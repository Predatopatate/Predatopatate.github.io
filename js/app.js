/* Portfolio d'Amaury Sutre : interface « bureau ».
   Le contenu des fenêtres est dans les pages HTML (bloc <div id="src">). Ce fichier ne contient aucun texte à modifier. */
(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const root=document.documentElement,desk=$('#desk'),lang=root.lang==='en'?'en':'fr';
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v);return true}catch(e){return false}}};
const narrow=()=>innerWidth<=700,MAIL='amaurysutre@gmail.com';
const L={fr:{dark:'Passer en mode sombre',light:'Passer en mode clair',on:'Couper les sons',off:'Activer les sons',close:'Fermer',copied:'copié !',win:'fenêtre',crton:'Activer l’effet écran cathodique',crtoff:'Désactiver l’effet écran cathodique'},en:{dark:'Switch to dark mode',light:'Switch to light mode',on:'Mute sounds',off:'Turn sounds on',close:'Close',copied:'copied!',win:'window',crton:'Turn on the old CRT screen effect',crtoff:'Turn off the old CRT screen effect'}}[lang];
const MU={fr:{t:'Écrire à Amaury',p:'Choisis ta messagerie : le message s’ouvre avec mon adresse déjà en destinataire.',app:'Application de messagerie',copy:'Copier',done:'Adresse copiée',close:'Fermer'},en:{t:'Write to Amaury',p:'Pick your mail service: the message opens with my address already filled in as the recipient.',app:'Mail app',copy:'Copy',done:'Address copied',close:'Close'}}[lang];
/* ---------- Thème et son ---------- */
const sm=p=>`<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const SUN='<circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',MOON='<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>';
const SPK='<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/>',SON=SPK+'<path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',SOFF=SPK+'<path d="M16 9l5 6M21 9l-5 6"/>';
const isDark=()=>root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;
function paintTheme(){const b=$('#tTheme');b.innerHTML=sm(isDark()?MOON:SUN);b.setAttribute('aria-label',isDark()?L.light:L.dark)}
$('#tTheme').onclick=()=>{root.dataset.theme=isDark()?'light':'dark';store.set('theme',root.dataset.theme);paintTheme();isDark()?sfx(440,.16,'sine',.08,660):sfx(660,.16,'sine',.08,440)};
let sound=store.get('sfx')==='on',ac; /* son coupé par défaut */
function paintSfx(){const b=$('#tSfx');b.innerHTML=sm(sound?SON:SOFF);b.setAttribute('aria-label',sound?L.on:L.off);b.setAttribute('aria-pressed',sound)}
function sfx(f,d=.1,type='triangle',v=.12,f2){if(!sound)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;if(f2)o.frequency.exponentialRampToValueAtTime(f2,ac.currentTime+d);g.gain.setValueAtTime(v,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
$('#tSfx').onclick=()=>{sound=!sound;store.set('sfx',sound?'on':'off');paintSfx();sfx(784,.09,'sine',.08)};
function paintCrt(){const b=$('#tCrt'),on=root.classList.contains('crt');b.innerHTML=sm('<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M8 3l4 3 4-3M8 21h8"/>');b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?L.crtoff:L.crton)}
$('#tCrt').onclick=()=>{root.classList.toggle('crt');store.set('crt',root.classList.contains('crt')?'on':'off');paintCrt();sfx(220,.3,'square',.06,110)};
paintTheme();paintSfx();paintCrt();
/* ---------- Fenêtres ---------- */
const WS={about:523,links:587,work:659,faq:784,contact:880,cv:1047,draw:698,write:740,cinema:831,games:932};
const wins={},stack=[];let z=10,n=0;
const src=k=>document.querySelector('#src [data-win="'+k+'"]');
const front=el=>{el.style.zIndex=++z;const i=stack.indexOf(el);if(i>-1)stack.splice(i,1);stack.push(el)};
function closeWin(k){const el=wins[k];if(!el)return;el.classList.add('out');setTimeout(()=>el.remove(),160);delete wins[k];const i=stack.indexOf(el);if(i>-1)stack.splice(i,1);sfx(520,.18,'sine',.07,330)}
function openWin(k){
 if(wins[k]){front(wins[k]);return}
 const s=src(k);if(!s)return;
 const el=document.createElement('section');el.className='win w'+(s.dataset.cls?' '+s.dataset.cls:'');el.setAttribute('role','dialog');el.setAttribute('aria-label',s.dataset.title);
 el.innerHTML='<header><span class="wt"></span><button class="x" aria-label="'+L.close+'">[x]</button></header><div class="body"></div>';
 el.querySelector('.wt').textContent=s.dataset.title;
 const body=el.querySelector('.body');body.innerHTML=s.innerHTML;
 if(body.querySelector('[data-snake]'))buildSnake(body);

 const r=desk.getBoundingClientRect(),w=Math.min(+s.dataset.w||460,r.width-16);
 el.style.width=w+'px';el.style.left=Math.max(8,(r.width-w)/2+((n%4)-1.5)*60)+'px';el.style.top=(60+(n%4)*38)+'px';n++;
 desk.appendChild(el);wins[k]=el;front(el);sfx(WS[k]||523,.28,'sine',.09,(WS[k]||523)*1.03);
 el.addEventListener('pointerdown',()=>front(el));
 el.querySelector('.x').onclick=()=>closeWin(k);
 const h=el.querySelector('header');let ox,oy;
 h.addEventListener('pointerdown',e=>{if(narrow()||e.target.closest('.x'))return;ox=e.clientX-el.offsetLeft;oy=e.clientY-el.offsetTop;h.setPointerCapture(e.pointerId);h.classList.add('drag')});
 h.addEventListener('pointermove',e=>{if(!h.hasPointerCapture(e.pointerId))return;const R=desk.getBoundingClientRect();el.style.left=Math.max(0,Math.min(R.width-el.offsetWidth,e.clientX-ox))+'px';el.style.top=Math.max(0,Math.min(R.height-60,e.clientY-oy))+'px'});
 h.addEventListener('pointerup',e=>{h.classList.remove('drag');if(h.hasPointerCapture(e.pointerId))h.releasePointerCapture(e.pointerId)});
}
/* ---------- Illustration : le serpentin ---------- */
function buildSnake(body){
 const host=body.querySelector('[data-snake]'),list=host.querySelector('.ink-src'),imgs=[...list.querySelectorAll('img')];
 const rows=8,dy=150,y0=65,H=y0+dy*(rows-1)+95,Y=r=>y0+r*dy,N=imgs.length;let t='',k=0,d='M3 '+y0;
 const tile=(i,x,y)=>`<button class="ph hx" data-i="${i}" style="left:${x}%;top:${y}px;--i:${i};--c1:hsl(${(i*37)%360} 55% 42%);--c2:hsl(${(i*37+40)%360} 60% 58%)" aria-label="${imgs[i].alt}"><span>${i+1}</span><img src="${imgs[i].getAttribute('src')}" alt="" loading="lazy" onerror="this.remove()"><em class="dn">${i+1}</em></button>`;
 for(let r=0;r<rows;r++){const dir=r%2?-1:1,y=Y(r),last=r===rows-1,xs=dir>0?[29,50,71]:[71,50,29];
  xs.forEach(x=>{if(k<N)t+=tile(k++,x,y)});
  if(!last){const ex=dir>0?91:9,bx=dir>0?100:0;d+=` L${ex} ${y} C${bx} ${y} ${bx} ${Y(r+1)} ${ex} ${Y(r+1)}`;if(k<N)t+=tile(k++,ex,y+dy/2)}else d+=` L12 ${y}`}
 const lbl=lang==='fr'?['début','fin']:['start','end'];
 const marks=`<i class="dot" style="left:3%;top:${y0}px"></i><i class="dot end" style="left:12%;top:${Y(rows-1)}px"></i><em class="lbl" style="left:2%;top:${y0-36}px">${lbl[0]}</em><em class="lbl" style="left:3%;top:${Y(rows-1)+22}px">${lbl[1]}</em>`;
 list.hidden=true;
 host.insertAdjacentHTML('beforeend',`<div class="snake" style="height:${H}px"><svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true"><path class="sea" d="${d}"/><path d="${d}"/></svg>${marks}${t}</div>`);
 sail(host.querySelector('.snake'));
}
/* ---------- Le bateau qui navigue le long du chemin ---------- */
const BOAT='<svg viewBox="0 0 52 44" width="52" height="44" aria-hidden="true"><path d="M26 30V6" stroke="#16243a" stroke-width="2.6" stroke-linecap="round"/><path d="M28 8L44 28H28Z" fill="#fff" stroke="#16243a" stroke-width="2.6" stroke-linejoin="round"/><path d="M24 13L10 28H24Z" fill="#8fd0ff" stroke="#16243a" stroke-width="2.6" stroke-linejoin="round"/><path d="M26 6L34 4L26 2Z" fill="#e0568a" stroke="#16243a" stroke-width="1.6" stroke-linejoin="round"/><path d="M5 30H47L40 40H12Z" fill="#f59300" stroke="#16243a" stroke-width="2.6" stroke-linejoin="round"/><circle cx="20" cy="35" r="1.8" fill="#fff6dc"/><circle cx="26" cy="35" r="1.8" fill="#fff6dc"/><circle cx="32" cy="35" r="1.8" fill="#fff6dc"/></svg>';
function sail(sn){
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const path=sn.querySelector('path:not(.sea)'),Lv=path.getTotalLength(),boat=document.createElement('div');boat.className='boat';boat.innerHTML=BOAT;sn.appendChild(boat);
 let pts=[],cum=[],lastW=0,t0=0;const dur=42000;
 const prep=W=>{pts=[];cum=[0];const m=500;for(let i=0;i<=m;i++){const q=path.getPointAtLength(i/m*Lv);pts.push([q.x*W/100,q.y])}for(let i=1;i<=m;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));lastW=W};
 const frame=ts=>{if(!sn.isConnected)return;const W=sn.clientWidth;if(W&&W!==lastW)prep(W);if(lastW){if(!t0)t0=ts;const tot=cum[cum.length-1],d=((ts-t0)%dur)/dur*tot;let lo=0,hi=cum.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;cum[mid]<=d?lo=mid:hi=mid}const a=pts[lo],b=pts[hi],f=(d-cum[lo])/((cum[hi]-cum[lo])||1);boat.style.left=(a[0]+(b[0]-a[0])*f)+'px';boat.style.top=(a[1]+(b[1]-a[1])*f)+'px';if(Math.abs(b[0]-a[0])>.05)boat.style.setProperty('--f',b[0]<a[0]?-1:1)}requestAnimationFrame(frame)};
 requestAnimationFrame(frame)}
