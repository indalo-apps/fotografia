/* FotoLab · composición
   © 2026 Adela Moreno Vega y Carlos Moreno Otto. Todos los derechos reservados. */
'use strict';
const CW=1200,CH=800;

/* ===================== fotos para encuadrar ===================== */
function drawFaro(c){
  const HZ=430;let g=c.createLinearGradient(0,0,0,HZ);g.addColorStop(0,'#2b3f7a');g.addColorStop(.55,'#e2836b');g.addColorStop(1,'#ffc98a');c.fillStyle=g;c.fillRect(0,0,CW,HZ);
  const r=rng(41);
  for(let i=0;i<7;i++){const x=r()*CW,y=60+r()*220,w=120+r()*200;c.fillStyle=`rgba(255,${170+r()*50},${150+r()*40},.35)`;c.beginPath();c.ellipse(x,y,w,12+r()*10,0,0,7);c.fill()}
  let rg=c.createRadialGradient(250,HZ,0,250,HZ,180);rg.addColorStop(0,'rgba(255,240,190,1)');rg.addColorStop(.25,'rgba(255,210,140,.6)');rg.addColorStop(1,'rgba(255,200,120,0)');c.fillStyle=rg;c.fillRect(0,HZ-180,500,180);
  c.fillStyle='#fff1c4';c.beginPath();c.arc(250,HZ,46,Math.PI,0);c.fill();
  g=c.createLinearGradient(0,HZ,0,CH);g.addColorStop(0,'#c56f63');g.addColorStop(.3,'#4b4f7d');g.addColorStop(1,'#1f2648');c.fillStyle=g;c.fillRect(0,HZ,CW,CH-HZ);
  c.fillStyle='rgba(255,226,170,.55)';for(let y=HZ+6;y<HZ+200;y+=8){const w=60-(y-HZ)*.2+r()*20;c.fillRect(250-w/2+(r()-.5)*30,y,w,2)}
  c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=2;for(let i=0;i<120;i++){const x=r()*CW,y=HZ+20+r()*(CH-HZ),w=10+r()*30;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+w/2,y-3,x+w,y);c.stroke()}
  c.fillStyle='#2a2430';c.beginPath();c.moveTo(760,500);c.quadraticCurveTo(800,440,870,452);c.quadraticCurveTo(950,440,1010,470);c.quadraticCurveTo(1060,500,1080,520);c.lineTo(740,520);c.fill();
  c.fillStyle='#3a3140';c.beginPath();c.ellipse(910,522,190,14,0,0,7);c.fill();
  const lx=885,base=462,top=230;
  for(let i=0;i<6;i++){const y0=base-(base-top)*i/6,y1=base-(base-top)*(i+1)/6,w0=26-i*1.6,w1=26-(i+1)*1.6;c.fillStyle=i%2?'#f4efe6':'#c8323a';c.beginPath();c.moveTo(lx-w0,y0);c.lineTo(lx+w0,y0);c.lineTo(lx+w1,y1);c.lineTo(lx-w1,y1);c.fill()}
  c.fillStyle='#222';c.fillRect(lx-22,top-6,44,8);c.fillStyle='#ffe9a6';c.fillRect(lx-12,top-30,24,24);c.fillStyle='#222';c.beginPath();c.moveTo(lx-16,top-30);c.lineTo(lx,top-48);c.lineTo(lx+16,top-30);c.fill();
  rg=c.createRadialGradient(lx,top-18,0,lx,top-18,60);rg.addColorStop(0,'rgba(255,240,180,.8)');rg.addColorStop(1,'rgba(255,240,180,0)');c.fillStyle=rg;c.beginPath();c.arc(lx,top-18,60,0,7);c.fill();
  const bx=360,by=520;
  c.fillStyle='#1d1a24';c.beginPath();c.moveTo(bx-70,by-4);c.lineTo(bx+55,by-4);c.lineTo(bx+40,by+16);c.lineTo(bx-50,by+16);c.closePath();c.fill();
  c.fillStyle='#2a2532';c.fillRect(bx+2,by-130,3,126);
  c.fillStyle='#f3e6d0';c.beginPath();c.moveTo(bx,by-126);c.lineTo(bx,by-10);c.lineTo(bx-62,by-10);c.closePath();c.fill();
  c.fillStyle='#e8d6bb';c.beginPath();c.moveTo(bx+8,by-110);c.lineTo(bx+8,by-10);c.lineTo(bx+50,by-10);c.closePath();c.fill();
  c.strokeStyle='#1d1a24';c.lineWidth=2.5;for(const [x,y,s] of [[600,180,14],[640,205,10],[690,170,12]]){c.beginPath();c.moveTo(x-s,y);c.quadraticCurveTo(x-s/2,y-s*.6,x,y);c.quadraticCurveTo(x+s/2,y-s*.6,x+s,y);c.stroke()}
}
function drawRetratoC(c){
  let g=c.createLinearGradient(0,0,CW,0);g.addColorStop(0,'#3b2f2a');g.addColorStop(.6,'#6b5446');g.addColorStop(1,'#b59a7c');c.fillStyle=g;c.fillRect(0,0,CW,CH);
  c.fillStyle='rgba(255,240,210,.55)';c.fillRect(930,80,200,420);c.strokeStyle='#4a3a30';c.lineWidth=10;c.strokeRect(930,80,200,420);c.beginPath();c.moveTo(1030,80);c.lineTo(1030,500);c.moveTo(930,290);c.lineTo(1130,290);c.stroke();
  const rg=c.createRadialGradient(900,320,0,900,320,600);rg.addColorStop(0,'rgba(255,230,190,.35)');rg.addColorStop(1,'rgba(255,230,190,0)');c.fillStyle=rg;c.fillRect(0,0,CW,CH);
  const cx=520,hy=330;
  c.fillStyle='#c98f2e';c.beginPath();c.moveTo(cx-260,CH);c.quadraticCurveTo(cx-250,hy+190,cx-70,hy+170);c.lineTo(cx+80,hy+170);c.quadraticCurveTo(cx+230,hy+200,cx+250,CH);c.fill();
  c.fillStyle='#d9a283';c.fillRect(cx-30,hy+80,64,100);
  c.fillStyle='#2a1a12';c.beginPath();c.ellipse(cx-30,hy-10,105,118,0,0,7);c.fill();c.beginPath();c.ellipse(cx-80,hy+80,55,110,.15,0,7);c.fill();
  c.fillStyle='#e6ae8d';c.beginPath();c.ellipse(cx+18,hy+10,74,92,0,0,7);c.fill();
  c.beginPath();c.moveTo(cx+86,hy-4);c.lineTo(cx+112,hy+36);c.lineTo(cx+84,hy+44);c.fill();
  c.fillStyle='#2a1a12';c.beginPath();c.ellipse(cx-10,hy-62,96,46,-.1,Math.PI,0);c.fill();
  c.fillStyle='#fff';c.beginPath();c.ellipse(cx+58,hy-6,12,7,0,0,7);c.fill();c.fillStyle='#3b2416';c.beginPath();c.arc(cx+64,hy-6,5.5,0,7);c.fill();
  c.strokeStyle='#a4524a';c.lineWidth=4;c.beginPath();c.moveTo(cx+56,hy+56);c.quadraticCurveTo(cx+74,hy+62,cx+88,hy+54);c.stroke();
  c.fillStyle='#d79a7c';c.beginPath();c.ellipse(cx-26,hy+14,14,22,0,0,7);c.fill();
}
function drawCalle(c){
  const VP=[760,360];
  let g=c.createLinearGradient(0,0,0,VP[1]);g.addColorStop(0,'#7fb3e6');g.addColorStop(1,'#e8eef3');c.fillStyle=g;c.fillRect(0,0,CW,CH);
  c.fillStyle='#6f6a66';c.beginPath();c.moveTo(0,CH);c.lineTo(VP[0]-40,VP[1]+30);c.lineTo(VP[0]+40,VP[1]+30);c.lineTo(CW,CH);c.fill();
  c.fillStyle='#bdb5a8';c.beginPath();c.moveTo(0,CH);c.lineTo(0,CH-40);c.lineTo(VP[0]-40,VP[1]+28);c.lineTo(VP[0]-40,VP[1]+30);c.fill();
  c.beginPath();c.moveTo(CW,CH);c.lineTo(CW,CH-40);c.lineTo(VP[0]+40,VP[1]+28);c.lineTo(VP[0]+40,VP[1]+30);c.fill();
  c.fillStyle='#e9e2d0';for(let i=0;i<14;i++){const u0=Math.pow(i/14,1.6),u1=Math.pow((i+.5)/14,1.6);const ya=CH+(VP[1]+30-CH)*u0,yb=CH+(VP[1]+30-CH)*u1,wa=12*(1-u0),wb=12*(1-u1);const xa=CW*.5+(VP[0]-CW*.5)*u0,xb=CW*.5+(VP[0]-CW*.5)*u1;c.beginPath();c.moveTo(xa-wa,ya);c.lineTo(xa+wa,ya);c.lineTo(xb+wb,yb);c.lineTo(xb-wb,yb);c.fill()}
  const side=(x0,dir,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x0,-10);c.lineTo(VP[0]-dir*40,VP[1]-60);c.lineTo(VP[0]-dir*40,VP[1]+28);c.lineTo(x0,CH-40);c.fill();
    for(let k=0;k<9;k++){const u=1-Math.pow(1-k/9,1.4),u2=1-Math.pow(1-(k+.55)/9,1.4);const xa=x0+(VP[0]-dir*40-x0)*u,xb=x0+(VP[0]-dir*40-x0)*u2;
      for(let row=0;row<5;row++){const f=row/5+.08,f2=f+.12;const ya=(-10+(VP[1]-60+10)*u)+((CH-40-(-10))*(1-u)+(VP[1]+28-(VP[1]-60))*u)*f,yb2=(-10+(VP[1]-60+10)*u)+((CH-40-(-10))*(1-u)+(VP[1]+28-(VP[1]-60))*u)*f2;
        const ya2=(-10+(VP[1]-60+10)*u2)+((CH-40-(-10))*(1-u2)+(VP[1]+28-(VP[1]-60))*u2)*f,yb3=(-10+(VP[1]-60+10)*u2)+((CH-40-(-10))*(1-u2)+(VP[1]+28-(VP[1]-60))*u2)*f2;
        c.fillStyle=row%2?'#3c4a5e':'#2f3a4c';c.beginPath();c.moveTo(xa,ya);c.lineTo(xb,ya2);c.lineTo(xb,yb3);c.lineTo(xa,yb2);c.fill()}}};
  side(0,1,'#c9875e');side(CW,-1,'#e0b07a');
  c.fillStyle='#222';c.beginPath();c.arc(VP[0]+6,VP[1]+2,5,0,7);c.fill();c.fillRect(VP[0]+3,VP[1]+7,6,16);
}
function drawEdificio(c){
  let g=c.createLinearGradient(0,0,0,470);g.addColorStop(0,'#4f86c6');g.addColorStop(1,'#d7e6f2');c.fillStyle=g;c.fillRect(0,0,CW,470);
  c.fillStyle='#6f8f5a';c.fillRect(0,440,CW,360);
  const bld=(k)=>{
    c.fillStyle='#efe6d6';c.fillRect(380,250,440,190);
    c.fillStyle='#e4d8c2';c.fillRect(330,200,60,240);c.fillRect(810,200,60,240);
    c.fillStyle='#d9c9ad';c.beginPath();c.moveTo(330,200);c.lineTo(360,150);c.lineTo(390,200);c.fill();c.beginPath();c.moveTo(810,200);c.lineTo(840,150);c.lineTo(870,200);c.fill();
    c.fillStyle='#efe6d6';c.beginPath();c.arc(600,250,120,Math.PI,0);c.fill();c.fillStyle='#c9b48e';c.fillRect(596,108,8,24);
    c.fillStyle='#3d4f63';for(let i=0;i<5;i++){const x=420+i*80;c.beginPath();c.moveTo(x,440);c.lineTo(x,330);c.arc(x+20,330,20,Math.PI,0);c.lineTo(x+40,440);c.fill()}
    c.fillStyle='#2b3a4a';c.beginPath();c.moveTo(565,440);c.lineTo(565,320);c.arc(600,320,35,Math.PI,0);c.lineTo(635,440);c.fill();
  };
  bld();
  c.fillStyle='#5b8fb3';c.fillRect(470,460,260,340);
  c.save();c.beginPath();c.rect(470,460,260,340);c.clip();c.globalAlpha=.42;c.translate(0,900);c.scale(1,-1);bld();c.restore();
  c.fillStyle='#d8cdb8';c.fillRect(460,452,280,10);c.fillRect(460,452,10,348);c.fillRect(730,452,10,348);
  c.fillStyle='#3e6b3a';for(const x of [180,260,940,1020]){c.beginPath();c.ellipse(x,420,40,70,0,0,7);c.fill()}
}
function drawPuerta(c){
  let g=c.createLinearGradient(0,0,0,CH);g.addColorStop(0,'#8ec6ef');g.addColorStop(.55,'#e9f3f6');g.addColorStop(.56,'#9cc07c');g.addColorStop(1,'#5f8a49');c.fillStyle=g;c.fillRect(0,0,CW,CH);
  c.fillStyle='#7ea6c9';c.beginPath();c.moveTo(380,440);c.lineTo(520,330);c.lineTo(640,420);c.lineTo(760,340);c.lineTo(840,440);c.fill();
  c.fillStyle='#d9c8a0';c.beginPath();c.moveTo(560,CH);c.lineTo(600,450);c.lineTo(640,CH);c.fill();
  c.fillStyle='#2f5a2a';for(const [x,y,s] of [[470,470,30],[720,480,36],[520,520,22]]){c.beginPath();c.arc(x,y,s,0,7);c.fill()}
  c.fillStyle='#4a3b31';c.beginPath();c.rect(0,0,CW,CH);c.moveTo(400,CH);c.lineTo(400,300);c.arc(600,300,200,Math.PI,0);c.lineTo(800,CH);c.closePath();c.fill('evenodd');
  c.save();c.beginPath();c.rect(0,0,CW,CH);c.moveTo(400,CH);c.lineTo(400,300);c.arc(600,300,200,Math.PI,0);c.lineTo(800,CH);c.closePath();c.clip('evenodd');
  c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=3;for(let y=30;y<CH;y+=60)for(let x=(y/60)%2?0:-60;x<CW;x+=120)c.strokeRect(x,y,120,60);c.restore();
  c.strokeStyle='#6b5646';c.lineWidth=18;c.beginPath();c.moveTo(400,CH);c.lineTo(400,300);c.arc(600,300,200,Math.PI,0);c.lineTo(800,CH);c.stroke();
}
const CSC={
 faro:{name:'Faro',draw:drawFaro},retrato:{name:'Retrato',draw:drawRetratoC},calle:{name:'Calle',draw:drawCalle},edificio:{name:'Edificio',draw:drawEdificio},puerta:{name:'Puerta',draw:drawPuerta}
};
const CPT={light:[885,345],boat:[360,520],hz:430,eye:[578,324],vp:[760,360],axis:600,arch:[400,100,800,800]};
const cimg={};
function cImg(k){if(!cimg[k]){const cv=mk(CW,CH);CSC[k].draw(cv.getContext('2d'));cimg[k]=cv}return cimg[k]}

