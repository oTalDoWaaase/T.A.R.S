const { test } = require("node:test");
const assert = require("node:assert/strict");
const profiles = require("../js/profiles.js");

test("dez perguntas cobrem os seis capítulos, sem IDs repetidos", () => {
  assert.equal(profiles.questions.length, 10);
  assert.equal(new Set(profiles.questions.map((q) => q.id)).size, 10);
  assert.deepEqual(
    [...new Set(profiles.questions.map((q) => q.chapter))],
    [0, 1, 2, 3, 4, 5],
  );
});
for (const [option, kind] of [
  "explorador",
  "investigador",
  "contemplativo",
  "conector",
].entries()) {
  test(`preferências coerentes produzem o retrato ${kind}`, () => {
    const answers = Object.fromEntries(
      profiles.questions.map((q) => [q.id, option]),
    );
    const result = profiles.result(answers);
    assert.equal(result.kind, kind);
    assert.equal(result.count, 10);
    assert.equal(result.records.length, 10);
    assert.ok(result.text.length > 100);
  });
}
test("silêncio e valores inválidos não viram respostas ou um perfil inventado", () => {
  const result = profiles.result({
    q01: "skip",
    q02: 99,
    q03: -1,
    q04: "0",
    unknown: 0,
  });
  assert.equal(result.count, 0);
  assert.equal(result.kind, "aberto");
});
test("a primeira opção conta e poucas escolhas deixam o retrato em aberto", () => {
  const result = profiles.result({ q01: 0, q02: 0 });
  assert.equal(result.count, 2);
  assert.equal(result.kind, "aberto");
});
test("preferências empatadas preservam um retrato misto", () => {
  const result = profiles.result({ q01: 0, q02: 1, q03: 2, q04: 3 });
  assert.equal(result.kind, "misto");
});
test("editar uma escolha atualiza os registros sem contá-la duas vezes", () => {
  const answers = { q01: 0, q02: 0, q03: 0 };
  const before = profiles.result(answers);
  answers.q01 = 3;
  const after = profiles.result(answers);
  assert.equal(after.count, 3);
  assert.notEqual(after.records[0].answer, before.records[0].answer);
  assert.ok(after.scores.conector > before.scores.conector);
});