/* ---------- Zoom (lightbox) ---------- */
const lb=$('#lb');let li_=0,lbList=[];
function showLb(p){lb.classList.toggle('single',lbList.length<2);li_=(p+lbList.length)%lbList.length;const it=lbList[li_];let im=$('#lbi');if(!im){im=document.createElement('img');im.id='lbi';lb.insertBefore(im,$('#lbn'))}im.src=it.src;im.alt=it.alt;lb.classList.add('on')}
/* ---------- Messagerie ---------- */
function openMail(sb='',b=''){const q=encodeURIComponent,S=q(sb),B=q(b);
 $('#mmt').textContent=MU.t;$('#mmp').textContent=MU.p;
 const A=[[MU.app,'mailto:'+MAIL+'?subject='+S+'&body='+B,0],['Gmail','https://mail.google.com/mail/?view=cm&fs=1&to='+MAIL+'&su='+S+'&body='+B,1],['Outlook','https://outlook.live.com/mail/0/deeplink/compose?to='+MAIL+'&subject='+S+'&body='+B,1],['Yahoo Mail','https://compose.mail.yahoo.com/?to='+MAIL+'&subject='+S+'&body='+B,1]];
 $('#mmo').innerHTML=A.map(x=>`<a class="mo" href="${x[1]}"${x[2]?' target="_blank" rel="noopener"':''}>${x[0]}</a>`).join('');
 $('#mmc').textContent=MU.copy+' '+MAIL;$('#mmx').textContent=MU.close;$('#mm').classList.add('on');sfx(988,.15,'sine',.07)}
