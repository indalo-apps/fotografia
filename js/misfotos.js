/* FotoLab · mis fotos: análisis de datos EXIF y misiones
   © 2026 Adela Moreno Vega y Carlos Moreno Otto. Todos los derechos reservados.
   Todo se procesa en el propio dispositivo: ninguna foto se envía a ningún servidor. */
'use strict';

/* ===================== lector de EXIF (JPEG) ===================== */
function readExif(buf){
  try{
    const v=new DataView(buf);if(v.byteLength<4||v.getUint16(0)!==0xFFD8)return null;
    let o=2;
    while(o<v.byteLength-4){
      const m=v.getUint16(o);if((m&0xFF00)!==0xFF00)break;
      const len=v.getUint16(o+2);
      if(m===0xFFE1&&v.getUint32(o+4)===0x45786966)return parseTiff(v,o+10);
      if(m===0xFFDA)break;o+=2+len;
    }
  }catch(e){}
  return null;
}
function parseTiff(v,t){
  const le=v.getUint16(t)===0x4949,g16=p=>v.getUint16(p,le),g32=p=>v.getUint32(p,le),out={};
  const SZ={1:1,2:1,3:2,4:4,5:8,7:1,9:4,10:8};
  const ifd=p=>{const n=g16(p);for(let i=0;i<n;i++){const e=p+2+i*12,tag=g16(e),type=g16(e+2),cnt=g32(e+4),sz=(SZ[type]||1)*cnt,dp=sz>4?t+g32(e+8):e+8;
    if(dp+Math.min(sz,64)>v.byteLength)continue;let val;
    if(type===2){let s='';for(let k=0;k<Math.min(cnt,80);k++){const ch=v.getUint8(dp+k);if(!ch)break;s+=String.fromCharCode(ch)}val=s.trim()}
    else if(type===3)val=g16(dp);else if(type===4)val=g32(dp);else if(type===9)val=v.getInt32(dp,le);
    else if(type===5){const d=g32(dp+4);val=d?g32(dp)/d:0}else if(type===10){const d=v.getInt32(dp+4,le);val=d?v.getInt32(dp,le)/d:0}
    else val=v.getUint8(dp);out[tag]=val}};
  ifd(t+g32(t+4));if(out[0x8769])ifd(t+out[0x8769]);
  return out;
}
function fracT(t){if(!t)return'—';if(t>=1)return(Math.round(t*10)/10)+' s';return'1/'+Math.round(1/t)+' s'}

/* ===================== análisis ===================== */
function explainExif(e){
  const t=e[0x829A],N=e[0x829D],iso=e[0x8827],f=e[0x920A],f35=e[0xA405],flash=e[0x9209],bias=e[0x9204],wb=e[0xA403],prog=e[0x8822];
  const rows=[],L=[];
  const mm=(e[0x010F]||'')+' '+(e[0x0110]||'');if(mm.trim())rows.push(['Cámara',esc(mm.trim())]);
  if(e[0xA434])rows.push(['Objetivo',esc(e[0xA434])]);
  if(e[0x9003])rows.push(['Fecha',esc(String(e[0x9003]).replace(/^(\d{4}):(\d\d):(\d\d)/,'$3/$2/$1'))]);
  if(t)rows.push(['Velocidad',fracT(t)]);if(N)rows.push(['Diafragma','f/'+(Math.round(N*10)/10)]);if(iso)rows.push(['ISO',iso]);
  if(f)rows.push(['Focal real',(Math.round(f*10)/10)+' mm']);if(f35)rows.push(['Focal equivalente (35 mm)',f35+' mm']);
  if(bias)rows.push(['Compensación',(bias>0?'+':'')+(Math.round(bias*10)/10)+' EV']);
  if(flash!==undefined)rows.push(['Flash',flash&1?'Disparado':'No']);
  if(wb!==undefined)rows.push(['Balance de blancos',wb===1?'Manual':'Automático']);
  if(prog)rows.push(['Modo',{1:'Manual',2:'Programa',3:'Prioridad a la apertura',4:'Prioridad a la velocidad'}[prog]||'Automático']);
  const fe=f35||(f&&f<12?null:f);
  if(t){
    if(t<=1/500)L.push(['ok',`<b>${fracT(t)}</b>: velocidad muy rápida. Congela incluso movimientos rápidos (deporte, agua, animales).`]);
    else if(t<=1/125)L.push(['ok',`<b>${fracT(t)}</b>: congela el movimiento normal de personas caminando.`]);
    else if(t<=1/30)L.push(['',`<b>${fracT(t)}</b>: velocidad media. Lo que se mueva rápido saldrá algo movido.`]);
    else L.push(['bad',`<b>${fracT(t)}</b>: velocidad lenta. Hay riesgo de foto movida; ¿usaste trípode o el modo noche? (el móvil junta varias fotos para compensar).`]);
    if(fe&&t>1/fe*1.01)L.push(['bad',`Es más lenta que 1/${fe} (la regla de 1/focal para ${fe} mm): sin trípode o estabilizador podría salir trepidada.`]);
  }
  if(N){if(N<=2.8&&f&&f<12)L.push(['',`<b>f/${Math.round(N*10)/10}</b>: los móviles tienen un diafragma muy abierto pero fijo. Su sensor es tan pequeño que casi todo sale nítido; el fondo borroso del «modo Retrato» lo hace el software.`]);
    else if(N<=2.8)L.push(['',`<b>f/${Math.round(N*10)/10}</b>: diafragma muy abierto, poca profundidad de campo: fondo desenfocado.`]);
    else if(N<=8)L.push(['',`<b>f/${Math.round(N*10)/10}</b>: diafragma medio, profundidad de campo media.`]);
    else L.push(['',`<b>f/${Math.round(N*10)/10}</b>: diafragma cerrado: casi todo nítido, típico de paisaje.`])}
  if(iso){if(iso<=100)L.push(['ok',`<b>ISO ${iso}</b>: sensibilidad mínima, imagen limpia. Había buena luz.`]);else if(iso<=800)L.push(['',`<b>ISO ${iso}</b>: algo de sensibilidad extra; poco ruido.`]);else L.push(['bad',`<b>ISO ${iso}</b>: ISO alto porque faltaba luz. Busca el grano en las zonas oscuras.`])}
  if(t&&N&&iso){const ev=Math.log2(N*N/t)-Math.log2(iso/100),r=Math.round(ev);
    const luz=ev>=14?'sol fuerte':ev>=11?'día nublado o a la sombra':ev>=8?'interior muy luminoso o atardecer':ev>=5?'interior normal o anochecer':'noche';
    L.push(['',`Luz de la escena: <b>EV ${r}</b> → ${luz}. En FotoLab sería parecida a la escena «${ev>=14?'Día soleado':ev>=11?'Día nublado':ev>=8?'Velódromo cubierto':ev>=5?'Anochecer':'Calle de noche'}».`])}
  if(fe){const tipo=fe<=24?'gran angular: cabe mucho':fe<=35?'angular (la cámara principal de casi todos los móviles)':fe<=60?'normal, parecida a la visión del ojo':fe<=135?'tele corto, ideal para retratos':'teleobjetivo';L.push(['',`<b>${fe} mm</b> equivalentes: ${tipo}.`])}
  if(flash!==undefined&&flash&1)L.push(['','Se disparó el <b>flash</b>: aplana la luz y puede dar ojos rojos; de día sirve para rellenar sombras a contraluz.']);
  return{rows,L};
}

