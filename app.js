const STORAGE_KEY = "maintenant-v2-signals";
const LEGACY_STORAGE_KEY = "maintenant-signals-v1";
const JOINED_KEY = "maintenant-v2-joined";

const categoryInfo = {
  dance: { label: "DANSE", color: "#C89BFF", glow: "rgba(200,155,255,.19)", visual: "rgba(200,155,255,.82)", icon: "♫" },
  food: { label: "MANGER", color: "#FFB86B", glow: "rgba(255,184,107,.18)", visual: "rgba(255,184,107,.86)", icon: "◒" },
  walk: { label: "BOUGER", color: "#72F4D2", glow: "rgba(114,244,210,.18)", visual: "rgba(114,244,210,.82)", icon: "↗" },
  music: { label: "MUSIQUE", color: "#7DB7FF", glow: "rgba(125,183,255,.18)", visual: "rgba(125,183,255,.83)", icon: "♪" },
  other: { label: "AUTRE", color: "#B9F75A", glow: "rgba(185,247,90,.18)", visual: "rgba(185,247,90,.85)", icon: "✦" }
};

const seedSignals = [
  { id:"seed-1", title:"Quelques pas de Kizomba au bord de Loire", description:"Session simple et détendue. Tous niveaux, musique sur enceinte.", category:"dance", time:"now", place:"Tours centre", distance:"1,2 km", capacity:8, participants:4, host:"Maya", beginner:true, featured:true, expiresAt:Date.now()+68*60*1000 },
  { id:"seed-2", title:"Marcher 45 minutes sans prise de tête", description:"On part tranquillement depuis le jardin des Prébendes.", category:"walk", time:"now", place:"Prébendes", distance:"2,4 km", capacity:6, participants:2, host:"Nico", beginner:false, featured:false, expiresAt:Date.now()+103*60*1000 },
  { id:"seed-3", title:"Tester un petit resto et partager les plats", description:"Budget environ 20 €. Groupe de quatre, ambiance conviviale.", category:"food", time:"tonight", place:"Vieux-Tours", distance:"0,8 km", capacity:4, participants:3, host:"Sarah", beginner:false, featured:true, expiresAt:Date.now()+5*60*60*1000 },
  { id:"seed-4", title:"Écouter deux morceaux et donner un avis honnête", description:"Mini écoute privée pour un projet musical. Quinze minutes suffisent.", category:"music", time:"tonight", place:"Tours nord", distance:"4,7 km", capacity:6, participants:1, host:"Bamss", beginner:true, featured:false, expiresAt:Date.now()+6*60*60*1000 },
  { id:"seed-5", title:"Café, idées et projets créatifs", description:"Chacun vient avec une idée. Une heure pour échanger et repartir motivé.", category:"other", time:"tomorrow", place:"Place Plumereau", distance:"1,0 km", capacity:6, participants:3, host:"Lina", beginner:true, featured:true, expiresAt:Date.now()+25*60*60*1000 }
];

let signals = loadSignals();
let activeTime = "now";
let activeCategory = "all";
let joined = new Set(JSON.parse(localStorage.getItem(JOINED_KEY) || "[]"));

const feed = document.getElementById("signalFeed");
const emptyState = document.getElementById("emptyState");
const createDialog = document.getElementById("createDialog");
const detailDialog = document.getElementById("detailDialog");
const simpleDialog = document.getElementById("simpleDialog");
const toast = document.getElementById("toast");

function loadSignals() {
  let saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  if (!saved) {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "null");
    if (Array.isArray(legacy) && legacy.length) {
      saved = legacy.map((signal,index)=>({...signal,beginner:Boolean(signal.beginner),featured:index%2===0}));
    }
  }
  if (!Array.isArray(saved) || !saved.length) saved = structuredClone(seedSignals);
  const active = saved.filter(signal=>!signal.expiresAt || signal.expiresAt>Date.now());
  localStorage.setItem(STORAGE_KEY,JSON.stringify(active));
  return active;
}

function saveSignals(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(signals)); }
function escapeHtml(value){ return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]); }
function initials(name){ return String(name||"").split(/\s+/).map(part=>part[0]).join("").slice(0,2).toUpperCase(); }
function momentLabel(time){ return time==="now"?"dès maintenant":time==="tonight"?"ce soir":"demain"; }
function timeLabel(signal){ const minutes=Math.max(1,Math.round((signal.expiresAt-Date.now())/60000)); return minutes<60?`expire dans ${minutes} min`:`expire dans ${Math.max(1,Math.round(minutes/60))} h`; }

