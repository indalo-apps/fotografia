/* FotoLab · teoría, glosario, historia, test, novedades y arranque
   © 2026 Adela Moreno Vega y Carlos Moreno Otto. Todos los derechos reservados. */
'use strict';

/* ===================== teoría ===================== */
const TEO=[
 ['La exposición'],
 ['📐','El triángulo de exposición',`<p>Una foto está bien expuesta cuando al sensor le llega la cantidad justa de luz. Depende de <b>tres ajustes</b>: la <b>apertura</b> (cuánta luz entra a la vez), la <b>velocidad</b> (durante cuánto tiempo) y el <b>ISO</b> (cuánto se amplifica la señal).</p><p>Cada uno tiene además un <b>efecto secundario</b>: la apertura cambia la profundidad de campo, la velocidad decide si el movimiento sale congelado o movido, y el ISO añade ruido. Elegir la combinación es lo que hace el fotógrafo.</p>`],
 ['🪜','El «paso» de luz',`<p>Un <b>paso</b> (o EV) es doblar o reducir a la mitad la luz. Los tres ajustes se miden en pasos, así que se pueden <b>compensar</b>:</p><div class="k">1/250 · f/8 · ISO 100 = 1/500 · f/5.6 · ISO 100 = 1/500 · f/8 · ISO 200</div><p>Si ganas un paso con un ajuste y lo pierdes con otro, la foto sale igual de clara, pero con distinto efecto.</p>`,()=>goCamera({scene:'nublado',mode:'A',fi:5})],
 ['⭕','Apertura o diafragma',`<p>Es el agujero del objetivo por el que entra la luz. Se indica con el <b>número f</b>, que funciona «al revés»: <b>número pequeño = agujero grande</b>.</p><div class="k">f/1.4 · f/2 · f/2.8 · f/4 · f/5.6 · f/8 · f/11 · f/16 · f/22</div><p>Cada salto de la escala es <b>un paso</b>: de f/4 a f/5.6 entra la mitad de luz.</p>`,()=>goCamera({scene:'retrato',mode:'A',fi:0})],
 ['🎯','Profundidad de campo',`<p>Es la zona de la foto que sale nítida por delante y por detrás del punto enfocado.</p><p><b>Diafragma abierto</b> (f/1.4–f/2.8): poca profundidad, fondo borroso, ideal para retratos. <b>Cerrado</b> (f/11–f/22): casi todo nítido, ideal para paisajes.</p><p>También influyen la focal (con teleobjetivo hay menos) y la distancia (cuanto más cerca del sujeto, menos).</p>`,()=>goCamera({scene:'sol',mode:'A',fi:0,focus:0})],
 ['⏱️','Velocidad de obturación',`<p>Es el tiempo que el obturador está abierto.</p><div class="k">1/4000 · 1/1000 · 1/250 · 1/60 · 1/15 · 1/2 · 1" · 30"</div><p><b>Rápida</b> (1/500 o más): congela el movimiento. <b>Lenta</b> (1/30 o menos): el movimiento deja estela… y sin trípode toda la foto sale movida (<b>trepidación</b>).</p>`,()=>goCamera({scene:'cascada',mode:'S',ti:9,tripod:true})],
 ['🌫️','ISO',`<p>Es la sensibilidad del sensor. <b>Doblar el ISO</b> (100 → 200) es ganar <b>un paso</b> de luz sin tocar apertura ni velocidad.</p><p>El precio es el <b>ruido</b>: puntitos de color y pérdida de detalle, sobre todo en las sombras. Por eso se usa el ISO más bajo posible.</p>`,()=>goCamera({scene:'noche',mode:'S',ti:6,ii:6})],
 ['📊','El fotómetro y la nieve',`<p>La cámara mide la luz y la compara con un «gris medio»: <b>0</b> es lo que considera correcto, <b>−</b> más oscuro y <b>+</b> más claro.</p><p>Por eso <b>se engaña</b> con escenas muy blancas (nieve, playa): las oscurece y salen grises. Y con escenas muy oscuras, las aclara. La solución es la compensación de exposición.</p>`,()=>goCamera({scene:'nieve',mode:'A',fi:5})],
 ['±','Compensación de exposición',`<p>En los modos <b>A, S y P</b> la cámara decide la exposición. Con la compensación (±EV) le dices «hazla más clara» (+) o «más oscura» (−). En nieve: +1⅔ o +2. En un concierto con fondo negro: −1.</p><p>En modo M no se usa: ahí mandas tú directamente.</p>`,()=>goCamera({scene:'nieve',mode:'A',fi:5,ec:EC0+5})],
 ['📈','El histograma',`<p>Es un gráfico de cuántos píxeles hay de cada brillo: a la izquierda las sombras, a la derecha las luces. Una montaña pegada a la derecha indica zonas <b>quemadas</b> (sin detalle); pegada a la izquierda, sombras <b>empastadas</b>.</p><p>Es más fiable que mirar la pantalla al sol. Actívalo en «Ajustes avanzados».</p>`,()=>{store.set('fotolab-histo',true);$('#histoOn').checked=true;goCamera({scene:'nieve',mode:'M',fi:5,ti:3})}],
 ['🔭','Distancia focal',`<p>Se mide en milímetros. <b>Gran angular</b> (14–35 mm): cabe mucho, ideal para paisaje e interiores. <b>Normal</b> (≈50 mm): parecido al ojo. <b>Teleobjetivo</b> (85–200 mm o más): acerca lo lejano, «comprime» el fondo y lo desenfoca más.</p><p>Cuanto más tele, más se nota el temblor: <b>regla de 1/focal</b>, a pulso con 200 mm, al menos 1/200.</p>`,()=>goCamera({scene:'retrato',foc:6,fi:0,ti:4})],
 ['🎨','Balance de blancos',`<p>Cada luz tiene un color, medido en kelvin (K): una bombilla es naranja (≈3000 K), el sol de mediodía neutro (≈5500 K) y la sombra azulada (≈7500 K).</p><p>El balance de blancos corrige ese color para que lo blanco salga blanco. Si eliges un ajuste equivocado, la foto sale <b>naranja</b> o <b>azul</b>. A veces se «equivoca» a propósito para dar calidez a un atardecer.</p>`,()=>goCamera({scene:'velodromo',fi:0,ti:2,ii:3,wb:'5500'})],
 ['🏁','Barrido',`<p>Consiste en <b>seguir al sujeto con la cámara</b> mientras disparas con una velocidad algo lenta (1/30–1/15). El sujeto sale nítido y el fondo se convierte en líneas que transmiten velocidad. Es típico en deportes de motor y ciclismo.</p>`,()=>goCamera({scene:'nublado',pan:true,ti:7,fi:6,ii:0})],
 ['🔤','Modos M, A, S y P',`<p><b>M (manual)</b>: eliges todo. <b>A / Av</b>: eliges el diafragma, la cámara pone la velocidad (retratos, paisajes). <b>S / Tv</b>: eliges la velocidad, la cámara pone el diafragma (deporte, movimiento). <b>P</b>: la cámara elige las dos.</p>`],
 ['La composición'],
 ['#️⃣','Regla de los tercios',`<p>Divide la imagen con dos líneas horizontales y dos verticales. Colocar el sujeto en las <b>líneas</b> o en los <b>cruces</b> (puntos fuertes) suele dar fotos más dinámicas que centrarlo. El horizonte, mejor en un tercio que en la mitad.</p>`,()=>presetComp('faro','faro-tercios')],
 ['🐚','Proporción áurea',`<p>Una versión más refinada de los tercios: las líneas se colocan al 38 % y 62 % de la imagen (el número de oro, 1,618), presente en la pintura y la arquitectura clásicas.</p>`,()=>presetComp('faro','libre','aurea')],
 ['➡️','Regla del aire y de la mirada',`<p>Deja espacio en la dirección hacia la que mira o se mueve el sujeto. Si alguien mira o avanza hacia el borde, la foto parece «chocar». En retratos, los ojos van bien en el tercio superior.</p>`,()=>presetComp('retrato','retrato-mirada')],
 ['🛤️','Líneas guía',`<p>Caminos, vías, barandillas, orillas… Las líneas de la escena llevan la mirada hacia el sujeto. Las diagonales transmiten dinamismo; las horizontales, calma.</p>`,()=>presetComp('calle','calle-lineas')],
 ['🪞','Simetría y patrones',`<p>En reflejos, edificios o pasillos, centrar y buscar la simetría es la excepción a los tercios: transmite orden y equilibrio. Los patrones repetidos también funcionan, sobre todo si algo los rompe.</p>`,()=>presetComp('edificio','edificio-sim')],
 ['🖼️','Encuadre natural',`<p>Usar elementos de la escena (una ventana, un arco, ramas) como marco dirige la atención y da profundidad.</p>`,()=>presetComp('puerta','puerta-marco')],
 ['⬜','Espacio negativo',`<p>Mucho espacio vacío (cielo, pared, mar) alrededor de un sujeto pequeño lo destaca y transmite soledad o calma. Menos es más.</p>`,()=>presetComp('faro','faro-negativo')],
 ['📐','Proporciones',`<p><b>3:2</b> es la de las cámaras; <b>4:3</b> la de muchos móviles; <b>1:1</b> cuadrada; <b>16:9</b> panorámica, como el cine; y <b>9:16</b> vertical, la de las historias de las redes. Cambiar la proporción cambia la composición: pruébalo en «Encuadra».</p>`,()=>presetComp('calle','libre')],
 ['🧍','Punto de vista',`<p>Agáchate o sube: no todo se fotografía a la altura de los ojos. Desde abajo (contrapicado) el sujeto parece poderoso; desde arriba (picado), pequeño o vulnerable.</p>`]
];
(function(){const fns=[];
  $('#teoria').innerHTML=TEO.map(t=>{if(t.length===1)return`<div class="sect">${t[0]}</div>`;const id=t[3]?fns.push(t[3])-1:-1;
    return`<details class="card acc"><summary><span class="e" aria-hidden="true">${t[0]}</span>${t[1]}</summary><div class="body">${t[2]}${id>=0?`<button class="btn pri" data-try="${id}">Pruébalo →</button>`:''}</div></details>`}).join('');
  $$('[data-try]').forEach(b=>b.onclick=()=>fns[+b.dataset.try]())})();

