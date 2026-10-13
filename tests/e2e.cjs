const { chromium } = require("playwright");
const path = require("node:path");
const fs = require("node:fs");
const screenshotDir =
  process.env.TARS_SCREENSHOTS || path.resolve("test-results");
fs.mkdirSync(screenshotDir, { recursive: true });
const baseURL = process.env.TARS_BASE_URL || "http://127.0.0.1:8080/";
const assert = (condition, message) => {
  if (!condition) throw Error(message);
};
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    acceptDownloads: true,
  });
  const page = await context.newPage(),
    errors = [],
    failures = [];
  page.setDefaultTimeout(8000);
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(r.url() + " " + r.status());
  });
  await page.goto(baseURL);
  await page.evaluate(() => document.fonts.ready);
  assert(
    (await page.locator("#sound-toggle").getAttribute("aria-pressed")) ===
      "false",
    "audio off initially",
  );
  await page.screenshot({
    path: path.join(screenshotDir, "tars-v2-home.png"),
    fullPage: true,
  });
  await page.locator("#explore").click();
  assert(
    (await page.locator(".map-node:disabled").count()) === 5,
    "no future chapters",
  );
  await page.keyboard.press("Escape");
  assert(
    await page
      .locator("#explore")
      .evaluate((e) => e === document.activeElement),
    "map focus return",
  );
  await page.locator("#begin").click();
  for (let i = 0; i < 3; i++) {
    assert(await page.locator("#prologue-title").isVisible(), "prologue " + i);
    await page.locator("#prologue-next").click();
  }
  let discoveries = 0;
  for (let chapter = 0; chapter < 6; chapter++) {
    console.log("Validando capítulo", chapter + 1);
    assert(
      (await page.locator("#journey").getAttribute("data-chapter")) ===
        String(chapter),
      "chapter " + chapter,
    );
    if (chapter === 5)
      assert(
        (await page.locator("#chapter-title").textContent()) ===
          "O Último Horizonte",
        "spoiler prevented",
      );
    const objects = await page.locator(".hotspot").count();
    assert(objects > 0, "discoveries each chapter");
    for (let i = 0; i < objects; i++) {
      await page.locator(".hotspot").nth(i).click();
      assert(
        await page.locator("#discovery-dialog").isVisible(),
        "discovery open",
      );
      assert(
        (await page.locator("#discovery-facts dd").count()) === 2,
        "facts",
      );
      await page.locator("#discovery-zoom").fill("160");
      assert(
        (await page.locator("#discovery-zoom").getAttribute("max")) === "180"
          ? (await page.locator("#zoom-value").textContent()) === "1,6×"
          : (await page.locator("#zoom-value").textContent()).includes("2/11"),
        "planet zoom or cosmic depth",
      );
      await page.locator("#reflection-tab").click();
      assert(
        await page.locator("#reflection-panel").isVisible(),
        "poetry panel",
      );
      await page.keyboard.press("ArrowLeft");
      assert(await page.locator("#fact-panel").isVisible(), "keyboard tabs");
      await page.locator("#bookmark").click();
      await page.keyboard.press("Escape");
      assert(
        await page
          .locator(".hotspot")
          .nth(i)
          .evaluate((e) => e === document.activeElement),
        "discovery focus return",
      );
      discoveries++;
    }
    await page.locator("#map-open").click();
    assert(
      (await page.locator(".map-node:disabled").count()) === 5 - chapter,
      "unlock " + chapter,
    );
    await page.keyboard.press("Escape");
    await page.locator("#scale-open").click();
    await page.locator("#scale-range").fill(String(chapter));
    assert(
      await page.locator("#scale-readout strong").textContent().then(Boolean),
      "scale " + chapter,
    );
    await page.keyboard.press("Escape");
    await page.locator("#contemplate").click();
    assert(
      (await page.locator("#contemplate").getAttribute("aria-pressed")) ===
        "true",
      "contemplate",
    );
    await page.locator("#contemplate").click();
    if (chapter === 4) {
      await page.locator("#light-time").fill("0");
      assert(
        await page
          .locator("#time-readout")
          .textContent()
          .then((t) => t.startsWith("Agora")),
        "time lens",
      );
    }
    if (chapter === 1)
      await page.screenshot({
        path: path.join(screenshotDir, "tars-v2-solar.png"),
        fullPage: true,
      });
    for (let beat = 0; beat < 3; beat++) {
      assert(
        (await page.locator("#transmission-count").textContent()) ===
          `/ 0${beat + 1} DE 03`,
        "beat progression",
      );
      if (chapter === 5 && beat === 2) {
        assert(
          (await page.locator("#chapter-title").textContent()) ===
            "Eu sou você.",
          "reveal",
        );
        await page.screenshot({
          path: path.join(screenshotDir, "tars-v2-final.png"),
          fullPage: true,
        });
        break;
      }
      await page.locator("#next").click();
    }
  }
  assert(
    (await page.locator("#journal-count").textContent()) === "13",
    "saved all discoveries",
  );
  await page.locator("#takeaway").fill("coragem");
  const letterPromise = page.waitForEvent("download");
  await page.locator("#save-letter").click();
  const letter = await letterPromise;
  assert(
    letter.suggestedFilename() === "TARS-carta-para-voce.txt",
    "letter export",
  );
  await page.locator("#journal-open").click();
  assert((await page.locator(".journal-item").count()) === 13, "journal");
  await page.locator(".journal-item").first().click();
  assert(
    await page.locator("#discovery-dialog").isVisible(),
    "revisit from notebook",
  );
  await page.keyboard.press("Escape");
  assert(
    await page.locator("#journal-dialog").isVisible(),
    "nested dialog return",
  );
  const journalPromise = page.waitForEvent("download");
  await page.locator("#download-journal").click();
  const journal = await journalPromise;
  assert(
    journal.suggestedFilename() === "TARS-caderno-de-bordo.txt",
    "journal export",
  );
  await page.keyboard.press("Escape");
  await page.reload();
  await page.locator("#begin").click();
  assert(
    (await page.locator("#chapter-title").textContent()) === "Eu sou você.",
    "resume after reload",
  );
  await page.locator("#next").click();
  assert(await page.locator("#home").isVisible(), "restart");
  assert(
    (await page.locator("#journal-count").textContent()) === "00",
    "reset records",
  );
  await page.locator("#sound-toggle").click();
  await page.waitForFunction(
    () =>
      document.querySelector("#sound-toggle").getAttribute("aria-pressed") ===
      "true",
  );
  assert(
    (await page.locator("#sound-toggle").getAttribute("aria-pressed")) ===
      "true",
    "audio on",
  );
  await page.locator("#settings-open").click();
  await page.locator("#volume").fill("15");
  assert(
    (await page.locator("#volume-value").textContent()) === "15%",
    "volume",
  );
  await page.keyboard.press("Escape");
  await page.locator("#sound-toggle").click();
  await page.waitForFunction(
    () =>
      document.querySelector("#sound-toggle").getAttribute("aria-pressed") ===
      "false",
  );
  assert(
    (await page.locator("#sound-toggle").getAttribute("aria-pressed")) ===
      "false",
    "audio off",
  );
  for (const width of [320, 390, 768, 1440]) {
    console.log("Validando jornada responsiva", width);
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    await page.setViewportSize({ width, height: 900 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "home overflow " + width,
    );
    await page.locator("#begin").click();
    await page.locator("#prologue-skip").click();
    for (let chapter = 0; chapter < 6; chapter++) {
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        "chapter overflow " + width + "/" + chapter,
      );
      assert(
        (await page.locator("#journey").getAttribute("data-chapter")) ===
          String(chapter),
        "responsive chapter sequence",
      );
      for (const edge of ["first", "last"]) {
        await page.locator(".hotspot")[edge]().click();
        assert(
          await page.locator("#discovery-dialog").isVisible(),
          "responsive discovery " + width + "/" + chapter,
        );
        await page.locator("#discovery-dialog [data-close]").last().click();
      }
      if (width === 390 && chapter === 1)
        await page.screenshot({
          path: path.join(screenshotDir, "mobile-solar.png"),
          fullPage: true,
        });
      for (let beat = 0; beat < 3; beat++) await page.locator("#next").click();
    }
    assert(await page.locator("#home").isVisible(), "responsive restart");
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: path.join(screenshotDir, "tars-v2-mobile-home.png"),
    fullPage: true,
  });
  await page.locator("#begin").click();
  await page.locator("#prologue-skip").click();
  await page.locator(".hotspot").first().click();
  await page.screenshot({
    path: path.join(screenshotDir, "tars-v2-mobile-discovery.png"),
  });
  assert(errors.length === 0, "JS: " + errors.join(";"));
  assert(failures.length === 0, "HTTP: " + failures.join(";"));
  console.log(
    JSON.stringify({
      chapters: 6,
      transmissions: 18,
      discoveries,
      prologue: 3,
      map: "locked/unlocked",
      focus: "dialogs and keyboard tabs",
      interactions:
        "zoom, scale, time lens, notebook, exports, contemplation, resume, restart",
      audio: "off/on/volume/off",
      viewports: [320, 390, 768, 1440],
      errors,
      failures,
    }),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
