"use strict";
// Sem framework e sem chamadas remotas: abrir index.html já basta.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const arrow =
  '<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>';
const pad = (number) => String(number).padStart(2, "0");
const STORAGE_KEY = "tars-journey-v3";
const state = {
  current: 0,
  unlocked: 0,
  started: false,
  beats: [0, 0, 0, 0, 0, 0],
  visited: [],
  bookmarks: [],
  answers: {},
};
let changingChapter = false,
  discoveryId = null,
  prologueStep = 0,
  toastTimer;
let explorer = null;
const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
let manualReducedMotion = false;
function reducedMotion() {
  return manualReducedMotion || reducedQuery.matches;
}
function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Navegação continua quando o armazenamento está desabilitado. */
  }
}
function restore() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (
      !saved ||
      !Number.isInteger(saved.unlocked) ||
      saved.unlocked < 0 ||
      saved.unlocked > 5
    )
      return;
    state.unlocked = saved.unlocked;
    state.current = Math.max(
      0,
      Math.min(Math.trunc(Number(saved.current) || 0), saved.unlocked),
    );
    state.started = !!saved.started;
    if (saved.answers && typeof saved.answers === "object") {
      for (const q of TARSProfiles.questions) {
        const value = saved.answers[q.id];
        if (
          q.chapter <= saved.unlocked &&
          (value === "skip" || (Number.isInteger(value) && q.options[value]))
        )
          state.answers[q.id] = value;
      }
    }
    if (Array.isArray(saved.beats))
      state.beats = chapters.map((_, i) =>
        Math.max(0, Math.min(2, Math.floor(Number(saved.beats[i]) || 0))),
      );
    for (const key of ["visited", "bookmarks"])
      if (Array.isArray(saved[key]))
        state[key] = [
          ...new Set(
            saved[key].filter(
              (id) =>
                objectDetails[id] &&
                objectDetails[id].chapter <= state.unlocked,
            ),
          ),
        ];
  } catch {
    /* Arquivos locais e modos privados podem impedir sessionStorage. */
  }
}
function toast(message) {
  clearTimeout(toastTimer);
  $("#toast").textContent = message;
  $("#toast").hidden = false;
  toastTimer = setTimeout(() => {
    $("#toast").hidden = true;
  }, 3800);
}
function openDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog.open) dialog.showModal();
}
function imagePath(name) {
  return `assets/images/${name}.webp`;
}
function imageForObject(id) {
  const chapter = objectDetails[id].chapter;
  return imagePath(chapters[chapter].image);
}
function updateHome() {
  $("#begin").innerHTML =
    (state.started ? "Continuar minha jornada" : "Iniciar jornada") + arrow;
  $("#journal-count").textContent = pad(
    state.bookmarks.length + TARSProfiles.result(state.answers).count,
  );
  $("#journal-open").setAttribute(
    "aria-label",
    `Abrir caderno: ${state.bookmarks.length} descobertas e ${TARSProfiles.result(state.answers).count} respostas`,
  );
}
function updateProgress() {
  $("#current-number").textContent = pad(state.current + 1);
  $("#progress").replaceChildren(
    ...chapters.map((chapter, index) => {
      const button = document.createElement("button");
      button.disabled = index > state.unlocked;
      button.setAttribute(
        "aria-label",
        `${chapter.number}. ${chapter.title}${index > state.unlocked ? " — ainda não alcançado" : ""}`,
      );
      if (index === state.current) button.setAttribute("aria-current", "step");
      button.addEventListener("click", () => goChapter(index));
      return button;
    }),
  );
}
function renderScene() {
  const chapter = chapters[state.current];
  $("#scene").replaceChildren(
    ...chapter.objects.map((id, index) => {
      const button = document.createElement("button"),
        object = objects[id],
        detail = objectDetails[id];
      button.className =
        "hotspot" + (state.visited.includes(id) ? " visited" : "");
      button.dataset.object = id;
      button.style.setProperty("--x", chapter.positions[index][0] + "%");
      button.style.setProperty("--y", chapter.positions[index][1] + "%");
      button.setAttribute("aria-label", `Explorar ${object.name}`);
      const sprite =
        state.current === 1 || state.current === 2
          ? `<span class="planet-thumb ${detail.art}" aria-hidden="true"></span>`
          : "";
      button.innerHTML = `${sprite}<span class="hotspot-marker" aria-hidden="true"></span><span class="hotspot-name">${object.name}<small class="hotspot-note">${state.visited.includes(id) ? "REGISTRO DESCOBERTO" : "EXPLORAR"}</small></span>`;
      button.addEventListener("click", () => discover(id));
      return button;
    }),
  );
}
function revealText(element) {
  if (reducedMotion() || typeof element.animate !== "function") return;
  element.getAnimations().forEach((animation) => animation.cancel());
  element.animate(
    [
      { opacity: 0, transform: "translateY(6px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 650, easing: "ease-out" },
  );
}
function currentQuestion() {
  return TARSProfiles.questions.find(
    (q) => q.chapter === state.current && q.beat === state.beats[state.current],
  );
}
function updateQuestionFeedback(question) {
  const selected = state.answers[question.id];
  const answered = Number.isInteger(selected);
  $("#question-panel").classList.toggle("question-answered", answered);
  $("#question-feedback").textContent = answered
    ? "Sinal registrado. A voz parece reconhecer algo em você."
    : selected === "skip"
      ? "O silêncio também tem lugar nesta viagem."
      : "Uma escolha sua deixa um sinal nesta viagem.";
  $("#skip-question").setAttribute("aria-pressed", String(selected === "skip"));
  updateHome();
}
function renderQuestion() {
  const q = currentQuestion();
  $("#question-panel").hidden = !q;
  if (!q) {
    delete $("#question-panel").dataset.question;
    return;
  }
  $("#question-panel").dataset.question = q.id;
  $("#question-title").textContent = q.text;
  $("#question-number").textContent =
    `PERGUNTA ${pad(TARSProfiles.questions.indexOf(q) + 1)} / 10 · RESPONDA OU CONTINUE OBSERVANDO`;
  $("#question-options").replaceChildren(
    ...q.options.map((option, index) => {
      const label = document.createElement("label");
      label.className = "question-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.id;
      input.value = String(index);
      input.checked = state.answers[q.id] === index;
      input.addEventListener("change", () => {
        state.answers[q.id] = index;
        persist();
        updateQuestionFeedback(q);
      });
      const text = document.createElement("span");
      text.textContent = option.label;
      label.append(input, text);
      return label;
    }),
  );
  updateQuestionFeedback(q);
}
function renderPortrait(visible) {
  $("#profile-result").hidden = !visible;
  if (!visible) return;
  const result = TARSProfiles.result(state.answers);
  $("#profile-result").dataset.kind = result.kind;
  $("#profile-count").textContent = `${result.count} / 10 ESCOLHAS REGISTRADAS`;
  $("#profile-name").textContent = result.name;
  $("#profile-title").textContent = result.title;
  $("#profile-text").textContent = result.text;
  $("#profile-secondary").textContent = result.secondary;
  $("#profile-secondary").hidden = !result.secondary;
  $("#profile-invitation").textContent = result.invitation;
  $("#profile-evidence").hidden = result.records.length < 3;
  if (result.records.length >= 3)
    $("#profile-evidence").textContent =
      `Você escolheu “${result.records[0].answer}” e levou consigo “${result.records.at(-1).answer}”. Este retrato nasce desses sinais.`;
}
function renderJournalAnswers() {
  const root = $("#journal-answers");
  root.replaceChildren();
  const heading = document.createElement("h3");
  heading.textContent = "As perguntas que ficaram com você.";
  root.append(heading);
  const known = TARSProfiles.questions.filter(
    (q) =>
      q.chapter < state.unlocked ||
      (state.started &&
        q.chapter === state.current &&
        q.beat <= state.beats[q.chapter]) ||
      Object.hasOwn(state.answers, q.id),
  );
  if (!known.length) {
    const p = document.createElement("p");
    p.className = "storage-note";
    p.textContent =
      "As perguntas aparecem ao longo das transmissões. Responda apenas se quiser.";
    root.append(p);
  }
  known.forEach((q) => {
    const button = document.createElement("button");
    button.className = "journal-answer";
    const selected = q.options[state.answers[q.id]];
    const number = document.createElement("small"),
      title = document.createElement("strong"),
      answer = document.createElement("span");
    number.textContent = `PERGUNTA ${pad(TARSProfiles.questions.indexOf(q) + 1)} / HORIZONTE ${pad(q.chapter + 1)}`;
    title.textContent = q.text;
    answer.textContent = selected
      ? `Você escolheu: ${selected.label}`
      : "Você deixou este sinal em aberto. Pode revisitar.";
    button.append(number, title, answer);
    button.setAttribute("aria-label", `Revisitar pergunta: ${q.text}`);
    button.addEventListener("click", () => {
      $("#journal-dialog").close();
      state.beats[q.chapter] = q.beat;
      goChapter(q.chapter);
    });
    root.append(button);
  });
}
function renderStory(focus = false) {
  const chapter = chapters[state.current],
    beat = state.beats[state.current],
    revealed = state.current === 5 && beat === 2;
  $("#journey").classList.toggle("revealed", revealed);
  $("#chapter-title").textContent = revealed ? "Eu sou você." : chapter.title;
  $("#chapter-description").textContent = revealed
    ? "A voz nunca esteve nas estrelas. Ela estava na sua vontade de compreender."
    : chapter.description;
  $("#narration").textContent = chapter.stories[beat];
  revealText($("#narration"));
  $("#transmission-count").textContent = `/ ${pad(beat + 1)} DE 03`;
  $("#voice-signature").textContent = revealed
    ? "ORIGEM DO SINAL: VOCÊ"
    : "IDENTIDADE NÃO CONFIRMADA";
  $("#story-back").disabled = beat === 0;
  $("#story-dots").replaceChildren(
    ...chapter.stories.map((_, index) => {
      const button = document.createElement("button");
      button.disabled = index > beat;
      button.setAttribute("aria-label", `Revisitar transmissão ${index + 1}`);
      if (index === beat) button.setAttribute("aria-current", "true");
      button.addEventListener("click", () => {
        state.beats[state.current] = index;
        persist();
        renderStory();
      });
      return button;
    }),
  );
  $("#final-reflection").hidden = !revealed;
  $("#easter-egg").hidden = !revealed;
  renderQuestion();
  renderPortrait(revealed);
  let label;
  if (revealed) label = "Reiniciar a jornada";
  else if (state.current === 5 && beat === 1) label = "De onde vem a voz?";
  else if (beat < 2) label = "Continuar transmissão";
  else label = "Próximo horizonte";
  $("#next").innerHTML = label + arrow;
  if (focus) $("#chapter-title").focus({ preventScroll: true });
  $("#status").textContent = `${chapter.title}. Transmissão ${beat + 1} de 3.`;
}
async function goChapter(index, { transition = true } = {}) {
  if (
    changingChapter ||
    index < 0 ||
    index > state.unlocked ||
    index >= chapters.length
  )
    return;
  changingChapter = true;
  const chapter = chapters[index],
    overlay = $("#transition");
  if (transition && !reducedMotion()) {
    $("#transition-label").textContent =
      `HORIZONTE ${chapter.number} / ${chapter.title.toUpperCase()}`;
    overlay.classList.add("active");
    await new Promise((resolve) => setTimeout(resolve, 420));
  }
  state.started = true;
  state.current = index;
  persist();
  $("#home").hidden = true;
  $("#journey").hidden = false;
  document.body.dataset.view = "journey";
  $("#journey").dataset.chapter = String(index);
  $("#journey").classList.toggle("final", index === 5);
  $("#chapter-image").style.backgroundImage =
    `url("${imagePath(chapter.image)}")`;
  $("#chapter-label").textContent = `CAPÍTULO ${chapter.number} / 06`;
  $("#chapter-location").textContent = chapter.location.toUpperCase();
  $("#scene-hint").textContent = chapter.hint;
  $("#time-lens").hidden = index !== 4;
  $("#atlas-open").hidden = index !== 1;
  document.body.classList.remove("contemplating");
  $("#contemplate").setAttribute("aria-pressed", "false");
  $("#contemplate span").textContent = "Contemplar";
  renderScene();
  updateProgress();
  renderStory(true);
  updateHome();
  updateAtmosphere(index);
  window.scrollTo({ top: 0, behavior: "instant" });
  overlay.classList.remove("active");
  changingChapter = false;
  // Pré-carregamento limitado ao próximo horizonte.
  if (index < 5) {
    const image = new Image();
    image.src = imagePath(chapters[index + 1].image);
  }
}
function returnHome() {
  if (changingChapter) return;
  $("#journey").hidden = true;
  $("#home").hidden = false;
  document.body.dataset.view = "home";
  document.body.classList.remove("contemplating");
  updateHome();
  window.scrollTo({ top: 0, behavior: "instant" });
  $("#begin").focus({ preventScroll: true });
}
function resetJourney() {
  Object.assign(state, {
    current: 0,
    unlocked: 0,
    started: false,
    beats: [0, 0, 0, 0, 0, 0],
    visited: [],
    bookmarks: [],
    answers: {},
  });
  $("#takeaway").value = "";
  persist();
  updateHome();
  returnHome();
  toast("Uma nova pergunta. Um novo começo.");
}
function startJourney() {
  if (state.started) {
    goChapter(state.current);
    return;
  }
  prologueStep = 0;
  renderPrologue();
  openDialog("prologue-dialog");
}
function renderPrologue() {
  const scene = prologue[prologueStep];
  $("#prologue-label").textContent =
    `TRANSMISSÃO INICIAL / ${pad(prologueStep + 1)}`;
  $("#prologue-title").textContent = scene.title;
  $("#prologue-text").textContent = scene.text;
  $("#prologue-next").innerHTML =
    (prologueStep === 2 ? "Abrir os olhos" : "Continuar") + arrow;
}
function finishPrologue() {
  $("#prologue-dialog").close();
  goChapter(0);
}
function next() {
  if (changingChapter) return;
  const question = currentQuestion();
  if (question && !Object.hasOwn(state.answers, question.id)) {
    state.answers[question.id] = "skip";
    persist();
  }
  if (state.beats[state.current] < 2) {
    state.beats[state.current]++;
    persist();
    renderStory();
    const target =
      state.current === 5 && state.beats[5] === 2
        ? $("#chapter-title")
        : $("#narrative");
    if (target.getBoundingClientRect().top < 0)
      target.scrollIntoView({
        block: "start",
        behavior: reducedMotion() ? "instant" : "smooth",
      });
  } else if (state.current < 5) {
    state.unlocked = Math.max(state.unlocked, state.current + 1);
    goChapter(state.current + 1);
  } else resetJourney();
}
function openMap() {
  $("#map-position").textContent = state.started
    ? `POSIÇÃO ATUAL / ${chapters[state.current].title.toUpperCase()}`
    : "POSIÇÃO ATUAL / ANTES DA PARTIDA";
  $("#map-progress").textContent =
    `${pad(state.unlocked + 1)} DE 06 HORIZONTES ALCANÇÁVEIS`;
  $("#map-nodes").replaceChildren(
    ...chapters.map((chapter, index) => {
      const button = document.createElement("button");
      button.className = "map-node";
      button.disabled = index > state.unlocked;
      button.setAttribute(
        "aria-label",
        `${chapter.number}. ${chapter.title}${index > state.unlocked ? " — ainda não alcançado" : ""}`,
      );
      if (state.started && index === state.current)
        button.setAttribute("aria-current", "step");
      button.innerHTML = `<span class="map-point" aria-hidden="true"></span><span class="node-number">${chapter.number}</span><img class="map-thumb" src="${imagePath(chapter.image)}" alt="" loading="lazy" width="160" height="110"><strong>${chapter.title}</strong><small>${index > state.unlocked ? "AINDA POR DESCOBRIR" : state.started && index === state.current ? "VOCÊ ESTÁ AQUI" : "DESTINO DISPONÍVEL"}</small>`;
      button.addEventListener("click", () => {
        $("#map-dialog").close();
        if (!state.started) startJourney();
        else goChapter(index);
      });
      return button;
    }),
  );
  $("#map-continue").innerHTML =
    (state.started ? "Continuar jornada" : "Iniciar jornada") + arrow;
  openDialog("map-dialog");
}
function mountExplorer(id, field = false) {
  if (explorer) explorer.destroy();
  const canvas = document.createElement("canvas");
  canvas.id = "object-canvas";
  canvas.className = "object-canvas";
  canvas.tabIndex = 0;
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    field
      ? "Campo estelar ilustrativo, exploração em profundidade"
      : `Visualização interativa de ${objects[id].name}`,
  );
  canvas.setAttribute("aria-describedby", "viewer-help");
  canvas.textContent = `Use os controles para girar e aproximar ${objects[id].name}.`;
  $("#discovery-art").replaceChildren(canvas);
  $("#viewer-field").hidden = !["proxima", "sirio"].includes(id);
  $("#viewer-field").setAttribute("aria-pressed", String(field));
  $("#viewer-field").textContent = field
    ? "Voltar à estrela"
    : "Explorar campo estelar";
  explorer = new TARSExplorer(canvas, {
    id: field ? "campo" : id,
    reduced: reducedMotion(),
    onChange: updateViewer,
  });
}
function updateViewer(info) {
  const deep = info.mode !== "planet";
  const slider = $("#discovery-zoom");
  slider.min = deep ? "0" : "100";
  slider.max = deep ? "1000" : "180";
  slider.value = String(Math.round(deep ? info.depth * 100 : info.zoom * 100));
  const names = {
    web: "Teia cósmica",
    galaxy: "Ilha de estrelas",
    stellar: "Campo estelar",
    nebula: "Nuvem interestelar",
    horizon: "Horizonte",
  };
  $("#zoom-value").textContent = deep
    ? `${names[info.layer]} · ${Math.floor(info.depth) + 1}/11`
    : info.zoom.toFixed(1).replace(".", ",") + "×";
  slider.setAttribute(
    "aria-valuetext",
    deep
      ? `Profundidade ${info.depth.toFixed(1)} de 10, ${names[info.layer]}`
      : `${info.zoom.toFixed(1)} vezes`,
  );
  $("#viewer-help").textContent = deep
    ? "Arraste para olhar ao redor · roda ou dois dedos para mergulhar · +/− no teclado"
    : "Arraste para girar · roda ou dois dedos para aproximar";
  $("#viewer-spin").setAttribute("aria-pressed", String(info.auto));
  $("#viewer-spin").textContent = info.auto
    ? "Pausar rotação"
    : "Iniciar rotação";
  $("#viewer-detail").setAttribute("aria-pressed", String(info.detail));
  const caption =
    discoveryId === "venus"
      ? info.detail
        ? "Ver nuvens"
        : "Ver superfície"
      : info.mode === "web"
        ? info.detail
          ? "Ocultar traçado"
          : "Traçar filamentos"
        : info.mode === "galaxy"
          ? info.detail
            ? "Ocultar braços"
            : "Traçar braços"
          : info.mode === "horizon"
            ? "Destacar horizonte"
            : ["proxima", "sirio"].includes(discoveryId)
              ? "Revelar granulação"
              : discoveryId === "sagitario"
                ? "Realçar disco"
                : "Luz difusa";
  $("#viewer-detail").textContent = caption;
  $("#viewer-detail").hidden =
    deep && ["stellar", "nebula"].includes(info.layer);
  $("#viewer-orientation").textContent =
    info.engine === "context-lost"
      ? "VISUALIZAÇÃO INTERROMPIDA · RESTAURE OU REABRA O OBJETO"
      : `VISTA ${Math.round((info.yaw * 180) / Math.PI)}° · INCLINAÇÃO ${Math.round((info.pitch * 180) / Math.PI)}°`;
  $("#viewer-note").textContent =
    discoveryId === "venus" && info.detail
      ? "Superfície NASA por radar · cores representativas"
      : info.note;
}
function openAtlas() {
  if (state.unlocked < 1) return;
  $("#atlas-worlds").replaceChildren(
    ...solarAtlas.map((id, index) => {
      const button = document.createElement("button");
      button.className = "atlas-world";
      button.dataset.world = id;
      button.setAttribute(
        "aria-label",
        `Explorar ${objects[id].name} no atlas`,
      );
      button.innerHTML = `<span class="atlas-orb ${id}" aria-hidden="true"></span><strong>${objects[id].name}</strong><small>SOL ${pad(index + 1)} / EXPLORAR</small><svg class="icon" aria-hidden="true"><use href="#i-diagonal"/></svg>`;
      button.addEventListener("click", () => discover(id));
      return button;
    }),
  );
  openDialog("solar-atlas-dialog");
  TARSExplorer.loadMaps()
    .then((maps) => {
      solarAtlas.forEach((id) => {
        const orb = $(`[data-world="${id}"] .atlas-orb`);
        if (orb && maps[id]) orb.style.backgroundImage = `url("${maps[id]}")`;
      });
    })
    .catch(() =>
      toast(
        "Os mapas não carregaram. A exploração procedural continua disponível.",
      ),
    );
}
function selectTab(name, { focus = false } = {}) {
  const facts = name === "facts";
  $("#fact-tab").setAttribute("aria-selected", String(facts));
  $("#reflection-tab").setAttribute("aria-selected", String(!facts));
  $("#fact-tab").tabIndex = facts ? 0 : -1;
  $("#reflection-tab").tabIndex = facts ? -1 : 0;
  $("#fact-panel").hidden = !facts;
  $("#reflection-panel").hidden = facts;
  if (focus) $(facts ? "#fact-tab" : "#reflection-tab").focus();
}
function updateBookmark() {
  const saved = state.bookmarks.includes(discoveryId);
  $("#bookmark").setAttribute("aria-pressed", String(saved));
  $("#bookmark").textContent = saved
    ? "Guardado no caderno ✓"
    : "Guardar no caderno +";
  updateHome();
}
function discover(id) {
  if (!objects[id] || objectDetails[id].chapter > state.unlocked) return;
  discoveryId = id;
  const object = objects[id],
    detail = objectDetails[id];
  if (!state.visited.includes(id)) {
    state.visited.push(id);
    persist();
    const marker = $(`[data-object="${id}"]`);
    if (marker) {
      marker.classList.add("visited");
      marker.querySelector(".hotspot-note").textContent = "REGISTRO DESCOBERTO";
    }
  }
  $("#discovery-title").textContent = object.name;
  $("#discovery-subtitle").textContent = object.subtitle;
  $("#discovery-description").textContent = object.description;
  $("#discovery-extra").textContent = detail.extra;
  $("#discovery-coordinate").textContent = detail.coordinate;
  $("#discovery-category").textContent =
    `DESCOBERTA / HORIZONTE ${pad(detail.chapter + 1)}`;
  $("#discovery-reflection").textContent = object.reflection.replace(
    "Metáfora de bordo: ",
    "",
  );
  $("#reflection-question").textContent = detail.question;

  $("#discovery-art").style.setProperty("--zoom", "1");
  $("#discovery-zoom").value = "100";
  $("#zoom-value").textContent = "1,0×";
  $("#discovery-facts").replaceChildren(
    ...object.facts.map(([label, value]) => {
      const div = document.createElement("div"),
        dt = document.createElement("dt"),
        dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      div.append(dt, dd);
      return div;
    }),
  );
  $("#discovery-source").href = object.source;
  selectTab("facts");
  updateBookmark();
  openDialog("discovery-dialog");
  $("#discovery-dialog").scrollTop = 0;
  mountExplorer(id);
}
function openJournal() {
  $("#journal-items").replaceChildren();
  if (!state.bookmarks.length) {
    const p = document.createElement("p");
    p.className = "journal-empty";
    p.textContent =
      "Seu caderno ainda é um céu em branco. Explore um objeto e escolha “Guardar no caderno” para começar.";
    $("#journal-items").append(p);
  } else
    state.bookmarks.forEach((id) => {
      const button = document.createElement("button");
      button.className = "journal-item";
      button.setAttribute(
        "aria-label",
        `Reabrir descoberta: ${objects[id].name}`,
      );
      button.innerHTML = `<img src="${imageForObject(id)}" alt="" width="60" height="75"><span><strong>${objects[id].name}</strong><small>HORIZONTE ${pad(objectDetails[id].chapter + 1)} / REVISITAR</small></span>`;
      button.addEventListener("click", () => discover(id));
      $("#journal-items").append(button);
    });
  renderJournalAnswers();
  $("#download-journal").disabled =
    !state.bookmarks.length && !TARSProfiles.result(state.answers).count;
  openDialog("journal-dialog");
}
function downloadText(filename, text) {
  const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    ),
    link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
function journalText() {
  const discoveries = state.bookmarks
    .map(
      (id) =>
        `${objects[id].name}\n${objects[id].description}\n${objects[id].reflection}\nFonte: ${objects[id].source}`,
    )
    .join("\n\n────────────────────\n\n");
  const result = TARSProfiles.result(state.answers);
  const answers = result.records
    .map((record) => `${record.question}\nSua escolha: ${record.answer}`)
    .join("\n\n");
  const portrait =
    state.beats[5] === 2
      ? `\n\nRETRATO DESTA VIAGEM\n${result.name}\n${result.title}\n${result.text}\n${result.secondary}\n${result.invitation}\nUm retrato narrativo, não uma definição de personalidade.`
      : "";
  return `${discoveries}${answers ? "\n\nAS ESCOLHAS QUE VOCÊ LEVA\n\n" + answers : ""}${portrait}`;
}
function updateScale() {
  const index = Number($("#scale-range").value),
    scale = scales[index];
  $("#scale-circle").style.setProperty("--diameter", `${50 + index * 37}px`);
  $("#scale-readout").replaceChildren();
  const name = document.createElement("p"),
    distance = document.createElement("strong"),
    description = document.createElement("p"),
    caption = document.createElement("p");
  name.className = "scale-name";
  name.textContent = scale.name;
  distance.textContent = scale.distance;
  description.textContent = scale.light;
  caption.textContent = scale.caption;
  $("#scale-readout").append(name, distance, description, caption);
}
function updateTime() {
  const amount = Number($("#light-time").value),
    years = amount * 10000;
  $("#time-readout").textContent =
    amount === 0
      ? "Agora: esta luz chega ao seu olhar."
      : amount === 250
        ? "Há 2,5 milhões de anos: esta luz deixou Andrômeda."
        : `Há ${new Intl.NumberFormat("pt-BR").format(years)} anos: esta luz ainda estava a caminho.`;
}
$("#begin").addEventListener("click", startJourney);
$("#explore").addEventListener("click", openMap);
$("#map-open").addEventListener("click", openMap);
$("#map-continue").addEventListener("click", () => {
  $("#map-dialog").close();
  startJourney();
});
$(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  returnHome();
});
$(".footer-brand").addEventListener("click", (event) => {
  event.preventDefault();
  returnHome();
});
$("#prologue-next").addEventListener("click", () => {
  if (prologueStep < 2) {
    prologueStep++;
    renderPrologue();
    $("#prologue-title").focus({ preventScroll: true });
  } else finishPrologue();
});
$("#prologue-skip").addEventListener("click", finishPrologue);
$("#next").addEventListener("click", next);
$("#story-back").addEventListener("click", () => {
  if (state.beats[state.current] > 0) {
    state.beats[state.current]--;
    persist();
    renderStory();
  }
});
$("#contemplate").addEventListener("click", () => {
  const enabled = document.body.classList.toggle("contemplating");
  $("#contemplate").setAttribute("aria-pressed", String(enabled));
  $("#contemplate span").textContent = enabled
    ? "Voltar à exploração"
    : "Contemplar";
});
$("#scale-open").addEventListener("click", () => {
  $("#scale-range").value = String(state.current);
  updateScale();
  openDialog("scale-dialog");
});
$("#scale-range").addEventListener("input", updateScale);
$("#light-time").addEventListener("input", updateTime);
$("#fact-tab").addEventListener("click", () => selectTab("facts"));
$("#reflection-tab").addEventListener("click", () => selectTab("reflection"));
$(".discovery-tabs").addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    const facts = $("#fact-tab").getAttribute("aria-selected") === "true";
    selectTab(
      event.key === "Home"
        ? "facts"
        : event.key === "End"
          ? "reflection"
          : facts
            ? "reflection"
            : "facts",
      { focus: true },
    );
  }
});
$("#discovery-zoom").addEventListener("input", () => {
  if (explorer) {
    const value = Number($("#discovery-zoom").value) / 100;
    explorer.setZoom(explorer.spec.mode ? 8 ** value : value);
  }
});
$("#viewer-left").addEventListener("click", () => explorer?.turn(-0.18));
$("#viewer-right").addEventListener("click", () => explorer?.turn(0.18));
$("#viewer-spin").addEventListener("click", () => explorer?.toggleAuto());
$("#viewer-detail").addEventListener("click", () => explorer?.toggleDetail());
$("#viewer-field").addEventListener("click", () => {
  const field = $("#viewer-field").getAttribute("aria-pressed") !== "true";
  mountExplorer(discoveryId, field);
  $("#object-canvas").focus({ preventScroll: true });
});
$("#viewer-immerse").addEventListener("click", () => {
  const active = $("#discovery-dialog").classList.toggle("immersed");
  $("#viewer-immerse").setAttribute("aria-pressed", String(active));
  $("#viewer-immerse").textContent = active
    ? "Voltar ao arquivo"
    : "Mergulhar na cena";
});
$("#viewer-reset").addEventListener("click", () => explorer?.reset());
$("#atlas-open").addEventListener("click", openAtlas);
$("#review-answers").addEventListener("click", openJournal);
$("#skip-question").addEventListener("click", () => {
  const q = currentQuestion();
  if (!q) return;
  state.answers[q.id] = "skip";
  $$("#question-options input").forEach((input) => {
    input.checked = false;
  });
  persist();
  updateQuestionFeedback(q);
});
$("#discovery-dialog").addEventListener("close", () => {
  $("#discovery-dialog").classList.remove("immersed");
  $("#viewer-immerse").setAttribute("aria-pressed", "false");
  $("#viewer-immerse").textContent = "Mergulhar na cena";
  if (explorer) {
    explorer.destroy();
    explorer = null;
  }
});
$("#bookmark").addEventListener("click", () => {
  if (!discoveryId) return;
  const index = state.bookmarks.indexOf(discoveryId);
  if (index === -1) state.bookmarks.push(discoveryId);
  else state.bookmarks.splice(index, 1);
  persist();
  updateBookmark();
  toast(
    index === -1
      ? "Descoberta guardada no seu caderno."
      : "Descoberta removida do caderno.",
  );
});
$("#journal-open").addEventListener("click", openJournal);
$("#journal-dialog").addEventListener("close", () => updateHome());
$("#download-journal").addEventListener("click", () => {
  downloadText(
    "TARS-caderno-de-bordo.txt",
    `T.A.R.S. — Caderno de bordo\n\n${journalText()}\n\nContinuar curioso também é uma forma de viajar.`,
  );
  toast("Seu caderno está pronto para levar com você.");
});
$("#save-letter").addEventListener("click", () => {
  const word = $("#takeaway").value.trim() || "curiosidade";
  downloadText(
    "TARS-carta-para-voce.txt",
    `T.A.R.S. — Uma carta para você\n\nVocê atravessou seis horizontes.\nDa Terra ao limite do que podemos observar.\n\nA palavra que você leva: ${word}\n\nA voz nunca esteve nas estrelas. Estava na sua vontade de compreender.\nO universo ficou maior. E você também.\n\n${journalText()}\n\nL.E. / ∞`,
  );
  toast("Sua viagem foi guardada em uma carta.");
});
for (const [button, dialog] of [
  ["settings-open", "settings-dialog"],
  ["about-open", "about-dialog"],
  ["credits-open", "credits-dialog"],
])
  document
    .getElementById(button)
    .addEventListener("click", () => openDialog(dialog));
