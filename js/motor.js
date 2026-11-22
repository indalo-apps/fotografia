/* FotoLab · motor de la cámara simulada
   © 2026 Adela Moreno Vega y Carlos Moreno Otto. Todos los derechos reservados. */
'use strict';

/* ===================== utilidades comunes ===================== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function rng(seed){return ()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646}}
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}};
function mk(w,h){const c=document.createElement('canvas');c.width=w||W;c.height=h||H;return c}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ===================== datos de cámara ===================== */
const W=720,H=480,BGW=2*W,BGH=2*H;
const F=[1.4,2,2.8,4,5.6,8,11,16,22];
const T=[1/4000,1/2000,1/1000,1/500,1/250,1/125,1/60,1/30,1/15,1/8,1/4,1/2,1,2,4,8,15,30];
const TL=['1/4000','1/2000','1/1000','1/500','1/250','1/125','1/60','1/30','1/15','1/8','1/4','1/2','1"','2"','4"','8"','15"','30"'];
const ISO=[100,200,400,800,1600,3200,6400,12800];
const FOC=[18,24,35,50,85,135,200];
const ECV=[];for(let i=-9;i<=9;i++)ECV.push(i/3);
const EC0=9;
function ecLabel(v){if(Math.abs(v)<1e-6)return '0';const sg=v>0?'+':'−',a=Math.abs(v),i=Math.floor(a+1e-6),fr=Math.round((a-i)*3);return sg+(i?i:'')+(fr===1?'⅓':fr===2?'⅔':'')}
const tSpeak=i=>TL[i].includes('/')?TL[i]+' de segundo':TL[i].replace('"','')+(TL[i]==='1"'?' segundo':' segundos');
const WBL={auto:'Automático','5500':'Luz de día','6500':'Nublado','7500':'Sombra','3200':'Tungsteno','4000':'Fluorescente'};
const fmtS=s=>{const r=Math.round(s);const v=Math.abs(s-r)<.2?r:Math.round(s*10)/10;return v===0?'0':(v>0?'+':'−')+Math.abs(v)};
const DEF={scene:'sol',mode:'M',fi:4,ti:2,ii:0,foc:3,ec:EC0,wb:'auto',focus:.5,tripod:false,pan:false};
const newS=o=>Object.assign({},DEF,o||{});

/* ===================== escenas ===================== */
// ev: luz de la escena (EV a ISO 100) · K: temperatura de color · bias: error del fotómetro · vel: movimiento del sujeto (px/s)
const SC={
 sol:{name:'☀️ Día soleado',ev:15,hz:.58,K:5500,subj:'ciclista',vel:[600,0],pan:true,sky0:'#3d8fe0',sky1:'#c4e5ff',sun:'#fff7cf',sunX:.83,sunY:.12,sunR:26,mtn1:'#8fabc6',mtn2:'#6e9a68',g0:'#7cc35a',g1:'#4f9a3a',road:'#7f8186',line:'#f5f5f5',tree:'#3c7c36',plant:'#3f8f2f',fl:['#ff5a5f','#ffd23f','#ffffff']},
 nublado:{name:'☁️ Día nublado',ev:12,hz:.58,K:6500,subj:'ciclista',vel:[600,0],pan:true,sky0:'#8f9aa7',sky1:'#d3d9df',clouds:true,mtn1:'#8e99a4',mtn2:'#6c7e66',g0:'#6f9a5c',g1:'#4c7442',road:'#6d7075',line:'#dcdcdc',tree:'#3b5d37',plant:'#3c6c31',fl:['#e25a5e','#e9c440','#f0f0f0']},
 anochecer:{name:'🌇 Anochecer',ev:9,hz:.58,K:3500,subj:'ciclista',vel:[600,0],pan:true,glow:true,glowGain:2.5,sky0:'#25336a',sky1:'#f39a5c',sun:'#ffb46c',sunX:.2,sunY:.55,sunR:30,mtn1:'#45395e',mtn2:'#2e2c43',g0:'#3b4a36',g1:'#232e1f',road:'#3e4046',line:'#c9c2b0',tree:'#1f291c',lamps:true,plant:'#2b3b23',fl:['#b8484c','#c79f37','#cfcfcf']},
 velodromo:{name:'🏟️ Velódromo cubierto',ev:8,hz:.52,K:4000,subj:'ciclista',vel:[600,0],pan:true,indoor:true,plant:'#555',fl:[]},
 noche:{name:'🌙 Calle de noche',ev:4,hz:.58,K:3000,subj:'ciclista',vel:[600,0],pan:true,glow:true,glowGain:3,sky0:'#04060d',sky1:'#1a2443',stars:true,sun:'#f1f1e4',sunX:.78,sunY:.13,sunR:17,city:true,g0:'#1e242a',g1:'#11151a',road:'#26292f',line:'#8d8a80',lamps:true,plant:'#1c2b1d',fl:['#7a3a3d','#80703a','#8a8a8a']},
 cascada:{name:'💧 Cascada en el bosque',ev:12,hz:.8,K:6500,subj:'cascada',vel:[0,700],pan:false,plant:'#2f5a2a',fl:[]},
 retrato:{name:'✨ Retrato con luces',ev:8,hz:.62,K:3600,subj:'retrato',vel:[0,0],pan:false,lights:true,plant:'#1d2a1c',fl:[]},
 nieve:{name:'❄️ Pista de nieve',ev:16,hz:.55,K:6000,bias:1.7,subj:'esquiador',vel:[450,0],pan:true,plant:'#24402c',fl:[]},
 autovia:{name:'🚗 Autovía de noche',ev:3,hz:.55,K:3000,subj:'coches',vel:[900,0],pan:false,glow:true,glowGain:7,plant:'#1a221a',fl:[]}
};