/* ===================== Encuadra ===================== */
const ASPECTS=[['3:2',1.5],['1:1',1],['4:5',.8],['16:9',16/9],['9:16',9/16]];
const comp={sc:'faro',ej:'libre',x:250,y:150,w:700,a:1.5,guide:'tercios'};
let compDone=store.get('fotolab-comp',{});
const chC=()=>comp.w/comp.a,wMax=()=>Math.min(CW,CH*comp.a),wMin=()=>Math.min(360,wMax());
function clampComp(){comp.w=Math.max(wMin(),Math.min(wMax(),comp.w));comp.x=Math.max(0,Math.min(CW-comp.w,comp.x));comp.y=Math.max(0,Math.min(CH-chC(),comp.y))}
const nx=p=>(p-comp.x)/comp.w,ny=p=>(p-comp.y)/chC();
const inF=(px,py)=>{const a=nx(px),b=ny(py);return a>=0&&a<=1&&b>=0&&b<=1};
function nearThird(px,py,tol){let best=9;for(const a of[1/3,2/3])for(const b of[1/3,2/3])best=Math.min(best,Math.hypot(nx(px)-a,(ny(py)-b)/comp.a*1.5*.67));return best<tol}
const EJ=[
 {id:'libre',sc:null,t:'Libre',d:'Encuadra como quieras: cambia de foto, de guía y de proporción.'},
 {id:'faro-tercios',sc:'faro',t:'Faro en un punto fuerte',guide:'tercios',d:'Coloca el faro sobre uno de los <b>cuatro cruces</b> de la regla de los tercios.',
  check:()=>{if(!inF(...CPT.light))return[false,'El faro se ha quedado fuera.'];if(nearThird(...CPT.light,.05))return[true,'¡Muy bien! El faro está en un punto fuerte: la mirada va directa a él.'];
   if(Math.abs(nx(CPT.light[0])-.5)<.06)return[false,'El faro está centrado: aquí queda estático. Desplázalo a un cruce.'];return[false,'Aún no está sobre un cruce: llévalo a uno de los puntos naranjas.']}},
 {id:'faro-horizonte',sc:'faro',t:'Horizonte en un tercio',guide:'tercios',d:'No partas la foto por la mitad: pon el <b>horizonte</b> en la línea del tercio superior o inferior.',
  check:()=>{const y=ny(CPT.hz);if(y<0||y>1)return[false,'El horizonte ha quedado fuera.'];if(Math.abs(y-1/3)<.035)return[true,'¡Bien! Horizonte arriba: protagonismo al mar.'];if(Math.abs(y-2/3)<.035)return[true,'¡Bien! Horizonte abajo: protagonismo al cielo.'];
   if(Math.abs(y-.5)<.06)return[false,'El horizonte parte la foto en dos mitades iguales: no se sabe qué es lo importante.'];return[false,'Acerca el horizonte a una de las líneas horizontales.']}},
 {id:'faro-aire',sc:'faro',t:'Deja aire al velero',guide:'tercios',d:'El velero navega hacia la <b>izquierda</b>: déjale espacio delante colocándolo en el <b>tercio derecho</b>.',
  check:()=>{const x=nx(CPT.boat[0]);if(!inF(CPT.boat[0],CPT.boat[1]-50))return[false,'El velero se ha quedado fuera.'];if(Math.abs(x-2/3)<.07)return[true,'¡Perfecto! Tiene espacio hacia donde navega: la foto transmite movimiento.'];
   if(x<.45)return[false,'El velero «choca» contra el borde izquierdo. Colócalo a la derecha.'];return[false,'Vas bien: llévalo a la línea del tercio derecho.']}},
 {id:'faro-negativo',sc:'faro',t:'Espacio negativo',guide:'tercios',d:'Aleja el zoom al máximo y deja el velero <b>pequeño</b> en un tercio, rodeado de cielo y mar.',
  check:()=>{if(comp.w<wMax()*.92)return[false,'Aleja más el zoom: el velero tiene que verse pequeño.'];const x=nx(CPT.boat[0]);if(!inF(...CPT.boat))return[false,'El velero se ha quedado fuera.'];
   if(Math.abs(x-1/3)<.08||Math.abs(x-2/3)<.08)return[true,'¡Muy bien! Mucho espacio vacío alrededor: transmite calma y soledad.'];return[false,'Coloca el velero sobre una línea vertical de los tercios.']}},
 {id:'retrato-mirada',sc:'retrato',t:'Regla de la mirada',guide:'tercios',d:'La persona mira a la derecha: déjale <b>espacio delante</b> y pon sus ojos cerca del <b>tercio superior</b>.',
  check:()=>{const x=nx(CPT.eye[0]),y=ny(CPT.eye[1]);if(!inF(...CPT.eye))return[false,'Los ojos se han quedado fuera.'];if(x>.55)return[false,'Mira hacia el borde y parece encerrada: muévela a la izquierda.'];
   if(y>.48)return[false,'Los ojos están muy abajo y sobra espacio encima de la cabeza: súbelos al tercio superior.'];if(x>=.22&&x<=.45&&y>=.24&&y<=.44)return[true,'¡Perfecto! Espacio hacia donde mira y ojos en el tercio superior.'];return[false,'Casi: ojos sobre la línea superior de los tercios, en la mitad izquierda.']}},
 {id:'calle-lineas',sc:'calle',t:'Líneas guía',guide:'tercios',d:'Las líneas de la calle se juntan en el <b>punto de fuga</b> (donde camina la persona). Colócalo en un cruce de los tercios.',
  check:()=>{if(!inF(...CPT.vp))return[false,'El punto de fuga ha quedado fuera.'];if(nearThird(...CPT.vp,.06))return[true,'¡Bien! Las líneas llevan la mirada directa a la persona.'];return[false,'Lleva el punto donde se juntan las líneas a un cruce naranja.']}},
 {id:'edificio-sim',sc:'edificio',t:'Simetría',guide:'centro',d:'Aquí la simetría manda: <b>centra</b> el eje del edificio y que se vean la cúpula y el reflejo.',
  check:()=>{if(Math.abs(nx(CPT.axis)-.5)>.02)return[false,'El eje del edificio no está centrado: muévelo hasta la cruz central.'];if(ny(105)<0||ny(780)>1)return[false,'Que quepan la cúpula y el reflejo: aleja un poco el zoom.'];return[true,'¡Simétrico! La excepción a los tercios: centrar transmite orden y calma.']}},
 {id:'puerta-marco',sc:'puerta',t:'Encuadre natural',guide:'ninguna',d:'Usa el arco como <b>marco</b>: que se vea entero (lados y arco de arriba) y rodee el paisaje.',
  check:()=>{const [x0,y0,x1]=CPT.arch;if(nx(x0-12)<0||nx(x1+12)>1||ny(y0-12)<0)return[false,'Estás cortando el arco: deja ver sus dos lados y la curva de arriba.'];if((x1-x0)/comp.w<.5)return[false,'El arco se ve demasiado pequeño: acerca un poco el zoom.'];return[true,'¡Muy bien! El marco dirige la mirada al paisaje y da profundidad.']}}
];
const GUIDES=[['ninguna','Ninguna'],['tercios','Tercios'],['aurea','Áurea'],['diagonales','Diagonales'],['centro','Centro']];
function drawGuides(c,w,h,guide){
  c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=Math.max(1.5,w/450);c.fillStyle='rgba(255,176,32,.95)';
  const ln=(a,b,cc,d)=>{c.beginPath();c.moveTo(a,b);c.lineTo(cc,d);c.stroke()};
  const grid=a=>{for(const f of a){ln(w*f,0,w*f,h);ln(0,h*f,w,h*f)}for(const fx of a)for(const fy of a){c.beginPath();c.arc(w*fx,h*fy,Math.max(5,w/130),0,7);c.fill()}};
  if(guide==='tercios')grid([1/3,2/3]);if(guide==='aurea')grid([.382,.618]);
  if(guide==='diagonales'){ln(0,0,w,h);ln(w,0,0,h)}
  if(guide==='centro'){const s=Math.min(w,h)*.05;ln(w/2-s,h/2,w/2+s,h/2);ln(w/2,h/2-s,w/2,h/2+s);c.strokeRect(w*.25,h*.25,w*.5,h*.5)}
}
const pcv=$('#comp'),pctx=pcv.getContext('2d');
function sizeComp(){const PW=900;pcv.width=PW;pcv.height=Math.round(PW/comp.a)}
function drawCompView(){clampComp();pctx.drawImage(cImg(comp.sc),comp.x,comp.y,comp.w,chC(),0,0,pcv.width,pcv.height);drawGuides(pctx,pcv.width,pcv.height,comp.guide);
  $('#vZ').textContent=Math.round(wMax()/comp.w*10)/10+'×';$('#rZ').value=Math.round((wMax()-comp.w)/(wMax()-wMin()||1)*100);
  pcv.setAttribute('aria-label','Foto para encuadrar: '+CSC[comp.sc].name)}
