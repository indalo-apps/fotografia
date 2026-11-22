/* FotoLab · retos, juegos y medallas
   © 2026 Adela Moreno Vega y Carlos Moreno Otto. Todos los derechos reservados. */
'use strict';

/* ===================== retos ===================== */
const NIVELES=['Nivel 1 · Un solo mando','Nivel 2 · Dos mandos y equivalencias','Nivel 3 · Todo en tus manos','Nivel 4 · Ajustes avanzados'];
const MANDOS={M:'modo',F:'apertura',T:'velocidad',I:'ISO',foc:'focal',ec:'compensación',wb:'balance de blancos',focus:'enfoque',tri:'trípode',pan:'barrido'};
const ok0=x=>Math.abs(x.s)<.5;
const RETOS=[
 // Nivel 1
 {id:'congela',lvl:0,t:'Congela al ciclista',scene:'sol',allow:['T'],preset:{fi:3,ti:6},isoMax:100,d:'Solo puedes tocar la velocidad. Haz que el ciclista salga congelado y la foto bien expuesta.',
  goal:x=>x.disp<1.5&&ok0(x),fail:'Busca una velocidad muy rápida (1/1000 o más) que además deje el fotómetro a 0.'},
 {id:'retrato',lvl:0,t:'Fondo desenfocado',scene:'nublado',allow:['F'],preset:{mode:'A',fi:6},isoMax:100,d:'Modo A: tú eliges el diafragma y la cámara pone la velocidad. Desenfoca el fondo todo lo posible.',
  goal:x=>x.bBg>=5&&x.bSub<1&&ok0(x),fail:'Abre el diafragma: número f pequeño (f/2.8 o menos).'},
 {id:'estela',lvl:0,t:'Estela de velocidad',scene:'anochecer',allow:['T'],preset:{mode:'S',tripod:true,ti:4},isoMax:100,d:'Modo S y trípode: tú eliges la velocidad y la cámara el diafragma. Haz que el ciclista deje estela.',
  goal:x=>x.disp>=40&&ok0(x),fail:'Elige una velocidad lenta: 1/15 o más lenta.'},
 {id:'iso',lvl:0,t:'Sube el ISO',scene:'noche',allow:['I'],preset:{fi:0,ti:6},isoMax:800,d:'De noche, a pulso, con f/1.4 y 1/60. Solo puedes subir el ISO: busca el mínimo que deje bien la foto.',
  goal:x=>ok0(x)&&!x.shake,fail:'Sube el ISO paso a paso hasta que el fotómetro marque 0.'},
 // Nivel 2
 {id:'bokeh',lvl:1,t:'Bokeh de luces',scene:'retrato',allow:['F','T'],preset:{fi:6,ti:5},isoMax:100,d:'Convierte las luces del fondo en grandes círculos de colores, con la persona nítida y bien expuesta.',
  goal:x=>x.bBg>=6&&x.bSub<1&&ok0(x)&&!x.shake,fail:'Abre al máximo el diafragma (f/1.4–f/2) y compensa con la velocidad.'},
 {id:'nitido',lvl:1,t:'Todo nítido',scene:'sol',allow:['F','T'],preset:{fi:2,ti:2},isoMax:100,d:'Que salga nítido todo, de las flores del primer plano a las montañas.',
  goal:x=>Math.max(x.bFg,x.bSub,x.bBg)<=1.3&&x.disp<3&&!x.shake&&ok0(x),fail:'Cierra el diafragma (f/11 o más) y ajusta la velocidad.'},
 {id:'primer',lvl:1,t:'A través de las flores',scene:'sol',allow:['F','T','focus'],preset:{fi:5,ti:4},isoMax:100,d:'Enfoca el fondo y deja las flores del primer plano como manchas de color.',
  goal:x=>x.focus===1&&x.bFg>=8&&ok0(x),fail:'Enfoca el fondo y abre el diafragma (f/2.8). Con tanto sol necesitarás 1/4000.'},
 {id:'seda',lvl:1,t:'Agua sedosa',scene:'cascada',allow:['F','T'],preset:{tripod:true,fi:4,ti:5},isoMax:100,d:'Con trípode, haz que la cascada parezca seda. Ojo: tendrás que compensar mucha luz.',
  goal:x=>x.disp>=60&&ok0(x),fail:'Velocidad lenta (1/8 o más) y diafragma muy cerrado (f/22) para no sobreexponer.'},
 {id:'equi1',lvl:1,t:'Misma luz, otro camino',scene:'nublado',allow:['F','T'],preset:{fi:5,ti:6},isoMax:100,d:'Partes de 1/60 · f/8, bien expuesta. Abre a f/4 para desenfocar más… sin cambiar la luz ni tocar el ISO.',
  goal:x=>x.N===4&&ok0(x),fail:'De f/8 a f/4 ganas 2 pasos de luz: quítalos con la velocidad (1/60 → 1/250).'},
 {id:'equi2',lvl:1,t:'Congela sin tocar el diafragma',scene:'nublado',allow:['T','I'],preset:{fi:5,ti:6},isoMax:800,d:'Partes de 1/60 · f/8. Congela al ciclista (1/500 o más) sin tocar el diafragma.',
  goal:x=>x.disp<1.5&&ok0(x),fail:'Cada paso más rápido de velocidad hay que compensarlo subiendo un paso el ISO.'},
 // Nivel 3
 {id:'pulso',lvl:2,t:'De noche y a pulso',scene:'noche',isoMax:1600,d:'Sin trípode, consigue una foto bien expuesta y sin trepidación.',
  goal:x=>!x.tripod&&!x.shake&&ok0(x),fail:'A pulso necesitas 1/50 o más rápido con 50 mm. Abre al máximo y sube el ISO lo justo.'},
 {id:'velo',lvl:2,t:'Sprint bajo techo',scene:'velodromo',isoMax:1600,d:'Congela al ciclista en el velódromo cubierto, donde hay mucha menos luz que fuera.',
  goal:x=>x.disp<1.5&&x.bSub<1.5&&ok0(x)&&!x.shake,fail:'1/500 o más rápido, enfocado al ciclista: compensa abriendo el diafragma y subiendo el ISO.'},
 {id:'larga',lvl:2,t:'Larga exposición limpia',scene:'noche',isoMax:100,d:'Con trípode e ISO 100 (sin ruido), consigue una exposición correcta de la calle.',
  goal:x=>x.tripod&&x.iso===100&&ok0(x),fail:'Trípode, ISO 100, y alarga la exposición varios segundos hasta que el fotómetro marque 0.'},
 {id:'trails',lvl:2,t:'Estelas de luz',scene:'autovia',isoMax:100,d:'Convierte los faros de los coches en estelas de luz, con ISO 100.',
  goal:x=>x.tripod&&x.disp>=300&&ok0(x),fail:'Trípode y varios segundos de exposición (4" u 8"), cerrando el diafragma para no sobreexponer.'},
 // Nivel 4
 {id:'nieve',lvl:3,t:'Nieve blanca',scene:'nieve',allow:['F','ec'],preset:{mode:'A',fi:5},isoMax:100,d:'En modo A, la nieve sale gris porque el fotómetro se engaña. Corrígelo con la compensación de exposición.',
  goal:x=>ok0(x)&&x.ec>0,fail:'Sube la compensación a +1⅔ o +2: así la cámara expone más clara de lo que mide.'},
 {id:'tele',lvl:3,t:'Retrato con teleobjetivo',scene:'retrato',allow:['F','T','I','foc'],preset:{fi:3,ti:5},isoMax:200,d:'Usa el teleobjetivo (135 mm o más) para el fondo más desenfocado posible, sin trepidación.',
  goal:x=>x.f>=135&&x.bBg>=12&&ok0(x)&&!x.shake,fail:'Sube la focal a 135–200 mm, abre el diafragma y usa al menos 1/focal (1/250 con 200 mm); sube un poco el ISO si falta luz.'},
 {id:'angular',lvl:3,t:'Gran angular a pulso',scene:'noche',allow:['T','foc'],preset:{fi:0,ii:2,ti:6,foc:3},isoMax:400,d:'f/1.4 e ISO 400 fijos. Con 50 mm no te llega la luz sin trepidar… ¿y con un gran angular?',
  goal:x=>!x.shake&&ok0(x),fail:'Baja la focal a 18 mm: a pulso aguantas hasta 1/18, así que 1/30 ya no tiembla.'},
 {id:'wb',lvl:3,t:'Corrige el color',scene:'velodromo',allow:['wb'],preset:{fi:0,ti:2,ii:3,wb:'5500'},isoMax:800,d:'La foto sale naranja porque el balance de blancos está en «Luz de día». Elige el ajuste correcto para esta luz artificial.',
  goal:x=>Math.abs(x.wbd)<.15,fail:'Prueba los ajustes de luz artificial: fluorescente (4000 K).'},
 {id:'barrido',lvl:3,t:'Barrido',scene:'nublado',allow:['T','F','pan'],preset:{fi:4,ti:2},isoMax:100,d:'Sigue al ciclista con la cámara: él nítido y el fondo con líneas de velocidad.',
  goal:x=>x.panning&&x.disp>=20&&!x.shake&&ok0(x),fail:'Activa «Barrido», usa 1/30 o 1/15 y cierra el diafragma para compensar la luz.'}
];
let stars=store.get('fotolab-stars',{});
function starStr(n){return `<span class="stars" role="img" aria-label="${n} de 3 estrellas">`+'★'.repeat(n)+'<span class="off" aria-hidden="true">'+'☆'.repeat(3-n)+'</span></span>'}
function renderRetos(){
  $('#retos').innerHTML=NIVELES.map((nv,l)=>`<div class="sect">${nv}</div><div class="grid">`+RETOS.map((r,i)=>r.lvl!==l?'':`<button class="card reto" data-i="${i}"><div class="n">RETO ${i+1} · ${SC[r.scene].name.replace(/^\S+\s/,'').toUpperCase()}</div><h3>${r.t}</h3><p>${r.d}</p>${starStr(stars[r.id]||0)}</button>`).join('')+'</div>').join('');
  $$('.reto').forEach(el=>el.onclick=()=>startReto(+el.dataset.i));
  const tot=Object.values(stars).reduce((a,b)=>a+b,0);
  $('#total').textContent=`★ ${tot} / ${RETOS.length*3} estrellas`;
}
function startReto(i){
  const r=RETOS[i];
  Object.assign(st,newS({scene:r.scene,ti:6}),r.preset||{},{ch:i,allow:r.allow||null});
  $('#chbT').textContent=`🎯 Reto ${i+1}: ${r.t}`;$('#chbD').textContent=r.d;
  $('#chbL').textContent=r.allow?'🔒 Solo puedes tocar: '+r.allow.map(k=>MANDOS[k]).join(', ')+'.':'';
  $('#chb').classList.add('on');$('#exitCh').style.display='';
  show('camara');applyMode(st);req();window.scrollTo({top:0,behavior:RM()?'auto':'smooth'});
}
function exitReto(silent){st.ch=null;st.allow=null;$('#chb').classList.remove('on');$('#exitCh').style.display='none';if(!silent)req()}
$('#exitCh').onclick=()=>exitReto();
$('#shoot').onclick=()=>{
  render();flash();
  const x=lastX,url=cv.toDataURL('image/jpeg',.85),alt=esc(cv.getAttribute('aria-label'));
  const info=`<div style="font-family:var(--mono);color:var(--muted);font-size:.8rem">${TL[st.ti]} · f/${x.N} · ISO ${x.iso} · ${x.f} mm${x.tripod?' · trípode':''}</div>`;
  if(st.ch===null){modal(`<img src="${url}" alt="${alt}"><h3>Tu foto</h3>${info}<ul>${analysis(x).map(a=>`<li>${a[1]}</li>`).join('')}</ul><div class="acts"><button class="btn pri" data-close>Seguir</button></div>`);return}
  const r=RETOS[st.ch],ok=r.goal(x),expOk=ok0(x),isoOk=x.iso<=r.isoMax,n=ok?1+(expOk?1:0)+(isoOk?1:0):0,lines=[];
  lines.push(ok?'✅ Objetivo conseguido.':'❌ '+r.fail);
  if(ok)lines.push(expOk?'✅ Exposición correcta.':`⚠️ Sale ${x.s>0?'sobreexpuesta':'subexpuesta'} (${fmtS(x.s)}). Compensa con otro ajuste.`);
  if(ok)lines.push(isoOk?'✅ ISO bajo: imagen limpia.':`⚠️ ISO ${x.iso} es más de lo necesario (se puede con ISO ${r.isoMax} o menos).`);
  if(n>(stars[r.id]||0)){stars[r.id]=n;store.set('fotolab-stars',stars);renderRetos()}
  const next=st.ch+1<RETOS.length;
  modal(`<img src="${url}" alt="${alt}"><h3>${n===3?'¡Foto perfecta!':n>0?'¡Conseguido!':'Casi…'}</h3>${starStr(n)}${info}<ul>${lines.map(l=>`<li>${l}</li>`).join('')}</ul><div class="acts"><button class="btn" data-close>Repetir</button>${next&&n>0?'<button class="btn pri" id="nextR">Siguiente reto →</button>':'<button class="btn pri" id="toList">Ver retos</button>'}</div>`);
  const nb=$('#nextR');if(nb)nb.onclick=()=>{closeModal();startReto(st.ch+1)};
  const tl=$('#toList');if(tl)tl.onclick=()=>{closeModal();exitReto();show('retos');showPanel('retos','lista')};
  checkMedals();
};

