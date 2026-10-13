# Entre horizontes — trilha original

A experiência inclui `entre-horizontes.mp3`: **96 segundos**, estéreo, MP3, 32 kHz, 96 kb/s. Uma composição original para T.A.R.S., com piano sintetizado, camadas harmônicas sustentadas, ecos e uma pulsação suave.

Não usa samples, gravações, melodias ou trechos de músicas de filmes. A referência é uma atmosfera contemplativa e cinematográfica, com desenho musical próprio. Não há narração falada.

## Uso e licença

A composição/gravação original e seu gerador (`tools/compose-audio.mjs`) são disponibilizados sob **CC0 1.0 Universal**. Veja `CC0.md`. Você pode utilizar esta trilha com o projeto, inclusive em publicações e portfólio, sem pagar royalties desta gravação. Os outros assets mantêm suas próprias licenças.

O áudio está desligado ao carregar e é criado/reproduzido apenas pelo botão. Possui volume, pausa, retomada e loop. É pausado ao ocultar a aba.

## Reproduzir o processo de criação

A aplicação não exige ferramentas de áudio. Somente para gerar novamente o arquivo, é necessário Node.js e FFmpeg:

```sh
node tools/compose-audio.mjs /tmp/tars-entre-horizontes.wav
ffmpeg -i /tmp/tars-entre-horizontes.wav -codec:a libmp3lame -b:a 96k assets/audio/entre-horizontes.mp3
```

O gerador sintetiza notas e envelopes diretamente, sem samples externos. O WAV intermediário não precisa ser distribuído.

## Substituir a trilha

Coloque um arquivo licenciado nesta pasta e altere `AUDIO_FILE` em `script.js`. Registre autor, origem e licença em `assets/CREDITS.md`. Uma string vazia seleciona a ambientação sintetizada anterior como alternativa opcional. Mantenha o início por escolha do visitante.