/* ---------- fondo (lienzo grande para poder hacer zoom) ---------- */
function bgOutdoor(c,P,E){
  const {x0,x1,y0,y1,hz}=E,ww=x1-x0;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,P.sky0);g.addColorStop(1,P.sky1);
  c.fillStyle=g;c.fillRect(x0,y0,ww,hz-y0+2);
  if(P.stars){const r=rng(7);c.fillStyle='#fff';for(let i=0;i<320;i++){c.globalAlpha=.25+r()*.75;const s=r()<.1?2:1.2;c.fillRect(x0+r()*ww,y0+r()*(hz*.85-y0),s,s)}c.globalAlpha=1}
  if(P.sun){const x=P.sunX*W,y=P.sunY*H;const rg=c.createRadialGradient(x,y,0,x,y,P.sunR*4);rg.addColorStop(0,P.sun);rg.addColorStop(.25,P.sun+'88');rg.addColorStop(1,P.sun+'00');c.fillStyle=rg;c.beginPath();c.arc(x,y,P.sunR*4,0,7);c.fill();c.fillStyle=P.sun;c.beginPath();c.arc(x,y,P.sunR,0,7);c.fill()}
  if(P.clouds){const r=rng(11);for(let i=0;i<22;i++){const x=x0+r()*ww,y=y0+40+r()*(hz*.55-y0),s=40+r()*70;c.fillStyle=`rgba(240,243,246,${.45+r()*.3})`;for(let j=0;j<5;j++){c.beginPath();c.ellipse(x+(j-2)*s*.45,y+Math.sin(j*1.7)*s*.12,s*.5,s*.28,0,0,7);c.fill()}}}
  c.fillStyle=P.g0;c.fillRect(x0,hz,ww,y1-hz);
  if(P.mtn1){let r=rng(3);c.fillStyle=P.mtn1;c.beginPath();c.moveTo(x0,hz);let y=hz-80;for(let x=x0;x<=x1+40;x+=45){y=Math.max(hz-170,Math.min(hz-40,y+(r()-.5)*70));c.lineTo(x,y)}c.lineTo(x1,hz);c.fill();
    r=rng(5);c.fillStyle=P.mtn2;c.beginPath();c.moveTo(x0,hz);y=hz-30;for(let x=x0;x<=x1+40;x+=30){y=Math.max(hz-70,Math.min(hz-10,y+(r()-.5)*30));c.lineTo(x,y)}c.lineTo(x1,hz);c.fill()}
  if(P.city){const r=rng(9);let x=x0-10;while(x<x1){const w=40+r()*60,h=60+r()*160;c.fillStyle=r()<.5?'#0d1220':'#131a2b';c.fillRect(x,hz-h,w,h+2);for(let wy=hz-h+10;wy<hz-8;wy+=14)for(let wx=x+6;wx<x+w-8;wx+=11){if(r()<.42){c.fillStyle=r()<.8?'#ffd98a':'#bfe3ff';c.fillRect(wx,wy,5,7)}}x+=w+2}}
  if(!P.city&&P.tree){const r=rng(13);for(let i=0;i<60;i++){const x=x0+r()*ww,s=10+r()*16,y=hz+4+r()*12;c.fillStyle=P.tree;c.beginPath();c.ellipse(x,y-s,s*.7,s,0,0,7);c.fill();c.fillRect(x-1.5,y-s*.2,3,s*.5)}}
}
function bgVelodromo(c,P,E){
  const {x0,x1,y0,y1,hz}=E,ww=x1-x0;
  c.fillStyle='#1d1b1b';c.fillRect(x0,y0,ww,hz-y0);
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#2d2a2a');g.addColorStop(1,'#7c6c55');c.fillStyle=g;c.fillRect(x0,0,ww,hz);
  c.strokeStyle='rgba(20,20,20,.7)';c.lineWidth=3;for(let x=x0-40;x<x1+40;x+=60){c.beginPath();c.moveTo(x,0);c.lineTo(x+30,60);c.lineTo(x+60,0);c.stroke()}
  c.beginPath();c.moveTo(x0,60);c.lineTo(x1,60);c.stroke();
  for(let x=x0+50;x<x1;x+=120){const rg=c.createRadialGradient(x,72,0,x,72,50);rg.addColorStop(0,'rgba(255,250,230,1)');rg.addColorStop(.2,'rgba(255,245,220,.6)');rg.addColorStop(1,'rgba(255,245,220,0)');c.fillStyle=rg;c.beginPath();c.arc(x,72,50,0,7);c.fill();c.fillStyle='#fff';c.fillRect(x-14,68,28,7)}
  const r=rng(21);c.fillStyle='#3c3a40';c.fillRect(x0,110,ww,hz-110);
  for(let y=118;y<hz-4;y+=11)for(let x=x0+4;x<x1;x+=9){if(r()<.75){c.fillStyle=['#c44','#36c','#eee','#ec3','#3a5','#222','#d8a'][Math.floor(r()*7)];c.beginPath();c.arc(x+r()*3,y,3.2,0,7);c.fill()}}
  c.fillStyle='#e6e1d6';c.fillRect(x0,hz-6,ww,8);
  c.fillStyle='#a5703d';c.fillRect(x0,hz+2,ww,y1-hz);
}
function bgCascada(c,P,E){
  const {x0,x1,y0,y1,hz}=E,ww=x1-x0;
  let g=c.createLinearGradient(0,0,0,H*.4);g.addColorStop(0,'#cfe3e8');g.addColorStop(1,'#9fc0b5');c.fillStyle=g;c.fillRect(x0,y0,ww,hz-y0);
  const r=rng(51);
  for(let layer=0;layer<3;layer++){const col=['#6f9a84','#4b7a5c','#2f5a3d'][layer];c.fillStyle=col;
    for(let i=0;i<90;i++){const x=x0+r()*ww,y=H*(.05+layer*.12)+r()*H*.25,s=30+r()*50;c.beginPath();c.ellipse(x,y,s,s*1.2,0,0,7);c.fill()}}
  c.fillStyle='#24452e';c.fillRect(x0,H*.5,ww,y1-H*.5);
}
function bgRetrato(c,P,E){
  const {x0,x1,y0,y1,hz}=E,ww=x1-x0;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#1c2142');g.addColorStop(.7,'#7a5277');g.addColorStop(1,'#d0866a');c.fillStyle=g;c.fillRect(x0,y0,ww,hz-y0+2);
  const r=rng(61);c.fillStyle='#141a1d';
  for(let i=0;i<70;i++){const x=x0+r()*ww,s=40+r()*70,y=hz-10-r()*40;c.beginPath();c.ellipse(x,y-s*.6,s*.8,s,0,0,7);c.fill()}
  c.fillRect(x0,hz-20,ww,y1-hz+20);
  // farolas lejanas
  for(let x=x0+80;x<x1;x+=260){c.fillStyle='#0d1012';c.fillRect(x,hz-150,4,150)}
  // guirnaldas de luces (se dibujan aparte, con su desenfoque «bokeh»)
  const L=[];const cols=['#ffd27a','#ffb35c','#fff1c9','#ffc46b','#ff9a6b'];
  for(let k=0;k<3;k++){const ya=hz-210+k*55,sag=40+k*12;for(let seg=x0;seg<x1;seg+=240){for(let u=0;u<=1;u+=1/11){const x=seg+u*240,y=ya+sag*4*u*(1-u)*1+Math.sin(seg)*6;L.push([x,y,cols[(L.length*7)%cols.length]])}}}
  P._lights=L;
}
function bgNieve(c,P,E){
  const {x0,x1,y0,y1,hz}=E,ww=x1-x0;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#2a66cf');g.addColorStop(1,'#b9d8f6');c.fillStyle=g;c.fillRect(x0,y0,ww,hz-y0+2);
  const x=.8*W,y=.13*H,rg=c.createRadialGradient(x,y,0,x,y,110);rg.addColorStop(0,'#fffef6');rg.addColorStop(.2,'#fffbe0aa');rg.addColorStop(1,'#fffbe000');c.fillStyle=rg;c.beginPath();c.arc(x,y,110,0,7);c.fill();
  let r=rng(71);
  const peaks=[];let px=x0-40;while(px<x1+60){peaks.push([px,hz-120-r()*170]);px+=120+r()*160}
  for(const [mx,my] of peaks){const w=170+r()*120;c.fillStyle='#f7fbff';c.beginPath();c.moveTo(mx-w,hz);c.lineTo(mx,my);c.lineTo(mx+w,hz);c.fill();
    c.fillStyle='#bcd2ea';c.beginPath();c.moveTo(mx,my);c.lineTo(mx+w,hz);c.lineTo(mx+w*.25,hz);c.fill()}
  c.fillStyle='#eef4fb';c.fillRect(x0,hz-2,ww,y1-hz+2);
  r=rng(73);for(let i=0;i<70;i++){const tx=x0+r()*ww,s=12+r()*16,ty=hz+2+r()*8;c.fillStyle='#21402b';c.beginPath();c.moveTo(tx,ty-s*2.4);c.lineTo(tx+s*.7,ty);c.lineTo(tx-s*.7,ty);c.fill();c.fillStyle='#f4f8fc';c.beginPath();c.moveTo(tx,ty-s*2.4);c.lineTo(tx+s*.3,ty-s*1.5);c.lineTo(tx-s*.3,ty-s*1.5);c.fill()}
}
function bgAutovia(c,P,E){
  const {x0,x1,y0,y1,hz}=E,ww=x1-x0;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#05070f');g.addColorStop(1,'#232a48');c.fillStyle=g;c.fillRect(x0,y0,ww,hz-y0+2);
  let r=rng(81);c.fillStyle='#fff';for(let i=0;i<200;i++){c.globalAlpha=.2+r()*.6;c.fillRect(x0+r()*ww,y0+r()*(hz*.7-y0),1.3,1.3)}c.globalAlpha=1;
  r=rng(83);let x=x0;while(x<x1){const w=30+r()*50,h=30+r()*110;c.fillStyle='#0b0f1a';c.fillRect(x,hz-h,w,h+2);for(let wy=hz-h+8;wy<hz-6;wy+=10)for(let wx=x+4;wx<x+w-5;wx+=8){if(r()<.35){c.fillStyle=r()<.85?'#ffcf7a':'#cfe6ff';c.fillRect(wx,wy,3,5)}}x+=w+3}
  c.fillStyle='#101318';c.fillRect(x0,hz,ww,y1-hz);
}