function renderCompUI(){
  $('#cphotos').innerHTML=Object.entries(CSC).map(([k,v])=>`<button data-k="${k}" class="${k===comp.sc?'on':''}" aria-pressed="${k===comp.sc}">${v.name}</button>`).join('');
  const list=EJ.filter(e=>!e.sc||e.sc===comp.sc);
  $('#ejs').innerHTML=list.map(e=>`<button data-i="${e.id}" class="${e.id===comp.ej?'on':''}" aria-pressed="${e.id===comp.ej}">${e.t}${compDone[e.id]?'<span class="done" aria-label="completado">✓</span>':''}</button>`).join('');
  $('#guides').innerHTML=GUIDES.map(([k,n])=>`<button data-g="${k}" class="${k===comp.guide?'on':''}" aria-pressed="${k===comp.guide}">${n}</button>`).join('');
  $('#aspects').innerHTML=ASPECTS.map(([n,a])=>`<button data-a="${a}" class="${Math.abs(a-comp.a)<.01?'on':''}" aria-pressed="${Math.abs(a-comp.a)<.01}">${n}</button>`).join('');
  const ej=EJ.find(e=>e.id===comp.ej);$('#ejd').innerHTML=ej.d;$('#check').style.display=ej.check?'':'none';
  $$('#cphotos button').forEach(b=>b.onclick=()=>{comp.sc=b.dataset.k;comp.ej='libre';resetComp();renderCompUI();drawCompView()});
  $$('#ejs button').forEach(b=>b.onclick=()=>{comp.ej=b.dataset.i;const e=EJ.find(z=>z.id===comp.ej);if(e.guide)comp.guide=e.guide;resetComp();renderCompUI();drawCompView()});
  $$('#guides button').forEach(b=>b.onclick=()=>{comp.guide=b.dataset.g;renderCompUI();drawCompView()});
  $$('#aspects button').forEach(b=>b.onclick=()=>{const cxm=comp.x+comp.w/2,cym=comp.y+chC()/2;comp.a=+b.dataset.a;sizeComp();comp.x=cxm-comp.w/2;comp.y=cym-chC()/2;renderCompUI();drawCompView()});
}
function resetComp(){comp.w=wMax()*.62;comp.x=(CW-comp.w)/2-80;comp.y=(CH-chC())/2-40;$('#compfb').className='fb'}
$('#rZ').oninput=e=>{const cxm=comp.x+comp.w/2,cym=comp.y+chC()/2;comp.w=wMax()-(+e.target.value/100)*(wMax()-wMin());comp.x=cxm-comp.w/2;comp.y=cym-chC()/2;$('#compfb').className='fb';drawCompView()};
function moveComp(dx,dy){const s=comp.w*.06;comp.x+=dx*s;comp.y+=dy*s;$('#compfb').className='fb';drawCompView();announceComp()}
function announceComp(){const p=v=>v<0||v>1?'fuera':v<.42?'a la izquierda':v>.58?'a la derecha':'en el centro',q=v=>v<0||v>1?'fuera':v<.42?'arriba':v>.58?'abajo':'en el centro';
  const msg={faro:()=>`Faro ${p(nx(CPT.light[0]))} y ${q(ny(CPT.light[1]))}; velero ${p(nx(CPT.boat[0]))}; horizonte ${q(ny(CPT.hz))}.`,retrato:()=>`Ojos ${p(nx(CPT.eye[0]))} y ${q(ny(CPT.eye[1]))}.`,calle:()=>`Punto de fuga ${p(nx(CPT.vp[0]))} y ${q(ny(CPT.vp[1]))}.`,edificio:()=>`Eje del edificio ${p(nx(CPT.axis))}.`,puerta:()=>`Arco ${p(nx(600))}.`}[comp.sc];
  $('#comppos').textContent=msg()}