/* ===================== glosario ===================== */
const GLOS=[
 ['Apertura','Abertura del objetivo por la que entra la luz. Se indica con el número f.'],
 ['Balance de blancos','Ajuste que corrige el color de la luz para que lo blanco salga blanco.'],
 ['Barrido','Técnica de seguir al sujeto con la cámara usando una velocidad lenta: él nítido y el fondo con estela.'],
 ['Bokeh','Calidad del desenfoque del fondo; las luces desenfocadas se ven como círculos.'],
 ['Compensación de exposición','Corrección (±EV) que se aplica a la exposición automática en los modos A, S y P.'],
 ['Composición','Forma de organizar los elementos dentro del encuadre.'],
 ['Contraluz','Cuando la luz principal viene de detrás del sujeto. Puede dar siluetas.'],
 ['Diafragma','Mecanismo de láminas que abre o cierra la apertura del objetivo.'],
 ['Distancia focal','Distancia, en milímetros, que determina el ángulo de visión del objetivo: menos milímetros, más ángulo.'],
 ['Encuadre','Lo que queda dentro de la foto y lo que se deja fuera.'],
 ['Espacio negativo','Zona vacía de la imagen que rodea y destaca al sujeto.'],
 ['EV (paso)','Unidad de luz: un paso más es el doble de luz; uno menos, la mitad.'],
 ['EXIF','Datos que la cámara guarda dentro del archivo: velocidad, diafragma, ISO, focal, fecha…'],
 ['Exposición','Cantidad total de luz que recibe el sensor al hacer una foto.'],
 ['Fotómetro','Medidor de luz de la cámara. Indica si la foto saldrá clara, oscura o correcta.'],
 ['Gran angular','Objetivo de focal corta (menos de unos 35 mm) que abarca mucho espacio.'],
 ['Histograma','Gráfico con la cantidad de píxeles de cada brillo, de las sombras (izquierda) a las luces (derecha).'],
 ['Hora dorada','Primera hora tras el amanecer y última antes del atardecer: luz cálida, suave y lateral.'],
 ['ISO','Sensibilidad del sensor. Más ISO permite fotos con menos luz, a cambio de ruido.'],
 ['Kelvin (K)','Unidad de la temperatura de color de la luz: valores bajos, luz cálida (naranja); altos, luz fría (azul).'],
 ['Líneas guía','Líneas de la escena que conducen la mirada hacia el sujeto.'],
 ['Modo A / Av','Prioridad a la apertura: tú eliges el diafragma y la cámara la velocidad.'],
 ['Modo M','Manual: tú eliges apertura, velocidad e ISO.'],
 ['Modo P','Programa: la cámara elige apertura y velocidad.'],
 ['Modo S / Tv','Prioridad a la velocidad: tú eliges la velocidad y la cámara el diafragma.'],
 ['Número f','Número que indica la apertura (f/1.4, f/8…). Cuanto menor, más abierto y más luz.'],
 ['Obturador','Cortinilla que se abre durante el tiempo de exposición.'],
 ['Picado y contrapicado','Foto tomada desde arriba (picado) o desde abajo (contrapicado).'],
 ['Profundidad de campo','Zona de la imagen que sale nítida delante y detrás del punto enfocado.'],
 ['Proporción áurea','Relación de 1,618 (número de oro) usada para colocar los elementos al 38 % y 62 %.'],
 ['Regla de los tercios','Dividir la imagen en 3×3 y colocar lo importante en las líneas o en sus cruces.'],
 ['Regla de la mirada','Dejar espacio hacia donde mira o se mueve el sujeto.'],
 ['Ruido','Grano y puntos de color que aparecen con ISO alto o poca luz.'],
 ['Sensor','Chip que capta la luz y la convierte en la imagen digital.'],
 ['Sobreexposición','Foto demasiado clara: las luces se queman a blanco.'],
 ['Subexposición','Foto demasiado oscura: las sombras pierden detalle.'],
 ['Teleobjetivo','Objetivo de focal larga (más de unos 85 mm): acerca lo lejano y comprime el fondo.'],
 ['Trepidación','Foto movida porque la cámara se mueve durante la exposición.'],
 ['Trípode','Soporte de tres patas que mantiene la cámara inmóvil.'],
 ['Velocidad de obturación','Tiempo que el obturador está abierto, en fracciones de segundo.']
];
function renderGlos(){const q=$('#gsearch').value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  const L=GLOS.filter(([t,d])=>!q||(t+' '+d).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(q));
  $('#glos').innerHTML=L.map(([t,d])=>`<dt>${t}</dt><dd>${d}</dd>`).join('');$('#gnone').style.display=L.length?'none':'block'}
