"use strict";
// Retratos narrativos de preferências nesta viagem; não é um inventário psicológico.
// Pesos transparentes: cada escolha aproxima dois modos de exploração.
const TARSProfiles = (() => {
  const axes = ["explorador", "investigador", "contemplativo", "conector"];
  const question = (id, chapter, beat, text, choices) => ({
    id,
    chapter,
    beat,
    text,
    options: choices.map(([label, primary, secondary]) => ({
      label,
      weights: { [primary]: 2, [secondary]: 1 },
    })),
  });
  const questions = [
    question(
      "q01",
      0,
      0,
      "A Terra fica para trás. O que você procura primeiro?",
      [
        ["O próximo horizonte.", "explorador", "investigador"],
        ["Entender como chegamos aqui.", "investigador", "contemplativo"],
        ["Um instante para sentir tudo isso.", "contemplativo", "conector"],
        ["Alguém com quem dividir este olhar.", "conector", "explorador"],
      ],
    ),
    question(
      "q02",
      0,
      1,
      "Sem as fronteiras, o que se torna mais importante?",
      [
        ["As possibilidades que ainda existem.", "explorador", "contemplativo"],
        ["As perguntas que ninguém respondeu.", "investigador", "explorador"],
        ["A beleza do que já está aqui.", "contemplativo", "investigador"],
        ["O cuidado entre quem vive nesse mundo.", "conector", "contemplativo"],
      ],
    ),
    question(
      "q03",
      1,
      0,
      "Um oceano se esconde sob o gelo. Você gostaria de…",
      [
        [
          "Ser o primeiro a atravessar o desconhecido.",
          "explorador",
          "conector",
        ],
        [
          "Encontrar as evidências do que existe lá.",
          "investigador",
          "explorador",
        ],
        [
          "Ficar diante do mistério por um tempo.",
          "contemplativo",
          "investigador",
        ],
        [
          "Pensar no que uma descoberta mudaria para nós.",
          "conector",
          "investigador",
        ],
      ],
    ),
    question("q04", 1, 2, "O que torna uma viagem valiosa para você?", [
      ["Voltar diferente de quem partiu.", "explorador", "contemplativo"],
      ["Descobrir algo que eu não entendia.", "investigador", "explorador"],
      [
        "Viver um momento que não precisa de explicação.",
        "contemplativo",
        "conector",
      ],
      ["Ter uma história para compartilhar.", "conector", "explorador"],
    ]),
    question(
      "q05",
      2,
      0,
      "Uma estrela está distante demais para alcançarmos. E agora?",
      [
        ["Continuo imaginando novos caminhos.", "explorador", "investigador"],
        [
          "Investigo o que sua luz já pode revelar.",
          "investigador",
          "contemplativo",
        ],
        [
          "Aceito a distância e permaneço olhando.",
          "contemplativo",
          "conector",
        ],
        [
          "Pergunto como essa luz toca outras pessoas.",
          "conector",
          "investigador",
        ],
      ],
    ),
    question(
      "q06",
      2,
      2,
      "Você descobre uma companhia escondida junto a Sirius. O que isso desperta?",
      [
        ["Vontade de procurar mais além.", "explorador", "conector"],
        [
          "Desconfiança saudável da primeira impressão.",
          "investigador",
          "explorador",
        ],
        [
          "Encanto pelo que permanece silencioso.",
          "contemplativo",
          "investigador",
        ],
        [
          "A lembrança de alguém que esteve ao meu lado.",
          "conector",
          "contemplativo",
        ],
      ],
    ),
    question("q07", 3, 1, "Você não está no centro da galáxia. Isso parece…", [
      [
        "Liberdade para escolher meu próprio caminho.",
        "explorador",
        "conector",
      ],
      [
        "Um convite para entender melhor meu lugar.",
        "investigador",
        "contemplativo",
      ],
      ["Um alívio: não preciso ocupar o centro.", "contemplativo", "conector"],
      [
        "Uma lembrança de que pertencemos ao mesmo todo.",
        "conector",
        "explorador",
      ],
    ]),
    question(
      "q08",
      3,
      2,
      "Se só uma coisa pudesse crescer nessa viagem, você escolheria…",
      [
        ["Minha coragem de tentar.", "explorador", "investigador"],
        ["Minha capacidade de compreender.", "investigador", "contemplativo"],
        ["Minha presença no que estou vivendo.", "contemplativo", "conector"],
        ["Minha capacidade de criar encontros.", "conector", "explorador"],
      ],
    ),
    question(
      "q09",
      4,
      1,
      "Uma mensagem sua poderia atravessar milhões de anos. O que levaria?",
      [
        ["Um convite: continuem explorando.", "explorador", "conector"],
        ["Uma pergunta que mereça sobreviver.", "investigador", "explorador"],
        [
          "Um registro de como era sentir o mundo.",
          "contemplativo",
          "investigador",
        ],
        [
          "Uma lembrança de que ninguém precisa estar só.",
          "conector",
          "contemplativo",
        ],
      ],
    ),
    question(
      "q10",
      5,
      0,
      "Diante do que não podemos conhecer, o que você leva consigo?",
      [
        ["A vontade de continuar.", "explorador", "contemplativo"],
        [
          "A disposição para mudar minhas certezas.",
          "investigador",
          "explorador",
        ],
        ["A paz de não precisar responder tudo.", "contemplativo", "conector"],
        ["A importância de quem caminha comigo.", "conector", "investigador"],
      ],
    ),
  ];
  const portraits = {
    explorador: {
      name: "Explorador de horizontes",
      title: "Você se aproxima do que ainda não conhece.",
      text: "Nesta travessia, suas escolhas voltaram à possibilidade: caminhos que ainda não existem, passos que transformam quem os dá. O desconhecido apareceu menos como uma barreira e mais como um convite. Talvez o que você procure não seja chegar mais longe, mas descobrir quem pode se tornar ao partir.",
      invitation:
        "Leve essa disposição para algo pequeno e real: um lugar novo, uma conversa ou um projeto que ainda espera seu primeiro passo.",
    },
    investigador: {
      name: "Cartógrafo do invisível",
      title: "Sua curiosidade quer enxergar por dentro.",
      text: "Você escolheu procurar sinais, rever impressões e dar tempo às perguntas. Nesta viagem, compreender pareceu tão interessante quanto alcançar. Há beleza nessa maneira de olhar: o mistério não precisa desaparecer para que você aprenda com ele. Uma boa pergunta pode ser uma descoberta inteira.",
      invitation:
        "Escolha uma pergunta que ficou com você. Procure duas fontes, compare o que dizem e permita que sua primeira ideia mude.",
    },
    contemplativo: {
      name: "Observador do silêncio",
      title: "Você encontra profundidade no instante.",
      text: "Suas respostas abriram espaço para perceber antes de explicar. Você escolheu permanecer diante da beleza, aceitar algumas distâncias e não transformar cada mistério em uma tarefa. Nesta travessia, estar presente teve valor próprio. O infinito não pediu pressa — e você soube escutar.",
      invitation:
        "Reserve alguns minutos para olhar o céu, uma janela ou um lugar familiar, sem registrar nada. Veja o que surge quando não há um resultado a produzir.",
    },
    conector: {
      name: "Tecelão de encontros",
      title: "Para você, a vastidão também é pertencimento.",
      text: "Nas suas escolhas, apareceram as pessoas: com quem dividir um olhar, quem permanece por perto, o que uma descoberta muda para todos. Você atravessou o cosmos sem abandonar os encontros que dão significado a ele. Nesta viagem, a distância tornou mais visíveis os fios que nos aproximam.",
      invitation:
        "Compartilhe uma descoberta com alguém. Pergunte o que essa pessoa vê nela — e deixe que o encontro transforme também a sua leitura.",
    },
    misto: {
      name: "Constelação em movimento",
      title: "Você não escolheu uma única maneira de olhar.",
      text: "Suas respostas caminharam por modos diferentes de explorar. Houve espaço para seguir adiante, compreender, contemplar e encontrar companhia. Isso não exige um rótulo único: às vezes, o que nos move depende do horizonte diante de nós. Seu retrato nesta viagem é uma constelação, não uma direção fixa.",
      invitation:
        "Releia suas escolhas. Qual delas combina mais com o momento que você vive agora? Comece por essa, sem precisar abandonar as outras.",
    },
    aberto: {
      name: "Um horizonte ainda aberto",
      title: "Algumas perguntas podem continuar com você.",
      text: "Você deixou boa parte das perguntas em silêncio. Isso também é uma maneira de atravessar a experiência. Ainda não há escolhas suficientes para desenhar um retrato individual; há espaço para voltar, responder no seu ritmo ou simplesmente guardar a viagem como ela foi.",
      invitation:
        "Se quiser aprofundar, revisite as perguntas no caderno. A jornada continua sendo sua, mesmo sem um perfil.",
    },
  };
  const secondary = {
    explorador: "Também apareceu uma vontade de experimentar novos caminhos.",
    investigador:
      "Também apareceu o desejo de entender o que existe além da primeira impressão.",
    contemplativo:
      "Também apareceu o cuidado de sentir o instante antes de preenchê-lo de respostas.",
    conector:
      "Também apareceu a importância de dividir o caminho com outras pessoas.",
  };
  function result(answers = {}) {
    const scores = Object.fromEntries(axes.map((axis) => [axis, 0]));
    const records = questions.flatMap((q) => {
      const index = answers[q.id];
      if (!Number.isInteger(index) || !q.options[index]) return [];
      const option = q.options[index];
      Object.entries(option.weights).forEach(([axis, value]) => {
        scores[axis] += value;
      });
      return [{ question: q.text, answer: option.label, id: q.id }];
    });
    const ordered = axes.slice().sort((a, b) => scores[b] - scores[a]);
    const kind =
      records.length < 3
        ? "aberto"
        : scores[ordered[0]] - scores[ordered[1]] <= 1
          ? "misto"
          : ordered[0];
    const second =
      kind === "aberto" || kind === "misto" ? "" : secondary[ordered[1]];
    return {
      kind,
      ...portraits[kind],
      secondary: second,
      scores,
      count: records.length,
      records,
    };
  }
  return Object.freeze({ questions, result, axes });
})();
if (typeof module !== "undefined" && module.exports)
  module.exports = TARSProfiles;