function closeOverlays(){const o=lb.classList.contains('on')||$('#mm').classList.contains('on');lb.classList.remove('on');$('#mm').classList.remove('on');return o}
/* ---------- Clics ---------- */
document.addEventListener('click',e=>{const t=e.target;
 const ic=t.closest('a.ico[data-k]');if(ic){e.preventDefault();openWin(ic.dataset.k);return}
 if(t.closest('#star')){openWin('cv');sfx(1975,.09,'sine',.07);setTimeout(()=>sfx(1975,.06,'sine',.06),70);return}
 const zm=t.closest('[data-zoom]');if(zm){e.preventDefault();const im=zm.querySelector('img');lbList=[{src:im.src,alt:im.alt}];showLb(0);return}
 const tl=t.closest('.snake .ph');if(tl){lbList=$$('.snake .ph').filter(b=>b.querySelector('img')).map(b=>({src:b.querySelector('img').src,alt:b.getAttribute('aria-label')||''}));const mine=lbList.findIndex(x=>x.src===(tl.querySelector('img')||{}).src);if(mine>-1)showLb(mine);return}
 if(t.closest('#lbp')){showLb(li_-1);return}if(t.closest('#lbn')){showLb(li_+1);return}
 if(t.id==='lb'||t.closest('#lbx')){lb.classList.remove('on');return}
 if(t.id==='mm'||t.closest('#mmx')){$('#mm').classList.remove('on');return}
 if(t.closest('#mmc')){try{navigator.clipboard.writeText(MAIL).then(()=>{$('#mmc').textContent=MU.done})}catch(x){}return}
 const gs=t.closest('[data-gstart]');if(gs){e.preventDefault();gstart(gs);return}
 const cp=t.closest('[data-copy]');if(cp){e.preventDefault();const o=cp.dataset.tip;try{navigator.clipboard.writeText(MAIL).then(()=>{cp.dataset.tip=L.copied;setTimeout(()=>cp.dataset.tip=o,1500)},()=>openMail('',''))}catch(x){openMail('','')}return}
 const a=t.closest('[data-mail]');if(a){e.preventDefault();openMail('','')}});
