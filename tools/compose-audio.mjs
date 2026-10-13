// Composição original gerada por síntese: nenhum sample ou tema musical de terceiros.
// Produz um WAV intermediário. Use ffmpeg conforme assets/audio/README.md para MP3.
import fs from "node:fs";
const sampleRate = 32000,
  seconds = 96,
  frames = sampleRate * seconds;
const left = new Float64Array(frames),
  right = new Float64Array(frames);
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const sine = (phase) => Math.sin(phase * Math.PI * 2);
const chords = [
  [50, 57, 60, 64, 69],
  [53, 57, 60, 64, 67],
  [46, 53, 57, 60, 65],
  [43, 50, 57, 58, 62],
];
// Notas sustentadas com ataques longos, respiradas entre os horizontes.
for (let chord = 0; chord < chords.length; chord++) {
  const start = chord * 24 - 2,
    duration = 28;
  for (let voice = 0; voice < chords[chord].length; voice++) {
    const frequency = midi(chords[chord][voice]),
      pan = 0.18 + voice * 0.15;
    for (
      let i = Math.max(0, Math.floor(start * sampleRate));
      i < Math.min(frames, (start + duration) * sampleRate);
      i++
    ) {
      const t = i / sampleRate - start,
        envelope = Math.min(1, t / 5) * Math.min(1, (duration - t) / 7),
        breath = 0.88 + 0.12 * sine(t * 0.035 + voice * 0.17);
      const soft =
        (sine(t * frequency) +
          0.16 * sine(t * frequency * 2.003) +
          0.06 * sine(t * frequency * 3.002)) *
        0.014 *
        envelope *
        breath;
      left[i] += soft * Math.sqrt(1 - pan);
      right[i] += soft * Math.sqrt(pan);
    }
  }
}
// Uma linha de piano deliberadamente esparsa, com desenho próprio e variações.
const patterns = [
  [0, 2, 4, 1, 3, 2, 1, 4],
  [2, 0, 3, 4, 1, 0, 2, 3],
  [1, 3, 0, 4, 2, 3, 1, 0],
  [4, 1, 2, 0, 3, 1, 4, 2],
];
function piano(start, note, velocity, pan) {
  const f = midi(note),
    duration = 7;
  for (
    let i = Math.floor(start * sampleRate);
    i < Math.min(frames, (start + duration) * sampleRate);
    i++
  ) {
    const t = i / sampleRate - start,
      attack = 1 - Math.exp(-t * 75);
    const body =
      sine(f * t) * Math.exp(-t * 0.5) +
      0.34 * sine(f * 2.001 * t) * Math.exp(-t * 0.95) +
      0.15 * sine(f * 3.004 * t) * Math.exp(-t * 1.5) +
      0.06 * sine(f * 4.009 * t) * Math.exp(-t * 2.3);
    const sample = body * attack * 0.043 * velocity;
    left[i] += sample * Math.sqrt(1 - pan);
    right[i] += sample * Math.sqrt(pan);
  }
}
for (let chord = 0; chord < 4; chord++)
  for (let step = 0; step < 8; step++) {
    const note = chords[chord][patterns[chord][step]] + 12,
      start = chord * 24 + step * 2.75 + 1.1;
    piano(start, note, 0.5 + 0.15 * (step % 3), 0.25 + (step % 4) * 0.15);
    // Ecos discretos que pertencem à gravação, sem efeitos externos em tempo real.
    piano(start + 0.68, note, 0.13, 0.75);
    piano(start + 1.31, note, 0.055, 0.22);
  }
// Uma pulsação lenta de baixa intensidade; sem batida percussiva ou picos bruscos.
for (let i = 0; i < frames; i++) {
  const t = i / sampleRate,
    edge = Math.min(1, t / 5, (seconds - t) / 6),
    pulse = (0.55 + 0.45 * sine(t * 0.125)) * 0.006;
  const bass = sine(t * midi(38)) * pulse;
  left[i] = (left[i] + bass) * Math.max(0, edge);
  right[i] = (right[i] + bass) * Math.max(0, edge);
}
// Espaço estéreo: reflexões decrescentes, sem convoluções ou samples.
for (const [delay, gain] of [
  [0.21, 0.18],
  [0.43, 0.12],
  [0.89, 0.065],
  [1.43, 0.035],
]) {
  const offset = Math.round(delay * sampleRate);
  for (let i = frames - 1; i >= offset; i--) {
    left[i] += right[i - offset] * gain;
    right[i] += left[i - offset] * gain;
  }
}
let peak = 0;
for (let i = 0; i < frames; i++)
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
const output = Buffer.alloc(44 + frames * 4);
output.write("RIFF", 0);
output.writeUInt32LE(output.length - 8, 4);
output.write("WAVEfmt ", 8);
output.writeUInt32LE(16, 16);
output.writeUInt16LE(1, 20);
output.writeUInt16LE(2, 22);
output.writeUInt32LE(sampleRate, 24);
output.writeUInt32LE(sampleRate * 4, 28);
output.writeUInt16LE(4, 32);
output.writeUInt16LE(16, 34);
output.write("data", 36);
output.writeUInt32LE(frames * 4, 40);
const normalizer = 0.63 / peak;
for (let i = 0; i < frames; i++) {
  const fade = Math.min(1, (frames - i) / (sampleRate * 2));
  output.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, left[i] * normalizer * fade)) * 32767),
    44 + i * 4,
  );
  output.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, right[i] * normalizer * fade)) * 32767),
    46 + i * 4,
  );
}
const target = process.argv[2] || "/tmp/tars-entre-horizontes.wav";
fs.writeFileSync(target, output);
console.log(
  `Composição original: ${seconds}s, estéreo, ${sampleRate} Hz. WAV: ${target}`,
);