function render(){
  const visible=signals.filter(s=>s.time===activeTime).filter(s=>activeCategory==="all"||s.category===activeCategory).filter(s=>!s.expiresAt||s.expiresAt>Date.now());
  feed.innerHTML=visible.map(signal=>{
    const cat=categoryInfo[signal.category]||categoryInfo.other;
    const isJoined=joined.has(signal.id);
    const shownCount=signal.participants+(isJoined?1:0);
    const avatars=[signal.host,"JL","AM"].slice(0,Math.min(3,Math.max(1,shownCount)));
    return `
      <article class="signal-card ${signal.featured?"featured":""}" data-id="${signal.id}" style="--category-color:${cat.color};--card-glow:${cat.glow};--visual-light:${cat.visual}">
        <div class="signal-visual" aria-hidden="true"><div class="visual-people"><span class="person-shape"></span><span class="person-shape"></span><span class="person-shape"></span></div></div>
        <div class="card-content">
          <div class="card-top"><span class="category-label">${cat.icon} ${cat.label}</span><span class="expiry">${timeLabel(signal)}</span></div>
          <h3>${escapeHtml(signal.title)}</h3>
          <p class="description">${escapeHtml(signal.description||"Un moment simple à partager.")}</p>
          ${signal.beginner?'<span class="beginner-tag">✓ Débutants bienvenus</span>':""}
          <div class="meta"><span>⌖ ${escapeHtml(signal.place)} · ${escapeHtml(signal.distance||"près de vous")}</span><span>◷ ${momentLabel(signal.time)}</span></div>
          <div class="card-bottom">
            <div class="people">${avatars.map(name=>`<span class="mini-avatar">${initials(name)}</span>`).join("")}<span class="people-count">${shownCount}/${signal.capacity}</span></div>
            <button class="join-button ${isJoined?"joined":""}" data-join="${signal.id}">${isJoined?"J’en suis ✓":"J’en suis"}</button>
          </div>
        </div>
      </article>`;
  }).join("");
  emptyState.classList.toggle("hidden",visible.length>0);
  document.querySelectorAll("[data-join]").forEach(button=>button.addEventListener("click",event=>{event.stopPropagation();toggleJoin(button.dataset.join);}));
  document.querySelectorAll(".signal-card").forEach(card=>card.addEventListener("click",()=>openDetail(card.dataset.id)));
}

function toggleJoin(id){
  const signal=signals.find(item=>item.id===id); if(!signal)return;
  if(joined.has(id)){joined.delete(id);showToast("Participation annulée");}
  else{if(signal.participants>=signal.capacity){showToast("Ce signal est complet");return;}joined.add(id);showToast("Vous êtes dans le groupe");}
  localStorage.setItem(JOINED_KEY,JSON.stringify([...joined])); render();
}

function openDetail(id){
  const signal=signals.find(item=>item.id===id); if(!signal)return;
  const cat=categoryInfo[signal.category]||categoryInfo.other;
  const isJoined=joined.has(id); const shownCount=signal.participants+(isJoined?1:0);
  document.getElementById("detailContent").innerHTML=`
    <div class="sheet-handle"></div>
    <section class="detail-cover" style="--category-color:${cat.color};--card-glow:${cat.glow};--visual-light:${cat.visual}">
      <div class="card-top"><span class="category-label">${cat.icon} ${cat.label}</span><button class="close-button" id="closeDetail" aria-label="Fermer">×</button></div>
      <div><h2>${escapeHtml(signal.title)}</h2><span class="expiry">${timeLabel(signal)}</span></div>
    </section>
    <div class="detail-row"><span class="row-icon">⌖</span><div><strong>${escapeHtml(signal.place)}</strong><span>Le point exact est révélé après acceptation.</span></div></div>
    <div class="detail-row"><span class="row-icon">◷</span><div><strong>${momentLabel(signal.time)}</strong><span>${escapeHtml(signal.description||"Un moment simple à partager.")}</span></div></div>
    <div class="detail-row"><span class="row-icon">○</span><div><strong>Proposé par ${escapeHtml(signal.host)}</strong><span>${signal.beginner?"Débutants bienvenus.":"Groupe ouvert dans la limite des places."}</span></div></div>
    <div class="participant-strip"><div class="participant-copy"><strong>${shownCount} participant${shownCount>1?"s":""} sur ${signal.capacity}</strong><span>Petit groupe, rencontre plus simple.</span></div><div class="participant-avatars"><span class="mini-avatar">${initials(signal.host)}</span>${shownCount>1?'<span class="mini-avatar">JL</span>':""}${shownCount>2?'<span class="mini-avatar">AM</span>':""}</div></div>
    <div class="detail-actions"><button class="primary-cta full" id="detailJoin">${isJoined?"Je participe ✓":"Demander à participer"}</button><button class="share-button" id="shareSignal" aria-label="Partager">↗</button></div>`;
  detailDialog.showModal();
  document.getElementById("closeDetail").onclick=()=>detailDialog.close();
  document.getElementById("detailJoin").onclick=()=>{toggleJoin(id);detailDialog.close();};
  document.getElementById("shareSignal").onclick=()=>shareSignal(signal);
}

async function shareSignal(signal){
  const text=`${signal.title} — ${signal.place}. ${signal.participants}/${signal.capacity} personnes. Rejoins ce signal sur MAINTENANT.`;
  try{if(navigator.share)await navigator.share({title:signal.title,text});else{await navigator.clipboard.writeText(text);showToast("Texte du signal copié");}}catch(_){}
}

