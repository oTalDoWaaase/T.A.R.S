const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const base = process.env.TARS_BASE_URL || "http://127.0.0.1:8080/";
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  try {
    for (const fallback of [false, true]) {
      const page = await browser.newPage({
        viewport: { width: 1280, height: 800 },
        reducedMotion: "reduce",
      });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      if (fallback)
        await page.addInitScript(() => {
          const get = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function (type, ...args) {
            return type.includes("webgl")
              ? null
              : get.call(this, type, ...args);
          };
        });
      const touch = await page.context().newCDPSession(page);
      await touch.send("Emulation.setTouchEmulationEnabled", {
        enabled: true,
        maxTouchPoints: 2,
      });
      await page.goto(base);
      assert.equal(
        await page.locator("#horizontes").isVisible(),
        false,
        "opening is a scene, not a scrolling catalogue",
      );
      for (const id of [
        "teia",
        "andromeda",
        "vialactea",
        "observavel",
        "campo",
      ]) {
        await page.evaluate((id) => {
          window.deepExplorer?.destroy();
          document.querySelector("#deep-canvas")?.remove();
          const canvas = document.createElement("canvas");
          canvas.id = "deep-canvas";
          canvas.tabIndex = 0;
          canvas.style =
            "position:fixed;inset:0;width:100vw;height:100vh;background:#05060b;z-index:99999;outline:none;touch-action:none";
          document.body.append(canvas);
          window.deepExplorer = new TARSExplorer(canvas, { id, reduced: true });
        }, id);
        await page.waitForFunction(
          () =>
            document.querySelector("#deep-canvas").dataset.rendered === "true",
        );
        const initial = await page.locator("#deep-canvas").screenshot();
        for (const depth of [1, 2.5, 5.8, 9.9, 10]) {
          await page.evaluate(
            (depth) => window.deepExplorer.setZoom(8 ** depth),
            depth,
          );
          await page.waitForFunction(
            (depth) =>
              Number(document.querySelector("#deep-canvas").dataset.depth) ===
              Math.floor(depth),
            depth,
          );
          const result = await page.evaluate(() => ({
            pose: window.deepExplorer.snapshot(),
            cache: window.deepExplorer.layers.size,
          }));
          assert(
            Math.abs(result.pose.depth - depth) < 0.0001,
            "actual deep zoom",
          );
          assert(result.cache <= 3, "bounded scene cache");
          const image = await page.locator("#deep-canvas").screenshot();
          assert(
            !image.equals(initial),
            "new scenery visible at depth " + depth,
          );
        }
        await page.locator("#deep-canvas").focus();
        await page.keyboard.press("-");
        assert(
          (await page.evaluate(() => window.deepExplorer.snapshot().depth)) <
            10,
          "keyboard retreats",
        );
        await page.mouse.move(640, 400);
        await page.mouse.wheel(0, -120);
        assert(
          (await page.evaluate(() => window.deepExplorer.snapshot().depth)) >
            9.8,
          "wheel advances",
        );
        await page.keyboard.press("Home");
        await page.waitForFunction(
          () => document.querySelector("#deep-canvas").dataset.depth === "0",
        );
        const restored = await page.locator("#deep-canvas").screenshot();
        assert(
          restored.equals(initial),
          "reset exactly restores original scene",
        );
        // Continuity: immediately across a level boundary the same new layer dominates.
        const cloudMatch = await page.evaluate(() => {
          window.deepExplorer.setZoom(8 ** 2.99999);
          const a = window.deepExplorer.depthScene();
          window.deepExplorer.setZoom(8 ** 3.00001);
          const b = window.deepExplorer.depthScene();
          return (
            a[1].cloud === b[0].cloud &&
            a[1].opacity > 0.999 &&
            b[0].opacity > 0.999
          );
        });
        assert(cloudMatch, "no abrupt layer replacement");
        await page.evaluate(() => window.deepExplorer.reset());
        await touch.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [
            { x: 580, y: 400, id: 1 },
            { x: 680, y: 400, id: 2 },
          ],
        });
        await touch.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [
            { x: 540, y: 400, id: 1 },
            { x: 720, y: 400, id: 2 },
          ],
        });
        await touch.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        assert(
          (await page.evaluate(() => window.deepExplorer.snapshot().zoom)) >
            1.4,
          "two-finger pinch advances into the scene",
        );
      }
      await page.evaluate(() => {
        window.deepExplorer.destroy();
        document.querySelector("#deep-canvas").remove();
      });
      await page.locator("#begin").click();
      await page.locator("#prologue-skip").click();
      await page.locator(".hotspot").first().click();
      await page.locator("#viewer-immerse").click();
      assert(
        await page
          .locator("#discovery-dialog")
          .evaluate((e) => e.classList.contains("immersed")),
        "full scene view",
      );
      assert.equal(
        await page.locator(".discovery-copy").isVisible(),
        false,
        "reading pane retreats",
      );
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(
        () =>
          Math.abs(
            document.querySelector("#object-canvas").getBoundingClientRect()
              .height - 844,
          ) < 1,
      );
      const bounds = await page
        .locator(".viewer-tools button:visible")
        .evaluateAll((buttons) =>
          buttons.map((button) => {
            const r = button.getBoundingClientRect();
            return {
              height: r.height,
              left: r.left,
              right: r.right,
              bottom: r.bottom,
            };
          }),
        );
      assert(
        bounds.every(
          (r) =>
            r.height >= 44 && r.left >= 0 && r.right <= 390 && r.bottom <= 844,
        ),
        "mobile controls are usable and within the viewport",
      );
      await page.locator("#viewer-immerse").click();
      assert(
        await page.locator(".discovery-copy").isVisible(),
        "reading restored",
      );
      await page.keyboard.press("Escape");
      assert.equal(
        await page.locator("#discovery-dialog").isVisible(),
        false,
        "exit accessible",
      );
      assert.deepEqual(errors, []);
      await page.close();
      console.log(
        fallback ? "Canvas2D" : "WebGL",
        "5 destinations, 10 depth levels, continuity, reset, bounded cache, immersion: OK",
      );
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