/* ===================== Adivina los ajustes ===================== */
const gcv=mk();const gctx=gcv.getContext('2d');
let adv={n:0,ok:0,q:null};
function mkQ(type){
  let S,opts,ans,q,why;
  if(type==='vel'){
    let sc,cands,ti;
    for(let k=0;k<40;k++){sc=pick(['sol','cascada','autovia','anochecer','nublado']);cands=sc==='autovia'?[6,12,14]:[2,6,9,11];ti=pick(cands);
      S=newS({scene:sc,ti,tripod:T[ti]>1/50});S.fi=bestF(S,ti,0,0);
      for(let i=0;i<7&&Math.abs(meterOf(S,S.fi,ti,S.ii))>.5;i++){S.ii++;S.fi=bestF(S,ti,S.ii,0)}
      if(Math.abs(meterOf(S,S.fi,ti,S.ii))<=.6)break}
    q='¿Con qué velocidad de obturación se hizo esta foto?';ans=TL[ti];opts=cands.map(i=>TL[i]);
    why=T[ti]<=1/500?'El movimiento sale congelado: velocidad muy rápida.':T[ti]<=1/60?'Hay algo de movimiento, pero poco: velocidad media.':'El movimiento deja estela: velocidad lenta, con trípode.';
  }else if(type==='ap'){
    const sc=pick(['retrato','nublado']);const c=[0,2,5,8],fi=pick(c);
    S=newS({scene:sc,fi,tripod:true});S.ti=bestT(S,fi,0,0);
    q='¿Con qué diafragma se hizo?';ans='f/'+F[fi];opts=c.map(i=>'f/'+F[i]);
    why=F[fi]<=2.8?'El fondo está muy desenfocado: diafragma muy abierto.':F[fi]<=8?'El fondo está algo desenfocado: diafragma medio.':'Casi todo está nítido: diafragma muy cerrado.';
  }else if(type==='iso'){
    const sc=pick(['noche','velodromo','autovia']);const c=[0,3,5,7],ii=pick(c);
    S=newS({scene:sc,ii,fi:2,tripod:true});S.ti=bestT(S,2,ii,0);
    q='¿Qué ISO se usó?';ans='ISO '+ISO[ii];opts=c.map(i=>'ISO '+ISO[i]);
    why=ISO[ii]<=100?'La imagen está limpia, sin grano: ISO bajo.':ISO[ii]<=800?'Hay un poco de grano: ISO medio.':'Hay mucho ruido de colores: ISO muy alto.';
  }else if(type==='exp'){
    const sc=pick(Object.keys(SC).filter(k=>k!=='nieve'));const sh=pick([-2,0,2]);
    S=newS({scene:sc,tripod:true});S.ti=bestT(S,S.fi,0,0);S.ti=Math.max(0,Math.min(17,S.ti-sh));
    const s=meterOf(S,S.fi,S.ti,S.ii);
    q='¿Cómo está expuesta esta foto?';ans=Math.abs(s)<.6?'Correcta':s>0?'Sobreexpuesta':'Subexpuesta';opts=['Subexpuesta','Correcta','Sobreexpuesta'];
    why=ans==='Correcta'?'Las luces y las sombras tienen detalle.':ans==='Sobreexpuesta'?'Las zonas claras se queman a blanco.':'Todo está demasiado oscuro.';
  }else{
    const sc=pick(['sol','retrato','nublado']);const c=[0,3,4,6],fo=pick(c);
    S=newS({scene:sc,foc:fo,tripod:true,fi:4});S.ti=bestT(S,4,0,0);
    q='¿Con qué distancia focal se hizo?';ans=FOC[fo]+' mm';opts=c.map(i=>FOC[i]+' mm');
    why=FOC[fo]<=24?'Se ve mucho paisaje y el fondo pequeño y lejano: gran angular.':FOC[fo]>=135?'El fondo se ve enorme y muy desenfocado: teleobjetivo.':'Vista parecida a la del ojo: focal normal o corta de retrato.';
  }
  return{S,q,ans,opts:shuffle([...new Set(opts)]),why};
}
function startAdivina(){adv={n:0,ok:0,types:shuffle(['vel','vel','vel','ap','ap','iso','exp','exp','foc','ap'])};nextAdivina()}
function nextAdivina(){
  const el=$('#adivina');
  if(adv.n>=10){const best=store.get('fotolab-adivina',0);if(adv.ok>best)store.set('fotolab-adivina',adv.ok);
    el.innerHTML=`<div class="big">${adv.ok}/10</div><p style="text-align:center">${adv.ok>=8?'¡Ojo de halcón! 🦅':adv.ok>=6?'Muy buen ojo.':'Sigue practicando con la cámara.'} Tu récord: ${Math.max(best,adv.ok)}/10.</p><button class="btn pri wide" id="advAgain">Otra ronda</button>`;
    $('#advAgain').onclick=startAdivina;checkMedals();return}
  const Q=mkQ(adv.types[adv.n]);adv.q=Q;const x=renderTo(Q.S,gctx);
  el.innerHTML=`<div class="prog"><i style="width:${adv.n*10}%"></i></div><div style="font-size:.75rem;color:var(--muted)">Foto ${adv.n+1} de 10 · ${adv.ok} aciertos</div>
    <div class="gview"><img alt="Foto misteriosa: ${esc(SC[Q.S.scene].name.replace(/^\S+\s/,''))}" src="${gcv.toDataURL('image/jpeg',.85)}" style="width:100%;display:block"></div>
    <div class="q">${Q.q}</div><div class="opts two">${Q.opts.map(o=>`<button>${o}</button>`).join('')}</div><div class="exp" id="advExp"></div>`;
  $$('#adivina .opts button').forEach(b=>b.onclick=()=>{
    const ok=b.textContent===Q.ans;if(ok)adv.ok++;
    $$('#adivina .opts button').forEach(z=>{z.disabled=true;if(z.textContent===Q.ans)z.classList.add('ok')});if(!ok)b.classList.add('bad');
    const e=$('#advExp');e.style.display='block';
    e.innerHTML=`${ok?'✅':'❌'} ${Q.why}<br><span style="font-family:var(--mono)">Ajustes: ${TL[Q.S.ti]} · f/${x.N} · ISO ${x.iso} · ${x.f} mm</span><div style="margin-top:10px"><button class="btn pri" id="advNext">${adv.n===9?'Ver resultado':'Siguiente →'}</button></div>`;
    $('#advNext').focus();$('#advNext').onclick=()=>{adv.n++;nextAdivina()}});
}