/* ---------- suelo (a la distancia del sujeto) ---------- */
function groundRoad(c,P,hz){
  const g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,P.g0);g.addColorStop(1,P.g1);c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  c.fillStyle=P.road;c.fillRect(0,H*.72,W,H*.18);c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,H*.72,W,4);
  c.fillStyle=P.line;for(let x=10;x<W;x+=70)c.fillRect(x,H*.81-2,38,4);
  if(P.lamps)lamps(c,H*.42,H*.72,[60,270,480,690]);
}
function lamps(c,top,base,xs){for(const x of xs){c.fillStyle='#15171c';c.fillRect(x-2,top,4,base-top);c.fillRect(x-2,top,22,3);
  const lx=x+20,ly=top+6;let rg=c.createRadialGradient(lx,ly,0,lx,ly,70);rg.addColorStop(0,'rgba(255,214,140,.95)');rg.addColorStop(.15,'rgba(255,200,120,.5)');rg.addColorStop(1,'rgba(255,190,110,0)');c.fillStyle=rg;c.beginPath();c.arc(lx,ly,70,0,7);c.fill();
  rg=c.createRadialGradient(lx,base+H*.08,0,lx,base+H*.08,110);rg.addColorStop(0,'rgba(255,200,120,.35)');rg.addColorStop(1,'rgba(255,200,120,0)');c.fillStyle=rg;c.beginPath();c.ellipse(lx,base+H*.08,120,30,0,0,7);c.fill()}}
function groundVelodromo(c,P,hz){
  c.fillStyle='#16a';c.fillRect(0,hz+2,W,6);
  const g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,'#a5703d');g.addColorStop(1,'#d39a5c');c.fillStyle=g;c.fillRect(0,hz+8,W,H-hz-8);
  c.strokeStyle='rgba(80,45,20,.25)';c.lineWidth=1;for(let y=hz+16;y<H;y+=9){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
  c.fillStyle='#1b6fd1';c.fillRect(0,H*.9,W,10);c.fillStyle='#111';c.fillRect(0,H*.86,W,4);c.fillStyle='#d22';c.fillRect(0,H*.76,W,3);
}
function groundCascada(c,P,hz){
  const r=rng(91);
  const rock=(pts,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))c.lineTo(p[0],p[1]);c.closePath();c.fill()};
  rock([[0,H*.1],[W*.2,H*.06],[W*.42,H*.14],[W*.43,H*.82],[0,H*.86]],'#4a463f');
  rock([[W*.57,H*.13],[W*.8,H*.04],[W,H*.1],[W,H*.86],[W*.57,H*.82]],'#433f39');
  c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=3;for(let i=0;i<40;i++){const x=r()<.5?r()*W*.42:W*.58+r()*W*.42,y=H*.12+r()*H*.65;c.beginPath();c.moveTo(x,y);c.lineTo(x+(r()-.5)*60,y+20+r()*30);c.stroke()}
  c.fillStyle='rgba(70,120,60,.75)';for(let i=0;i<60;i++){const x=r()<.5?r()*W*.4:W*.6+r()*W*.4,y=H*.08+r()*H*.7;c.beginPath();c.ellipse(x,y,8+r()*14,5+r()*8,0,0,7);c.fill()}
  const g=c.createLinearGradient(0,hz-8,0,H);g.addColorStop(0,'#5d8c8a');g.addColorStop(1,'#20403f');c.fillStyle=g;c.fillRect(0,hz-8,W,H-hz+8);
  c.strokeStyle='rgba(220,240,240,.25)';c.lineWidth=2;for(let i=0;i<40;i++){const x=r()*W,y=hz+r()*(H-hz),w=20+r()*50;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+w/2,y-3,x+w,y);c.stroke()}
}
function groundRetrato(c,P,hz){const g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,'#232a20');g.addColorStop(1,'#141812');c.fillStyle=g;c.fillRect(0,hz,W,H-hz)}
function groundNieve(c,P,hz){
  const g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,'#f2f6fb');g.addColorStop(1,'#dde7f2');c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  c.strokeStyle='rgba(150,175,205,.45)';c.lineWidth=2;const r=rng(95);for(let i=0;i<26;i++){const y=hz+20+r()*(H-hz-20);c.beginPath();c.moveTo(0,y);c.bezierCurveTo(W*.3,y+(r()-.5)*30,W*.6,y+(r()-.5)*30,W,y+(r()-.5)*20);c.stroke()}
}
function groundAutovia(c,P,hz){
  c.fillStyle='#15181d';c.fillRect(0,hz,W,H-hz);
  c.fillStyle='#2a2d33';c.fillRect(0,H*.66,W,H*.26);
  c.fillStyle='#d8d4c8';c.fillRect(0,H*.66,W,3);c.fillRect(0,H*.92-3,W,3);
  c.fillStyle='#bdb8aa';for(let x=0;x<W;x+=60){c.fillRect(x,H*.745,30,3);c.fillRect(x+20,H*.835,30,3)}
  c.fillStyle='#6b6f78';c.fillRect(0,H*.62,W,6);for(let x=10;x<W;x+=40)c.fillRect(x,H*.62,4,22);
  lamps(c,H*.3,H*.62,[110,400,690]);
}

