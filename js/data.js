"use strict";
// Conteúdo local: fatos científicos, narrativa e representações visuais têm funções distintas.
// Edite as definições abaixo; não há sobrescritas posteriores dos textos.

const objects = {
  terra: {
    name: "Terra",
    art: "earth",
    subtitle: "Tudo o que chamamos de casa.",
    description:
      "Oceanos líquidos, uma atmosfera protetora e uma história de vida que ainda estamos aprendendo a ler. Até hoje, é o único mundo onde sabemos que há vida.",
    facts: [
      ["Diâmetro médio", "12.742 km"],
      ["Satélite natural", "A Lua"],
    ],
    reflection:
      "Metáfora de bordo: vista de longe, nenhuma fronteira está desenhada.",
    source: "https://science.nasa.gov/solar-system/",
  },
  lua: {
    name: "Lua",
    art: "enceladus",
    subtitle: "Uma companhia na escuridão.",
    description:
      "Nosso satélite natural guarda marcas de impactos antigos. Vemos quase sempre a mesma face porque sua rotação e sua órbita ao redor da Terra têm períodos semelhantes.",
    facts: [
      ["Distância média da Terra", "384.400 km"],
      ["Órbita sideral", "27,3 dias"],
    ],
    reflection: "Metáfora de bordo: mesmo o silêncio pode fazer companhia.",
    source: "https://science.nasa.gov/moon/",
  },
  marte: {
    name: "Marte",
    art: "mars",
    subtitle: "Um mundo que se lembra da água.",
    description:
      "Vales e minerais mostram que água líquida já correu pela superfície de Marte. Hoje, o planeta é frio, com uma atmosfera muito tênue. Ainda não encontramos evidência confirmada de vida ali.",
    facts: [
      ["Um dia marciano", "24 h 37 min"],
      ["Luas", "Fobos e Deimos"],
    ],
    reflection: "Metáfora de bordo: nem todo deserto esteve sempre sozinho.",
    source: "https://science.nasa.gov/mars/",
  },
  jupiter: {
    name: "Júpiter",
    art: "jupiter",
    subtitle: "Uma tempestade com um mundo ao redor.",
    description:
      "O maior planeta do Sistema Solar é composto principalmente de hidrogênio e hélio. A Grande Mancha Vermelha é uma enorme tempestade observada há séculos.",
    facts: [
      ["Diâmetro equatorial", "142.984 km"],
      ["Rotação", "Cerca de 10 horas"],
    ],
    reflection: "Metáfora de bordo: a grandeza também tem suas inquietações.",
    source: "https://science.nasa.gov/jupiter/",
  },
  saturno: {
    name: "Saturno",
    art: "saturn",
    subtitle: "O tempo desenhado em anéis.",
    description:
      "Os anéis de Saturno são compostos de incontáveis partículas de gelo e rocha. Parecem contínuos à distância, mas cada fragmento segue sua própria órbita.",
    facts: [
      ["Composição dos anéis", "Gelo e rocha"],
      ["Ano saturniano", "Cerca de 29 anos terrestres"],
    ],
    reflection: "Metáfora de bordo: às vezes, pertencer é orbitar junto.",
    source: "https://science.nasa.gov/saturn/",
  },
  encelado: {
    name: "Encélado",
    art: "enceladus",
    subtitle: "Um oceano escondido no gelo.",
    description:
      "Esta lua de Saturno lança plumas de vapor de água e gelo por fissuras próximas ao polo sul. Evidências da missão Cassini indicam um oceano líquido sob a crosta gelada.",
    facts: [
      ["Diâmetro", "Cerca de 500 km"],
      ["Sob a superfície", "Um oceano global"],
    ],
    reflection:
      "Metáfora de bordo: há profundezas que uma superfície não revela.",
    source: "https://science.nasa.gov/saturn/moons/enceladus/",
  },
  proxima: {
    name: "Proxima Centauri",
    art: "star",
    subtitle: "A vizinha ainda distante.",
    description:
      "A estrela mais próxima do Sol é uma anã vermelha. Sua luz leva cerca de 4,24 anos para chegar até nós. Mesmo nossa vizinhança estelar desafia a escala da experiência humana.",
    facts: [
      ["Distância do Sol", "4,24 anos-luz"],
      ["Tipo de estrela", "Anã vermelha"],
    ],
    reflection:
      "Metáfora de bordo: perto é uma palavra que muda quando olhamos para cima.",
    source: "https://science.nasa.gov/universe/stars/",
  },
  sirio: {
    name: "Sirius",
    art: "star",
    subtitle: "Uma luz que vem em dupla.",
    description:
      "A estrela mais brilhante do céu noturno, vista da Terra, faz parte de um sistema binário. Sua companheira, Sirius B, é uma anã branca: o remanescente de uma estrela.",
    facts: [
      ["Distância", "Cerca de 8,6 anos-luz"],
      ["Sistema", "Duas estrelas"],
    ],
    reflection:
      "Metáfora de bordo: até os pontos de luz podem guardar histórias invisíveis.",
    source: "https://science.nasa.gov/universe/stars/",
  },
  vialactea: {
    name: "Via Láctea",
    art: "galaxy",
    subtitle: "Uma cidade feita de estrelas.",
    description:
      "Nossa galáxia é uma espiral barrada. O Sistema Solar ocupa uma região do braço de Órion, longe do centro. A faixa luminosa no céu é a visão de dentro de seu disco.",
    facts: [
      ["Diâmetro do disco", "Cerca de 100 mil anos-luz"],
      ["Nosso endereço", "Braço de Órion"],
    ],
    reflection:
      "Metáfora de bordo: não estamos no centro. Ainda assim, estamos aqui.",
    source: "https://science.nasa.gov/universe/galaxies/",
  },
  sagitario: {
    name: "Sagittarius A*",
    art: "horizon",
    subtitle: "Um centro que não emite luz.",
    description:
      "No centro da Via Láctea há um buraco negro supermassivo. Estrelas orbitando essa região e observações do Event Horizon Telescope ajudam a revelar sua presença.",
    facts: [
      ["Massa aproximada", "4 milhões de sóis"],
      ["Localização", "Centro galáctico"],
    ],
    reflection:
      "Metáfora de bordo: o que não vemos também pode mudar nossa trajetória.",
    source: "https://science.nasa.gov/universe/black-holes/",
  },
  andromeda: {
    name: "Andrômeda",
    art: "galaxy",
    subtitle: "Outra ilha no oceano escuro.",
    description:
      "Uma grande galáxia espiral do Grupo Local. Sua luz viaja por cerca de 2,5 milhões de anos antes de chegar aos nossos olhos. Olhar para longe também é olhar para o passado.",
    facts: [
      ["Distância", "2,5 milhões de anos-luz"],
      ["Família galáctica", "Grupo Local"],
    ],
    reflection:
      "Metáfora de bordo: algumas cartas levam milhões de anos para chegar.",
    source: "https://science.nasa.gov/universe/galaxies/",
  },
  teia: {
    name: "Teia cósmica",
    art: "web",
    subtitle: "O universo entre as ilhas.",
    description:
      "Em grandes escalas, galáxias e matéria se distribuem em filamentos, aglomerados e extensos vazios. Essa estrutura cresceu a partir de pequenas diferenças de densidade no universo primordial.",
    facts: [
      ["Estrutura", "Filamentos e vazios"],
      ["Escala", "Milhões de anos-luz"],
    ],
    reflection:
      "Metáfora de bordo: mesmo a vastidão tem seus fios de encontro.",
    source: "https://science.nasa.gov/universe/galaxies/",
  },
  observavel: {
    name: "Universo observável",
    art: "horizon",
    subtitle: "Um limite da nossa visão.",
    description:
      "É a região de onde a luz teve tempo de nos alcançar desde o início da expansão cósmica. Seu horizonte não é uma parede nem uma borda física demonstrada de todo o universo.",
    facts: [
      ["Idade do universo", "Cerca de 13,8 bilhões de anos"],
      ["Raio observável atual", "Cerca de 46 bilhões de anos-luz"],
    ],
    reflection:
      "A expansão do espaço explica por que o raio atual supera 13,8 bilhões de anos-luz. A jornada é imaginativa, não uma viagem fisicamente realizável.",
    source: "https://science.nasa.gov/universe/overview/",
  },
  mercurio: {
    name: "Mercúrio",
    art: "mercury",
    subtitle: "Um mundo de extremos junto ao Sol.",
    description:
      "O menor planeta do Sistema Solar tem uma superfície marcada por crateras e uma exosfera muito tênue. Seus dias e noites atingem temperaturas muito diferentes.",
    facts: [
      ["Ano mercuriano", "Cerca de 88 dias terrestres"],
      ["Luas", "Nenhuma"],
    ],
    reflection:
      "Metáfora de bordo: até perto da luz há espaço para o silêncio.",
    source: "https://science.nasa.gov/mercury/",
  },
  venus: {
    name: "Vênus",
    art: "venus",
    subtitle: "Um mundo escondido por nuvens.",
    description:
      "Uma atmosfera densa de dióxido de carbono e nuvens de ácido sulfúrico envolvem Vênus. O intenso efeito estufa faz dele o planeta mais quente do Sistema Solar.",
    facts: [
      ["Temperatura da superfície", "Cerca de 465 °C"],
      ["Rotação", "Retrógrada e muito lenta"],
    ],
    reflection:
      "Metáfora de bordo: uma superfície nem sempre mostra o que existe por baixo.",
    source: "https://science.nasa.gov/venus/",
  },
  urano: {
    name: "Urano",
    art: "uranus",
    subtitle: "Um gigante que mudou de perspectiva.",
    description:
      "Urano é um gigante de gelo com atmosfera rica em hidrogênio, hélio e metano. Seu eixo é muito inclinado: o planeta parece girar deitado em relação ao plano de sua órbita.",
    facts: [
      ["Inclinação do eixo", "Cerca de 98°"],
      ["Ano uraniano", "Cerca de 84 anos terrestres"],
    ],
    reflection:
      "Metáfora de bordo: há outras maneiras de atravessar o mesmo céu.",
    source: "https://science.nasa.gov/uranus/",
  },
  netuno: {
    name: "Netuno",
    art: "neptune",
    subtitle: "Um horizonte azul e ventoso.",
    description:
      "O planeta mais distante do Sol abriga ventos muito rápidos. Sua atmosfera contém metano, e sua aparência real é mais suavemente azul do que muitas imagens históricas em cores realçadas.",
    facts: [
      ["Ano netuniano", "Cerca de 165 anos terrestres"],
      ["Tipo de planeta", "Gigante de gelo"],
    ],
    reflection:
      "Metáfora de bordo: mesmo a distância mais fria pode guardar movimento.",
    source: "https://science.nasa.gov/neptune/",
  },
};

