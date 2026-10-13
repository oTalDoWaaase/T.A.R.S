# T.A.R.S. — A Jornada

Uma experiência narrativa autoral em seis capítulos, da Terra ao horizonte observável. HTML, CSS e JavaScript puro; sem backend, dependências, rastreamento ou recursos remotos obrigatórios.

## Rodar localmente

Abra `index.html` diretamente no navegador. Tudo funciona offline; somente os links opcionais de fontes precisam de internet. Para servir por HTTP, use um servidor estático de sua preferência, por exemplo `npx --yes http-server . -p 8080` (requer Node e internet na primeira execução). Nenhum build é necessário.

## Publicar

**GitHub Pages:** envie os arquivos ao repositório. Em Settings → Pages, escolha Deploy from a branch, `main` e `/ (root)`. Os caminhos relativos também funcionam sob `/T.A.R.S/`.

**Netlify:** arraste a pasta com `index.html` ao painel de deploy manual, ou conecte o repositório sem comando de build e com diretório de publicação `.`.

A publicação é uma etapa separada; este protótipo não foi publicado automaticamente.

## Estrutura e edição

- `index.html`: estrutura, abertura, controles e dialogs acessíveis.
- `style.css`: paleta Abismo Cósmico, layouts, planetas e adaptação mobile.
- `script.js`: textos em `chapters`, descobertas em `objects`, progresso, áudio e estrelas.
- `assets/images/earth.svg`: ilustração original da Terra, deliberadamente conceitual.
- `assets/audio/`: local para sua futura trilha.

As demais composições são CSS. Não são fotografias, mapas exatos ou simulações físicas. Substitua as classes `.earth`, `.mars`, `.galaxy` etc. por fundos `url('./assets/images/nome.webp')` em `style.css`. A URL é relativa ao CSS. Imagens recomendadas: Terra vista do espaço, planetas, Via Láctea, galáxias profundas e estruturas cósmicas. Prefira WebP/AVIF otimizados, inclua créditos e confira a licença de cada material. Não há assets externos necessários, fontes baixadas ou identidade de filmes copiada.

## Áudio

Som desligado no carregamento. O botão inicia uma ambientação original suave, sintetizada pela Web Audio API; há controle de volume e mute em todas as telas. O som é interrompido ao ocultar a aba. Não há narração falada.

Para substituir por uma trilha licenciada, coloque `ambiente.mp3` em `assets/audio` e defina `AUDIO_FILE = './assets/audio/ambiente.mp3'` em `script.js`. O mesmo controle passa a usar o arquivo. Mantenha volume moderado e registre autor/licença aqui.

## Narrativa e navegação

A sequência é fixa; o avanço é voluntário. O mapa e os indicadores liberam apenas capítulos já alcançados. É possível revisitar destinos, e reiniciar limpa o progresso. O estado fica em memória, sem persistência: recarregar começa uma nova viagem. Há descobertas reais em todos os capítulos, zoom visual no painel e revelação no sexto. Textos poéticos são originais; metáforas estão identificadas e não descrevem entidades sobrenaturais como fatos.

## Acessibilidade e desempenho

Controles nativos, foco visível, link para pular a navegação, títulos focados ao mudar de capítulo e dialogs nativos com Escape, confinamento e retorno de foco. As animações respeitam `prefers-reduced-motion`. Canvas decorativo sem loop contínuo; SVG local pequeno; layout adaptado a telas estreitas. A exploração funciona sem som. É necessário JavaScript para a jornada, com aviso de fallback quando desativado.

## Fontes científicas e créditos

Os painéis têm links para aprofundamento na NASA:

- [Sistema Solar](https://science.nasa.gov/solar-system/), [Lua](https://science.nasa.gov/moon/), [Marte](https://science.nasa.gov/mars/), [Júpiter](https://science.nasa.gov/jupiter/), [Saturno](https://science.nasa.gov/saturn/), [Encélado](https://science.nasa.gov/saturn/moons/enceladus/).
- [Estrelas](https://science.nasa.gov/universe/stars/), [galáxias](https://science.nasa.gov/universe/galaxies/), [buracos negros](https://science.nasa.gov/universe/black-holes/), [universo](https://science.nasa.gov/universe/overview/).

Valores aproximados, sem proporções físicas na composição. O horizonte observável não representa uma borda demonstrada de todo o universo; a viagem é imaginativa. Arte SVG/CSS, ambientação sintetizada e narrativa foram produzidas para este protótipo, sem assets de terceiros.