addEventListener('keydown',e=>{
 if(lb.classList.contains('on')){if(e.key==='ArrowLeft')showLb(li_-1);if(e.key==='ArrowRight')showLb(li_+1)}
 if(e.key==='Escape'&&!closeOverlays()&&stack.length){const el=stack[stack.length-1],k=Object.keys(wins).find(x=>wins[x]===el);if(k)closeWin(k)}});
/* ---------- Sons : clics (un son différent selon l'élément) et survol des puces de compétences ---------- */
document.addEventListener('pointerdown',e=>{if(e.button)return;const t=e.target,c=q=>t.closest(q);
 if(c('summary')){sfx(c('details').open?1500:1908,.02,'sine',.08);return}
 if(c('.x')){sfx(950,.03,'sine',.08);return}
 if(c('#tTheme,#tSfx,#tCrt,#tLang,.star'))return;
 if(c('.btn2')){sfx(880,.08,'sine',.08);setTimeout(()=>sfx(1175,.14,'sine',.08),85);return}
 if(c('.snake .ph')){sfx(500,.14,'triangle',.07,900);return}
 if(c('.lbn,.mrow button,.mo')){sfx(1150,.03,'sine',.08);return}
 if(c('.tabs a,.logo')){sfx(740,.08,'sine',.07,990);return}
 if(c('a.ico[data-k],.btn')){sfx(1033,.03,'sine',.09);return}
 if(c('a.ico,.soc')){sfx(1250,.05,'triangle',.08);return}
 if(c('a'))sfx(1100,.04,'sine',.06)});
