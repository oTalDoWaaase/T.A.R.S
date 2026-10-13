const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const path = require("node:path");
const baseURL = process.env.TARS_BASE_URL || "http://127.0.0.1:8080/";
const shots = process.env.TARS_SCREENSHOTS || path.resolve("test-results");
const assert = (value, message) => {
  if (!value) throw Error(message);
};
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  try {
    await fs.mkdir(shots, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
      acceptDownloads: true,
    });
    await context.addInitScript(() => {
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        window.__testMusic = this;
        return play.call(this);
      };
    });
    const page = await context.newPage(),
      errors = [],
      failed = [];
    page.setDefaultTimeout(12000);
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(baseURL);
    assert(
      await page.evaluate(() => !window.__testMusic),
      "no audio construction/autoplay",
    );
    await page.locator("#begin").click();
    await page.locator("#prologue-skip").click();
    assert(
      await page.locator("#next").evaluate((e) => !!e.closest("#narrative")),
      "advance inside transmission",
    );
    assert(
      await page
        .locator("#next")
        .evaluate(
          (e) => getComputedStyle(e).backgroundColor !== "rgb(232, 234, 248)",
        ),
      "themed advance",
    );
    let questionCount = 0,
      atlasCount = 0;
    for (let chapter = 0; chapter < 6; chapter++) {
      console.log("Novas interações, capítulo", chapter + 1);
      if (chapter === 0) {
        await page.locator(".hotspot").first().click();
        await page.waitForFunction(
          () =>
            document.querySelector("#object-canvas")?.dataset.texture ===
            "ready",
        );
        assert(
          (await page.locator("#object-canvas").getAttribute("data-engine")) ===
            "webgl",
          "GPU renderer active",
        );
        const before = await page.locator("#object-canvas").screenshot();
        const box = await page.locator("#object-canvas").boundingBox();
        await page.mouse.move(
          box.x + box.width * 0.5,
          box.y + box.height * 0.5,
        );
        await page.mouse.down();
        await page.mouse.move(
          box.x + box.width * 0.72,
          box.y + box.height * 0.56,
          { steps: 12 },
        );
        await page.mouse.up();
        const after = await page.locator("#object-canvas").screenshot();
        assert(!before.equals(after), "drag changes rendered planet");
        const pose = await page.locator("#viewer-orientation").textContent();
        await page.locator("#object-canvas").focus();
        await page.keyboard.press("ArrowUp");
        assert(
          (await page.locator("#viewer-orientation").textContent()) !== pose,
          "keyboard orbit",
        );
        await page.keyboard.press("+");
        assert(
          (await page.locator("#discovery-zoom").inputValue()) === "110",
          "keyboard zoom",
        );
        const stoppedImage = await page.locator("#object-canvas").screenshot();
        await page.locator("#viewer-spin").click();
        assert(
          (await page.locator("#viewer-spin").getAttribute("aria-pressed")) ===
            "true",
          "explicit rotation can start",
        );
        await page.waitForTimeout(350);
        const rotatingImage = await page.locator("#object-canvas").screenshot();
        assert(
          !stoppedImage.equals(rotatingImage),
          "rotation changes the rendered surface",
        );
        await page.locator("#viewer-spin").click();
        assert(
          (await page.locator("#viewer-spin").getAttribute("aria-pressed")) ===
            "false",
          "pause rotation",
        );
        await page.locator("#viewer-reset").click();
        assert(
          (await page.locator("#discovery-zoom").inputValue()) === "100",
          "restore view",
        );
        await page.keyboard.press("Escape");
      }
      if (chapter === 1) {
        await page.locator("#atlas-open").click();
        assert(
          (await page.locator(".atlas-world").count()) === 8,
          "eight planets",
        );
        for (const id of [
          "mercurio",
          "venus",
          "terra",
          "marte",
          "jupiter",
          "saturno",
          "urano",
          "netuno",
        ]) {
          await page.locator(`[data-world="${id}"]`).click();
          await page.waitForFunction(
            () =>
              document.querySelector("#object-canvas")?.dataset.rendered ===
              "true",
          );
          if (!["mercurio", "urano"].includes(id))
            await page.waitForFunction(
              () =>
                document.querySelector("#object-canvas")?.dataset.texture ===
                "ready",
            );
          if (id === "venus") {
            const before = await page.locator("#object-canvas").screenshot();
            await page.locator("#viewer-detail").click();
            const after = await page.locator("#object-canvas").screenshot();
            assert(!before.equals(after), "Venus clouds/radar switch");
          }
          await page.locator("#viewer-right").click();
          await page.keyboard.press("Escape");
          atlasCount++;
        }
        await page.keyboard.press("Escape");
      }
      if (chapter === 2) {
        await page.locator(".hotspot").first().click();
        await page.locator("#viewer-field").click();
        await page.locator("#discovery-zoom").fill("600");
        await page.waitForFunction(
          () => document.querySelector("#object-canvas").dataset.depth === "6",
        );
        assert(
          (await page.locator("#viewer-note").textContent()).includes(
            "Campo estelar ilustrativo",
          ),
          "star field identified as illustrative",
        );
        await page.locator("#viewer-field").click();
        assert(
          (await page.locator("#discovery-zoom").getAttribute("max")) === "180",
          "stellar surface restored",
        );
        await page.keyboard.press("Escape");
      }
      if (chapter === 3 || chapter === 4) {
        for (const index of chapter === 3 ? [0] : [0, 1]) {
          await page.locator(".hotspot").nth(index).click();
          await page.waitForFunction(
            () =>
              document.querySelector("#object-canvas")?.dataset.rendered ===
              "true",
          );
          const before = await page.locator("#object-canvas").screenshot();
          await page.locator("#viewer-right").click();
          await page.locator("#viewer-detail").click();
          const after = await page.locator("#object-canvas").screenshot();
          assert(!before.equals(after), "cosmic structure interaction");
          await page.locator("#discovery-zoom").fill("500");
          await page.waitForFunction(
            () =>
              document.querySelector("#object-canvas").dataset.depth === "5",
          );
          assert(
            (await page.locator("#zoom-value").textContent()).includes("6/11"),
            "deep slider synchronizes",
          );
          await page.locator("#viewer-immerse").click();
          assert(
            await page
              .locator("#discovery-dialog")
              .evaluate((e) => e.classList.contains("immersed")),
            "cosmic immersion",
          );
          await page.locator("#object-canvas").focus();
          await page.keyboard.press("Home");
          assert(
            (await page.locator("#discovery-zoom").inputValue()) === "0",
            "deep reset synchronizes",
          );
          await page.keyboard.press("Escape");
        }
      }
      for (let beat = 0; beat < 3; beat++) {
        if (await page.locator("#question-panel").isVisible()) {
          await page.locator("#question-options input").first().check();
          questionCount++;
          assert(
            (await page.locator("#question-options input:checked").count()) ===
              1,
            "one selected choice",
          );
          if (chapter === 0 && beat === 0) {
            await page.locator("#question-options input").first().focus();
            await page.keyboard.press("ArrowRight");
            assert(
              await page.locator("#question-options input").nth(1).isChecked(),
              "keyboard choice keeps focus",
            );
            await page.locator("#question-options input").first().check();
          }
        }
        if (chapter === 5 && beat === 2) break;
        await page.locator("#next").click();
      }
    }
    assert(questionCount === 10, "ten questions encountered");
    assert(atlasCount === 8, "all planets visited");
    assert(
      (await page.locator("#profile-result").getAttribute("data-kind")) ===
        "explorador",
      "personalized final",
    );
    assert(
      (await page.locator("#profile-count").textContent()).includes("10 / 10"),
      "answer count",
    );
    await page.screenshot({
      path: path.join(shots, "personalized-final.png"),
      fullPage: true,
    });
    await page.locator("#review-answers").click();
    assert(
      (await page.locator(".journal-answer").count()) === 10,
      "all choices in notebook",
    );
    await page.locator(".journal-answer").first().click();
    await page.locator("#question-options input").nth(3).check();
    await page.locator("#map-open").click();
    await page.locator(".map-node").last().click();
    assert(
      (await page.locator("#profile-evidence").textContent()).includes(
        "Alguém com quem dividir",
      ),
      "edited answer affects final",
    );
    await page.reload();
    await page.locator("#begin").click();
    assert(
      (await page.locator("#profile-count").textContent()).includes("10 / 10"),
      "answers survive reload",
    );
    await page.locator("#takeaway").fill("horizontes");
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#save-letter").click();
    const download = await downloadPromise;
    const letter = await fs.readFile(await download.path(), "utf8");
    assert(
      letter.includes("Explorador de horizontes") &&
        letter.includes("Sua escolha:"),
      "letter includes personal portrait and choices",
    );
    await page.locator("#sound-toggle").click();
    await page.waitForFunction(() => window.__testMusic?.currentTime > 0.05);
    assert(
      await page.evaluate(
        () => window.__testMusic.loop && !window.__testMusic.paused,
      ),
      "original track decoded and playing",
    );
    await page.locator("#sound-toggle").click();
    await page.waitForFunction(() => window.__testMusic.paused);
    assert(
      (await page.locator("#sound-toggle").getAttribute("aria-pressed")) ===
        "false",
      "music paused",
    );
    await page.locator("#next").click();
    await page.locator("#begin").click();
    await page.locator("#prologue-skip").click();
    await page.locator("#skip-question").click();
    assert(
      (await page.locator("#question-options input:checked").count()) === 0,
      "question may be skipped",
    );
    // Preferências de movimento reduzem o padrão; um comando explícito pode iniciar a rotação.
    await page.locator(".hotspot").first().click();
    assert(
      (await page.locator("#viewer-spin").getAttribute("aria-pressed")) ===
        "false",
      "no automatic rotation with reduced motion",
    );
    await page.keyboard.press("Escape");
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 900 });
      assert(
        await page.locator("#settings-open span").isVisible(),
        "visible mobile preferences",
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        "responsive question " + width,
      );
      await page.locator("#question-options input").nth(2).check();
      assert(
        await page.locator("#next").isVisible(),
        "integrated advance visible",
      );
      await page.locator(".hotspot").first().click();
      await page.waitForFunction(
        () =>
          document.querySelector("#object-canvas")?.dataset.texture === "ready",
      );
      await page.locator("#object-canvas").focus();
      await page.keyboard.press("ArrowRight");
      await page.locator("#discovery-zoom").fill("160");
      assert(
        (await page.locator("#zoom-value").textContent()) === "1,6×",
        "mobile zoom",
      );
      await page.locator("#discovery-dialog [data-close]").last().click();
    }
    // Falha de capacidade gráfica não deve impedir a exploração.
    const fallback = await browser.newContext({
      viewport: { width: 1000, height: 900 },
      reducedMotion: "reduce",
    });
    await fallback.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type === "webgl" || type === "experimental-webgl") return null;
        return original.call(this, type, ...args);
      };
    });
    const fallbackPage = await fallback.newPage();
    fallbackPage.on("pageerror", (e) => errors.push(e.message));
    await fallbackPage.goto(baseURL);
    await fallbackPage.locator("#begin").click();
    await fallbackPage.locator("#prologue-skip").click();
    await fallbackPage.locator(".hotspot").first().click();
    await fallbackPage.waitForFunction(
      () =>
        document.querySelector("#object-canvas")?.dataset.texture === "ready",
    );
    assert(
      (await fallbackPage
        .locator("#object-canvas")
        .getAttribute("data-engine")) === "canvas2d",
      "software fallback",
    );
    await fallbackPage.locator("#object-canvas").focus();
    await fallbackPage.keyboard.press("ArrowRight");
    await fallbackPage.locator("#discovery-zoom").fill("150");
    assert(
      (await fallbackPage.locator("#zoom-value").textContent()) === "1,5×",
      "fallback interaction",
    );
    assert(errors.length === 0, "JS errors: " + errors.join(";"));
    assert(failed.length === 0, "missing assets: " + failed.join(";"));
    console.log(
      JSON.stringify({
        questions: questionCount,
        atlas: atlasCount,
        portrait: "derived, editable, resumable and exported",
        graphics:
          "WebGL planet drag, keyboard, zoom, rotation, structure; Canvas2D fallback",
        music: "MP3 decoded, playing, paused, no autoplay",
        errors,
        failed,
      }),
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