const objectDetails = {
  terra: {
    chapter: 0,
    art: "earth",
    coordinate: "SOL III / NOSSA CASA",
    extra:
      "Cerca de 71% da superfície é coberta por água. O azul que vemos de longe é um lembrete de que a vida depende de condições delicadas.",
    question:
      "Se você visse sua casa do espaço, o que deixaria de parecer tão importante?",
  },
  lua: {
    chapter: 0,
    art: "moon",
    coordinate: "TERRA / SATÉLITE NATURAL",
    extra:
      "A Lua não produz a luz que vemos: ela reflete a luz do Sol. Suas fases dependem da geometria entre Sol, Terra e Lua.",
    question: "O que, na sua vida, ilumina sem precisar ser o centro?",
  },
  marte: {
    chapter: 1,
    art: "mars",
    coordinate: "SOL IV / MUNDO ROCHOSO",
    extra:
      "O Monte Olimpo é um enorme vulcão marciano, com cerca de 22 km de altura acima do terreno de referência. Sua escala supera a de qualquer vulcão terrestre.",
    question:
      "O que você ainda gostaria de descobrir em um lugar que parece vazio?",
  },
  jupiter: {
    chapter: 1,
    art: "jupiter",
    coordinate: "SOL V / GIGANTE GASOSO",
    extra:
      "Júpiter não tem uma superfície sólida como a da Terra. Sua atmosfera se torna progressivamente mais densa conforme descemos.",
    question: "Há algo grande em você que ainda não encontrou um nome?",
  },
  saturno: {
    chapter: 1,
    art: "saturn",
    coordinate: "SOL VI / GIGANTE GASOSO",
    extra:
      "Os anéis são muito extensos e, em comparação com sua largura, surpreendentemente finos. A Cassini explorou esse sistema por treze anos.",
    question:
      "O que mantém as pequenas partes da sua vida em uma mesma órbita?",
  },
  encelado: {
    chapter: 1,
    art: "enceladus",
    coordinate: "SATURNO / LUA GELADA",
    extra:
      "A Cassini detectou moléculas orgânicas nas plumas. Isso torna Encélado um lugar de grande interesse para estudar ambientes habitáveis, sem confirmar vida.",
    question: "Que possibilidades você esconde sob a sua superfície?",
  },
  proxima: {
    chapter: 2,
    art: "red-star",
    coordinate: "CENTAURO / VIZINHANÇA ESTELAR",
    extra:
      "Proxima Centauri tem pelo menos um planeta confirmado. Saber que existe um planeta não significa saber que ele abriga vida.",
    question:
      "Se o perto também pode ser tão distante, quanto vale um pequeno passo?",
  },
  sirio: {
    chapter: 2,
    art: "blue-star",
    coordinate: "CÃO MAIOR / SISTEMA BINÁRIO",
    extra:
      "Sirius A é a estrela brilhante visível a olho nu. Sirius B é muito mais tênue e pequena, apesar de ter massa próxima à do Sol.",
    question: "O que existe ao seu lado e você ainda não aprendeu a perceber?",
  },
  vialactea: {
    chapter: 3,
    art: "galaxy",
    coordinate: "BRAÇO DE ÓRION / NOSSA GALÁXIA",
    extra:
      "O Sol leva aproximadamente 230 milhões de anos para completar uma volta ao redor do centro da galáxia. A humanidade surgiu durante uma fração minúscula desse percurso.",
    question: "O seu lugar precisa ser o centro para ter significado?",
  },
  sagitario: {
    chapter: 3,
    art: "blackhole",
    coordinate: "CENTRO GALÁCTICO / SAGITTARIUS A*",
    extra:
      "Um buraco negro não é um aspirador universal. Longe dele, sua gravidade se comporta como a de outros objetos com a mesma massa.",
    question:
      "Como você se orienta quando algo importante permanece invisível?",
  },
  andromeda: {
    chapter: 4,
    art: "galaxy",
    coordinate: "M31 / GRUPO LOCAL",
    extra:
      "A luz que você recebe hoje deixou Andrômeda antes do aparecimento da nossa espécie. A distância transforma um olhar em uma janela temporal.",
    question:
      "Que mensagem você gostaria que sobrevivesse ao seu próprio tempo?",
  },
  teia: {
    chapter: 4,
    art: "web",
    coordinate: "GRANDE ESCALA / FILAMENTOS",
    extra:
      "Entre os filamentos existem grandes vazios cósmicos. “Vazio” não significa ausência absoluta de matéria, mas uma densidade muito menor.",
    question: "E se o espaço entre as coisas também fosse parte da história?",
  },
  observavel: {
    chapter: 5,
    art: "horizon",
    coordinate: "HORIZONTE OBSERVÁVEL / SEM BORDA FÍSICA CONFIRMADA",
    extra:
      "Não sabemos se o universo inteiro é finito ou infinito. O limite da nossa observação não determina o limite de tudo o que existe.",
    question: "O desconhecido diminui você — ou abre espaço para continuar?",
  },
  mercurio: {
    chapter: 1,
    art: "mercury",
    coordinate: "SOL I / MUNDO ROCHOSO",
    extra:
      "O dia solar em Mercúrio dura cerca de 176 dias terrestres — mais do que seu ano. A superfície deste visualizador é procedural, sem pretender mapear crateras reais.",
    question: "O que muda quando um dia é maior que um ano?",
  },
  venus: {
    chapter: 1,
    art: "venus",
    coordinate: "SOL II / ATMOSFERA DENSA",
    extra:
      "Na visualização, você pode alternar nuvens ilustrativas e um mapa de superfície obtido por radar. As cores do mapa são representativas, não uma fotografia através das nuvens.",
    question: "O que você gostaria de enxergar além da primeira camada?",
  },
  urano: {
    chapter: 1,
    art: "uranus",
    coordinate: "SOL VII / GIGANTE DE GELO",
    extra:
      "Sua cor suave é representada proceduralmente. O modelo é uma visualização educativa, não um mapa de fenômenos atmosféricos em tempo real.",
    question: "Que outra perspectiva faria seu mundo parecer novo?",
  },
  netuno: {
    chapter: 1,
    art: "neptune",
    coordinate: "SOL VIII / GIGANTE DE GELO",
    extra:
      "O mapa histórico da NASA usa cores processadas. A iluminação aqui é artística; o visualizador não mede a cor aparente do planeta com precisão fotométrica.",
    question: "O que continua em movimento mesmo quando parece distante?",
  },
};