$('#gsearch').oninput=renderGlos;

/* ===================== historia ===================== */
const HIST=[
 ['Antigüedad – s. XI','La cámara oscura','Ya se sabía que la luz que entra por un agujerito en una sala oscura proyecta una imagen invertida del exterior. El sabio árabe Alhacén (Ibn al-Haytham) la estudió a fondo hacia el año 1000.'],
 ['1826–1827','La primera fotografía conservada','Joseph Nicéphore Niépce fija la «Vista desde la ventana en Le Gras» tras una exposición de muchas horas.'],
 ['1839','El daguerrotipo','Louis Daguerre presenta en París un proceso que da imágenes únicas muy detalladas sobre una placa de metal. Se considera el nacimiento oficial de la fotografía.'],
 ['1841','El calotipo y el negativo','William Henry Fox Talbot patenta el calotipo: un negativo en papel del que se pueden sacar muchas copias.'],
 ['1861','La primera foto en color','James Clerk Maxwell demuestra el color fotografiando una cinta de tartán tres veces, con filtros rojo, verde y azul.'],
 ['1888','Kodak: «usted apriete el botón»','George Eastman lanza la Kodak con un carrete para 100 fotos. La fotografía llega a todo el mundo.'],
 ['1925','La Leica y el formato 35 mm','Una cámara pequeña que usa película de cine de 35 mm. Nace el fotoperiodismo moderno.'],
 ['1935','Kodachrome','Primera película en color de gran éxito, usada durante décadas.'],
 ['1948','La foto instantánea','Edwin Land presenta la primera cámara Polaroid: la foto sale revelada en un minuto.'],
 ['1959','La réflex profesional','La Nikon F populariza las cámaras réflex de objetivos intercambiables.'],
 ['1975','La primera cámara digital','Steven Sasson, ingeniero de Kodak, construye un prototipo de 0,01 megapíxeles que tarda 23 segundos en grabar cada foto en una cinta.'],
 ['2000','El primer móvil con cámara','En Japón se vende el Sharp J-SH04, con una cámara de 0,11 megapíxeles.'],
 ['2007 →','El smartphone','Los teléfonos inteligentes convierten la cámara en algo que todos llevamos siempre encima.'],
 ['2010 →','La fotografía computacional','Los móviles combinan varias fotos y usan software para el HDR, el modo noche o el desenfoque del modo Retrato.']
];
$('#hist').innerHTML=HIST.map(([y,t,d])=>`<div class="it"><div class="y">${y}</div><h3>${t}</h3><p>${d}</p></div>`).join('');