/* ===================== Contrarreloj ===================== */
const ccv=mk();const cctx=ccv.getContext('2d');
let cr={on:false};
function crHome(){
  const best=store.get('fotolab-crono',0),bestR=store.get('fotolab-crono-r',null);
  $('#crono').innerHTML=`<p style="margin-top:0">Te damos una escena mal expuesta. Ajusta apertura, velocidad e ISO hasta que el fotómetro marque 0 y dispara. ¡Cuantas más, mejor!</p>
    <label class="switch">Modo relajado (sin reloj: 10 fotos a tu ritmo) <input type="checkbox" id="crRelax"></label>
    <p style="color:var(--muted);font-size:.85rem">Récord con reloj: <b>${best}</b> fotos en 60 s${bestR?` · Relajado: <b>${bestR}</b> intentos para 10 fotos`:''}</p>
    <button class="btn pri wide" id="crGo">⏱️ Empezar</button>`;
  $('#crRelax').checked=store.get('fotolab-crono-relax',false);
  $('#crGo').onclick=()=>{store.set('fotolab-crono-relax',$('#crRelax').checked);crStart($('#crRelax').checked)};
}
function crScene(){const sc=pick(Object.keys(SC).filter(k=>k!=='nieve'));let S;
  do{S=newS({scene:sc,fi:Math.floor(Math.random()*9),ti:Math.floor(Math.random()*18),ii:Math.floor(Math.random()*5),tripod:true})}while(Math.abs(meterOf(S,S.fi,S.ti,S.ii))<1.5||Math.abs(meterOf(S,S.fi,S.ti,S.ii))>3.5);return S}