let hp=0,hT=0;
document.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const el=e.target.closest('.cols .tag');if(!el||el.contains(e.relatedTarget))return;const t=performance.now();hp=t-hT<900?hp+1:0;if(hp>11)hp=0;hT=t;sfx(880*Math.pow(2,hp/12),.09,'sine',.07)});
/* ---------- Ciel : étoiles, parallaxe, oiseaux et étoiles filantes ---------- */
const starsEl=$('#stars');for(let i=0;i<42;i++){const d=document.createElement('i');d.style.cssText='left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;animation-delay:'+Math.random()*3+'s;scale:'+(.6+Math.random());starsEl.appendChild(d)}
const cloudsEl=$('.clouds'),skyEl=$('.sky');
desk.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const R=desk.getBoundingClientRect(),x=(e.clientX-R.left)/R.width-.5,y=(e.clientY-R.top)/R.height-.5;cloudsEl.style.translate=(x*-18)+'px '+(y*-8)+'px';skyEl.style.translate=(x*10)+'px '+(y*4)+'px';starsEl.style.translate=(x*-10)+'px '+(y*-6)+'px'});
function ambient(){const dk=isDark(),el=document.createElement('i');el.className=dk?'shoot':'bird';el.style.top=(6+Math.random()*26)+'%';if(dk)el.style.setProperty('--x',(45+Math.random()*50)+'%');desk.insertBefore(el,$('.stage'));setTimeout(()=>el.remove(),dk?1500:16000);setTimeout(ambient,9000+Math.random()*8000)}
setTimeout(ambient,3500);
/* ---------- Vie marine : dauphin le jour, poisson-lanterne la nuit ---------- */
const DOLPHIN='<svg aria-hidden="true" viewBox="0 0 96 52" width="96" height="52"><g stroke="#16243a" stroke-width="5.4" stroke-linejoin="round" fill="#16243a"><path d="M20 26L4 12L8 27L3 40L21 32Z"/><ellipse cx="46" cy="28" rx="30" ry="15"/><circle cx="66" cy="23" r="12"/><ellipse cx="81" cy="31" rx="12" ry="5"/><path d="M40 15Q50 -1 58 15Z"/><path d="M50 38Q50 51 38 49Q46 43 44 35Z"/></g><path d="M20 26L4 12L8 27L3 40L21 32Z" fill="#4a9fe0"/><ellipse cx="46" cy="28" rx="30" ry="15" fill="#6fb7f2"/><circle cx="66" cy="23" r="12" fill="#6fb7f2"/><ellipse cx="81" cy="31" rx="12" ry="5" fill="#6fb7f2"/><path d="M40 15Q50 -1 58 15Z" fill="#4a9fe0"/><path d="M50 38Q50 51 38 49Q46 43 44 35Z" fill="#4a9fe0"/><path d="M24 34Q46 46 70 34Q58 40 46 40Q34 40 24 34Z" fill="#e9f6ff"/><circle cx="69" cy="20" r="2.4" fill="#16243a"/><circle cx="69.8" cy="19.2" r=".9" fill="#fff"/><path d="M74 31Q82 34 90 30" stroke="#16243a" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="64" cy="28" r="3" fill="#ff9a8a" opacity=".7"/></svg>',ANGLER='<svg aria-hidden="true" viewBox="0 0 92 64" width="92" height="64"><defs><radialGradient id="lg"><stop offset="0" stop-color="#ffe66d" stop-opacity=".9"/><stop offset="1" stop-color="#ffe66d" stop-opacity="0"/></radialGradient></defs><circle class="halo" cx="78" cy="9" r="16" fill="url(#lg)"/><g stroke="#0b1426" stroke-width="5.4" stroke-linejoin="round" fill="#0b1426"><path class="tailp" d="M20 38L4 25L8 38L4 51Z"/><ellipse cx="46" cy="38" rx="27" ry="20"/><path d="M34 20Q40 8 50 19Z"/><path d="M40 56Q46 64 54 56Z"/></g><path d="M50 20Q60 0 78 9" stroke="#0b1426" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M50 20Q60 0 78 9" stroke="#7b8cff" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M20 38L4 25L8 38L4 51Z" fill="#5a6ce0"/><ellipse cx="46" cy="38" rx="27" ry="20" fill="#7b8cff"/><path d="M34 20Q40 8 50 19Z" fill="#5a6ce0"/><path d="M40 56Q46 64 54 56Z" fill="#5a6ce0"/><path d="M30 48Q46 62 66 48Q54 54 46 54Q38 54 30 48Z" fill="#b8c4ff"/><circle cx="78" cy="9" r="5" fill="#ffe66d" stroke="#0b1426" stroke-width="1.8"/><path d="M62 36Q76 38 70 50" stroke="#0b1426" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M64 38L66 43L68 38ZM67 40L69 45L71 40Z" fill="#fff" stroke="#0b1426" stroke-width=".8" stroke-linejoin="round"/><circle cx="62" cy="29" r="5.4" fill="#fff" stroke="#0b1426" stroke-width="1.8"/><circle cx="63.4" cy="29.4" r="2.4" fill="#0b1426"/><circle cx="52" cy="40" r="3.2" fill="#ff9a8a" opacity=".7"/></svg>';
function sea(){const dk=isDark(),el=document.createElement('div'),left=Math.random()<.5;
 if(dk){el.className='angler';el.innerHTML=ANGLER;el.style.setProperty('--b',(5+Math.random()*18)+'%');el.style.setProperty('--dur',(24+Math.random()*10)+'s');desk.insertBefore(el,$('.stage'));setTimeout(()=>el.remove(),36000)}
 else{el.className='dolphin';el.innerHTML='<div class="dj">'+DOLPHIN+'</div>';el.style.setProperty('--dur',(6+Math.random())+'s');desk.insertBefore(el,$('.sky'));setTimeout(()=>el.remove(),8000)}
 if(left){el.style.left='auto';el.style.right='-130px';el.style.setProperty('--dx',-1);el.style.scale='-1 1'}
 setTimeout(sea,16000+Math.random()*12000)}