/* ===================== test por temas ===================== */
const QS=[
 ['exp','¿Qué diafragma deja entrar MÁS luz?',['f/1.4','f/5.6','f/11','f/22'],'El número f funciona al revés: cuanto más pequeño, más grande es la abertura.'],
 ['exp','Pasar de f/4 a f/5.6 supone…',['Perder un paso: entra la mitad de luz','Ganar un paso: entra el doble','No cambia la luz','Perder dos pasos'],'Cada número de la escala deja pasar la mitad de luz que el anterior.'],
 ['exp','Para congelar a un atleta en pleno sprint eliges…',['1/1000','1/30','1/4','2 segundos'],'Para congelar movimiento rápido hacen falta 1/500 o más rápido.'],
 ['exp','¿Principal inconveniente de subir mucho el ISO?',['Aparece ruido','Menos profundidad de campo','Estela de movimiento','La foto sale más oscura'],'Un ISO alto amplifica la señal y, con ella, el ruido.'],
 ['exp','Para un retrato con el fondo muy desenfocado usarías…',['Diafragma abierto, como f/1.8','Diafragma cerrado, como f/16','Velocidad lenta, como 1/8','ISO 6400'],'Abrir el diafragma reduce la profundidad de campo.'],
 ['exp','Tienes 1/250 · f/8 · ISO 100. ¿Cuál da la MISMA exposición?',['1/500 · f/5.6 · ISO 100','1/125 · f/5.6 · ISO 100','1/500 · f/11 · ISO 100','1/250 · f/5.6 · ISO 100'],'Abrir de f/8 a f/5.6 gana un paso y pasar a 1/500 lo pierde: se compensan.'],
 ['exp','En el modo A (Av)…',['Tú eliges la apertura y la cámara la velocidad','Tú eliges la velocidad y la cámara la apertura','La cámara lo elige todo','Tú lo eliges todo'],'A/Av = prioridad a la apertura.'],
 ['exp','El fotómetro marca −2. La foto saldrá…',['Oscura: le faltan dos pasos','Clara: le sobran dos pasos','Bien expuesta','Desenfocada'],'Los valores negativos indican subexposición.'],
 ['exp','Para un paisaje nítido de cerca a lejos usarías…',['f/11 – f/16','f/1.4','f/2','Da igual el diafragma'],'Cerrar el diafragma aumenta la profundidad de campo.'],
 ['exp','Subes el ISO de 200 a 400. Para mantener la exposición puedes…',['Usar una velocidad el doble de rápida','Usar una velocidad el doble de lenta','Abrir un paso el diafragma','Nada'],'Doblar el ISO gana un paso: lo compensas perdiendo uno con la velocidad.'],
 ['exp','De noche, ¿qué te permite el trípode?',['Velocidades lentas con ISO bajo, sin trepidación','Congelar los coches','Desenfocar el fondo','Usar ISO más alto'],'Con la cámara fija puedes exponer segundos sin que salga movida.'],
 ['exp','Para que una cascada parezca seda necesitas…',['Velocidad lenta y trípode','Velocidad muy rápida','ISO muy alto','Flash'],'Con una exposición larga, el agua en movimiento se funde en un velo.'],
 ['comp','La regla de los tercios consiste en…',['Colocar lo importante en las líneas o cruces de una cuadrícula 3×3','Dejar siempre el sujeto en el centro','Hacer tres fotos de cada escena','Que el cielo ocupe siempre un tercio exacto'],'Los cruces son los «puntos fuertes» de la imagen.'],
 ['comp','La regla del aire dice que hay que dejar espacio…',['Hacia donde mira o se mueve el sujeto','Detrás del sujeto','Siempre encima de la cabeza','Por igual a todos los lados'],'Si el sujeto avanza hacia el borde, la foto parece cortada.'],
 ['comp','¿Qué son las líneas guía?',['Líneas de la escena que llevan la mirada al sujeto','La cuadrícula del visor','Un horizonte torcido','Ruido en bandas'],'Caminos, vías o barandillas dirigen la vista.'],
 ['comp','¿Cuándo es mejor CENTRAR el sujeto?',['En escenas simétricas, como un edificio con su reflejo','Nunca','Siempre que haya horizonte','Cuando el sujeto mira a un lado'],'La simetría es la gran excepción a la regla de los tercios.'],
 ['comp','Un horizonte en el tercio inferior da protagonismo a…',['El cielo','El suelo o el mar','Nada, es igual','El sujeto central'],'Si el horizonte está abajo, el cielo ocupa dos tercios de la foto.'],
 ['comp','¿Qué es un encuadre natural?',['Usar elementos de la escena, como un arco, como marco','Hacer la foto sin zoom','Usar la proporción 3:2','No recortar la foto'],'El marco dirige la mirada y da profundidad.'],
 ['comp','El espacio negativo sirve para…',['Destacar un sujeto pequeño y transmitir calma','Que la foto salga más clara','Evitar el ruido','Aumentar la profundidad de campo'],'El vacío alrededor hace que el sujeto destaque.'],
 ['comp','En un retrato, ¿dónde suelen ir mejor los ojos?',['Cerca del tercio superior','En el borde inferior','Justo en el centro siempre','Fuera del encuadre'],'Así no sobra espacio encima de la cabeza.'],
 ['adv','A pulso, con un objetivo de 200 mm, la velocidad mínima recomendable es…',['1/200 aproximadamente','1/30','1/2','Da igual la focal'],'Regla de 1/focal: cuanto más tele, más rápido hay que disparar.'],
 ['adv','¿Por qué la nieve sale gris en modo automático?',['El fotómetro la confunde con algo más claro de lo normal y la oscurece','Por el balance de blancos','Por el ISO','Porque el sensor no capta el blanco'],'El fotómetro busca un gris medio. Se corrige con compensación +1⅔ o +2.'],
 ['adv','La compensación de exposición se usa en…',['Los modos A, S y P','Solo en modo M','Solo con flash','Solo con trípode'],'En M mandas tú directamente.'],
 ['adv','Una bombilla con el balance en «Luz de día» hace la foto…',['Anaranjada','Azulada','Verde','Normal'],'La luz de la bombilla es cálida (≈3000 K) y el ajuste de día no la corrige.'],
 ['adv','En el histograma, una montaña pegada a la derecha indica…',['Zonas quemadas','Mucho ruido','Foto movida','Foto desenfocada'],'La derecha son las luces: si está pegada, se pierden detalles en blanco.'],
 ['adv','Con un teleobjetivo, el fondo…',['Se ve más grande y más desenfocado','Se ve más pequeño','Sale siempre nítido','No cambia'],'El tele «comprime» la perspectiva y reduce la profundidad de campo.'],
 ['adv','Para hacer un barrido…',['Sigues al sujeto con la cámara a 1/30 o 1/15','Usas 1/4000','Dejas la cámara fija en trípode','Subes el ISO al máximo'],'Así el sujeto queda nítido y el fondo con líneas de velocidad.'],
 ['adv','¿Qué son los datos EXIF?',['Información técnica guardada dentro del archivo de la foto','Un filtro de color','Un tipo de objetivo','Un formato de vídeo'],'Velocidad, diafragma, ISO, focal, fecha…'],
 ['adv','¿Qué es la hora dorada?',['El rato tras el amanecer y antes del atardecer, con luz cálida y suave','El mediodía','La noche','Cuando hay nubes'],'La luz baja y cálida favorece casi cualquier foto.'],
 ['adv','¿Quién presentó en 1839 el daguerrotipo?',['Louis Daguerre','Thomas Edison','George Eastman','Steven Sasson'],'Se considera el nacimiento oficial de la fotografía.']
];
const TEMAS=[['all','Todo'],['exp','Exposición'],['comp','Composición'],['adv','Avanzado']];
let tema='all',tq=[],tn=0,tok=0;
function renderTemas(){$('#ttemas').innerHTML=TEMAS.map(([k,n])=>`<button data-k="${k}" class="${k===tema?'on':''}" aria-pressed="${k===tema}">${n}</button>`).join('');
  $$('#ttemas button').forEach(b=>b.onclick=()=>{tema=b.dataset.k;renderTemas();startTest()})}