$$('.pad button').forEach(b=>b.onclick=()=>{if(b.dataset.mv==='c'){comp.x=(CW-comp.w)/2;comp.y=(CH-chC())/2;$('#compfb').className='fb';drawCompView();announceComp();return}const [dx,dy]=b.dataset.mv.split(',').map(Number);moveComp(dx,dy)});
$('#compwrap').addEventListener('keydown',e=>{const k={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(k){e.preventDefault();moveComp(...k)}});
$('#check').onclick=()=>{const e=EJ.find(z=>z.id===comp.ej);if(!e.check)return;const r=e.check();const fb=$('#compfb');fb.className='fb '+(r[0]?'ok':'bad');fb.innerHTML=(r[0]?'✅ ':'❌ ')+r[1];
  if(r[0]&&!compDone[e.id]){compDone[e.id]=1;store.set('fotolab-comp',compDone);renderCompUI();checkMedals()}};
(function(){const el=$('#compwrap');let p=null;
  el.addEventListener('pointerdown',e=>{p={x:e.clientX,y:e.clientY};el.setPointerCapture(e.pointerId)});
  el.addEventListener('pointermove',e=>{if(!p)return;const k=comp.w/pcv.clientWidth;comp.x-=(e.clientX-p.x)*k;comp.y-=(e.clientY-p.y)*k;p={x:e.clientX,y:e.clientY};$('#compfb').className='fb';drawCompView()});
  const up=()=>p=null;el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up)})();

