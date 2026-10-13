# T.A.R.S. — A Jornada

Uma obra digital contemplativa: você desperta à deriva e atravessa seis horizontes, da Terra aos limites do universo observável. Ao longo da história, uma voz conduz a exploração — e deixa pistas sobre sua origem.

![Tela de abertura da jornada, com a Terra e um viajante à deriva](docs/abertura.jpg)

Esta versão reconstrói a primeira entrega: seis cenários próprios, direção de arte cinematográfica, abertura em três atos, dezoito transmissões e descobertas que alternam ciência e reflexão. O briefing de referência está em `BRIEFING_TARS_V1.md`.

## Rodar agora

Extraia o projeto e abra **`index.html`** no navegador. Não há instalação, build ou conexão obrigatória. Mantenha as pastas junto ao HTML.

Se preferir um servidor local, com Node.js instalado:

```sh
node tools/serve.mjs
```

Abra a porta 8080 no seu navegador local. Para outra porta, configure `PORT` antes de executar. O servidor é somente uma ferramenta opcional de desenvolvimento; a aplicação continua inteiramente estática, sem backend.

![Capítulo Nossa Vizinhança, com Saturno e objetos exploráveis](docs/vizinhanca.jpg)

## A experiência

- **Abertura:** três cenas escritas, sem cronômetro; você pode ir direto à jornada.
- **Seis capítulos:** cada horizonte tem um cenário e três transmissões. O botão principal continua a história antes de abrir o próximo capítulo.
- **Mapa:** destinos futuros ficam bloqueados. Os conhecidos podem ser revisitados.
- **13 descobertas:** Terra, Lua, Marte, Júpiter, Saturno, Encélado, Proxima Centauri, Sirius, Via Láctea, Sagittarius A\*, Andrômeda, teia cósmica e universo observável.
- **Painéis:** ampliação visual, dados curtos, curiosidade adicional, fonte científica, leitura poética e pergunta pessoal. Os planetas têm ilustrações detalhadas locais.
- **Caderno de bordo:** guarde descobertas e exporte seus registros como texto. Não é necessário criar conta.
- **Escala interativa:** compare seis ordens de grandeza, da Lua ao horizonte observável.
- **Lente do tempo:** em Além da Via Láctea, explore conceitualmente a viagem da luz de Andrômeda.
- **Contemplação:** recolha textos e marcadores para observar o cenário.
- **Final:** a revelação ocorre na terceira transmissão do último capítulo. Uma palavra sua pode acompanhar uma carta baixada localmente. Há um detalhe `L.E.` para quem continuar olhando.
- **Preferências:** som opcional, volume, movimento reduzido e tela cheia quando disponível.

Os capítulos, descobertas e favoritos ficam em **sessionStorage**, apenas nesta aba, para retomar após recarregar. Fechar a aba normalmente encerra a sessão. Reiniciar limpa todos os registros da jornada e a resposta final. Nenhum dado é enviado para serviços externos. Se o navegador bloquear esse armazenamento, a exploração continua em memória. A palavra da carta fica apenas em memória até sair/recarregar.

## Publicação

### GitHub Pages

Em **Settings → Pages**, selecione **Deploy from a branch**, branch `main` e pasta `/ (root)`. Os caminhos relativos funcionam também em `/T.A.R.S/`. Não é necessário um build ou configuração de SPA.

### Netlify

Envie a pasta do projeto pelo deploy manual, ou conecte o repositório usando diretório de publicação `.` e nenhum comando de build.

Enviar código ao GitHub não publica automaticamente o site. A ativação de Pages/Netlify é uma etapa separada.

## Estrutura

```text
index.html              Estrutura semântica e dialogs
style.css               Direção de arte, cenas e responsividade
script.js               Jornada, estado, interações e som
js/data.js              Narrativa, ciência, objetos e escalas
assets/images/          Cenários e atlas de planetas em WebP
assets/fonts/           Fontes locais e licenças OFL
assets/audio/           Sua futura trilha, se quiser substituir o sintetizador
tools/serve.mjs          Servidor local opcional, sem dependências
tests/e2e.cjs            Teste de navegador opcional
BRIEFING_TARS_V1.md      Referência do projeto
```

