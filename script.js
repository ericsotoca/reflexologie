
// --- ÉTAT GLOBAL ---
const state = {
    journal: JSON.parse(localStorage.getItem('eq_journal')) || [],
    sessions: JSON.parse(localStorage.getItem('eq_sessions')) || [],
    activeSection: 'home',
    programTab: 'stress'
};

// --- SYNCHRONISATION STORAGE ---
function syncStorage() {
    localStorage.setItem('eq_journal', JSON.stringify(state.journal));
    localStorage.setItem('eq_sessions', JSON.stringify(state.sessions));
}

// --- NAVIGATION (FONCTION GLOBALE) ---
window.showSection = function(id) {
    state.activeSection = id;
    
    // Masquer toutes les sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    
    // Afficher la section demandée
    const target = document.getElementById(`section-${id}`);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('animate-in');
    }

    // Mise à jour de l'UI des boutons Desktop
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active-nav', btn.dataset.section === id);
    });

    // Mise à jour de l'UI des icônes Mobile
    document.querySelectorAll('[data-mob]').forEach(btn => {
        btn.classList.toggle('text-[#8da399]', btn.dataset.mob === id);
        btn.classList.toggle('text-gray-400', btn.dataset.mob !== id);
    });

    // Déclencher les rendus spécifiques
    if (id === 'journal') renderJournalChart();
    if (id === 'program') setProgramTab(state.programTab);
    if (id === 'score') initQuiz();
    if (id === 'followup') renderSessions();
    
    // Recréer les icônes Lucide pour les éléments injectés
    if (window.lucide) lucide.createIcons();
    window.scrollTo(0, 0);
};

// --- MODULE JOURNAL ---
let chartInstance = null;
window.updateVal = function(key) {
    const input = document.getElementById(`input-${key}`);
    const display = document.getElementById(`val-${key}`);
    if (input && display) display.innerText = input.value;
};

window.saveJournal = function() {
    const entry = {
        date: document.getElementById('journal-date').value || new Date().toISOString().split('T')[0],
        stress: parseInt(document.getElementById('input-stress').value),
        energy: parseInt(document.getElementById('input-energy').value),
        sleep: parseInt(document.getElementById('input-sleep').value),
        mood: parseInt(document.getElementById('input-mood').value),
        notes: document.getElementById('journal-notes').value
    };

    const idx = state.journal.findIndex(e => e.date === entry.date);
    if (idx > -1) state.journal[idx] = entry;
    else state.journal.push(entry);

    state.journal.sort((a,b) => new Date(a.date) - new Date(b.date));
    syncStorage();
    renderJournalChart();
    alert("Données du jour enregistrées.");
};