/* ===================== crops para los juegos ===================== */
// coloca el punto (px,py) en la posición relativa (fx,fy) de un recorte de anchura w y proporción a
function cropAt(px,py,fx,fy,w,a){a=a||1.5;const h=w/a;return[Math.max(0,Math.min(CW-w,px-fx*w)),Math.max(0,Math.min(CH-h,py-fy*h)),w,a]}
function cropImg(sc,cr,pw){pw=pw||600;const [x,y,w,a]=cr,cv=mk(pw,Math.round(pw/a));cv.getContext('2d').drawImage(cImg(sc),x,y,w,w/a,0,0,cv.width,cv.height);return cv}

/* ===================== ¿Cuál es mejor? ===================== */
const PAIRS=[
 {sc:'faro',g:cropAt(885,345,2/3,1/3,700),b:cropAt(885,345,.5,.5,700),why:'Con el faro en un punto fuerte (regla de los tercios) la foto es más dinámica; centrado queda estático.'},
 {sc:'faro',g:cropAt(600,430,.5,2/3,760),b:cropAt(600,430,.5,.5,760),why:'Con el horizonte en un tercio se ve qué importa (aquí, el cielo). En la mitad, la foto queda partida en dos.'},
 {sc:'faro',g:cropAt(360,470,2/3,.5,480),b:cropAt(360,470,.18,.5,480),why:'El velero navega hacia la izquierda: necesita espacio delante (regla del aire). Pegado al borde parece que choca.'},
 {sc:'retrato',g:cropAt(578,324,.36,1/3,620),b:cropAt(578,324,.74,1/3,620),why:'Regla de la mirada: espacio hacia donde mira. Si mira al borde, parece encerrada.'},
 {sc:'retrato',g:cropAt(578,324,.38,.34,620),b:cropAt(578,324,.38,.7,620),why:'Los ojos van mejor en el tercio superior. Con los ojos abajo sobra «aire» encima de la cabeza.'},
 {sc:'edificio',g:cropAt(600,420,.5,.45,1000),b:cropAt(600,420,.4,.45,1000),why:'Ojo, trampa: en un edificio simétrico lo mejor es CENTRAR. Un descentrado pequeño parece un error.'},
 {sc:'puerta',g:cropAt(600,420,.5,.48,1080),b:cropAt(600,520,.5,.5,620),why:'El arco entero funciona como marco natural. Cortado, se pierde el efecto y molesta.'},
 {sc:'calle',g:cropAt(760,360,2/3,1/3,900),b:cropAt(760,360,.9,.75,700),why:'Las líneas guía llevan la vista al punto de fuga; en un punto fuerte funciona. En la esquina, la vista se escapa de la foto.'}
];
let mj={};
function startMejor(){mj={n:0,ok:0,list:shuffle(PAIRS)};nextMejor()}
function nextMejor(){
  const el=$('#mejor');
  if(mj.n>=mj.list.length){const best=store.get('fotolab-mejor',0);if(mj.ok>best)store.set('fotolab-mejor',mj.ok);
    el.innerHTML=`<div class="big">${mj.ok}/${mj.list.length}</div><p style="text-align:center">${mj.ok>=7?'¡Gran ojo de crítico! 🧐':'Repasa las reglas en Aprende y vuelve a probar.'}</p><button class="btn pri wide" id="mjA">Otra vez</button>`;$('#mjA').onclick=startMejor;checkMedals();return}
  const P=mj.list[mj.n],goodFirst=Math.random()<.5,A=goodFirst?P.g:P.b,B=goodFirst?P.b:P.g;
  el.innerHTML=`<div class="prog"><i style="width:${mj.n/mj.list.length*100}%"></i></div><div style="font-size:.75rem;color:var(--muted);margin-bottom:8px">Pareja ${mj.n+1} de ${mj.list.length} · ${mj.ok} aciertos</div>
    <div class="pair"><div class="opt" id="mjo0"></div><div class="opt" id="mjo1"></div></div><div class="exp" id="mjE"></div>`;
  [A,B].forEach((cr,i)=>{const c=cropImg(P.sc,cr,560);c.setAttribute('role','img');c.setAttribute('aria-label',`Encuadre ${'AB'[i]} de la foto ${CSC[P.sc].name}`);const o=$('#mjo'+i);o.appendChild(c);
    const b=document.createElement('button');b.className='btn';b.textContent=`Me quedo con la ${'AB'[i]}`;o.appendChild(b);
    b.onclick=()=>{const right=(i===0)===goodFirst;if(right)mj.ok++;
      $$('#mejor .opt button').forEach(z=>z.disabled=true);$('#mjo'+(goodFirst?0:1)).classList.add('ok');if(!right)o.classList.add('bad');
      const e=$('#mjE');e.style.display='block';e.innerHTML=`${right?'✅ ¡Bien visto!':'❌ Era la '+(goodFirst?'A':'B')+'.'} ${P.why}<div style="margin-top:10px"><button class="btn pri" id="mjN">${mj.n===mj.list.length-1?'Ver resultado':'Siguiente →'}</button></div>`;
      $('#mjN').focus();$('#mjN').onclick=()=>{mj.n++;nextMejor()}}});
}