/* ---------- sujetos ---------- */
function drawCiclista(c,g,P,night){
  const cx=W*.48,gy=H*.85;
  c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(cx,gy+2,95,9,0,0,7);c.fill();
  const R=[cx-48,gy-33],Fh=[cx+50,gy-33],B=[cx-4,gy-30],S=[cx-22,gy-84],Hd=[cx+30,gy-86];
  c.lineCap='round';c.lineJoin='round';
  for(const w of [R,Fh]){c.strokeStyle='#15151a';c.lineWidth=5;c.beginPath();c.arc(w[0],w[1],32,0,7);c.stroke();c.strokeStyle='rgba(200,200,210,.7)';c.lineWidth=1;for(let a=0;a<6.28;a+=.52){c.beginPath();c.moveTo(w[0],w[1]);c.lineTo(w[0]+Math.cos(a)*30,w[1]+Math.sin(a)*30);c.stroke()}}
  c.strokeStyle='#d8262f';c.lineWidth=5;c.beginPath();c.moveTo(...R);c.lineTo(...B);c.lineTo(...S);c.closePath();c.moveTo(...S);c.lineTo(...Hd);c.lineTo(...B);c.moveTo(...Hd);c.lineTo(...Fh);c.stroke();
  c.strokeStyle='#222';c.lineWidth=4;c.beginPath();c.moveTo(Hd[0],Hd[1]);c.lineTo(cx+40,gy-96);c.lineTo(cx+46,gy-88);c.stroke();
  c.beginPath();c.moveTo(S[0]-8,S[1]-4);c.lineTo(S[0]+10,S[1]-4);c.stroke();
  const hip=[cx-18,gy-96],sh=[cx+16,gy-130];
  c.strokeStyle='#1d2b55';c.lineWidth=11;c.beginPath();c.moveTo(...hip);c.lineTo(cx-2,gy-62);c.lineTo(B[0]+6,B[1]+6);c.stroke();
  c.strokeStyle='#26386e';c.beginPath();c.moveTo(...hip);c.lineTo(cx+8,gy-70);c.lineTo(B[0]-6,B[1]+10);c.stroke();
  c.strokeStyle='#f2b705';c.lineWidth=17;c.beginPath();c.moveTo(...hip);c.lineTo(...sh);c.stroke();
  c.strokeStyle='#e9b38c';c.lineWidth=7;c.beginPath();c.moveTo(...sh);c.lineTo(cx+30,gy-108);c.lineTo(cx+42,gy-95);c.stroke();
  c.fillStyle='#e9b38c';c.beginPath();c.arc(cx+30,gy-144,11,0,7);c.fill();
  c.fillStyle='#d8262f';c.beginPath();c.ellipse(cx+26,gy-150,14,9,-.3,Math.PI,0);c.fill();
  if(night){let rg=g.createRadialGradient(cx+48,gy-90,0,cx+48,gy-90,18);rg.addColorStop(0,'rgba(255,255,240,1)');rg.addColorStop(.3,'rgba(255,255,230,.55)');rg.addColorStop(1,'rgba(255,255,230,0)');g.fillStyle=rg;g.beginPath();g.arc(cx+48,gy-90,18,0,7);g.fill();
    rg=g.createRadialGradient(cx-30,gy-86,0,cx-30,gy-86,11);rg.addColorStop(0,'rgba(255,40,40,1)');rg.addColorStop(1,'rgba(255,40,40,0)');g.fillStyle=rg;g.beginPath();g.arc(cx-30,gy-86,11,0,7);g.fill()}
}
function drawCascada(c){
  const r=rng(101),x0=W*.43,x1=W*.57,top=H*.13,bot=H*.8;
  c.fillStyle='rgba(215,232,240,.55)';c.beginPath();c.moveTo(x0,top);c.lineTo(x1,top);c.lineTo(x1+10,bot);c.lineTo(x0-10,bot);c.fill();
  c.lineCap='round';
  for(let i=0;i<260;i++){const x=x0-6+r()*(x1-x0+12);let y=top+r()*(bot-top)*.2;
    while(y<bot){const len=6+r()*26;c.strokeStyle=`rgba(${235+r()*20},${245+r()*10},255,${.5+r()*.5})`;c.lineWidth=1+r()*2.2;c.beginPath();c.moveTo(x+(r()-.5)*2,y);c.lineTo(x+(r()-.5)*3,y+len);c.stroke();y+=len+4+r()*22}}
  for(let i=0;i<180;i++){const a=r()*Math.PI,d=r()*70;c.fillStyle=`rgba(255,255,255,${.4+r()*.6})`;c.beginPath();c.arc(W*.5+Math.cos(a)*d*1.6,bot+4-Math.sin(a)*d*.5,1+r()*3,0,7);c.fill()}
  c.fillStyle='rgba(240,248,250,.7)';c.beginPath();c.ellipse(W*.5,bot+6,100,16,0,0,7);c.fill();
}
function drawRetrato(c){
  const cx=W*.44,hy=H*.42;
  c.fillStyle='#2b6f73';c.beginPath();c.moveTo(cx-170,H);c.quadraticCurveTo(cx-160,hy+120,cx-40,hy+105);c.lineTo(cx+40,hy+105);c.quadraticCurveTo(cx+160,hy+120,cx+170,H);c.fill();
  c.fillStyle='#235c60';c.beginPath();c.moveTo(cx-40,hy+105);c.lineTo(cx,hy+150);c.lineTo(cx+40,hy+105);c.fill();
  c.fillStyle='#d9a283';c.fillRect(cx-20,hy+50,40,62);
  c.fillStyle='#3a2418';c.beginPath();c.ellipse(cx-6,hy-8,62,72,0,0,7);c.fill();c.beginPath();c.ellipse(cx-34,hy+40,30,60,.2,0,7);c.fill();
  c.fillStyle='#e6ae8d';c.beginPath();c.ellipse(cx+6,hy+6,46,58,0,0,7);c.fill();
  c.fillStyle='#3a2418';c.beginPath();c.ellipse(cx-4,hy-40,56,28,-.15,Math.PI,0);c.fill();
  c.fillStyle='#2a1a12';c.beginPath();c.ellipse(cx+22,hy,5,3.5,0,0,7);c.fill();c.beginPath();c.ellipse(cx-6,hy,5,3.5,0,0,7);c.fill();
  c.strokeStyle='#b0715a';c.lineWidth=2.5;c.beginPath();c.moveTo(cx+16,hy+12);c.lineTo(cx+22,hy+24);c.lineTo(cx+14,hy+26);c.stroke();
  c.strokeStyle='#a4524a';c.lineWidth=3;c.beginPath();c.arc(cx+10,hy+30,12,.25,Math.PI-.4);c.stroke();
}
function drawEsquiador(c){
  const cx=W*.48,gy=H*.83;
  c.fillStyle='rgba(120,150,190,.35)';c.beginPath();c.ellipse(cx,gy+4,90,7,0,0,7);c.fill();
  const r=rng(111);for(let i=0;i<120;i++){c.fillStyle=`rgba(255,255,255,${.5+r()*.5})`;c.beginPath();c.arc(cx-70-r()*120,gy-r()*60*(1-r()*.5),1+r()*3.5,0,7);c.fill()}
  c.lineCap='round';c.strokeStyle='#1f2b3a';c.lineWidth=5;c.beginPath();c.moveTo(cx-80,gy);c.lineTo(cx+90,gy-6);c.stroke();
  c.strokeStyle='#222';c.lineWidth=12;c.beginPath();c.moveTo(cx-10,gy-6);c.lineTo(cx+18,gy-38);c.lineTo(cx-18,gy-62);c.stroke();
  c.beginPath();c.moveTo(cx+22,gy-6);c.lineTo(cx+34,gy-34);c.lineTo(cx-10,gy-60);c.stroke();
  c.strokeStyle='#d8262f';c.lineWidth=20;c.beginPath();c.moveTo(cx-16,gy-64);c.lineTo(cx+20,gy-100);c.stroke();
  c.lineWidth=7;c.beginPath();c.moveTo(cx+14,gy-96);c.lineTo(cx+44,gy-74);c.stroke();
  c.strokeStyle='#999';c.lineWidth=2;c.beginPath();c.moveTo(cx+44,gy-74);c.lineTo(cx+10,gy-2);c.stroke();
  c.fillStyle='#e9b38c';c.beginPath();c.arc(cx+34,gy-116,11,0,7);c.fill();
  c.fillStyle='#1a1a1a';c.beginPath();c.ellipse(cx+32,gy-122,14,10,-.3,Math.PI,0);c.fill();
  c.fillStyle='#ffb020';c.fillRect(cx+33,gy-121,13,6);
}
function drawCoches(c,g){
  const cars=[[W*.16,H*.79,'#2b3a55'],[W*.52,H*.88,'#5a2b2b'],[W*.8,H*.78,'#3a3f45']];
  for(const [x,y,col] of cars){
    c.fillStyle=col;c.beginPath();c.moveTo(x-70,y);c.lineTo(x-66,y-22);c.lineTo(x-38,y-26);c.lineTo(x-20,y-44);c.lineTo(x+30,y-44);c.lineTo(x+50,y-26);c.lineTo(x+72,y-20);c.lineTo(x+72,y);c.fill();
    c.fillStyle='rgba(150,180,210,.35)';c.beginPath();c.moveTo(x-16,y-40);c.lineTo(x+28,y-40);c.lineTo(x+44,y-26);c.lineTo(x-34,y-26);c.fill();
    c.fillStyle='#0c0c0e';c.beginPath();c.arc(x-40,y,11,0,7);c.arc(x+44,y,11,0,7);c.fill();
    let rg=g.createRadialGradient(x+72,y-14,0,x+72,y-14,26);rg.addColorStop(0,'rgba(255,252,235,1)');rg.addColorStop(.3,'rgba(255,240,200,.6)');rg.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=rg;g.beginPath();g.arc(x+72,y-14,26,0,7);g.fill();
    rg=g.createRadialGradient(x-70,y-16,0,x-70,y-16,16);rg.addColorStop(0,'rgba(255,40,30,1)');rg.addColorStop(1,'rgba(255,40,30,0)');g.fillStyle=rg;g.beginPath();g.arc(x-70,y-16,16,0,7);g.fill();
  }
}