$$("[data-close]").forEach((button) =>
  button.addEventListener("click", () =>
    document.getElementById(button.dataset.close).close(),
  ),
);
$$("dialog").forEach((dialog) =>
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  }),
);
$("#motion-toggle").checked = reducedQuery.matches;
$("#motion-toggle").addEventListener("change", () => {
  manualReducedMotion = $("#motion-toggle").checked;
  document.body.classList.toggle("reduced-motion", manualReducedMotion);
  if (explorer) {
    explorer.reduced = reducedMotion();
    if (explorer.reduced) explorer.auto = false;
    explorer.update();
  }
});
$("#fullscreen").addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen)
      await document.documentElement.requestFullscreen();
    else toast("Este navegador não oferece tela cheia.");
  } catch {
    toast("Tela cheia não está disponível neste navegador.");
  }
});
// Ambientação original: drone harmônico, ruído filtrado e modulação muito lenta.
// Para uma trilha licenciada, preencha AUDIO_FILE com './assets/audio/ambiente.mp3'.
const AUDIO_FILE = "assets/audio/entre-horizontes.mp3";
let audioContext,
  masterGain,
  soundtrack,
  soundEnabled = false,
  voices = [],
  audioBusy = false;
const volumeValue = () => Number($("#volume").value) / 100;
function createAtmosphere() {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) throw new Error("Web Audio indisponível");
  audioContext = new Context();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0;
  const compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.ratio.value = 3;
  masterGain.connect(compressor);
  compressor.connect(audioContext.destination);
  [55, 82.4069, 110, 164.8138, 220].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator(),
      gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index % 2 ? 3 : -3;
    gain.gain.value = 0.045 / (index + 1);
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start();
    voices.push(oscillator);
    const lfo = audioContext.createOscillator(),
      depth = audioContext.createGain();
    lfo.frequency.value = 0.025 + index * 0.007;
    depth.gain.value = 0.005 / (index + 1);
    lfo.connect(depth);
    depth.connect(gain.gain);
    lfo.start();
  });
  const buffer = audioContext.createBuffer(
      1,
      audioContext.sampleRate * 4,
      audioContext.sampleRate,
    ),
    samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  const noise = audioContext.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 450;
  const gain = audioContext.createGain();
  gain.gain.value = 0.012;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  noise.start();
}
function updateAtmosphere(index) {
  if (!audioContext) return;
  const roots = [55, 49, 61.735, 55, 41.203, 55],
    root = roots[index];
  voices.forEach((voice, i) =>
    voice.frequency.setTargetAtTime(
      root * [1, 1.5, 2, 3, 4][i],
      audioContext.currentTime,
      3,
    ),
  );
}
async function setSound(enabled) {
  if (audioBusy) return;
  audioBusy = true;
  $("#sound-toggle").disabled = true;
  try {
    if (AUDIO_FILE) {
      if (!soundtrack) {
        soundtrack = new Audio(AUDIO_FILE);
        soundtrack.loop = true;
      }
      soundtrack.volume = volumeValue();
      if (enabled) await soundtrack.play();
      else soundtrack.pause();
    } else {
      if (enabled && !audioContext) createAtmosphere();
      if (enabled) {
        await audioContext.resume();
        masterGain.gain.setTargetAtTime(
          volumeValue(),
          audioContext.currentTime,
          1,
        );
        updateAtmosphere(state.current);
      } else if (audioContext) {
        masterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.1);
        await new Promise((resolve) => setTimeout(resolve, 260));
        await audioContext.suspend();
      }
    }
    soundEnabled = enabled;
    $("#sound-toggle").setAttribute("aria-pressed", String(enabled));
    $("#sound-toggle").setAttribute(
      "aria-label",
      enabled ? "Desligar som ambiente" : "Ligar som ambiente",
    );
    $("#sound-label").textContent = enabled ? "Som ligado" : "Som desligado";
  } catch {
    toast(
      "Áudio indisponível neste navegador. Você pode continuar no silêncio.",
    );
  } finally {
    audioBusy = false;
    $("#sound-toggle").disabled = false;
    if (document.hidden && soundEnabled) setSound(false);
  }
}
$("#sound-toggle").addEventListener("click", () => setSound(!soundEnabled));
$("#volume").addEventListener("input", () => {
  $("#volume-value").textContent = $("#volume").value + "%";
  if (soundtrack) soundtrack.volume = volumeValue();
  if (masterGain && soundEnabled)
    masterGain.gain.setTargetAtTime(
      volumeValue(),
      audioContext.currentTime,
      0.2,
    );
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && soundEnabled) setSound(false);
});
// Paralaxe discreta limitada a um frame por movimento; sem animação JS contínua.
let pointerFrame = 0;
window.addEventListener(
  "pointermove",
  (event) => {
    if (
      reducedMotion() ||
      event.pointerType !== "mouse" ||
      innerWidth < 800 ||
      pointerFrame
    )
      return;
    pointerFrame = requestAnimationFrame(() => {
      const x = (event.clientX / innerWidth - 0.5) * 8,
        y = (event.clientY / innerHeight - 0.5) * 6;
      $("#chapter-image").style.translate = `${x}px ${y}px`;
      pointerFrame = 0;
    });
  },
  { passive: true },
);
function drawStars() {
  const canvas = $("#starfield"),
    ctx = canvas.getContext("2d");
  if (!ctx) return;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  ctx.scale(ratio, ratio);
  let seed = 73;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < Math.min(650, (innerWidth * innerHeight) / 2500); i++) {
    const x = random() * innerWidth,
      y = random() * innerHeight,
      r = random() * 1.1 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(205,213,247,${random() * 0.6 + 0.15})`;
    ctx.fill();
  }
}
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawStars, 150);
});
restore();
updateHome();
drawStars();
updateTime();

// Ao voltar de uma descoberta aberta no caderno, atualizar os favoritos exibidos.
$("#discovery-dialog").addEventListener("close", () => {
  $("#discovery-dialog").classList.remove("immersed");
  $("#viewer-immerse").setAttribute("aria-pressed", "false");
  $("#viewer-immerse").textContent = "Mergulhar na cena";
  if ($("#journal-dialog").open) {
    openJournal();
    $("#journal-title").tabIndex = -1;
    $("#journal-title").focus({ preventScroll: true });
  }
});