/* ===================== Analiza ===================== */
let pImg=null,pGuide='tercios';
function loadPhoto(file){
  if(!file||!/^image\//.test(file.type)){$('#pout').classList.remove('on');return}
  const rd=new FileReader();
  rd.onload=()=>{const ex=readExif(rd.result);const url=URL.createObjectURL(file);const im=new Image();
    im.onload=()=>{pImg=im;drawPhoto();
      const {rows,L}=ex?explainExif(ex):{rows:[],L:[]};
      $('#ptable').innerHTML=rows.length?rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join(''):'<tr><td colspan="2">Sin datos de cámara.</td></tr>';
      $('#pwhy').innerHTML=(L.length?L:[['bad','Esta foto no trae datos de la cámara. Pasa con capturas de pantalla y con fotos enviadas por WhatsApp o redes sociales, que los borran. Prueba con una foto original de la cámara.']]).map(([c,t])=>`<li class="${c}">${t}</li>`).join('');
      $('#pout').classList.add('on');$('#pcv').setAttribute('aria-label','Tu foto'+(rows.length?': '+rows.filter(r=>['Velocidad','Diafragma','ISO'].includes(r[0])).map(r=>r[0]+' '+r[1]).join(', '):''));
      $('#pout').scrollIntoView({behavior:RM()?'auto':'smooth',block:'start'})};
    im.src=url};
  rd.readAsArrayBuffer(file);
}
function drawPhoto(){if(!pImg)return;const c=$('#pcv'),mx=1400,k=Math.min(1,mx/Math.max(pImg.naturalWidth,pImg.naturalHeight));c.width=Math.round(pImg.naturalWidth*k);c.height=Math.round(pImg.naturalHeight*k);
  const x=c.getContext('2d');x.drawImage(pImg,0,0,c.width,c.height);drawGuides(x,c.width,c.height,pGuide);
  $('#pguides').innerHTML=GUIDES.map(([k2,n])=>`<button data-g="${k2}" class="${k2===pGuide?'on':''}" aria-pressed="${k2===pGuide}">${n}</button>`).join('');
  $$('#pguides button').forEach(b=>b.onclick=()=>{pGuide=b.dataset.g;drawPhoto()})}
$('#fpick').onchange=e=>loadPhoto(e.target.files[0]);
(function(){const d=$('#drop');['dragenter','dragover'].forEach(ev=>d.addEventListener(ev,e=>{e.preventDefault();d.style.borderColor='var(--accent)'}));
  ['dragleave','drop'].forEach(ev=>d.addEventListener(ev,e=>{e.preventDefault();d.style.borderColor=''}));
  d.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f)loadPhoto(f)})})();