/* ---------- primer plano ---------- */
function drawFG(c,P,key){
  const r=rng(31);
  if(key==='velodromo'){c.fillStyle='#2a2d33';c.fillRect(0,H*.93,W*.42,12);for(let x=10;x<W*.42;x+=70)c.fillRect(x,H*.93,8,H*.07);c.fillStyle='#555a63';c.fillRect(0,H*.93,W*.42,3);
    c.fillStyle='#c8102e';c.fillRect(W*.62,H*.9,W*.38,H*.1);c.fillStyle='#fff';c.font='bold 22px Inter,sans-serif';c.fillText('META',W*.72,H*.975);return}
  if(key==='nieve'){for(const [bx,dir] of [[-10,1],[W+10,-1]]){for(let i=0;i<5;i++){const y=H-30-i*28,len=110+r()*60;c.strokeStyle='#2a3b2a';c.lineWidth=5;c.beginPath();c.moveTo(bx,y);c.lineTo(bx+dir*len,y-12);c.stroke();
      for(let k=0;k<14;k++){const u=k/14,px=bx+dir*len*u,py=y-12*u;c.strokeStyle=P.plant;c.lineWidth=2.5;c.beginPath();c.moveTo(px,py);c.lineTo(px+dir*10,py+12);c.moveTo(px,py);c.lineTo(px+dir*10,py-10);c.stroke()}
      c.fillStyle='#f6f9fd';c.beginPath();c.ellipse(bx+dir*len*.5,y-14,len*.45,7,0,0,7);c.fill()}}return}
  if(key==='autovia'){c.fillStyle='#0d0f12';c.fillRect(0,H*.95,W,H*.05);for(let x=30;x<W;x+=150){c.fillStyle='#22252b';c.fillRect(x,H*.88,12,H*.12);c.fillStyle='#ff9d2e';c.fillRect(x,H*.895,12,6)}return}
  if(key==='retrato'){for(const [x0,x1] of [[-20,140],[600,W+20]])for(let i=0;i<26;i++){const x=x0+r()*(x1-x0),y=H-r()*140;c.fillStyle=r()<.5?'#1c2a1b':'#24361f';c.beginPath();c.ellipse(x,y,26+r()*30,12+r()*12,r()*3,0,7);c.fill()}return}
  if(key==='cascada'){for(const [x0,x1] of [[-10,170],[560,W+10]])for(let i=0;i<10;i++){const x=x0+r()*(x1-x0),y=H+10;c.strokeStyle=P.plant;c.lineWidth=3;const len=90+r()*80,ang=-Math.PI/2+(r()-.5)*1.2;const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x,y-len*.6,ex,ey);c.stroke();
      for(let k=1;k<12;k++){const u=k/12,px=x+(ex-x)*u,py=y+(ey-y)*u-Math.sin(u*3)*10;c.fillStyle='#3d7a34';c.beginPath();c.ellipse(px-10,py,12*(1-u*.6),4,-.5,0,7);c.ellipse(px+10,py,12*(1-u*.6),4,.5,0,7);c.fill()}}return}
  const patch=(x0,x1)=>{for(let i=0;i<70;i++){const x=x0+r()*(x1-x0),h=50+r()*110,lean=(r()-.5)*40;c.strokeStyle=P.plant;c.lineWidth=2+r()*3;c.beginPath();c.moveTo(x,H+5);c.quadraticCurveTo(x+lean*.3,H-h*.5,x+lean,H-h);c.stroke()}
    for(let i=0;i<14;i++){const x=x0+r()*(x1-x0),y=H-50-r()*95,s=6+r()*8;c.fillStyle=P.fl[i%P.fl.length];for(let k=0;k<5;k++){const a=k*1.256;c.beginPath();c.ellipse(x+Math.cos(a)*s,y+Math.sin(a)*s,s*.75,s*.45,a,0,7);c.fill()}c.fillStyle='#f6c032';c.beginPath();c.arc(x,y,s*.45,0,7);c.fill()}};
  patch(-10,200);patch(560,W+10);
}

/* ---------- capas (caché de las últimas escenas) ---------- */
const LC=new Map();
function layers(key){
  if(LC.has(key)){const v=LC.get(key);LC.delete(key);LC.set(key,v);return v}
  const P=SC[key],hz=P.hz*H,hzY=2*hz;
  const L={bg:mk(BGW,BGH),ground:mk(),subj:mk(),glow:mk(),fg:mk(),hzY};
  const b=L.bg.getContext('2d');b.translate(W/2,hzY-hz);
  const E={x0:-W/2,x1:1.5*W,y0:hz-hzY,y1:2*H-hz,hz};
  ({velodromo:bgVelodromo,cascada:bgCascada,retrato:bgRetrato,nieve:bgNieve,autovia:bgAutovia}[key]||bgOutdoor)(b,P,E);
  const g=L.ground.getContext('2d');
  ({velodromo:groundVelodromo,cascada:groundCascada,retrato:groundRetrato,nieve:groundNieve,autovia:groundAutovia}[key]||groundRoad)(g,P,hz);
  const s=L.subj.getContext('2d'),gl=L.glow.getContext('2d');
  if(P.subj==='ciclista')drawCiclista(s,gl,P,!!P.glow);
  else if(P.subj==='cascada')drawCascada(s);
  else if(P.subj==='retrato')drawRetrato(s);
  else if(P.subj==='esquiador')drawEsquiador(s);
  else if(P.subj==='coches')drawCoches(s,gl);
  drawFG(L.fg.getContext('2d'),P,key);
  LC.set(key,L);if(LC.size>3)LC.delete(LC.keys().next().value);
  return L;
}