setTimeout(sea,6000);
/* ---------- Oiseau messager ---------- */
const pet=$('#pet');let trT=0;
function spark(x,y){for(let i=0;i<7;i++){const d=document.createElement('i');d.className='sp';const a=i/7*6.283+Math.random()*.5,r=26+Math.random()*22;d.style.cssText='left:'+x+'px;top:'+y+'px;--dx:'+Math.cos(a)*r+'px;--dy:'+Math.sin(a)*r+'px';desk.appendChild(d);setTimeout(()=>d.remove(),700)}}
desk.addEventListener('pointerdown',e=>{
 if(e.target!==desk)return;
 const R=desk.getBoundingClientRect(),x=e.clientX-R.left,y=e.clientY-R.top,cx=pet.offsetLeft+28,cy=pet.offsetTop+28,dist=Math.hypot(x-cx,y-cy);
 spark(x,y);if(dist<10)return;
 pet.style.setProperty('--dir',x<cx?-1:1);pet.style.setProperty('--tilt',Math.max(-35,Math.min(35,Math.atan2(y-cy,Math.abs(x-cx))*180/Math.PI))+'deg');pet.style.setProperty('--d',Math.min(2,dist/380+.4)+'s');
 pet.classList.add('fly');pet.style.left=(x-28)+'px';pet.style.top=(y-28)+'px';sfx(380,.3,'sine',.05,820);
 clearInterval(trT);trT=setInterval(()=>{const d=document.createElement('i');d.className='tr';d.style.left=(pet.offsetLeft+28)+'px';d.style.top=(pet.offsetTop+28)+'px';desk.insertBefore(d,pet);setTimeout(()=>d.remove(),900)},45)});