function startTest(){tq=shuffle(QS.filter(q=>tema==='all'||q[0]===tema)).slice(0,10);tn=0;tok=0;drawQ()}
function drawQ(){
  const N=tq.length;
  if(tn>=N){const msg=tok>=N*.9?'¡Fotógrafo/a de primera! 📸':tok>=N*.7?'Muy bien, dominas lo básico.':tok>=N*.5?'Vas por buen camino. Repasa la teoría.':'Repasa la teoría y prueba otra vez.';
    $('#test').innerHTML=`<div class="big">${tok}/${N}</div><p style="text-align:center">${msg}</p><button class="btn pri wide" id="again">Otra ronda</button>`;
    $('#again').onclick=startTest;if(tema==='all'&&N===10){const best=store.get('fotolab-test',0);if(tok>best)store.set('fotolab-test',tok);checkMedals()}return}
  const [,q,opts,exp]=tq[tn],correct=opts[0],sh=shuffle(opts);
  $('#test').innerHTML=`<div class="prog"><i style="width:${tn/N*100}%"></i></div><div style="font-size:.75rem;color:var(--muted)">Pregunta ${tn+1} de ${N} · ${tok} aciertos</div><div class="q">${q}</div><div class="opts">${sh.map(o=>`<button>${o}</button>`).join('')}</div><div class="exp" id="exp"></div>`;
  $$('#test .opts button').forEach(b=>b.onclick=()=>{
    const ok=b.textContent===correct;if(ok)tok++;
    $$('#test .opts button').forEach(x=>{x.disabled=true;if(x.textContent===correct)x.classList.add('ok')});if(!ok)b.classList.add('bad');
    const e=$('#exp');e.style.display='block';e.innerHTML=(ok?'✅ ':'❌ ')+exp+`<div style="margin-top:10px"><button class="btn pri" id="nq">${tn===N-1?'Ver resultado':'Siguiente →'}</button></div>`;
    $('#nq').focus();$('#nq').onclick=()=>{tn++;drawQ()}});
}
onShow['aprende-glosario']=renderGlos;
onShow['aprende-test']=()=>{if(!tq.length||tn>=tq.length)startTest()};