## Editar narrativa, imagens e áudio

**Textos:** edite `chapters`, `prologue`, `objects`, `objectDetails` e `scales` em `js/data.js`. O final é exibido pela lógica de `renderStory` em `script.js`; a abertura e os textos estruturais estão no HTML. Novas descobertas devem incluir fonte, fatos e reflexão separados.

**Cenários:** substitua os WebP em `assets/images`, ou altere `image` nos capítulos. A abertura usa `arrival.webp`. Recomenda-se largura de 1600–1920 px e compressão WebP/AVIF. Os fundos privilegiam objetos à direita e espaço escuro à esquerda para texto. O atlas `planets.webp` tem Marte/Júpiter na linha superior e Saturno/Encélado na inferior; o CSS seleciona cada quadrante. A Lua tem uma composição procedural simples. Imagens de Terra, Sistema Solar, vizinhança estelar, galáxias e estruturas cósmicas podem substituir as artes; confira a licença e mantenha os créditos.

**Som:** já existe uma ambientação original via Web Audio API, com camadas harmônicas, ruído filtrado e mudanças suaves entre capítulos. Não há narração falada. Som desligado no carregamento; inicia exclusivamente pelo botão e é interrompido ao ocultar a aba. Para usar uma trilha licenciada, coloque `ambiente.mp3` em `assets/audio` e preencha `AUDIO_FILE` em `script.js` com `./assets/audio/ambiente.mp3`. Registre sua licença em `assets/CREDITS.md`.

## Ciência e arte

A viagem é **imaginativa**, não um simulador físico ou uma viagem realizável ao limite do cosmos. Tamanhos, posições, cenas e ampliações são composições sem escala física. Os fundos e planetas são **ilustrações geradas com IA**, não astrofotografias ou reconstruções científicas precisas. Não copiar personagens ou identidade de filmes faz parte da direção de arte.

O anel do último capítulo é uma metáfora do limite de observação, não uma imagem real do universo observável ou de um buraco negro. A ilustração em Sagittarius A\* é conceitual. A galáxia apresentada como Via Láctea é ilustrativa: não possuímos uma fotografia de nossa galáxia inteira vista de fora.

O raio observável atual é aproximadamente 46 bilhões de anos-luz, apesar da idade de cerca de 13,8 bilhões de anos, devido à expansão do espaço. O horizonte observável não demonstra uma borda física de todo o universo. A lente do tempo apenas visualiza uma viagem de luz: ela não simula mudanças reais na aparência da galáxia.

Os painéis têm fontes de aprofundamento na NASA. Créditos e links estão em `assets/CREDITS.md` e no diálogo de créditos. Metáforas ficam na aba **O que sentimos** e são identificadas como uma leitura poética.

## Acessibilidade e desempenho

HTML semântico, controles nativos, foco visível, link de salto, títulos focados nas transições e dialogs com Escape, confinamento e retorno de foco. As abas de descoberta aceitam setas, Home e End. Sliders usam teclado nativo. A interface funciona sem som.

`prefers-reduced-motion` é respeitado, e há uma preferência adicional na interface. Animações usam CSS; o campo estelar só é desenhado no carregamento/redimensionamento. Paralaxe sutil de mouse usa frames sob demanda e é desativada em telas menores e movimento reduzido. Imagens e fontes são locais, totalizando aproximadamente 1,7 MB; thumbnails são carregados conforme necessário, e só o próximo cenário é pré-carregado ao viajar.

## Validação de navegador

A aplicação não precisa de dependências. Para executar o teste automatizado opcional, instale Playwright somente como ferramenta de desenvolvimento:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node tools/serve.mjs
# Em outro terminal:
node tests/e2e.cjs
```

O teste cobre percurso narrativo, bloqueio do mapa, descobertas, foco, abas, zoom, caderno e exportação, escala, lente temporal, áudio, retomada, reinício e responsividade. Para usar um Chromium já instalado, defina `CHROMIUM_PATH`. Para um servidor em outra porta, use `TARS_BASE_URL`. Ele não publica ou envia dados.