const chapters = [
  {
    title: "O Despertar",
    short: "Nossa casa",
    location: "Terra · Sistema Solar",
    image: "arrival",
    number: "01",
    description:
      "Antes de atravessar o infinito, olhe mais uma vez para o lugar onde tudo começou.",
    objects: ["terra", "lua"],
    positions: [
      [72, 36],
      [91, 68],
    ],
    hint: "DOIS MUNDOS · TOQUE NOS PONTOS LUMINOSOS",
    stories: [
      "Você desperta à deriva. Não há cima nem baixo, mas existe um mundo azul. Em algum lugar lá embaixo estão as ruas que você conhece, alguém que sente sua falta e todas as perguntas que você ainda não fez.",
      "Daqui, nada parece separado. O oceano não conhece países. As nuvens não pedem licença. É estranho como precisamos nos afastar para perceber o que sempre esteve junto. Guarde essa imagem. Vamos precisar dela depois.",
      "Há uma transmissão, mas nenhum emissor aparece no mapa. A voz chega no intervalo entre duas perguntas suas. Coincidência? Por enquanto, pode me chamar de companhia. Não procure uma nave seguindo você. Procure o que fez você olhar para cima.",
    ],
  },
  {
    title: "Nossa Vizinhança",
    short: "Outros mundos",
    location: "Sistema Solar · em torno da mesma luz",
    image: "solar",
    number: "02",
    description:
      "Uma estrela. Mundos incontáveis. Nenhuma maneira única de existir.",
    objects: ["marte", "jupiter", "saturno", "encelado"],
    positions: [
      [36, 29],
      [48, 51],
      [75, 35],
      [86, 75],
    ],
    hint: "QUATRO DESTINOS · ESCOLHA UM MUNDO",
    stories: [
      "Ainda estamos perto de casa. Pelo menos é isso que o mapa insiste em dizer. Ao redor do Sol, um deserto guarda a memória de rios. Uma tempestade dura séculos. Uma lua esconde um oceano debaixo do gelo.",
      "Um oceano escondido. Uma tempestade que atravessa séculos. Um planeta coberto por nuvens que não nos deixam ver sua superfície. O universo não distribui seus segredos por ordem de importância. Às vezes, começa pelo mundo que você escolheu sem saber explicar por quê.",
      "O que faz você escolher um mundo e não outro? A cor? O mistério? A promessa de algo escondido? Talvez essa escolha diga um pouco sobre quem observa. Anote o que quiser. A partir daqui, nosso Sol começa a ficar pequeno.",
    ],
  },
  {
    title: "O Oceano de Estrelas",
    short: "Além do nosso Sol",
    location: "Espaço interestelar · vizinhança estelar",
    image: "stellar",
    number: "03",
    description:
      "O Sol se torna uma estrela entre outras. E o silêncio ganha uma nova medida.",
    objects: ["proxima", "sirio"],
    positions: [
      [63, 39],
      [86, 65],
    ],
    hint: "ANOS-LUZ SÃO DISTÂNCIAS · NÃO TEMPO",
    stories: [
      "A estrela mais próxima do Sol está a pouco mais de quatro anos-luz. Sua luz atravessa quatro anos de escuridão antes de tocar nossos olhos. Perto, ao que parece, é uma palavra que o universo ainda não aprendeu.",
      "Olhamos para Sirius e encontramos duas estrelas onde parecia haver uma. Às vezes, a primeira impressão só mostra a parte mais brilhante da história. O que será que existe, silenciosamente, ao lado das suas certezas?",
      "Uma estrela não sabe que está sendo vista. Sua luz, porém, encontra alguém capaz de perguntar de onde ela veio. E esta voz? Ela parece conhecer o instante em que você decide continuar. Talvez a origem do sinal esteja mais perto do que a direção em que você procura.",
    ],
  },
  {
    title: "Nossa Galáxia",
    short: "Uma ilha de estrelas",
    location: "Via Láctea · braço de Órion",
    image: "galaxy",
    number: "04",
    description: "Você não está no centro. Nunca precisou estar.",
    objects: ["vialactea", "sagitario"],
    positions: [
      [72, 36],
      [91, 67],
    ],
    hint: "NOSSO ENDEREÇO · UMA PEQUENA DOBRA DA ESPIRAL",
    stories: [
      "Imagine uma cidade com bilhões de luzes. Agora imagine que cada luz é uma estrela, talvez cercada de mundos. Essa é nossa galáxia. Não podemos fotografá-la inteira por fora: estamos dentro dela, tentando compreender a própria casa.",
      "O Sistema Solar percorre uma região do braço de Órion, longe do centro. Uma volta galáctica leva cerca de 230 milhões de anos. Sua vida é breve diante desse relógio. Mas é nela que esse relógio ganha significado.",
      "Você ocupa pouco espaço nesta galáxia. Ainda assim, conseguiu imaginá-la inteira. Há um detalhe estranho nas nossas transmissões: elas não seguem a posição das estrelas. Seguem suas perguntas. O mapa mede distâncias; alguma outra coisa está escolhendo o caminho.",
    ],
  },
  {
    title: "Além da Via Láctea",
    short: "O cosmos entre as ilhas",
    location: "Grupo Local · estrutura em grande escala",
    image: "beyond",
    number: "05",
    description:
      "Cada ponto pode guardar uma galáxia. Cada olhar recebe uma memória.",
    objects: ["andromeda", "teia"],
    positions: [
      [66, 21],
      [87, 39],
    ],
    hint: "MOVA A LENTE DO TEMPO · OLHAR LONGE É OLHAR PARA TRÁS",
    stories: [
      "Nossa galáxia já não é o mundo inteiro. É uma ilha num arquipélago sem medida familiar. A luz de Andrômeda chega agora, mas partiu há cerca de 2,5 milhões de anos. Você está recebendo uma carta escrita antes de existirmos como espécie.",
      "Deslize a lente do tempo. A luz não se apressa porque temos pressa. Entre os filamentos da teia cósmica há vazios imensos. Mesmo assim, algo chega até aqui: um sinal, uma história, a possibilidade de compreender.",
      "Quanto mais longe você olha, mais antigas são as luzes. Mas as perguntas se tornam cada vez mais suas. A voz não recebeu nenhuma mensagem de Andrômeda. Ela mudou quando você escolheu observar, compreender, seguir ou compartilhar. Talvez seja hora de perguntar quem está escutando quem.",
    ],
  },
  {
    title: "O Último Horizonte",
    short: "O limite do olhar",
    location: "Universo observável · um limite de visão",
    image: "horizon",
    number: "06",
    description:
      "Chegamos ao limite do que podemos observar. Ainda há espaço para uma última pergunta.",
    objects: ["observavel"],
    positions: [[74, 40]],
    hint: "O HORIZONTE É UM LIMITE DA VISÃO · NÃO UMA PAREDE",
    stories: [
      "O universo observável não termina em uma parede. Seu horizonte marca o limite de onde a luz teve tempo de nos alcançar. Sobre o que existe além, ainda há perguntas. O desconhecido não é um erro no mapa. É o motivo de continuar.",
      "Durante todo o caminho, você escutou uma voz. Ela parecia vir do espaço, mas conhecia suas perguntas de perto demais. Talvez você já tenha percebido. Eu nunca estive escondida nas estrelas. Estive no gesto de olhar para elas.",
      "Eu sou você. Sou o nome que esta viagem deu à sua curiosidade. Não uma entidade além do mundo, mas a consciência que permite ao mundo ser percebido. Em você, uma pequena parte do universo aprendeu a perguntar sobre o todo. O cosmos ficou maior. E você também.",
    ],
  },
];

