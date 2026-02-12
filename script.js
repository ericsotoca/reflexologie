
// --- ÉTAT ET STORAGE ---
const state = {
    journal: JSON.parse(localStorage.getItem('eq_journal')) || [],
    sessions: JSON.parse(localStorage.getItem('eq_sessions')) || [],
    activeSection: 'home',
    programTab: 'stress'
};

function syncStorage() {
    localStorage.setItem('eq_journal', JSON.stringify(state.journal));
    localStorage.setItem('eq_sessions', JSON.stringify(state.sessions));
}

// --- NAVIGATION ---
function showSection(id) {
    state.activeSection = id;
    
    // UI Masquer toutes les sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    
    // Afficher la cible
    const target = document.getElementById(`section-${id}`);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('animate-in');
    }

    // Update Boutons Desktop
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === id);
    });

    // Update Icones Mobile
    document.querySelectorAll('[data-mob]').forEach(btn => {
        btn.classList.toggle('text-[#8da399]', btn.dataset.mob === id);
        btn.classList.toggle('text-gray-400', btn.dataset.mob !== id);
    });

    // Actions spécifiques
    if (id === 'journal') renderJournalChart();
    if (id === 'program') setProgramTab(state.programTab);
    if (id === 'score') initQuiz();
    if (id === 'followup') renderSessions();
    
    lucide.createIcons();
}

// --- JOURNAL ---
let chartInstance = null;
function updateVal(key) {
    document.getElementById(`val-${key}`).innerText = document.getElementById(`input-${key}`).value;
}

function saveJournal() {
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
    alert("Données enregistrées");
}