/* ===================== simulación óptica ===================== */
const HAS_FILTER=(()=>{try{const c=mk(2,2).getContext('2d');if(typeof c.filter!=='string')return false;c.filter='blur(2px)';return c.filter==='blur(2px)'}catch(e){return false}})();
function blur(src,r){
  if(r<.45)return src;
  const w=src.width,h=src.height,out=mk(w,h),c=out.getContext('2d');
  if(HAS_FILTER){c.filter=`blur(${r.toFixed(2)}px)`;c.drawImage(src,0,0);c.filter='none';return out}
  const s=Math.max(1.01,r/1.1),sw=Math.max(2,Math.round(w/s)),sh=Math.max(2,Math.round(h/s));
  const sm=mk(sw,sh),sc=sm.getContext('2d');sc.imageSmoothingQuality='high';sc.drawImage(src,0,0,sw,sh);
  c.imageSmoothingQuality='high';c.drawImage(sm,0,0,w,h);return out;
}
function smear(src,dx,dy,gain){ // suma de copias desplazadas = movimiento durante la exposición
  const d=Math.hypot(dx,dy);if(d<.8)return src;
  const n=Math.min(56,Math.ceil(d/1.3))+1,out=mk(src.width,src.height),c=out.getContext('2d');
  c.globalCompositeOperation='lighter';c.globalAlpha=Math.min(1,(gain||1)/n);
  for(let i=0;i<n;i++){const u=i/(n-1)-.5;c.drawImage(src,dx*u,dy*u)}
  return out;
}
function overlayOn(base,top){const o=mk(),c=o.getContext('2d');c.drawImage(base,0,0);c.drawImage(top,0,0);return o}
function shakeImg(src,px){
  const n=Math.min(40,Math.ceil(px/1.2))+2,sh=mk(),s=sh.getContext('2d');s.globalCompositeOperation='lighter';s.globalAlpha=1/n;
  for(let i=0;i<n;i++){const u=i/(n-1);s.drawImage(src,px*(u-.5),px*.45*Math.sin(u*Math.PI*2.2))}
  return overlayOn(src,sh);
}

/* ===================== cálculo de la foto ===================== */
const meterOf=(S,fi,ti,ii)=>{const P=SC[S.scene];return P.ev+Math.log2(ISO[ii]/100)-Math.log2(F[fi]*F[fi]/T[ti])+(P.bias||0)};
function derive(S){
  const P=SC[S.scene],N=F[S.fi],t=T[S.ti],f=FOC[S.foc],iso=ISO[S.ii];
  const s=P.ev+Math.log2(iso/100)-Math.log2(N*N/t);
  const fk=Math.pow(f/50,.7),bl=d=>20*Math.abs(d-S.focus)*(1.4/N)*fk;
  const panning=!!(S.pan&&P.pan);
  const v=P.vel||[0,0],sp=Math.hypot(v[0],v[1]),disp=Math.min(W*.9,sp*t);
  const lim=panning?Math.max(1/f,1/15):1/f;
  const shake=(S.tripod||t<=lim+1e-9)?0:Math.min(40,(3+4*Math.log2(t/lim))*Math.sqrt(f/50));
  const setK=S.wb==='auto'?(P.K<3600?P.K+400:P.K):+S.wb,wbd=Math.log2(setK/P.K);
  return{N,t,f,iso,s,meter:s+(P.bias||0),ec:ECV[S.ec],bFg:bl(0),bSub:bl(.5),bBg:bl(1),bgScale:Math.pow(f/50,.6),
    disp,dx:sp?v[0]/sp*disp:0,dy:sp?v[1]/sp*disp:0,moving:sp>0,shake,panning,wbd,setK,tripod:S.tripod,focus:S.focus,scene:S.scene,mode:S.mode};
}
function bestT(S,fi,ii,target){let b=0,bd=1e9;T.forEach((_,i)=>{const d=Math.abs(meterOf(S,fi,i,ii)-target);if(d<bd-1e-9){bd=d;b=i}});return b}
function bestF(S,ti,ii,target){let b=0,bd=1e9;F.forEach((_,i)=>{const d=Math.abs(meterOf(S,i,ti,ii)-target);if(d<bd-1e-9){bd=d;b=i}});return b}
function applyMode(S){
  const tg=ECV[S.ec];
  if(S.mode==='A')S.ti=bestT(S,S.fi,S.ii,tg);
  else if(S.mode==='S')S.fi=bestF(S,S.ti,S.ii,tg);
  else if(S.mode==='P'){
    const maxT=S.tripod?30:1/FOC[S.foc],pref=[4,5,3,6,2,7,1,8,0];let done=false;
    for(const fi of pref){const ti=bestT(S,fi,S.ii,tg);if(Math.abs(meterOf(S,fi,ti,S.ii)-tg)<.5&&T[ti]<=maxT+1e-9){S.fi=fi;S.ti=ti;done=true;break}}
    if(!done){S.fi=0;S.ti=bestT(S,0,S.ii,tg)}
  }
}

/* ===================== render ===================== */
function renderTo(S,ctx,histoCv){
  const P=SC[S.scene],L=layers(S.scene),x=derive(S),hz=P.hz*H,s=x.bgScale;
  const back=mk(),c=back.getContext('2d');
  const ox=W/2-s*W,oy=hz-s*L.hzY;
  c.drawImage(blur(L.bg,x.bBg/s),ox,oy,BGW*s,BGH*s);
  if(P.lights&&P._lights){ // bokeh: cada luz desenfocada se convierte en un disco
    const r=Math.max(1.6,x.bBg*1.15);c.save();c.globalCompositeOperation='lighter';
    for(const [lx,ly,col] of P._lights){const X=ox+s*(lx-W/2+W),Y=oy+s*(ly-hz+L.hzY);if(X<-r||X>W+r||Y<-r||Y>H+r)continue;
      const a=Math.min(1,3.2/Math.max(1,r*.55));c.globalAlpha=a;c.fillStyle=col;c.beginPath();c.arc(X,Y,r,0,7);c.fill();
      if(r>5){c.globalAlpha=a*.5;c.strokeStyle='#fff';c.lineWidth=1.2;c.stroke()}}
    c.restore();
  }
  c.drawImage(blur(L.ground,x.bSub),0,0);
  const backF=(x.panning&&x.disp>.8)?overlayOn(back,smear(back,-x.dx,-x.dy)):back;
  const out=mk(),o=out.getContext('2d');o.drawImage(backF,0,0);
  const sub=blur(L.subj,x.bSub);
  o.drawImage(x.panning?sub:smear(sub,x.dx,x.dy),0,0);
  if(P.glow){const gl=blur(L.glow,x.bSub);o.save();o.globalCompositeOperation='lighter';o.drawImage(x.panning?gl:smear(gl,x.dx,x.dy,P.glowGain||5),0,0);o.restore()}
  o.drawImage(blur(L.fg,x.bFg),0,0);
  const fin=x.shake?shakeImg(out,x.shake):out;
  ctx.clearRect(0,0,W,H);ctx.drawImage(fin,0,0);
  // exposición + balance de blancos + ruido
  const img=ctx.getImageData(0,0,W,H),d=img.data,gn=Math.pow(2,x.s);
  const gR=Math.pow(2,.45*x.wbd),gB=Math.pow(2,-.45*x.wbd),gG=Math.pow(2,.06*x.wbd);
  const mkL=k=>{const l=new Uint8ClampedArray(256);for(let v=0;v<256;v++)l[v]=255*Math.pow(Math.min(1,Math.pow(v/255,2.2)*gn*k),1/2.2);return l};
  const lR=mkL(gR),lG=mkL(gG),lB=mkL(gB),amp=.6*S.ii*S.ii,hist=new Uint32Array(64);
  for(let i=0;i<d.length;i+=4){
    let r=lR[d[i]],g=lG[d[i+1]],b=lB[d[i+2]];
    if(amp>0){const k=amp*(1.15-(r+g+b)/1150),n=(Math.random()+Math.random()+Math.random()-1.5)*k*1.6;
      r+=n+(Math.random()-.5)*k*.7;g+=n+(Math.random()-.5)*k*.7;b+=n+(Math.random()-.5)*k*.7}
    d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255;
    if(histoCv&&!(i&28))hist[Math.min(63,(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2])>>2)]++;
  }
  ctx.putImageData(img,0,0);
  if(histoCv)drawHisto(histoCv,hist);
  return x;
}
function drawHisto(cv,h){
  const c=cv.getContext('2d'),w=cv.width,hh=cv.height;c.clearRect(0,0,w,hh);
  let mx=1;for(let i=1;i<63;i++)mx=Math.max(mx,h[i]);
  c.fillStyle='rgba(255,255,255,.85)';const bw=w/64;
  for(let i=0;i<64;i++){const v=Math.min(1,h[i]/mx)*(hh-6);c.fillRect(i*bw,hh-v,bw+.5,v)}
  const tot=h.reduce((a,b)=>a+b,0);
  if(h[63]/tot>.02){c.fillStyle='#ff6b6b';c.fillRect(w-4,0,4,hh)}
  if(h[0]/tot>.02){c.fillStyle='#6bb6ff';c.fillRect(0,0,4,hh)}
}