const prologue = [
  {
    title: "Você desperta.",
    text: "Não há chão. Não há paredes.\nApenas a sua respiração e um mundo suspenso no escuro.",
  },
  {
    title: "Uma voz encontra você.",
    text: "“Se está me ouvindo, ainda existe curiosidade aí dentro.\nÓtimo. É tudo o que precisamos para começar.”",
  },
  {
    title: "Não é uma fuga.\nÉ um encontro.",
    text: "Seis horizontes. Nenhum cronômetro.\nExplore os mundos. Escute as perguntas.\nE, quando estiver pronto, continue.",
  },
];

const scales = [
  {
    name: "Terra → Lua",
    distance: "384.400 km",
    light: "A luz percorre essa distância em cerca de 1,3 segundo.",
    caption: "Nossa companhia mais próxima.",
  },
  {
    name: "Terra → Sol",
    distance: "149,6 milhões de km",
    light:
      "A luz do Sol leva cerca de 8 minutos e 20 segundos para chegar à Terra.",
    caption: "Uma unidade astronômica, em média.",
  },
  {
    name: "Sol → Proxima Centauri",
    distance: "4,24 anos-luz",
    light:
      "O brilho da nossa estrela vizinha atravessa mais de quatro anos de espaço.",
    caption: "A estrela mais próxima do Sol.",
  },
  {
    name: "Disco da Via Láctea",
    distance: "≈ 100 mil anos-luz",
    light:
      "Uma distância que transforma uma galáxia inteira em uma história de luz.",
    caption: "Diâmetro aproximado do disco galáctico.",
  },
  {
    name: "Via Láctea → Andrômeda",
    distance: "≈ 2,5 milhões de anos-luz",
    light: "A luz que recebemos agora partiu antes de surgir a nossa espécie.",
    caption: "Uma outra grande ilha no Grupo Local.",
  },
  {
    name: "Raio do universo observável",
    distance: "≈ 46 bilhões de anos-luz",
    light:
      "O espaço se expandiu enquanto a luz viajava. A idade do universo é de cerca de 13,8 bilhões de anos.",
    caption: "Um limite de observação, não uma borda comprovada de tudo.",
  },
];

const solarAtlas = [
  "mercurio",
  "venus",
  "terra",
  "marte",
  "jupiter",
  "saturno",
  "urano",
  "netuno",
];