function openCreate(){ if(typeof createDialog.showModal==="function")createDialog.showModal(); }

document.getElementById("signalForm").addEventListener("submit",event=>{
  event.preventDefault(); const data=new FormData(event.currentTarget);
  const newSignal={id:`user-${Date.now()}`,title:String(data.get("title")||"").trim(),description:String(data.get("description")||"").trim(),category:data.get("category"),time:data.get("time"),place:String(data.get("place")||"").trim(),distance:"dans votre zone",capacity:Number(data.get("capacity")),participants:1,host:"Vous",beginner:data.get("beginner")==="on",featured:signals.length%2===0,expiresAt:Date.now()+3*60*60*1000};
  signals.unshift(newSignal); saveSignals(); activeTime=newSignal.time; updateTimeUI(); event.currentTarget.reset(); document.getElementById("placeInput").value="Tours centre"; createDialog.close(); render(); showToast("Signal publié pour 3 heures");
});

document.querySelectorAll(".segment").forEach(button=>button.addEventListener("click",()=>{activeTime=button.dataset.time;updateTimeUI();render();}));
function updateTimeUI(){document.querySelectorAll(".segment").forEach(button=>button.classList.toggle("active",button.dataset.time===activeTime));}
document.querySelectorAll(".chip").forEach(button=>button.addEventListener("click",()=>{activeCategory=button.dataset.category;document.querySelectorAll(".chip").forEach(chip=>chip.classList.toggle("active",chip===button));render();}));
["openCreate","emptyCreate","navCreate"].forEach(id=>document.getElementById(id).addEventListener("click",openCreate));
document.getElementById("closeCreate").addEventListener("click",()=>createDialog.close());
document.getElementById("brandBtn").addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
document.getElementById("profileBtn").addEventListener("click",openProfile);
document.getElementById("cityBtn").addEventListener("click",()=>showSimpleDialog("Zone pilote","Le lancement commence à Tours et dans les alentours avant d’ouvrir d’autres villes.",[["Tours centre","Zone principale"],["Chambray-lès-Tours","Ouverture prévue"],["Saint-Cyr-sur-Loire","Ouverture prévue"]]));
document.getElementById("mapToggle").addEventListener("click",()=>showSimpleDialog("Carte des signaux","La V2 prépare une vraie carte locale. Pour ce prototype, la position exacte reste volontairement masquée.",[["Tours centre","2 signaux actifs"],["Vieux-Tours","1 signal ce soir"],["Prébendes","1 signal maintenant"]]));

document.querySelectorAll(".nav-item").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".nav-item").forEach(item=>item.classList.toggle("active",item===button));
  const view=button.dataset.view;
  if(view==="home"){scrollTo({top:0,behavior:"smooth"});return;}
  if(view==="signals"){openMySignals();return;}
  if(view==="groups"){
    const items=joined.size?[...joined].map(id=>{const signal=signals.find(item=>item.id===id);return signal?[signal.title,"Groupe actif"]:["Signal","Groupe actif"];}):[["Aucun groupe actif","Rejoignez un signal pour commencer"]];
    showSimpleDialog("Groupes temporaires","Chaque signal rejoint crée un petit groupe qui disparaîtra après l’activité.",items);return;
  }
  if(view==="profile")openProfile();
}));

function openMySignals(){
  const mine=signals.filter(signal=>signal.host==="Vous").map(signal=>[signal.title,"Créé par vous"]);
  const joinedSignals=signals.filter(signal=>joined.has(signal.id)).map(signal=>[signal.title,"Vous participez"]);
  const items=[...mine,...joinedSignals];
  showSimpleDialog("Mes signaux","Retrouvez ici les signaux que vous avez créés ou rejoints.",items.length?items:[["Aucun signal pour le moment","Lancez-en un ou rejoignez une activité"]]);
}
function openProfile(){showSimpleDialog("Votre profil","Le profil reste volontairement minimal : prénom, zone et confiance après les rencontres.",[["Bamba K.","Tours et alentours"],["0 rencontre confirmée","Le score de confiance viendra après les premiers tests"],["Profil privé","Pas de compteur public d’abonnés"]]);}
function showSimpleDialog(title,description,items){
  document.getElementById("simpleContent").innerHTML=`<div class="sheet-header"><div><p class="eyebrow">MAINTENANT</p><h2>${escapeHtml(title)}</h2></div><button class="close-button" id="closeSimple" aria-label="Fermer">×</button></div><p>${escapeHtml(description)}</p><div class="simple-list">${items.map(([label,detail])=>`<div class="simple-item"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(detail)}</span></div>`).join("")}</div>`;
  simpleDialog.showModal(); document.getElementById("closeSimple").onclick=()=>simpleDialog.close();
}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2200);}

if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));}
render();
setInterval(()=>{const previous=signals.length;signals=signals.filter(signal=>!signal.expiresAt||signal.expiresAt>Date.now());if(signals.length!==previous)saveSignals();render();},60000);