/* ===================== explicación ===================== */
function analysis(x){
  const a=[],s=x.s,P=SC[x.scene];
  if(P.bias&&s<-.5&&Math.abs(x.meter-(x.mode==='M'?0:x.ec))<.5)a.push(['bad',`<b>El fotómetro se engaña con la nieve</b>: marca correcto, pero la nieve sale gris (${fmtS(s)} pasos). Como ve la escena muy clara, la oscurece. Sube la compensación a +1⅔ o +2.`]);
  else if(Math.abs(s)<.5)a.push(['ok','<b>Exposición correcta.</b>'+(P.bias?' Has corregido el error del fotómetro: la nieve sale blanca.':'')]);
  else if(s>0)a.push(['bad',`<b>Sobreexpuesta (${fmtS(s)} pasos)</b>: entra demasiada luz y se queman las zonas claras. Cierra el diafragma (número mayor), usa una velocidad más rápida o baja el ISO.`]);
  else a.push(['bad',`<b>Subexpuesta (${fmtS(s)} pasos)</b>: falta luz. Abre el diafragma (número menor), usa una velocidad más lenta o sube el ISO.`]);
  if(x.mode!=='M'&&Math.abs(x.ec)>.1)a.push(['',`Compensación <b>${ecLabel(x.ec)}</b>: la cámara expone ${x.ec>0?'más clara':'más oscura'} de lo que mide el fotómetro.`]);
  const fn={0:'el primer plano',.5:'el sujeto',1:'el fondo'}[x.focus];
  const dof=x.bBg>=6||x.bFg>=6?`muy poca profundidad de campo: solo sale nítido ${fn}`:Math.max(x.bBg,x.bFg)<=1.3?'mucha profundidad de campo: casi todo sale nítido':'profundidad de campo media';
  a.push(['',`Con <b>f/${x.N}</b> y <b>${x.f} mm</b> hay ${dof}.`]);
  if(x.f>=135)a.push(['','<b>Teleobjetivo</b>: el fondo se ve grande y cercano («compresión») y se desenfoca más.']);
  else if(x.f<=24)a.push(['','<b>Gran angular</b>: cabe mucho más paisaje y el fondo se ve lejano y pequeño.']);
  if(P.subj==='cascada'){
    a.push(['',x.disp<4?'El agua sale <b>congelada</b> en gotas.':x.disp<40?'El agua empieza a verse <b>sedosa</b>.':'El agua sale <b>sedosa</b>, como seda o niebla.'])}
  else if(P.subj==='coches')a.push(['',x.disp<3?'Los coches salen <b>nítidos</b>.':x.disp<120?'Los coches salen <b>movidos</b> y los faros empiezan a dejar rastro.':'Los coches casi desaparecen y los faros dejan <b>estelas de luz</b>.']);
  else if(x.moving){
    if(x.panning)a.push(['',x.disp<6?'Barrido con velocidad rápida: apenas se nota. Usa 1/30 o 1/15.':'<b>Barrido</b>: sigues al sujeto, así que él sale nítido y el fondo se arrastra en líneas de velocidad.']);
    else a.push(['',x.disp<1.5?'El sujeto sale <b>congelado</b>.':x.disp<12?'El sujeto sale <b>ligeramente movido</b>.':'El sujeto deja una <b>estela</b> de movimiento.'])}
  if(x.shake)a.push(['bad',`<b>Trepidación</b>: a esa velocidad y con ${x.f} mm no puedes sujetar la cámara quieta. Regla práctica: a pulso, como mínimo 1/${x.f}${x.panning?' (en barrido, 1/15)':''}. O usa trípode.`]);
  if(x.iso>=3200)a.push(['bad',`<b>ISO ${x.iso}</b>: aparece ruido (grano de colores), sobre todo en las sombras.`]);
  else if(x.iso>=800)a.push(['',`ISO ${x.iso}: algo de ruido, aún aceptable.`]);
  if(Math.abs(x.wbd)>.15)a.push(['bad',`<b>Balance de blancos</b> mal ajustado para esta luz: la foto sale ${x.wbd>0?'anaranjada (cálida)':'azulada (fría)'}. Elige el ajuste que corresponde a la luz${x.wbd>0?' o uno más bajo':' o uno más alto'}.`]);
  return a;
}