pet.addEventListener('transitionend',e=>{if(e.propertyName==='left'||e.propertyName==='top'){pet.classList.remove('fly');clearInterval(trT);pet.style.setProperty('--tilt','0deg');pet.classList.add('land');setTimeout(()=>pet.classList.remove('land'),400)}});
pet.addEventListener('click',e=>{e.stopPropagation();pet.classList.remove('loop');void pet.offsetWidth;pet.classList.add('loop');const R=pet.getBoundingClientRect(),D=desk.getBoundingClientRect();spark(R.left-D.left+28,R.top-D.top+28);{const m=document.createElement('i');m.className='env';m.style.left=(R.left-D.left+18)+'px';m.style.top=(R.top-D.top+30)+'px';desk.appendChild(m);setTimeout(()=>m.remove(),1300)}[659,880,1175].forEach((f,i)=>setTimeout(()=>sfx(f,.12,'triangle',.07),i*90));setTimeout(()=>pet.classList.remove('loop'),900)});
/* ---------- Secrets : code Konami (mini-jeu) et mode rétro (5 clics sur le logo) ---------- */
function confetti(){const C=['#f59300','#b8f1ff','#e0568a','#5b4bdb','#2fb366','#ffd54a'];for(let i=0;i<48;i++){const c=document.createElement('i');c.className='cf';c.style.cssText='left:'+Math.random()*100+'vw;background:'+C[i%6]+';--dx:'+(Math.random()*160-80)+'px;animation-duration:'+(1.8+Math.random()*1.6)+'s;animation-delay:'+Math.random()*.4+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),4200)}}
const KON=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let kp=0;
addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea'))return;const k=e.key.length===1?e.key.toLowerCase():e.key;kp=k===KON[kp]?kp+1:(k===KON[0]?1:0);if(kp===KON.length){kp=0;confetti();[523,659,784,1047].forEach((f,i)=>setTimeout(()=>sfx(f,.18,'triangle',.09),i*110));openWin('game')}});
let GM=null;
function gstart(btn){if(GM)return;const gm=btn.closest('[data-gm]'),ga=gm.querySelector('[data-ga]'),hi=+(store.get('hi')||0);let sc=0,tm=30,combo=0;
 const KW=['SERP','backlink','CTR','GEO','maillage','crawl','E-E-A-T','Core Web Vitals','sitemap','balise title','intention','longue traîne'],BAD=['spam','404','duplicate'];
 const set=()=>{gm.querySelector('[data-sc]').textContent=sc;gm.querySelector('[data-tm]').textContent=tm};
 gm.querySelector('[data-hi]').textContent=hi;ga.innerHTML='';btn.style.display='none';set();
 function end(quiet){clearInterval(GM.sp);clearInterval(GM.tk);GM=null;if(quiet)return;store.set('hi',Math.max(hi,sc));ga.innerHTML='<div class="gi">score : '+sc+(sc>hi?(lang==='fr'?' — nouveau record !':' — new best!'):'')+'</div>';btn.style.display='';btn.textContent=lang==='fr'?'rejouer':'play again';[784,988,1175].forEach((f,i)=>setTimeout(()=>sfx(f,.15,'triangle',.08),i*100))}
 function spawn(){const bad=Math.random()<.2,b=document.createElement('button'),dur=3.2+Math.random()*2;b.className='kw'+(bad?' bad':'');b.textContent=bad?BAD[Math.random()*BAD.length|0]:KW[Math.random()*KW.length|0];b.style.left=(4+Math.random()*68)+'%';b.style.animationDuration=dur+'s';
  b.onclick=()=>{if(bad){sc=Math.max(0,sc-2);combo=0;sfx(180,.18,'sawtooth',.07)}else{combo++;sc+=1+(combo>4?1:0);sfx(500+Math.min(combo,10)*80,.08,'sine',.09)}set();b.remove()};
  setTimeout(()=>{if(b.isConnected&&!bad)combo=0;b.remove()},dur*1000);ga.appendChild(b)}
 GM={sp:setInterval(()=>{if(!ga.isConnected){end(true);return}spawn()},650),tk:setInterval(()=>{if(!ga.isConnected){end(true);return}tm--;set();if(tm<=0)end()},1000)}}
/* ---------- Ouverture directe d'une fenêtre via l'adresse (ex. /#work) ---------- */
const h=location.hash.slice(1);if(h&&src(h)&&h!=='game')setTimeout(()=>openWin(h),200);
})();