function renderJournalChart() {
    const ctx = document.getElementById('journalChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    const last7 = state.journal.slice(-7);
    const labels = last7.map(e => e.date.split('-').reverse().slice(0,2).join('/'));

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Stress', data: last7.map(e => e.stress), borderColor: '#f87171', tension: 0.3 },
                { label: 'Énergie', data: last7.map(e => e.energy), borderColor: '#fbbf24', tension: 0.3 },
                { label: 'Sommeil', data: last7.map(e => e.sleep), borderColor: '#60a5fa', tension: 0.3 },
                { label: 'Humeur', data: last7.map(e => e.mood), borderColor: '#34d399', tension: 0.3 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// --- PROGRAMME ---
const programs = {
    stress: {
        title: "Apaisement Nerveux",
        advice: "Le stress bloque souvent le diaphragme. Libérez votre respiration.",
        routines: ["10 min de cohérence cardiaque", "Massage plexus solaire", "Tisane mélisse/passiflore"],
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    sleep: {
        title: "Rituel de Nuit",
        advice: "Le sommeil se prépare 2h avant le coucher. Obscurité et fraîcheur.",
        routines: ["Pas d'écran après 21h", "Masser les talons (ancrage)", "Lecture inspirante"],
        video: "https://www.youtube.com/embed/5qap5aO4i9A"
    },
    digestion: {
        title: "Équilibre Digestif",
        advice: "Prenez le temps de mâcher. La digestion commence dans la bouche.",
        routines: ["Verre d'eau tiède le matin", "Massage voûte plantaire (zone intestin)", "3 min de respiration avant repas"],
        video: "https://www.youtube.com/embed/zP12zM2796Y"
    }
};

function setProgramTab(id) {
    state.programTab = id;
    document.querySelectorAll('.prog-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
    
    const p = programs[id];
    document.getElementById('program-content').innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in">
            <div class="space-y-6">
                <h3 class="text-2xl font-['Cormorant_Garamond'] text-[#8da399] font-bold">${p.title}</h3>
                <p class="text-gray-500 italic border-l-4 border-[#f5f1e9] pl-4 text-sm">${p.advice}</p>
                <ul class="space-y-3">
                    ${p.routines.map(r => `<li class="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-lg"><i data-lucide="check" class="text-sage"></i> ${r}</li>`).join('')}
                </ul>
            </div>
            <div class="aspect-video rounded-xl overflow-hidden shadow-md">
                <iframe width="100%" height="100%" src="${p.video}" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// --- SCORE ---
const quizQuestions = [
    "Je me sens calme face aux imprévus.",
    "Mon sommeil est réparateur.",
    "Je digère facilement.",
    "J'ai de l'énergie au réveil.",
    "Je prends du temps pour moi.",
    "Je me sens détendu(e) physiquement.",
    "Je respire profondément.",
    "Je ris souvent.",
    "Je gère bien mes émotions.",
    "Mon appétit est stable.",
    "Je me concentre facilement.",
    "Mes muscles sont souples.",
    "Je suis à l'écoute de mon corps.",
    "Mon esprit est clair le soir.",
    "Je me sens globalement équilibré(e)."
];

function initQuiz() {
    const container = document.getElementById('quiz-questions');
    if (container.children.length > 0) return;
    quizQuestions.forEach((q, i) => {
        const div = document.createElement('div');
        div.className = "pb-4 border-b border-gray-50";
        div.innerHTML = `
            <p class="text-sm font-medium mb-3">${i+1}. ${q}</p>
            <div class="flex justify-between gap-2">
                ${[1,2,3,4,5].map(v => `<label class="flex-1 text-center cursor-pointer group">
                    <input type="radio" name="q${i}" value="${v}" class="hidden peer">
                    <div class="py-2 bg-gray-50 rounded-lg text-xs peer-checked:bg-[#8da399] peer-checked:text-white">${v}</div>
                </label>`).join('')}
            </div>
        `;
        container.appendChild(div);
    });
}

function calculateScore() {
    let total = 0;
    let ok = true;
    for(let i=0; i<15; i++) {
        const r = document.querySelector(`input[name="q${i}"]:checked`);
        if(!r) { ok = false; break; }
        total += parseInt(r.value);
    }
    if(!ok) return alert("Répondez à toutes les questions");

    document.getElementById('score-quiz').classList.add('hidden');
    const res = document.getElementById('score-result');
    res.classList.remove('hidden');
    document.getElementById('final-score').innerText = total;

    const label = document.getElementById('score-label');
    const advice = document.getElementById('score-advice');

    if(total <= 35) { label.innerText = "Faible équilibre"; advice.innerText = "Besoin de repos profond et d'écoute corporelle."; }
    else if(total <= 60) { label.innerText = "Équilibre modéré"; advice.innerText = "Vous êtes sur la bonne voie. Travaillez sur vos zones de tension."; }
    else { label.innerText = "Bel Équilibre"; advice.innerText = "Harmonie parfaite. Continuez vos routines !"; }
}

function resetQuiz() {
    document.getElementById('score-result').classList.add('hidden');
    document.getElementById('score-quiz').classList.remove('hidden');
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
}

// --- SUIVI ---
function toggleSessionForm() { document.getElementById('session-form').classList.toggle('hidden'); }
function addSession() {
    const obj = document.getElementById('sess-obj').value;
    if(!obj) return;
    state.sessions.unshift({ id: Date.now(), date: document.getElementById('sess-date').value || new Date().toLocaleDateString(), objective: obj, advice: document.getElementById('sess-adv').value, done: false });
    syncStorage(); renderSessions(); toggleSessionForm();
}
function toggleDone(id) { 
    const s = state.sessions.find(x => x.id === id); 
    if(s) s.done = !s.done; syncStorage(); renderSessions(); 
}
function deleteSession(id) {
    state.sessions = state.sessions.filter(s => s.id !== id);
    syncStorage(); renderSessions();
}
function renderSessions() {
    document.getElementById('sessions-list').innerHTML = state.sessions.map(s => `
        <div class="bg-white p-6 rounded-2xl shadow-sm border ${s.done ? 'border-[#8da399] opacity-75' : 'border-gray-50'} relative animate-in">
             <button onclick="deleteSession(${s.id})" class="absolute top-2 right-4 text-gray-300 hover:text-red-400">×</button>
             <span class="text-[10px] font-bold text-[#8da399] bg-[#f5f1e9] px-2 py-1 rounded-full">${s.date}</span>
             <h4 class="font-bold text-lg my-2">${s.objective}</h4>
             <p class="text-xs text-gray-400 italic mb-4">"${s.advice}"</p>
             <button onclick="toggleDone(${s.id})" class="w-full py-3 rounded-xl border-2 font-bold ${s.done ? 'bg-[#8da399] border-[#8da399] text-white' : 'border-[#8da399] text-[#8da399]'}">
                ${s.done ? 'Fait ✓' : 'Je l\'ai fait'}
             </button>
        </div>
    `).join('');
    lucide.createIcons();
}

// --- RESPIRATION ---
let bInterval = null;
let isB = false;
let bPhase = 'inhale';
let bSec = 5;
let bCycles = 0;

function toggleBreathing() {
    const btn = document.getElementById('breath-btn');
    const icon = document.getElementById('breath-icon');
    if(isB) {
        clearInterval(bInterval); isB = false;
        document.getElementById('breath-circle').className = "relative z-10 w-48 h-48 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center border-4 border-[#f5f1e9]";
        document.getElementById('breath-timer').classList.add('hidden');
        document.getElementById('breath-text').innerText = "Prêt ?";
        icon.setAttribute('data-lucide', 'play');
    } else {
        isB = true; bSec = 5; bPhase = 'inhale';
        document.getElementById('breath-timer').classList.remove('hidden');
        icon.setAttribute('data-lucide', 'square');
        updateB();
        bInterval = setInterval(updateB, 1000);
    }
    lucide.createIcons();
}

function updateB() {
    const circle = document.getElementById('breath-circle');
    const text = document.getElementById('breath-text');
    const timer = document.getElementById('breath-timer');
    
    timer.innerText = bSec;
    if(bPhase === 'inhale') { text.innerText = "Inspirer"; circle.classList.add('inhaling'); circle.classList.remove('exhaling'); }
    else { text.innerText = "Expirer"; circle.classList.add('exhaling'); circle.classList.remove('inhaling'); }

    bSec--;
    if(bSec < 0) {
        bSec = 5;
        if(bPhase === 'inhale') bPhase = 'exhale';
        else { bPhase = 'inhale'; bCycles++; document.getElementById('cycle-count').innerText = bCycles; document.getElementById('total-min').innerText = (bCycles * 10 / 60).toFixed(1); }
    }
}

// Initialisation
document.getElementById('journal-date').valueAsDate = new Date();
showSection('home');
lucide.createIcons();