function renderJournalChart() {
    const canvas = document.getElementById('journalChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (chartInstance) chartInstance.destroy();

    const last7 = state.journal.slice(-7);
    const labels = last7.map(e => e.date.split('-').reverse().slice(0,2).join('/'));

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Stress', data: last7.map(e => e.stress), borderColor: '#f87171', tension: 0.3 },
                { label: 'Sommeil', data: last7.map(e => e.sleep), borderColor: '#60a5fa', tension: 0.3 },
                { label: 'Humeur', data: last7.map(e => e.mood), borderColor: '#34d399', tension: 0.3 }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

// --- MODULE PROGRAMME (VERSION PROTOCOLE D'INTERVENTION) ---
const programs = {
    stress: {
        title: "Apaisement & Anti-Stress",
        advice: "Le stress bloque souvent le diaphragme. Ce protocole vise à libérer la respiration.",
        protocol: [
            { step: "Ouverture", desc: "Installez-vous confortablement. Pratiquez 3 respirations abdominales amples pour signaler au corps le début de la séance." },
            { step: "Détente Diaphragme", desc: "Exercez des pressions glissées lentes sous les têtes des métatarsiens (ligne du diaphragme) de l'intérieur vers l'extérieur." },
            { step: "Point d'Ancrage", action: "Terminez par une pression maintenue de 2 minutes sur le plexus solaire en expirant longuement." }
        ],
        selfMassage: [
            { point: "Plexus Solaire", action: "Centre de la voûte plantaire. Pression circulaire douce." },
            { point: "Glandes Surrénales", action: "Légèrement au-dessus du plexus, côté interne. Pression tonique." },
            { point: "Ligne de Colonne", action: "Bord interne du pied, du gros orteil au talon." }
        ]
    },
    sleep: {
        title: "Sommeil & Récupération",
        advice: "L'objectif est de descendre l'énergie de la tête vers les pieds pour favoriser l'endormissement.",
        protocol: [
            { step: "Calme Mental", desc: "Massez lentement chaque orteil (représentation de la tête) pour apaiser le flux de pensées." },
            { step: "Sédation", desc: "Effectuez des mouvements de 'chenille' très lents le long de la voûte plantaire pour relaxer le système nerveux." },
            { step: "Clôture", desc: "Enveloppez vos talons avec vos mains pendant 1 minute pour favoriser l'ancrage et la sécurité." }
        ],
        selfMassage: [
            { point: "Glande Pinéale", action: "Centre du gros orteil. Pression douce mais profonde." },
            { point: "Zone du Bassin", action: "L'ensemble du talon. Massage vigoureux." },
            { point: "Zone du Coeur", action: "Sous le coussinet du pied gauche. Pression apaisante." }
        ]
    },
    digestion: {
        title: "Digestion & Ventre",
        advice: "Ce protocole stimule le péristaltisme et aide à débloquer les tensions viscérales.",
        protocol: [
            { step: "Éveil", desc: "Frictionnez vos mains pour les chauffer. Massez le centre du pied pour réveiller les zones organiques." },
            { step: "Circuit Digestif", desc: "Suivez le trajet du colon (pied droit puis pied gauche) en exerçant des pressions glissées fermes." },
            { step: "Libération", desc: "Massez la zone de l'estomac (pied gauche) en cercles lents pour soulager les ballonnements." }
        ],
        selfMassage: [
            { point: "Colon Ascendant", action: "Pied droit, bord externe, du talon vers le haut." },
            { point: "Estomac", action: "Pied gauche, sous le coussinet interne." },
            { point: "Intestin Grêle", action: "Zone centrale du creux du pied, massage global." }
        ]
    }
};

window.setProgramTab = function(id) {
    state.programTab = id;
    document.querySelectorAll('.prog-tab').forEach(t => t.classList.toggle('active-tab', t.dataset.tab === id));
    
    const p = programs[id];
    const content = document.getElementById('program-content');
    if (content) {
        content.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in">
                <!-- Colonne 1 : Protocole d'intervention -->
                <div class="space-y-6">
                    <div class="bg-[#8da399]/10 p-4 rounded-xl inline-flex items-center gap-2 text-[#8da399]">
                         <i data-lucide="clipboard-check"></i>
                         <span class="font-bold text-sm">Protocole : ${p.title}</span>
                    </div>
                    
                    <div class="space-y-4">
                        ${p.protocol.map((step, i) => `
                            <div class="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <div class="flex-shrink-0 w-8 h-8 bg-[#8da399] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    ${i+1}
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-800 text-sm">${step.step}</h4>
                                    <p class="text-xs text-gray-500 leading-relaxed mt-1">${step.desc || step.action}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="p-4 bg-[#f5f1e9]/50 rounded-xl">
                        <h4 class="text-xs font-bold text-gray-400 uppercase mb-2">Conseil du praticien</h4>
                        <p class="text-xs text-gray-600 italic leading-relaxed">"${p.advice}"</p>
                    </div>
                </div>

                <!-- Colonne 2 : Points de massage -->
                <div class="bg-white rounded-2xl p-6 shadow-md border-t-4 border-[#8da399]">
                    <h3 class="text-xl font-['Cormorant_Garamond'] text-[#8da399] font-bold mb-6 flex items-center gap-2">
                        <i data-lucide="hand"></i> Points Réflexes Clés
                    </h3>
                    <div class="space-y-4">
                        ${p.selfMassage.map(m => `
                            <div class="p-4 rounded-xl bg-[#faf9f6] border border-gray-50 hover:border-[#8da399]/20 transition-all group">
                                <div class="flex justify-between items-center mb-1">
                                    <h4 class="font-bold text-gray-700 text-xs uppercase tracking-tight">${m.point}</h4>
                                    <i data-lucide="map-pin" class="text-gray-300 group-hover:text-[#8da399] transition-colors" size="14"></i>
                                </div>
                                <p class="text-[11px] text-gray-500 leading-relaxed">${m.action}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-6 flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                        <i data-lucide="shield-check" class="text-amber-500 shrink-0" size="14"></i>
                        <p class="text-[10px] text-amber-700 leading-tight">Effectuez ces gestes avec calme. Ne forcez jamais si une zone est trop douloureuse.</p>
                    </div>
                </div>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    }
};

// --- MODULE SCORE ---
const quizQuestions = [
    "Je me sens calme face aux imprévus.", "Mon sommeil est profond.", "Je digère facilement mes repas.",
    "J'ai de l'énergie au réveil.", "Je prends du temps pour moi.", "Je me sens détendu(e) physiquement.",
    "Je respire profondément.", "Je ris souvent.", "Je gère bien mes émotions.",
    "Mon appétit est stable.", "Je me concentre facilement.", "Mes muscles sont souples.",
    "Je suis à l'écoute de mon corps.", "Mon esprit est clair le soir.", "Je me sens globalement équilibré(e)."
];

window.initQuiz = function() {
    const container = document.getElementById('quiz-questions');
    if (container && container.children.length === 0) {
        quizQuestions.forEach((q, i) => {
            const div = document.createElement('div');
            div.className = "pb-4 border-b border-gray-50";
            div.innerHTML = `
                <p class="text-sm font-medium mb-3 text-gray-700">${i+1}. ${q}</p>
                <div class="flex justify-between gap-2">
                    ${[1,2,3,4,5].map(v => `<label class="flex-1 text-center cursor-pointer group">
                        <input type="radio" name="q${i}" value="${v}" class="hidden peer">
                        <div class="py-2 bg-gray-50 rounded-lg text-xs peer-checked:bg-[#8da399] peer-checked:text-white transition-all">${v}</div>
                    </label>`).join('')}
                </div>
            `;
            container.appendChild(div);
        });
    }
};

window.calculateScore = function() {
    let total = 0;
    let ok = true;
    for(let i=0; i<15; i++) {
        const r = document.querySelector(`input[name="q${i}"]:checked`);
        if(!r) { ok = false; break; }
        total += parseInt(r.value);
    }
    if(!ok) return alert("Veuillez répondre à toutes les questions.");

    document.getElementById('score-quiz').classList.add('hidden');
    document.getElementById('score-result').classList.remove('hidden');
    document.getElementById('final-score').innerText = total;

    const label = document.getElementById('score-label');
    const advice = document.getElementById('score-advice');
    if(total <= 35) { label.innerText = "Besoin de repos"; advice.innerText = "Votre score indique une fatigue importante. Il est temps de ralentir et d'utiliser l'auto-massage d'ancrage du programme sommeil."; }
    else if(total <= 60) { label.innerText = "Équilibre modéré"; advice.innerText = "Vous avez une bonne base, mais quelques tensions persistent. Le massage du plexus solaire vous aiderait."; }
    else { label.innerText = "Bel Équilibre !"; advice.innerText = "Félicitations, vous vivez en harmonie avec vos besoins. Continuez vos rituels d'auto-massage."; }
};

window.resetQuiz = function() {
    document.getElementById('score-result').classList.add('hidden');
    document.getElementById('score-quiz').classList.remove('hidden');
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
};

// --- MODULE SUIVI ---
window.toggleSessionForm = function() { 
    const form = document.getElementById('session-form');
    if(form) form.classList.toggle('hidden'); 
};

window.addSession = function() {
    const obj = document.getElementById('sess-obj').value;
    if(!obj) return alert("Veuillez saisir un objectif.");
    state.sessions.unshift({ 
        id: Date.now(), 
        date: document.getElementById('sess-date').value || new Date().toLocaleDateString(), 
        objective: obj, 
        advice: document.getElementById('sess-adv').value, 
        done: false 
    });
    syncStorage(); renderSessions(); toggleSessionForm();
};

window.toggleDone = function(id) { 
    const s = state.sessions.find(x => x.id === id); 
    if(s) s.done = !s.done; syncStorage(); renderSessions(); 
};

window.deleteSession = function(id) {
    if(confirm("Supprimer cette séance ?")) {
        state.sessions = state.sessions.filter(s => s.id !== id);
        syncStorage(); renderSessions();
    }
};

function renderSessions() {
    const list = document.getElementById('sessions-list');
    if(!list) return;
    list.innerHTML = state.sessions.map(s => `
        <div class="bg-white p-6 rounded-2xl shadow-sm border ${s.done ? 'border-[#8da399] opacity-75' : 'border-gray-50'} relative animate-in">
             <button onclick="deleteSession(${s.id})" class="absolute top-2 right-4 text-gray-300 hover:text-red-400">×</button>
             <span class="text-[10px] font-bold text-[#8da399] bg-[#f5f1e9] px-2 py-1 rounded-full">${s.date}</span>
             <h4 class="font-bold text-lg my-2 text-gray-800">${s.objective}</h4>
             <p class="text-xs text-gray-400 italic mb-4">"${s.advice}"</p>
             <button onclick="toggleDone(${s.id})" class="w-full py-3 rounded-xl border-2 font-bold transition-all ${s.done ? 'bg-[#8da399] border-[#8da399] text-white' : 'border-[#8da399] text-[#8da399] hover:bg-[#8da399]/5'}">
                ${s.done ? 'Objectif Atteint ✓' : 'Je l\'ai fait'}
             </button>
        </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
}

// --- MODULE RESPIRATION ---
let bInterval = null;
let isB = false;
let bPhase = 'inhale';
let bSec = 5;
let bCycles = 0;

window.toggleBreathing = function() {
    const icon = document.getElementById('breath-icon');
    if(isB) {
        clearInterval(bInterval); isB = false;
        document.getElementById('breath-circle').className = "relative z-10 w-48 h-48 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center border-4 border-[#f5f1e9]";
        document.getElementById('breath-timer').classList.add('hidden');
        document.getElementById('breath-text').innerText = "Prêt ?";
        document.getElementById('ripple').classList.remove('active-ripple');
        if(icon) icon.setAttribute('data-lucide', 'play');
    } else {
        isB = true; bSec = 5; bPhase = 'inhale';
        document.getElementById('breath-timer').classList.remove('hidden');
        document.getElementById('ripple').classList.add('active-ripple');
        if(icon) icon.setAttribute('data-lucide', 'square');
        updateB();
        bInterval = setInterval(updateB, 1000);
    }
    if (window.lucide) lucide.createIcons();
};

function updateB() {
    const circle = document.getElementById('breath-circle');
    const text = document.getElementById('breath-text');
    const timer = document.getElementById('breath-timer');
    
    if (timer) timer.innerText = bSec;
    if(bPhase === 'inhale') { 
        if(text) text.innerText = "Inspirer"; 
        if(circle) { circle.classList.add('inhaling-anim'); circle.classList.remove('exhaling-anim'); }
    } else { 
        if(text) text.innerText = "Expirer"; 
        if(circle) { circle.classList.add('exhaling-anim'); circle.classList.remove('inhaling-anim'); }
    }

    bSec--;
    if(bSec < 0) {
        bSec = 5;
        if(bPhase === 'inhale') bPhase = 'exhale';
        else { 
            bPhase = 'inhale'; bCycles++; 
            document.getElementById('cycle-count').innerText = bCycles; 
            document.getElementById('total-min').innerText = (bCycles * 10 / 60).toFixed(1); 
        }
    }
}

// --- INITIALISATION AU CHARGEMENT ---
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('journal-date').valueAsDate = new Date();
    if (window.lucide) lucide.createIcons();
    showSection('home');
});
