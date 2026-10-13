# BRIEFING DE PRODUTO — T.A.R.S. / A JORNADA (V1)

**Status:** briefing inicial aprovado conceitualmente, nome provisório.

## 1. Problema e oportunidade
Criar uma obra digital autoral que funcione simultaneamente como portfólio de desenvolvimento web e refúgio contemplativo. O visitante quer desligar-se da rotina, experimentar curiosidade, espanto e paz, e descobrir o universo e a própria capacidade de perguntar, aprender e explorar. Não é loja, blog de notícias nem portal escolar.

## 2. Público
Pessoas curiosas — inclusive sem conhecimento de astronomia —, fãs de ciência, exploração, estética cósmica e reflexão existencial. A jornada deve encantar também quem já gosta de astronomia, sem exigir conhecimento prévio.

## 3. Promessa da experiência
Uma viagem narrativa e interativa da Terra aos limites do universo observável, com sensação de frio na barriga, mistério, silêncio e contemplação. Mensagem subjacente: a imensidão do cosmos não invalida o potencial do indivíduo; aprender e buscar novos horizontes é extraordinário.

## 4. Objetivos da V1
- Primeira versão funcional para testar hoje em Claude Code e Codex e comparar resultados.
- Peça potencial de portfólio; desenvolvimento posterior sem prazo definido.
- Experiência inicial de aproximadamente cinco minutos, porém sem impor cronômetro; exploração opcional pode durar mais.
- Responsiva para desktop e celular, preferencialmente desktop-first sem sacrificar o mobile.

## 5. Estrutura da missão: seis capítulos, em ordem narrativa fixa
1. **O Despertar:** despertar à deriva, Terra, origem da jornada e da consciência curiosa.
2. **Nossa Vizinhança:** Sistema Solar, seus mundos e suas particularidades.
3. **O Oceano de Estrelas:** espaço interestelar e vizinhança estelar além do Sistema Solar.
4. **Nossa Galáxia:** Via Láctea e nosso lugar nela.
5. **Além da Via Láctea:** galáxias próximas, distantes e estrutura em grande escala.
6. **O Último Horizonte:** universo observável, limites do que podemos conhecer e reflexão final.

A sequência da história é fixa. Dentro de cada capítulo, o visitante pode abrir painéis de descoberta para investigar objetos, curiosidades e imagens no seu ritmo. O mapa da jornada deve estar presente na V1 como visualização navegável de progresso e destinos, sem permitir pular capítulos ainda não percorridos (destinos desbloqueados podem ser revisitados, preservando o arco da primeira viagem).

## 6. Interações essenciais
- Abertura misteriosa com sensação de despertar/estar à deriva.
- Capítulos imersivos em tela cheia, com avanço voluntário e transições suaves.
- Objetos cósmicos clicáveis e painéis de descoberta com imagens, informações curtas e curiosidades.
- Zoom aproximado em pelo menos um objeto (por exemplo, Terra), usando abordagem tecnicamente viável e fluida, sem prometer simulação tridimensional completa.
- Mapa da jornada acessível, mostrando seis destinos, localização atual, progresso e destinos conhecidos.
- Trilha espacial ambiente **opcional**, desligada no carregamento e iniciada somente após ação do usuário; botão de ligar/desligar e volume; interface compreensível sem som.
- Narração escrita por uma inteligência cósmica extremamente perspicaz, misteriosa, quase sem identidade definida, com humor leve e filosofia. Sem chatbot/IA real na V1.
- Plot twist final: a voz simboliza a própria curiosidade/consciência do visitante, não uma entidade sobrenatural comprovada. Pistas discretas ao longo dos capítulos; preservar o impacto.
- Easter egg discreto **L.E.**, escondido em coordenadas simbólicas, padrões estelares ou créditos mínimos.

## 7. Conteúdo e responsabilidade científica
Primeira versão é sobretudo conceitual, visual e filosófica, mas não deve inventar fatos. Diferenciar claramente fatos astronômicos de metáforas poéticas. Não confundir o universo observável com um limite físico demonstrado de todo o universo; não sugerir viagem literal realizável ao seu limite. Utilizar fatos de alta confiança e fontes confiáveis (NASA/ESA, se aplicável); textos breves, com opção de aprofundamento. Imagens devem ter direitos de uso compatíveis e créditos quando necessários; não copiar personagens, falas, trilhas ou identidade visual protegidos de filmes/séries.

## 8. Direção artística
- Predominância **transcendência cósmica**: atmosfera onírica, misteriosa e contemplativa.
- Mistura de astrofotografia realista com surrealismo moderado, dreamcore e sensação liminal/backrooms, **sem terror**.
- Paleta **Abismo Cósmico**: preto quase absoluto (#05060B), azul profundo (#111B37), violeta (#433C83), lavanda (#988DE0), branco frio (#E8EAF8). Contraste legível.
- Tipografia editorial/filosófica para títulos e momentos poéticos, complementada por sans-serif ou monoespaçada discreta para dados e HUD.
- HUD espacial minimalista: progresso, capítulo e poucos indicadores; jamais competir com imagens/textos.
- Ritmo lento e respirável: espaço negativo, silêncio, pausas, acelerações raras e justificadas.
- Linguagem visual coerente; evitar excesso de efeitos, neon aleatório e menus complexos.

## 9. Tecnologia e publicação
Recomendação: **HTML semântico + CSS + JavaScript (ES modules)**, com Vite opcional para facilitar desenvolvimento local. Não usar Java ou Python sem uma necessidade real. Nada de backend, contas ou banco de dados na V1. Publicação futura em GitHub Pages ou Netlify; rodar localmente inicialmente. Animações leves em CSS/JS; bibliotecas externas apenas se trouxerem ganho justificável. Respeitar `prefers-reduced-motion`, navegação por teclado, foco, contraste, mobile e otimização de imagens. Se usar APIs externas, permitir fallback offline ou com imagens locais.

## 10. Fora do escopo da V1
Comunidade, chats, perfis, login, bandeiras públicas, IA conversacional real tipo TARS, publicação diária automática, enciclopédia astronômica completa, livre navegação em universo 3D, simulação física realista, conteúdo científico ilimitado e muitos efeitos pesados.

## 11. Critérios de aceitação
- Jornada completa do despertar ao encerramento, em seis capítulos.
- Experiência visual responsiva e coerente com direção de arte.
- Mapa funcional da jornada.
- Painéis de descoberta reais e acessíveis em cada capítulo.
- Som opcional, sem autoplay com som.
- Narrativa com pistas e revelação final.
- Sem afirmações científicas inventadas; fontes/créditos para dados e materiais usados.
- Rodar localmente e ter instruções claras de publicação.
- Código limpo e compreensível para estudo e evolução.
