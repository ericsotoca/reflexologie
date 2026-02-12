
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

// --- MODULE PROGRAMME (VERSION AUTO-MASSAGE) ---
const programs = {
    stress: {
        title: "Apaisement Nerveux",
        advice: "Le stress bloque souvent le diaphragme. Apprenez à libérer votre plexus solaire pour retrouver votre souffle.",
        routines: ["10 min de cohérence cardiaque matin/soir", "Tisane mélisse avant dormir", "Éloignement des écrans 30min avant le massage"],
        selfMassage: [
            { point: "Plexus Solaire (Pied)", action: "Au centre de la voûte plantaire, juste sous les coussinets. Exercez une pression circulaire douce avec le pouce pendant 2 minutes en respirant profondément." },
            { point: "Ligne du Diaphragme", action: "Suivez la ligne horizontale sous les coussinets des pieds. Massez de l'intérieur vers l'extérieur pour libérer les tensions respiratoires." },
            { point: "Point de Sérénité (Main)", action: "Au centre de la paume. Pressez fermement pendant 1 minute lors d'un pic de stress." }
        ]
    },
    sleep: {
        title: "Sommeil Réparateur",
        advice: "Le corps a besoin d'ancrage pour s'endormir. Massez les zones liées à la détente profonde.",
        routines: ["Pas d'écran après 21h30", "Chambre à 18°C", "Respiration alternée (Pranayama) avant de fermer les yeux"],
        selfMassage: [
            { point: "L'Ancrage du Talon", action: "Massez vigoureusement tout le talon. C'est la zone du bassin et de l'ancrage, idéale pour calmer le mental envahissant." },
            { point: "Glande Pinéale (Gros orteil)", action: "Massez le centre de la pulpe du gros orteil. Cela favorise la régulation de la mélatonine." },
            { point: "Zone de la Colonne Vertébrale", action: "Sur le bord interne du pied, massez de la base du gros orteil jusqu'au talon pour détendre le système nerveux central." }
        ]
    },
    digestion: {
        title: "Confort Digestif",
        advice: "La digestion commence par la détente. Massez les zones réflexes de l'estomac et des intestins.",
        routines: ["Eau tiède au citron le matin", "Mâcher 20 fois chaque bouchée", "Marche calme de 10 min après repas"],
        selfMassage: [
            { point: "Zone Estomac (Pied Gauche)", action: "Située sous le coussinet du gros orteil sur le pied gauche. Effectuez des mouvements circulaires dans le sens des aiguilles d'une montre." },
            { point: "Intestins (Voûte Plantaire)", action: "Massez toute la partie creuse de la voûte plantaire avec le poing fermé pour stimuler le péristaltisme." },
            { point: "Point Digestion (Main)", action: "Dans le creux entre le pouce et l'index. Massez pour soulager les ballonnements (attention : éviter en cas de grossesse)." }
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
                <div class="space-y-6">
                    <h3 class="text-2xl font-['Cormorant_Garamond'] text-[#8da399] font-bold">${p.title}</h3>
                    <p class="text-gray-500 italic border-l-4 border-[#f5f1e9] pl-4 text-sm leading-relaxed">${p.advice}</p>
                    <div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Hygiène de vie</h4>
                        <ul class="space-y-2">
                            ${p.routines.map(r => `<li class="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-lg"><i data-lucide="check" class="text-[#8da399]" size="16"></i> ${r}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="bg-[#f5f1e9]/30 rounded-2xl p-6 border border-[#f5f1e9]">
                    <h3 class="text-xl font-['Cormorant_Garamond'] text-[#8da399] font-bold mb-6 flex items-center gap-2">
                        <i data-lucide="hand"></i> Auto-massage Réflexo
                    </h3>
                    <div class="space-y-6">
                        ${p.selfMassage.map(m => `
                            <div class="bg-white p-4 rounded-xl shadow-sm border border-white">
                                <h4 class="font-bold text-[#8da399] text-sm mb-1">${m.point}</h4>
                                <p class="text-xs text-gray-500 leading-relaxed">${m.action}</p>
                            </div>
                        `).join('')}
                    </div>
                    <p class="mt-6 text-[10px] text-center text-gray-400 italic">Effectuez ces gestes sur les deux côtés (sauf indication contraire).</p>
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
