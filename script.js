
// --- ÉTAT GLOBAL ET STORAGE ---
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
    
    // UI Updates
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`section-${id}`).classList.remove('hidden');
    document.getElementById(`section-${id}`).classList.add('animate-in');

    // Button states (Desktop)
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === id);
    });

    // Button states (Mobile)
    document.querySelectorAll('[data-section-mob]').forEach(btn => {
        btn.classList.toggle('text-[#8da399]', btn.dataset.sectionMob === id);
        btn.classList.toggle('text-gray-400', btn.dataset.sectionMob !== id);
    });

    // Special renders
    if (id === 'journal') renderJournalChart();
    if (id === 'program') setProgramTab(state.programTab);
    if (id === 'score') initQuiz();
    if (id === 'followup') renderSessions();
}

// --- JOURNAL BIEN-ÊTRE ---
let chartInstance = null;

function updateVal(key) {
    const val = document.getElementById(`input-${key}`).value;
    document.getElementById(`val-${key}`).innerText = val;
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

    // Update or Add
    const existingIndex = state.journal.findIndex(e => e.date === entry.date);
    if (existingIndex > -1) state.journal[existingIndex] = entry;
    else state.journal.push(entry);

    state.journal.sort((a,b) => new Date(a.date) - new Date(b.date));
    syncStorage();
    renderJournalChart();
    alert("Entrée enregistrée !");
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
                { label: 'Stress', data: last7.map(e => e.stress), borderColor: '#f87171', tension: 0.3, borderWidth: 2 },
                { label: 'Énergie', data: last7.map(e => e.energy), borderColor: '#fbbf24', tension: 0.3, borderWidth: 2 },
                { label: 'Sommeil', data: last7.map(e => e.sleep), borderColor: '#60a5fa', tension: 0.3, borderWidth: 2 },
                { label: 'Humeur', data: last7.map(e => e.mood), borderColor: '#34d399', tension: 0.3, borderWidth: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { min: 0, max: 10 } },
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } }
        }
    });
}