/* ===================== acerca de y actualizaciones ===================== */
const VERSION=document.querySelector('meta[name="app-version"]').content;
const NOVEDADES=[
 ['2.1',['Nuevo botón ⚙︎ Ajustes con «Buscar actualizaciones», autores y aviso','Ayuda para instalarla con los pasos de tu móvil, y aviso amarillo para tenerla en la pantalla de inicio','Iconos para todos los tamaños e imagen al compartir el enlace']],
 ['2.0',['4 escenas nuevas: cascada, retrato con luces (bokeh), nieve y autovía de noche','Distancia focal, compensación de exposición, balance de blancos, histograma y barrido','19 retos en 4 niveles, juegos «Adivina los ajustes» y «Contrarreloj», y medallas','Composición con 5 fotos, proporciones, «¿Cuál es mejor?» y «Detecta la regla»','Mis fotos: analiza los datos de tus fotos y completa misiones','Glosario, historia de la fotografía y test por temas']],
 ['1.1',['Funciona en horizontal, botones para encuadrar, VoiceOver, botones más grandes, letra que crece con el sistema y respeto a «Reducir movimiento»']]
];
function verAjustes(desde){modal(`<h3 id="mtitle">${desde?'¡La app se ha actualizado!':'Ajustes'}</h3>
  ${desde?`<ul>${NOVEDADES.filter(([v])=>vCmp(v,desde)>0).slice(0,4).flatMap(([v,it])=>it).map(i=>`<li>${i}</li>`).join('')}</ul>`:''}
  <p style="font-size:.85rem;margin:14px 0 4px"><b>Instalar en el móvil</b></p>
  ${IK.instalada()?'<p style="font-size:.85rem;color:var(--muted);margin:0">✓ Ya la estás usando como app instalada.</p>':'<button class="btn" id="aj-instalar">📲 Cómo añadirla a la pantalla de inicio</button>'}
  <p style="font-size:.85rem;margin:14px 0 4px"><b>Acerca de</b></p>
  <div style="display:flex;gap:10px;align-items:center"><img src="icon-192.png" alt="" width="44" height="44" style="width:44px;border-radius:10px"><div><b>FotoLab · Aprende fotografía</b><br><span style="font-family:var(--mono);color:var(--muted);font-size:.85rem">Versión ${VERSION}</span></div></div>
  <p style="font-size:.85rem;margin:8px 0 0">Creada por <b>Adela Moreno Vega</b> y <b>Carlos Moreno Otto</b>.</p>
  <p style="font-size:.78rem;color:var(--muted);margin:4px 0 0">© ${new Date().getFullYear()} Adela Moreno Vega y Carlos Moreno Otto. Todos los derechos reservados. Uso personal y educativo gratuito.</p>
  <p style="font-size:.85rem;margin:14px 0 4px"><b>Aviso</b></p>
  <p style="font-size:.8rem;color:var(--muted);margin:0">Esta app es una ayuda para aprender y puede contener errores. La cámara es una simulación didáctica: sus valores son aproximados. Las fotos que analizas no salen de tu dispositivo.</p>
  <p style="font-size:.85rem;margin:14px 0 4px"><b>Versión</b></p>
  <p style="font-size:.8rem;color:var(--muted);margin:0">Se actualiza sola cuando hay una versión nueva.</p>
  <div class="acts"><button class="btn" id="aj-buscar">🔄 Buscar actualizaciones</button><button class="btn" id="aj-nov">Ver novedades</button></div>
  <p id="aj-upd-msg" role="status" style="font-size:.78rem;color:var(--muted);margin:6px 0 0">La app lo comprueba sola cada vez que la abres o vuelves a ella.</p>
  <div id="aj-novlist" hidden>${NOVEDADES.slice(0,4).map(([v,it])=>`<p style="font-size:.85rem;margin-bottom:2px"><b>Versión ${v}</b></p><ul style="font-size:.8rem;margin-top:0">${it.map(i=>`<li>${i}</li>`).join('')}</ul>`).join('')}</div>
  <div class="acts"><button class="btn pri" data-close>${desde?'Entendido':'Cerrar'}</button></div>`);
  const b=$('#aj-instalar');if(b)b.onclick=()=>IK.abrirInstalar();
  $('#aj-buscar').onclick=()=>IK.buscar($('#aj-buscar'),$('#aj-upd-msg'));
  $('#aj-nov').onclick=()=>{const l=$('#aj-novlist');l.hidden=!l.hidden};
}
$('#about').onclick=()=>verAjustes(null);
const EN_WEB=/\.github\.io$/.test(location.hostname)||location.hostname==='localhost';
let actPendiente=false;
const vCmp=(a,b)=>{const x=a.split('.').map(Number),y=b.split('.').map(Number);for(let i=0;i<Math.max(x.length,y.length);i++){const d=(x[i]||0)-(y[i]||0);if(d)return d}return 0};
// nunca se recarga con una ventana abierta ni en mitad de un juego
const seguroRecargar=()=>!$('#modal').classList.contains('on')&&!cr.on&&!(adv.types&&adv.n>0&&adv.n<10);
function actualizar(){if(!seguroRecargar()){actPendiente=true;return}$('#barra-act').hidden=false;setTimeout(()=>location.replace(location.pathname+'?u='+Date.now()+location.hash),900)}
let lastCheck=0;
async function buscarVersion(){if(!EN_WEB||Date.now()-lastCheck<4000)return;lastCheck=Date.now();
  try{const txt=await(await fetch(location.pathname+'?v='+Date.now(),{cache:'no-store'})).text();const m=txt.match(/name="app-version" content="([^"]+)"/);if(m&&vCmp(m[1],VERSION)>0)actualizar()}catch(e){}}
setInterval(()=>{if(actPendiente&&seguroRecargar()){actPendiente=false;actualizar()}},3000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')buscarVersion()});
addEventListener('focus',buscarVersion);addEventListener('pageshow',buscarVersion);setInterval(buscarVersion,90000);buscarVersion();
if(/[?&]u=/.test(location.search))history.replaceState(history.state,'',location.pathname+location.hash);
if(EN_WEB&&'serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(r=>r.update()).catch(()=>{}));
(function(){const seen=store.get('fotolab-version',null);store.set('fotolab-version',VERSION);if(seen&&vCmp(VERSION,seen)>0)setTimeout(()=>verAjustes(seen),700)})();
IK.init({nombre:'FotoLab',clave:'fotolab',version:VERSION,onNueva:()=>actualizar(),esInicio:()=>$('#v-camara').classList.contains('active')&&!$('#modal').classList.contains('on')});

/* ===================== arranque ===================== */
renderTemas();
applyMode(st);
show('camara');
render();