/* ===================== Detecta la regla ===================== */
const RULES={tercios:'Regla de los tercios',simetria:'Simetría',lineas:'Líneas guía',marco:'Encuadre natural',negativo:'Espacio negativo',mirada:'Regla de la mirada'};
const DET=[
 {sc:'faro',cr:cropAt(885,345,2/3,1/3,640),a:'tercios',why:'El faro está justo en un cruce de los tercios.'},
 {sc:'edificio',cr:cropAt(600,420,.5,.45,1000),a:'simetria',why:'El edificio y su reflejo están centrados: las dos mitades son iguales.'},
 {sc:'calle',cr:cropAt(760,360,2/3,.42,1000),a:'lineas',why:'Las líneas de la calle llevan la mirada hasta la persona.'},
 {sc:'puerta',cr:cropAt(600,420,.5,.48,1080),a:'marco',why:'El arco hace de marco alrededor del paisaje.'},
 {sc:'faro',cr:cropAt(360,500,2/3,.62,1200),a:'negativo',why:'El velero es pequeño y está rodeado de mucho espacio vacío.'},
 {sc:'retrato',cr:cropAt(578,324,.32,.36,640),a:'mirada',why:'Hay espacio delante de la cara, hacia donde mira.'}
];
let dt={};
function startDetecta(){dt={n:0,ok:0,list:shuffle(DET)};nextDetecta()}
function nextDetecta(){
  const el=$('#detecta');
  if(dt.n>=dt.list.length){el.innerHTML=`<div class="big">${dt.ok}/${dt.list.length}</div><p style="text-align:center">${dt.ok===dt.list.length?'¡Las conoces todas!':'Repasa la composición en Aprende → Teoría.'}</p><button class="btn pri wide" id="dtA">Otra vez</button>`;$('#dtA').onclick=startDetecta;return}
  const D=dt.list[dt.n],opts=shuffle([D.a,...shuffle(Object.keys(RULES).filter(k=>k!==D.a)).slice(0,3)]);
  el.innerHTML=`<div class="prog"><i style="width:${dt.n/dt.list.length*100}%"></i></div><div style="font-size:.75rem;color:var(--muted);margin-bottom:8px">Foto ${dt.n+1} de ${dt.list.length} · ${dt.ok} aciertos</div>
    <div class="gview" id="dtV"></div><div class="q">¿Qué regla de composición usa esta foto?</div><div class="opts two">${opts.map(k=>`<button data-k="${k}">${RULES[k]}</button>`).join('')}</div><div class="exp" id="dtE"></div>`;
  const c=cropImg(D.sc,D.cr,720);c.style.width='100%';c.setAttribute('role','img');c.setAttribute('aria-label','Foto: '+CSC[D.sc].name);$('#dtV').appendChild(c);
  $$('#detecta .opts button').forEach(b=>b.onclick=()=>{const ok=b.dataset.k===D.a;if(ok)dt.ok++;
    $$('#detecta .opts button').forEach(z=>{z.disabled=true;if(z.dataset.k===D.a)z.classList.add('ok')});if(!ok)b.classList.add('bad');
    const e=$('#dtE');e.style.display='block';e.innerHTML=`${ok?'✅':'❌'} ${D.why}<div style="margin-top:10px"><button class="btn pri" id="dtN">${dt.n===dt.list.length-1?'Ver resultado':'Siguiente →'}</button></div>`;$('#dtN').focus();$('#dtN').onclick=()=>{dt.n++;nextDetecta()}});
}
function presetComp(sc,ej,guide){comp.sc=sc;comp.ej=ej||'libre';const e=EJ.find(z=>z.id===comp.ej);if(guide)comp.guide=guide;else if(e&&e.guide)comp.guide=e.guide;resetComp();renderCompUI();drawCompView();show('comp');showPanel('comp','encuadra');window.scrollTo({top:0,behavior:RM()?'auto':'smooth'})}
onShow['comp-encuadra']=()=>{drawCompView()};
onShow['comp-mejor']=()=>{if(!mj.list||mj.n>=mj.list.length)startMejor()};
onShow['comp-detecta']=()=>{if(!dt.list||dt.n>=dt.list.length)startDetecta()};
sizeComp();resetComp();renderCompUI();
