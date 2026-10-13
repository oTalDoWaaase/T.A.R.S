'use strict';
// Conteúdo local. Fontes abertas somente por escolha do visitante.
const sources = { solar: 'https://science.nasa.gov/solar-system/', stars: 'https://science.nasa.gov/universe/stars/', galaxies: 'https://science.nasa.gov/universe/galaxies/', universe: 'https://science.nasa.gov/universe/overview/' };
const objects = {
  terra: { name:'Terra', art:'earth', subtitle:'Tudo o que chamamos de casa.', description:'Oceanos líquidos, uma atmosfera protetora e uma história de vida que ainda estamos aprendendo a ler. Até hoje, é o único mundo onde sabemos que há vida.', facts:[['Diâmetro médio','12.742 km'],['Satélite natural','A Lua']], reflection:'Metáfora de bordo: vista de longe, nenhuma fronteira está desenhada.', source:sources.solar },
  lua: { name:'Lua', art:'enceladus', subtitle:'Uma companhia na escuridão.', description:'Nosso satélite natural guarda marcas de impactos antigos. Vemos quase sempre a mesma face porque sua rotação e sua órbita ao redor da Terra têm períodos semelhantes.', facts:[['Distância média da Terra','384.400 km'],['Órbita sideral','27,3 dias']], reflection:'Metáfora de bordo: mesmo o silêncio pode fazer companhia.', source:'https://science.nasa.gov/moon/' },
  marte: { name:'Marte', art:'mars', subtitle:'Um mundo que se lembra da água.', description:'Vales e minerais mostram que água líquida já correu pela superfície de Marte. Hoje, o planeta é frio, com uma atmosfera muito tênue. Ainda não encontramos evidência confirmada de vida ali.', facts:[['Um dia marciano','24 h 37 min'],['Luas','Fobos e Deimos']], reflection:'Metáfora de bordo: nem todo deserto esteve sempre sozinho.', source:'https://science.nasa.gov/mars/' },
  jupiter: { name:'Júpiter', art:'jupiter', subtitle:'Uma tempestade com um mundo ao redor.', description:'O maior planeta do Sistema Solar é composto principalmente de hidrogênio e hélio. A Grande Mancha Vermelha é uma enorme tempestade observada há séculos.', facts:[['Diâmetro equatorial','142.984 km'],['Rotação','Cerca de 10 horas']], reflection:'Metáfora de bordo: a grandeza também tem suas inquietações.', source:'https://science.nasa.gov/jupiter/' },
  saturno: { name:'Saturno', art:'saturn', subtitle:'O tempo desenhado em anéis.', description:'Os anéis de Saturno são compostos de incontáveis partículas de gelo e rocha. Parecem contínuos à distância, mas cada fragmento segue sua própria órbita.', facts:[['Composição dos anéis','Gelo e rocha'],['Ano saturniano','Cerca de 29 anos terrestres']], reflection:'Metáfora de bordo: às vezes, pertencer é orbitar junto.', source:'https://science.nasa.gov/saturn/' },
  encelado: { name:'Encélado', art:'enceladus', subtitle:'Um oceano escondido no gelo.', description:'Esta lua de Saturno lança plumas de vapor de água e gelo por fissuras próximas ao polo sul. Evidências da missão Cassini indicam um oceano líquido sob a crosta gelada.', facts:[['Diâmetro','Cerca de 500 km'],['Sob a superfície','Um oceano global']], reflection:'Metáfora de bordo: há profundezas que uma superfície não revela.', source:'https://science.nasa.gov/saturn/moons/enceladus/' },
  proxima: { name:'Proxima Centauri', art:'star', subtitle:'A vizinha ainda distante.', description:'A estrela mais próxima do Sol é uma anã vermelha. Sua luz leva cerca de 4,24 anos para chegar até nós. Mesmo nossa vizinhança estelar desafia a escala da experiência humana.', facts:[['Distância do Sol','4,24 anos-luz'],['Tipo de estrela','Anã vermelha']], reflection:'Metáfora de bordo: perto é uma palavra que muda quando olhamos para cima.', source:sources.stars },
  sirio: { name:'Sirius', art:'star', subtitle:'Uma luz que vem em dupla.', description:'A estrela mais brilhante do céu noturno, vista da Terra, faz parte de um sistema binário. Sua companheira, Sirius B, é uma anã branca: o remanescente de uma estrela.', facts:[['Distância','Cerca de 8,6 anos-luz'],['Sistema','Duas estrelas']], reflection:'Metáfora de bordo: até os pontos de luz podem guardar histórias invisíveis.', source:sources.stars },
  vialactea: { name:'Via Láctea', art:'galaxy', subtitle:'Uma cidade feita de estrelas.', description:'Nossa galáxia é uma espiral barrada. O Sistema Solar ocupa uma região do braço de Órion, longe do centro. A faixa luminosa no céu é a visão de dentro de seu disco.', facts:[['Diâmetro do disco','Cerca de 100 mil anos-luz'],['Nosso endereço','Braço de Órion']], reflection:'Metáfora de bordo: não estamos no centro. Ainda assim, estamos aqui.', source:sources.galaxies },
  sagitario: { name:'Sagittarius A*', art:'horizon', subtitle:'Um centro que não emite luz.', description:'No centro da Via Láctea há um buraco negro supermassivo. Estrelas orbitando essa região e observações do Event Horizon Telescope ajudam a revelar sua presença.', facts:[['Massa aproximada','4 milhões de sóis'],['Localização','Centro galáctico']], reflection:'Metáfora de bordo: o que não vemos também pode mudar nossa trajetória.', source:'https://science.nasa.gov/universe/black-holes/' },
  andromeda: { name:'Andrômeda', art:'galaxy', subtitle:'Outra ilha no oceano escuro.', description:'Uma grande galáxia espiral do Grupo Local. Sua luz viaja por cerca de 2,5 milhões de anos antes de chegar aos nossos olhos. Olhar para longe também é olhar para o passado.', facts:[['Distância','2,5 milhões de anos-luz'],['Família galáctica','Grupo Local']], reflection:'Metáfora de bordo: algumas cartas levam milhões de anos para chegar.', source:sources.galaxies },
  teia: { name:'Teia cósmica', art:'web', subtitle:'O universo entre as ilhas.', description:'Em grandes escalas, galáxias e matéria se distribuem em filamentos, aglomerados e extensos vazios. Essa estrutura cresceu a partir de pequenas diferenças de densidade no universo primordial.', facts:[['Estrutura','Filamentos e vazios'],['Escala','Milhões de anos-luz']], reflection:'Metáfora de bordo: mesmo a vastidão tem seus fios de encontro.', source:sources.galaxies },
  observavel: { name:'Universo observável', art:'horizon', subtitle:'Um limite da nossa visão.', description:'É a região de onde a luz teve tempo de nos alcançar desde o início da expansão cósmica. Seu horizonte não é uma parede nem uma borda física demonstrada de todo o universo.', facts:[['Idade do universo','Cerca de 13,8 bilhões de anos'],['Raio observável atual','Cerca de 46 bilhões de anos-luz']], reflection:'A expansão do espaço explica por que o raio atual supera 13,8 bilhões de anos-luz. A jornada é imaginativa, não uma viagem fisicamente realizável.', source:sources.universe }
};
const chapters = [
 {title:'O Despertar',scale:'Terra · nosso ponto de partida',description:'Abra os olhos. Há um mundo inteiro flutuando no escuro. Por enquanto, podemos chamá-lo de casa.',narration:'Você não precisa saber para onde vai. A curiosidade costuma chegar antes do mapa. Estou aqui desde a sua primeira pergunta.',objects:['terra','lua'],note:'Explore um mundo. Depois, avance no seu próprio tempo.'},
 {title:'Nossa Vizinhança',scale:'Sistema Solar · mundos próximos',description:'Ao redor da mesma estrela, mundos tão diferentes. O familiar também guarda o desconhecido.',narration:'Trouxe pouca bagagem? Ótimo. Para atravessar a imensidão, perguntas pesam menos que certezas.',objects:['marte','jupiter','saturno','encelado'],note:'As posições e os tamanhos dos objetos são composições artísticas, sem escala física.'},
 {title:'O Oceano de Estrelas',scale:'Vizinhança estelar · além do Sol',description:'Nosso Sol agora é uma luz entre outras. Entre cada uma delas, um silêncio maior que qualquer oceano.',narration:'A luz que chega agora partiu antes de você olhar. Observar é receber uma lembrança que não era sua — até este instante.',objects:['proxima','sirio'],note:'Um ano-luz é uma medida de distância: o percurso da luz em um ano.'},
 {title:'Nossa Galáxia',scale:'Via Láctea · uma ilha de estrelas',description:'Bilhões de estrelas em um mesmo movimento. Nossa história acontece em uma pequena dobra dessa espiral.',narration:'Você procurou seu lugar no universo. Talvez lugar não seja o centro de nada, mas o ponto de onde nasce uma pergunta.',objects:['vialactea','sagitario'],note:'Ilustrações conceituais: não são fotografias ou simulações científicas.'},
 {title:'Além da Via Láctea',scale:'Grupo Local · a teia cósmica',description:'A ilha se torna arquipélago. Galáxias traçam fios de luz sobre distâncias que quase não cabem no pensamento.',narration:'Quanto mais longe olhamos, mais antigo é o que vemos. Curioso: para descobrir o horizonte, aprendemos a escutar o passado.',objects:['andromeda','teia'],note:'A luz tem velocidade finita. Objetos distantes são observados como eram no passado.'},
 {title:'Eu sou você.',scale:'O Último Horizonte · capítulo 06',description:'A voz que trouxe você até aqui nunca esteve nas estrelas. Era a sua própria vontade de compreender.',narration:'Não sou uma presença escondida no cosmos. Sou o nome que você deu à sua curiosidade. Em você, uma pequena parte do universo aprendeu a olhar para o todo. O universo ficou maior. E você também.',objects:['observavel'],note:'Uma reflexão poética sobre a consciência. O horizonte observável é um limite da observação, não uma borda comprovada de todo o universo.'}
];
const $ = selector => document.querySelector(selector);
let current = 0, unlocked = 0, started = false;
// Progresso fica apenas em memória: uma nova visita começa sem revelar o encerramento.
function goChapter(index) {
  if(index < 0 || index > unlocked || index >= chapters.length) return;
  started = true; current = index;
  const chapter = chapters[index];
  $('#home').hidden = true; $('#journey').hidden = false;
  $('#journey').classList.toggle('final', index === 5);
  $('#chapter-label').textContent = `${String(index + 1).padStart(2,'0')} / 06 — ${chapter.scale}`;
  $('#chapter-title').textContent = chapter.title;
  $('#chapter-description').textContent = chapter.description;
  $('#narration').textContent = chapter.narration;
  $('#science-note').textContent = chapter.note;
  $('#scene').replaceChildren(...chapter.objects.map(id => {
    const object = objects[id], button = document.createElement('button');
    button.className = 'object'; button.setAttribute('aria-label',`Explorar ${object.name}`);
    button.innerHTML = `<span class="planet ${object.art}" aria-hidden="true"></span><span class="object-label">${object.name}<small>+ EXPLORAR</small></span>`;
    button.addEventListener('click',() => discover(id)); return button;
  }));
  $('#previous').disabled = index === 0;
  $('#next').innerHTML = index === 5 ? 'Reiniciar jornada ↺' : 'Próximo horizonte <span aria-hidden="true">→</span>';
  $('#easter-egg').hidden = index !== 5;
  $('#progress').replaceChildren(...chapters.map((chapter,i) => {
    const button = document.createElement('button'); button.textContent = String(i+1).padStart(2,'0');
    button.disabled = i > unlocked; button.setAttribute('aria-label',`${chapter.scale}: ${i > unlocked ? 'ainda não alcançado' : chapter.title}`);
    if(i === index) button.setAttribute('aria-current','step');
    button.addEventListener('click',()=>goChapter(i)); return button;
  }));
  window.scrollTo({top:0,behavior:'instant'}); $('#chapter-title').focus({preventScroll:true});
}
function resetJourney(){
  current = 0; unlocked = 0; started = false;
  $('#journey').hidden = true; $('#home').hidden = false;
  window.scrollTo({top:0,behavior:'instant'}); $('#begin').focus({preventScroll:true});
}
function discover(id){
  const object = objects[id];
  $('#discovery-title').textContent = object.name;
  $('#discovery-subtitle').textContent = object.subtitle;
  $('#discovery-description').textContent = object.description;
  $('#discovery-reflection').textContent = object.reflection;
  $('#discovery-art').innerHTML = `<div class="planet ${object.art}"></div>`;
  $('#discovery-facts').replaceChildren(...object.facts.map(([label,value]) => {
    const group = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
    dt.textContent = label; dd.textContent = value; group.append(dt,dd); return group;
  }));
  $('#discovery-source').href = object.source; $('#discovery-dialog').showModal();
}
function openMap(){
  $('#map-nodes').replaceChildren(...chapters.map((chapter,i) => {
    const button = document.createElement('button'); button.className = 'map-node'; button.disabled = i > unlocked;
    button.innerHTML = `<strong>${String(i+1).padStart(2,'0')} · ${i === 5 ? 'O Último Horizonte' : chapter.title}</strong><small>${i > unlocked ? 'AINDA POR DESCOBRIR' : started && i === current ? 'VOCÊ ESTÁ AQUI' : 'DESTINO CONHECIDO'}</small>`;
    if(started && i === current) button.setAttribute('aria-current','step');
    button.addEventListener('click',()=>{$('#map-dialog').close();goChapter(i);}); return button;
  }));
  $('#map-continue').textContent = started ? 'Continuar jornada →' : 'Iniciar jornada →';
  $('#map-dialog').showModal();
}
$('#begin').addEventListener('click',()=>goChapter(0));
$('#explore').addEventListener('click',openMap); $('#map-open').addEventListener('click',openMap);
$('#map-continue').addEventListener('click',()=>{$('#map-dialog').close();goChapter(current);});
$('.brand').addEventListener('click',event=>{event.preventDefault();$('#journey').hidden = true;$('#home').hidden = false;window.scrollTo({top:0,behavior:'instant'});$('#begin').focus();});
$('#previous').addEventListener('click',()=>goChapter(current-1));
$('#next').addEventListener('click',()=>{if(current === 5) resetJourney();else{unlocked = Math.max(unlocked,current+1);goChapter(current+1);}});
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.close).close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target !== dialog) return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) dialog.close();}));
$('#chapter-preview').replaceChildren(...chapters.map((chapter,i)=>{
  const button=document.createElement('button');button.className='preview';
  button.innerHTML=`<small>${String(i+1).padStart(2,'0')}</small><span>${i===5?'O Último Horizonte':chapter.title}</span><span class="mini" aria-hidden="true"></span>`;
  button.setAttribute('aria-label',`Ver ${i===5?'O Último Horizonte':chapter.title} no mapa da jornada`);button.addEventListener('click',openMap);return button;
}));
// Som original sintetizado: inicia somente após clique. Sem arquivos/licenças de terceiros.
// Para usar um arquivo, preencha AUDIO_FILE com './assets/audio/ambiente.mp3'.
const AUDIO_FILE = '';
let audioContext, masterGain, soundtrack, soundEnabled = false;
function volumeValue(){return Number($('#volume').value)/100;}
async function setSound(enabled){
  try {
    if(AUDIO_FILE){
      if(!soundtrack){soundtrack=new Audio(AUDIO_FILE);soundtrack.loop=true;}
      soundtrack.volume=volumeValue();if(enabled) await soundtrack.play();else soundtrack.pause();
    }else{
      const Context=window.AudioContext||window.webkitAudioContext;
      if(!Context) throw new Error('Web Audio indisponível');
      if(enabled && !audioContext){
        audioContext=new Context();masterGain=audioContext.createGain();masterGain.gain.value=0;masterGain.connect(audioContext.destination);
        [55,82.41,110,164.81].forEach((frequency,i)=>{
          const oscillator=audioContext.createOscillator(), voice=audioContext.createGain();
          oscillator.type='sine';oscillator.frequency.value=frequency;voice.gain.value=.055/(i+1);
          oscillator.connect(voice);voice.connect(masterGain);oscillator.start();
        });
      }
      if(enabled){await audioContext.resume();masterGain.gain.setTargetAtTime(volumeValue(),audioContext.currentTime,.7);}
      else if(audioContext){masterGain.gain.setTargetAtTime(0,audioContext.currentTime,.2);await audioContext.suspend();}
    }
    soundEnabled=enabled;$('#sound-toggle').setAttribute('aria-pressed',String(enabled));$('#sound-label').textContent=enabled?'Som ligado':'Som desligado';
  }catch{ $('#status').textContent='Não foi possível iniciar o áudio neste navegador. A jornada continua disponível sem som.'; }
}
$('#sound-toggle').addEventListener('click',async()=>{const button=$('#sound-toggle');button.disabled=true;await setSound(!soundEnabled);button.disabled=false;});
$('#volume').addEventListener('input',()=>{if(soundtrack) soundtrack.volume=volumeValue();if(masterGain && soundEnabled) masterGain.gain.setTargetAtTime(volumeValue(),audioContext.currentTime,.1);});
document.addEventListener('visibilitychange',()=>{if(document.hidden && soundEnabled) setSound(false);});
// Campo estelar determinístico, redesenhado somente ao redimensionar, sem loop de animação.
function drawStars(){
  const canvas=$('#stars'),ctx=canvas.getContext('2d');if(!ctx)return;
  const width=innerWidth,height=innerHeight,ratio=Math.min(devicePixelRatio||1,2);
  canvas.width=width*ratio;canvas.height=height*ratio;ctx.scale(ratio,ratio);
  let seed=42;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  for(let i=0;i<Math.min(650,width*height/2200);i++){
    const x=random()*width,y=random()*height,r=random()*1.1+.2;
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=`rgba(214,220,249,${random()*.65+.15})`;ctx.fill();
    if(r>1.15){ctx.fillStyle='#b8b3da26';ctx.fillRect(x-4,y-.25,8,.5);ctx.fillRect(x-.25,y-4,.5,8);}
  }
}
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(drawStars,150);});drawStars();