function crStart(relax){
  cr={on:true,relax,score:0,tries:0,end:Date.now()+60000,S:crScene()};
  $('#crono').innerHTML=`<div class="crbar"><span>📸 <span id="crSc">0</span>${relax?' / 10':''}</span><span class="time" id="crT">${relax?'sin reloj':'60'}</span></div>
    <div class="grid2"><div class="gview"><canvas id="crCv" width="${W}" height="${H}" role="img" aria-label="Escena del contrarreloj"></canvas></div>
    <div><div class="mini3">
      <div class="lbl"><span>Apertura</span><span class="v" id="crvF"></span></div><input type="range" id="crF" min="0" max="8" aria-label="Apertura">
      <div class="lbl"><span>Velocidad</span><span class="v" id="crvT"></span></div><input type="range" id="crTi" min="0" max="17" aria-label="Velocidad">
      <div class="lbl"><span>ISO</span><span class="v" id="crvI"></span></div><input type="range" id="crI" min="0" max="7" aria-label="ISO">
    </div>
    <div class="lbl" style="margin-top:6px"><span>Fotómetro</span><span class="v" id="crM"></span></div>
    <div class="shutter"><button class="btn pri" id="crShoot">📸 Disparar</button><button class="btn ghost" id="crStop">Terminar</button></div>
    <div class="fb" id="crFb" role="status" aria-live="polite"></div></div></div>`;
  ['crF','crTi','crI'].forEach(id=>$('#'+id).oninput=crDraw);
  $('#crShoot').onclick=crShoot;$('#crStop').onclick=crEnd;
  crLoad();if(!relax)cr.timer=setInterval(crTick,200);
}
function crLoad(){$('#crF').value=cr.S.fi;$('#crTi').value=cr.S.ti;$('#crI').value=cr.S.ii;crDraw()}
function crDraw(){if(!cr.on)return;const S=cr.S;S.fi=+$('#crF').value;S.ti=+$('#crTi').value;S.ii=+$('#crI').value;
  const x=renderTo(S,$('#crCv').getContext('2d'));$('#crvF').textContent='f/'+x.N;$('#crvT').textContent=TL[S.ti];$('#crvI').textContent=x.iso;$('#crM').textContent=fmtS(x.meter);
  $('#crF').setAttribute('aria-valuetext','f/'+x.N);$('#crTi').setAttribute('aria-valuetext',tSpeak(S.ti));$('#crI').setAttribute('aria-valuetext','ISO '+x.iso);
  $('#crCv').setAttribute('aria-label',`${SC[S.scene].name.replace(/^\S+\s/,'')}. Fotómetro ${fmtS(x.meter)}.`)}