// --- PROGRAMME ---
const programs = {
    stress: {
        title: "Apaisement du Système Nerveux",
        advice: "Le stress chronique bloque le diaphragme. Apprenez à libérer votre respiration pour envoyer un message de sécurité à votre cerveau.",
        routines: ["10 min de cohérence cardiaque matin/soir", "Masser la zone réflexe du plexus solaire", "Écouter la piste audio de détente"],
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    sleep: {
        title: "Rituel d'Endormissement",
        advice: "La qualité du sommeil dépend de la chute de température corporelle. Un massage doux des pieds avant le coucher favorise ce processus.",
        routines: ["Pas d'écrans 1h avant le coucher", "Masser les points d'ancrage sous les talons", "Utiliser une huile essentielle de Lavande"],
        video: "https://www.youtube.com/embed/5qap5aO4i9A",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    digestion: {
        title: "Équilibre du Ventre",
        advice: "Le système digestif est notre second cerveau. Les tensions émotionnelles s'y logent souvent. La réflexologie aide à dénouer ces blocages.",
        routines: ["Verre d'eau tiède citronnée au réveil", "Masser la voûte plantaire (zone intestin)", "Prendre 3 respirations avant chaque repas"],
        video: "https://www.youtube.com/embed/zP12zM2796Y",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    }
};

function setProgramTab(id) {
    state.programTab = id;
    document.querySelectorAll('.prog-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
    
    const p = programs[id];
    const html = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in">
            <div class="space-y-6">
                <div>
                    <h3 class="text-2xl font-['Cormorant_Garamond'] text-[#8da399] font-bold mb-2">${p.title}</h3>
                    <p class="text-sm text-gray-500 italic border-l-4 border-[#f5f1e9] pl-4">${p.advice}</p>
                </div>
                <div>
                    <h4 class="font-bold text-xs uppercase text-gray-400 mb-3">Routine quotidienne</h4>
                    <ul class="space-y-2">
                        ${p.routines.map(r => `<li class="flex items-center gap-3 text-sm text-gray-600 bg-[#f5f1e9]/30 p-3 rounded-lg"><i data-lucide="check-circle" size="16" class="text-[#8da399]"></i> ${r}</li>`).join('')}
                    </ul>
                </div>
                <div class="p-4 bg-[#f5f1e9] rounded-2xl">
                    <p class="text-[10px] font-bold uppercase mb-2 tracking-widest text-[#8da399]">Audio Relaxation</p>
                    <audio controls class="w-full h-8 opacity-70">
                        <source src="${p.audio}" type="audio/mpeg">
                    </audio>
                </div>
            </div>
            <div>
                <div class="aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-100">
                    <iframe width="100%" height="100%" src="${p.video}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    `;
    document.getElementById('program-content').innerHTML = html;
    lucide.createIcons();
}

// --- SCORE D'ÉQUILIBRE ---
const quizQuestions = [
    "Je me sens calme face aux imprévus.",
    "Mon sommeil est profond et réparateur.",
    "Je digère facilement tous mes repas.",
    "J'ai de l'énergie dès le saut du lit.",
    "Je m'accorde du temps pour moi chaque jour.",
    "Mes muscles (épaules, dos) sont détendus.",
    "Je respire naturellement par le ventre.",
    "Je me sens concentré(e) dans mon travail.",
    "Je gère mes émotions sans être submergé(e).",
    "J'ai un appétit régulier et sain.",
    "Je ris souvent au cours de ma journée.",
    "Je me sens physiquement souple et léger.",
    "Mon esprit est paisible le soir venu.",
    "Je suis à l'écoute de mes besoins corporels.",
    "Je me sens globalement en équilibre."
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
                ${[1,2,3,4,5].map(v => `
                    <label class="flex-1 text-center group cursor-pointer">
                        <input type="radio" name="q${i}" value="${v}" class="hidden peer">
                        <div class="py-2 bg-[#f5f1e9]/50 rounded-lg text-xs text-gray-400 peer-checked:bg-[#8da399] peer-checked:text-white transition-all">${v}</div>
                    </label>
                `).join('')}
            </div>
        `;
        container.appendChild(div);
    });
}

function calculateScore() {
    let total = 0;
    let completed = true;
    for(let i=0; i<15; i++) {
        const val = document.querySelector(`input[name="q${i}"]:checked`);
        if (!val) { completed = false; break; }
        total += parseInt(val.value);
    }

    if (!completed) {
        alert("Veuillez répondre à toutes les questions.");
        return;
    }

    document.getElementById('score-quiz').classList.add('hidden');
    document.getElementById('score-result').classList.remove('hidden');
    document.getElementById('final-score').innerText = total;

    const label = document.getElementById('score-label');
    const advice = document.getElementById('score-advice');

    if (total <= 35) {
        label.innerText = "Besoin de Ressourcement";
        advice.innerText = "Votre niveau d'énergie est bas. Il est temps de lever le pied et de programmer une séance complète de réflexologie.";
    } else if (total <= 60) {
        label.innerText = "Équilibre en Construction";
        advice.innerText = "Vous êtes sur la bonne voie, mais des tensions persistent. Poursuivez vos routines quotidiennes.";
    } else {
        label.innerText = "Plénitude & Harmonie";
        advice.innerText = "Bravo ! Vous avez trouvé un rythme sain et une belle écoute de vous-même. Cultivez cet état de grâce.";
    }
}

function resetQuiz() {
    document.getElementById('score-result').classList.add('hidden');
    document.getElementById('score-quiz').classList.remove('hidden');
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
}

// --- SUIVI SÉANCES ---
function toggleSessionForm() {
    document.getElementById('session-form').classList.toggle('hidden');
}

function addSession() {
    const session = {
        id: Date.now(),
        date: document.getElementById('sess-date').value || new Date().toLocaleDateString('fr-FR'),
        objective: document.getElementById('sess-obj').value,
        advice: document.getElementById('sess-adv').value,
        done: false
    };

    if (!session.objective) return;

    state.sessions.unshift(session);
    syncStorage();
    renderSessions();
    toggleSessionForm();
    document.getElementById('sess-obj').value = "";
    document.getElementById('sess-adv').value = "";
}

function deleteSession(id) {
    state.sessions = state.sessions.filter(s => s.id !== id);
    syncStorage();
    renderSessions();
}

function toggleDone(id) {
    const s = state.sessions.find(x => x.id === id);
    if (s) s.done = !s.done;
    syncStorage();
    renderSessions();
}

function renderSessions() {
    const container = document.getElementById('sessions-list');
    container.innerHTML = state.sessions.map(s => `
        <div class="bg-white p-6 rounded-2xl shadow-sm border ${s.done ? 'border-[#8da399]' : 'border-gray-50'} relative transition-all">
            <button onclick="deleteSession(${s.id})" class="absolute top-4 right-4 text-gray-300 hover:text-red-400">×</button>
            <span class="text-[10px] font-bold text-[#8da399] bg-[#f5f1e9] px-3 py-1 rounded-full uppercase mb-4 inline-block">${s.date}</span>
            <h4 class="text-xl font-['Cormorant_Garamond'] font-bold mb-2">${s.objective}</h4>
            <p class="text-xs text-gray-500 italic mb-6">"${s.advice}"</p>
            <button onclick="toggleDone(${s.id})" class="w-full py-3 rounded-xl border-2 ${s.done ? 'bg-[#8da399] border-[#8da399] text-white' : 'border-[#8da399] text-[#8da399] hover:bg-[#8da399]/5'} font-bold transition-all">
                ${s.done ? '<i data-lucide="check" class="inline-block mr-2" size="16"></i> Objectif Atteint' : 'Je l\'ai fait'}
            </button>
        </div>
    `).join('');
    lucide.createIcons();
}

// --- RESPIRATION ---
let breathInterval = null;
let isBreathing = false;
let breathTime = 5;
let breathPhase = 'inhale';
let totalCycles = 0;

function toggleBreathing() {
    const circle = document.getElementById('breath-circle');
    const text = document.getElementById('breath-text');
    const timer = document.getElementById('breath-timer');
    const icon = document.getElementById('breath-icon');
    const ripple = document.getElementById('ripple');

    if (isBreathing) {
        clearInterval(breathInterval);
        isBreathing = false;
        circle.className = "relative z-10 w-48 h-48 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center border-4 border-[#f5f1e9] transition-all duration-500 ease-in-out";
        text.innerText = "Prêt ?";
        timer.classList.add('hidden');
        ripple.classList.remove('active');
        document.getElementById('breath-btn').className = "w-20 h-20 bg-[#8da399] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#8da399]/30 transition-transform active:scale-95";
        icon.setAttribute('data-lucide', 'play');
    } else {
        isBreathing = true;
        breathTime = 5;
        breathPhase = 'inhale';
        timer.classList.remove('hidden');
        ripple.classList.add('active');
        document.getElementById('breath-btn').className = "w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-xl shadow-red-100 transition-transform active:scale-95";
        icon.setAttribute('data-lucide', 'square');
        
        startBreathCycle();
        breathInterval = setInterval(updateBreath, 1000);
    }
    lucide.createIcons();
}

function startBreathCycle() {
    const circle = document.getElementById('breath-circle');
    const text = document.getElementById('breath-text');
    
    if (breathPhase === 'inhale') {
        circle.classList.add('inhaling');
        circle.classList.remove('exhaling');
        text.innerText = "Inspirer";
    } else {
        circle.classList.add('exhaling');
        circle.classList.remove('inhaling');
        text.innerText = "Expirer";
    }
}

function updateBreath() {
    breathTime--;
    document.getElementById('breath-timer').innerText = breathTime;

    if (breathTime <= 0) {
        breathTime = 5;
        if (breathPhase === 'inhale') {
            breathPhase = 'exhale';
        } else {
            breathPhase = 'inhale';
            totalCycles++;
            document.getElementById('cycle-count').innerText = totalCycles;
            document.getElementById('total-min').innerText = (totalCycles * 10 / 60).toFixed(1);
        }
        startBreathCycle();
    }
}

// Initial Landing
document.getElementById('journal-date').valueAsDate = new Date();
showSection('home');