/* ===================== cámara (estado y controles) ===================== */
const st=newS({ch:null,allow:null});
const cv=$('#cam'),cx=cv.getContext('2d');
let raf=0;function req(){if(!raf)raf=requestAnimationFrame(()=>{raf=0;render()})}
let lastX=null;
function render(){lastX=renderTo(st,cx,$('#histoOn').checked?$('#histo'):null);updateUI(lastX)}
const MODEHELP={M:'<b>Manual</b>: tú eliges apertura, velocidad e ISO. Control total.',A:'<b>Prioridad a la apertura</b> (A / Av): tú eliges el diafragma y la cámara calcula la velocidad.',S:'<b>Prioridad a la velocidad</b> (S / Tv): tú eliges la velocidad y la cámara calcula el diafragma.',P:'<b>Programa</b>: la cámara elige apertura y velocidad (a pulso, intenta no bajar de 1/focal). Tú eliges el ISO.'};
const can=k=>!st.allow||st.allow.includes(k);
function updateUI(x){
  $('#rF').value=st.fi;$('#rT').value=st.ti;$('#rI').value=st.ii;$('#rFoc').value=st.foc;$('#rEC').value=st.ec;$('#wb').value=st.wb;
  const aF=st.mode==='S'||st.mode==='P',aT=st.mode==='A'||st.mode==='P';
  $('#rF').disabled=aF||!can('F');$('#rT').disabled=aT||!can('T');$('#rI').disabled=!can('I');$('#rFoc').disabled=!can('foc');
  $('#rEC').disabled=st.mode==='M'||!can('ec');$('#wb').disabled=!can('wb');
  $('#tripod').disabled=!can('tri');$('#swTri').classList.toggle('off',!can('tri'));
  const pOK=SC[st.scene].pan&&can('pan');$('#pan').disabled=!pOK;$('#swPan').classList.toggle('off',!pOK);
  $$('#modes button').forEach(b=>{const on=b.dataset.m===st.mode;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.disabled=!can('M')&&!on});
  $$('#focus button').forEach(b=>{const on=+b.dataset.f===st.focus;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.disabled=!can('focus')&&!on});
  $('#vF').innerHTML='f/'+x.N+(aF?'<span class="auto">AUTO</span>':'');
  $('#vT').innerHTML=TL[st.ti]+(aT?'<span class="auto">AUTO</span>':'');
  $('#vI').textContent=x.iso;$('#vFoc').textContent=x.f+' mm';$('#vEC').textContent=st.mode==='M'?'— (en M no se usa)':ecLabel(x.ec);
  $('#rF').setAttribute('aria-valuetext','f/'+x.N+(aF?', automático':''));
  $('#rT').setAttribute('aria-valuetext',tSpeak(st.ti)+(aT?', automático':''));
  $('#rI').setAttribute('aria-valuetext','ISO '+x.iso);$('#rFoc').setAttribute('aria-valuetext',x.f+' milímetros');
  $('#rEC').setAttribute('aria-valuetext',ecLabel(x.ec).replace('−','menos ').replace('+','más ')+' pasos');
  $('#hT').textContent=TL[st.ti];$('#hTa').textContent=aT?'A':'';$('#hF').textContent='f/'+x.N;$('#hFa').textContent=aF?'A':'';$('#hI').textContent=x.iso;
  $('#hFoc').textContent=x.f+'mm';$('#hEC').textContent=st.mode!=='M'&&Math.abs(x.ec)>.1?'±'+ecLabel(x.ec):'';
  const mv=x.meter; // el fotómetro: 0 = lo que la cámara considera correcto
  $('#mk').style.left=((Math.max(-3,Math.min(3,mv))+3)/6*100)+'%';$('#mk').classList.toggle('out',Math.abs(mv)>3);
  const oor=$('#oor');oor.style.display=Math.abs(mv)>3?'block':'none';oor.textContent=mv>0?'+3 o más':'−3 o menos';oor.style.left=mv>0?'auto':'0';oor.style.right=mv>0?'0':'auto';
  $('#badge').textContent=st.mode+' · '+SC[st.scene].name.replace(/^\S+\s/,'');
  $('#warn').style.display=x.shake?'block':'none';
  $('#histo').style.display=$('#histoOn').checked?'block':'none';
  $('#modehelp').innerHTML=MODEHELP[st.mode];
  $('#scene').value=st.scene;$('#scene').disabled=st.ch!==null;$('#tripod').checked=st.tripod;$('#pan').checked=st.pan;
  const an=analysis(x);$('#why').innerHTML=an.map(([c,t])=>`<li class="${c}">${t}</li>`).join('');
  cv.setAttribute('aria-label',`Foto simulada. ${SC[st.scene].name.replace(/^\S+\s/,'')}, ${TL[st.ti]}, f/${x.N}, ISO ${x.iso}, ${x.f} milímetros. `+an.map(a=>a[1].replace(/<[^>]+>/g,'')).join(' '));
}
$('#scene').innerHTML=Object.entries(SC).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('');
const onCtl=fn=>e=>{fn(e);applyMode(st);req()};
$('#rF').oninput=onCtl(e=>st.fi=+e.target.value);
$('#rT').oninput=onCtl(e=>st.ti=+e.target.value);
$('#rI').oninput=onCtl(e=>st.ii=+e.target.value);
$('#rFoc').oninput=onCtl(e=>st.foc=+e.target.value);
$('#rEC').oninput=onCtl(e=>st.ec=+e.target.value);
$('#wb').onchange=onCtl(e=>st.wb=e.target.value);
$('#scene').onchange=onCtl(e=>{st.scene=e.target.value;if(!SC[st.scene].pan)st.pan=false});
$('#tripod').onchange=onCtl(e=>st.tripod=e.target.checked);
$('#pan').onchange=onCtl(e=>st.pan=e.target.checked);
$('#histoOn').onchange=()=>{store.set('fotolab-histo',$('#histoOn').checked);req()};
$('#histoOn').checked=store.get('fotolab-histo',false);
$$('#modes button').forEach(b=>b.onclick=()=>{st.mode=b.dataset.m;applyMode(st);req()});
$$('#focus button').forEach(b=>b.onclick=()=>{st.focus=+b.dataset.f;req()});
if(matchMedia('(max-width:899px)').matches)$('#adv').open=false;

/* ===================== ventanas emergentes y navegación ===================== */
let lastFocus=null;
function modal(html){lastFocus=document.activeElement;$('#mbox').innerHTML=html;const h=$('#mbox h3');if(h)h.id='mtitle';$('#modal').classList.add('on');$$('#mbox [data-close]').forEach(b=>b.onclick=closeModal);const f=$('#mbox .acts .btn.pri')||$('#mbox button');if(f)f.focus()}
function closeModal(){$('#modal').classList.remove('on');if(lastFocus&&lastFocus.focus)lastFocus.focus()}
$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
document.addEventListener('keydown',e=>{if(!$('#modal').classList.contains('on'))return;if(e.key==='Escape')closeModal();
  if(e.key==='Tab'){const fs=$$('#mbox button');if(!fs.length)return;const a=fs[0],z=fs[fs.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
function flash(){if(RM())return;const f=$('#flash');f.classList.remove('go');void f.offsetWidth;f.classList.add('go')}
const onShow={};
function show(v){$$('.view').forEach(s=>s.classList.toggle('active',s.id==='v-'+v));
  $$('nav.tabs button').forEach(b=>{const on=b.dataset.v===v;b.classList.toggle('on',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  const g=$(`#v-${v} .seg.sub`);if(g){const cur=g.querySelector('button.on')||g.querySelector('button');showPanel(g.dataset.group,cur.dataset.p)}
  if(onShow[v])onShow[v]()}
function showPanel(group,p){const g=$(`.seg.sub[data-group="${group}"]`);
  g.querySelectorAll('button').forEach(b=>{const on=b.dataset.p===p;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  $$(`.panel[data-panel^="${group}-"]`).forEach(x=>x.classList.toggle('active',x.dataset.panel===group+'-'+p));
  if(onShow[group+'-'+p])onShow[group+'-'+p]()}
$$('.seg.sub').forEach(g=>g.querySelectorAll('button').forEach(b=>b.onclick=()=>showPanel(g.dataset.group,b.dataset.p)));
$$('nav.tabs button').forEach(b=>b.onclick=()=>{show(b.dataset.v);window.scrollTo({top:0})});
function goCamera(o){exitReto(true);Object.assign(st,newS(),{ch:null,allow:null},o||{});applyMode(st);show('camara');req();window.scrollTo({top:0,behavior:RM()?'auto':'smooth'})}