function crTick(){const left=Math.max(0,Math.ceil((cr.end-Date.now())/1000));const t=$('#crT');if(!t){clearInterval(cr.timer);return}t.textContent=left;t.classList.toggle('low',left<=10);if(left<=0)crEnd()}
function crShoot(){
  const m=meterOf(cr.S,cr.S.fi,cr.S.ti,cr.S.ii);cr.tries++;const fb=$('#crFb');
  if(Math.abs(m)<.5){cr.score++;$('#crSc').textContent=cr.score;fb.className='fb ok';fb.textContent='✅ ¡Clavada! Siguiente escena.';
    if(cr.relax&&cr.score>=10){crEnd();return}cr.S=crScene();crLoad()}
  else{fb.className='fb bad';fb.textContent=`❌ El fotómetro marca ${fmtS(m)}: ${m>0?'sobra luz':'falta luz'}.`}
}
function crEnd(){if(!cr.on)return;cr.on=false;clearInterval(cr.timer);
  let msg;
  if(cr.relax){const best=store.get('fotolab-crono-r',null);const done=cr.score>=10;if(done&&(best===null||cr.tries<best))store.set('fotolab-crono-r',cr.tries);msg=done?`10 fotos en ${cr.tries} intentos.`:`${cr.score} fotos en ${cr.tries} intentos.`}
  else{const best=store.get('fotolab-crono',0);if(cr.score>best)store.set('fotolab-crono',cr.score);msg=`${cr.score} fotos bien expuestas en 60 segundos.${cr.score>best?' ¡Nuevo récord!':''}`}
  $('#crono').innerHTML=`<div class="big">${cr.score}</div><p style="text-align:center">${msg}</p><button class="btn pri wide" id="crBack">Volver</button>`;
  $('#crBack').onclick=crHome;$('#crBack').focus();checkMedals();
}