/* ===================== Misiones ===================== */
const MIS=[
 {id:'lineas',ic:'🛤️',t:'Líneas guía',d:'Un camino, una vía, una barandilla… que lleve la mirada hacia algo.'},
 {id:'tercios',ic:'#️⃣',t:'Regla de los tercios',d:'Coloca el sujeto en un cruce de los tercios (activa la cuadrícula de la cámara del móvil).'},
 {id:'simetria',ic:'🪞',t:'Simetría',d:'Un edificio, un pasillo o un reflejo, perfectamente centrado.'},
 {id:'marco',ic:'🖼️',t:'Encuadre natural',d:'Usa una ventana, un arco o unas ramas como marco.'},
 {id:'negativo',ic:'⬜',t:'Espacio negativo',d:'Un sujeto pequeño rodeado de mucho cielo, pared o agua.'},
 {id:'bajo',ic:'🐜',t:'Punto de vista bajo',d:'Agáchate hasta el suelo y fotografía desde abajo.'},
 {id:'patron',ic:'🔁',t:'Patrón',d:'Algo que se repite: baldosas, ventanas, hojas… mejor si algo lo rompe.'},
 {id:'silueta',ic:'🌅',t:'Silueta a contraluz',d:'Un sujeto oscuro contra un cielo luminoso (atardecer o ventana).'},
 {id:'congela',ic:'⚡',t:'Congela el movimiento',d:'Agua, un salto o una pelota en el aire, totalmente nítidos.',check:e=>{const t=e[0x829A];return t?t<=1/500?'✅ Los datos lo confirman: '+fracT(t)+'.':'ℹ️ Tu foto se hizo a '+fracT(t)+'; para congelar de verdad, mejor 1/500 o más.':null}},
 {id:'estela',ic:'💫',t:'Estela de movimiento',d:'Coches, agua o luces en movimiento con exposición larga (el modo noche o «Live» del móvil ayudan).',check:e=>{const t=e[0x829A];return t?t>=1/15?'✅ Exposición larga: '+fracT(t)+'.':'ℹ️ Se hizo a '+fracT(t)+'; prueba con 1/15 o más lento.':null}},
 {id:'bokeh',ic:'🌸',t:'Fondo desenfocado',d:'Un retrato o una flor con el fondo borroso (modo Retrato o acércate mucho al sujeto).'},
 {id:'noche',ic:'🌙',t:'Foto nocturna',d:'Una escena de noche bien expuesta y sin que salga movida.',check:e=>{const i=e[0x8827];return i?'ℹ️ ISO '+i+(i>=1600?': mira el ruido en las sombras.':': ¡poco ruido!'):null}}
];
let misData=store.get('fotolab-misiones',{});
function renderMis(){
  const n=Object.keys(misData).length;$('#mistotal').textContent=`🎒 ${n} / ${MIS.length} misiones completadas`;
  $('#mis').innerHTML=MIS.map(m=>{const d=misData[m.id];return`<div class="card mi ${d?'done':''}"><div class="top"><span class="ic" aria-hidden="true">${m.ic}</span><div><h3>${m.t}${d?' <span style="color:var(--ok)" aria-label="completada">✓</span>':''}</h3><p>${m.d}</p></div></div>
    ${d?`<img class="thumb" src="${d.img}" alt="Tu foto para la misión ${esc(m.t)}">`:'<div class="thumb" aria-hidden="true">Sin foto todavía</div>'}
    ${d&&d.note?`<div class="note">${d.note}</div>`:''}
    <div class="acts"><label class="btn ${d?'':'pri'}"><input type="file" accept="image/*" class="sr" data-m="${m.id}">📷 ${d?'Cambiar':'Añadir foto'}</label>${d?`<button class="btn ghost" data-del="${m.id}">Quitar</button>`:''}</div></div>`}).join('');
  $$('#mis input[type=file]').forEach(inp=>inp.onchange=e=>addMis(inp.dataset.m,e.target.files[0]));
  $$('#mis [data-del]').forEach(b=>b.onclick=()=>{delete misData[b.dataset.del];store.set('fotolab-misiones',misData);renderMis()});
}
function addMis(id,file){
  if(!file)return;const m=MIS.find(z=>z.id===id),rd=new FileReader();
  rd.onload=()=>{const ex=readExif(rd.result),url=URL.createObjectURL(file),im=new Image();
    im.onload=()=>{const k=Math.min(1,420/Math.max(im.naturalWidth,im.naturalHeight)),c=mk(Math.round(im.naturalWidth*k),Math.round(im.naturalHeight*k));c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      const note=ex&&m.check?m.check(ex):null;misData[id]={img:c.toDataURL('image/jpeg',.72),note,date:Date.now()};
      if(!store.set('fotolab-misiones',misData)){delete misData[id];modal('<h3>No queda espacio</h3><p>El almacenamiento de este navegador está lleno. Quita alguna foto de otra misión y vuelve a probar.</p><div class="acts"><button class="btn pri" data-close>Entendido</button></div>')}
      renderMis();URL.revokeObjectURL(url);checkMedals()};
    im.src=url};
  rd.readAsArrayBuffer(file);
}
onShow['fotos-misiones']=renderMis;