/* ===================== medallas ===================== */
function medalList(){
  const S=id=>stars[id]||0,all3=RETOS.every(r=>S(r.id)===3);
  const comp=store.get('fotolab-comp',{}),mis=store.get('fotolab-misiones',{});
  return[
   {ic:'📸',t:'Primer disparo',d:'Supera tu primer reto.',ok:Object.keys(stars).some(k=>stars[k]>0)},
   {ic:'🏃',t:'Maestro del movimiento',d:'Congela, estela, agua sedosa y barrido con 2★ o más.',ok:['congela','estela','seda','barrido'].every(k=>S(k)>=2),p:['congela','estela','seda','barrido'].filter(k=>S(k)>=2).length+'/4'},
   {ic:'🌸',t:'Rey del bokeh',d:'Fondo desenfocado, bokeh de luces, flores y teleobjetivo con 2★.',ok:['retrato','bokeh','primer','tele'].every(k=>S(k)>=2),p:['retrato','bokeh','primer','tele'].filter(k=>S(k)>=2).length+'/4'},
   {ic:'🌙',t:'Nocturno',d:'Los retos de noche: ISO, a pulso, larga exposición y estelas.',ok:['iso','pulso','larga','trails'].every(k=>S(k)>=2),p:['iso','pulso','larga','trails'].filter(k=>S(k)>=2).length+'/4'},
   {ic:'⚖️',t:'Equilibrista',d:'Los dos retos de exposiciones equivalentes con 3★.',ok:S('equi1')===3&&S('equi2')===3},
   {ic:'❄️',t:'Mago de los ajustes',d:'Nieve, color, gran angular y teleobjetivo con 2★.',ok:['nieve','wb','angular','tele'].every(k=>S(k)>=2)},
   {ic:'⭐',t:'Coleccionista',d:'Las 3 estrellas en todos los retos.',ok:all3,p:RETOS.filter(r=>S(r.id)===3).length+'/'+RETOS.length},
   {ic:'🦅',t:'Ojo de halcón',d:'8/10 o más en «Adivina los ajustes».',ok:store.get('fotolab-adivina',0)>=8,p:'récord '+store.get('fotolab-adivina',0)+'/10'},
   {ic:'⏱️',t:'Rayo',d:'8 fotos bien expuestas en el contrarreloj.',ok:store.get('fotolab-crono',0)>=8,p:'récord '+store.get('fotolab-crono',0)},
   {ic:'🖼️',t:'Compositor',d:'Todos los ejercicios de encuadre.',ok:typeof EJ!=='undefined'&&EJ.filter(e=>e.check).every(e=>comp[e.id]),p:typeof EJ!=='undefined'?EJ.filter(e=>e.check&&comp[e.id]).length+'/'+EJ.filter(e=>e.check).length:''},
   {ic:'🧐',t:'Crítico',d:'7/8 o más en «¿Cuál es mejor?».',ok:store.get('fotolab-mejor',0)>=7,p:'récord '+store.get('fotolab-mejor',0)+'/8'},
   {ic:'🎒',t:'Fotógrafo de campo',d:'Completa 5 misiones con tus fotos.',ok:Object.keys(mis).length>=5,p:Object.keys(mis).length+'/5'},
   {ic:'🎓',t:'Sabio',d:'9/10 o más en el test.',ok:store.get('fotolab-test',0)>=9,p:'récord '+store.get('fotolab-test',0)+'/10'}
  ];
}
function renderMedals(){
  const L=medalList(),n=L.filter(m=>m.ok).length;
  $('#mtotal').textContent=`🏅 ${n} / ${L.length} medallas · ★ ${Object.values(stars).reduce((a,b)=>a+b,0)} estrellas`;
  $('#medals').innerHTML=L.map(m=>`<div class="card medal ${m.ok?'ok':'no'}"><div class="ic" aria-hidden="true">${m.ic}</div><h3>${m.t}</h3><p>${m.d}</p><div class="st">${m.ok?'✓ Conseguida':'🔒 '+(m.p||'Pendiente')}</div></div>`).join('');
}
let medalsSeen=store.get('fotolab-medals-seen',[]);
function checkMedals(){
  const got=medalList().filter(m=>m.ok&&!medalsSeen.includes(m.t));
  if(!got.length)return;medalsSeen=medalsSeen.concat(got.map(m=>m.t));store.set('fotolab-medals-seen',medalsSeen);
  setTimeout(()=>{if($('#modal').classList.contains('on'))return;modal(`<div style="text-align:center;font-size:3rem" aria-hidden="true">${got[0].ic}</div><h3 style="text-align:center">¡Nueva medalla: ${got[0].t}!</h3><p style="text-align:center;color:var(--muted)">${got[0].d}</p><div class="acts"><button class="btn pri" data-close>¡Bien!</button></div>`)},900);
}
onShow['retos-lista']=renderRetos;
onShow['retos-adivina']=()=>{if(!adv.types||adv.n>=10)startAdivina()};
onShow['retos-crono']=()=>{if(!cr.on)crHome()};
onShow['retos-medallas']=renderMedals;
