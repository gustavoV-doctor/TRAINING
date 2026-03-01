/* ========================================
   DEMON TRAINING — App Logic
   ======================================== */

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.7 ? '#c41e3a' : '#ffffff'
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // Update
            p.x += p.vx;
            p.y += p.vy;

            // Wrap
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fill();

            // Lines between nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = '#c41e3a';
                    this.ctx.globalAlpha = (1 - dist / 120) * 0.15;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ===== DATA =====
const WORKOUT_NAMES = {
    baki: 'PROTOCOLO BAKI',
    yujiro: 'FÚRIA DO OGRO',
    hanayama: 'GRIP DE HANAYAMA',
    oliva: 'TANQUE OLIVA',
    retsu: 'FLUXO DE RETSU',
    doppo: 'KARATE DOPPO'
};

const WORKOUT_ICONS = {
    baki: '🏋️',
    yujiro: '💪',
    hanayama: '🔥',
    oliva: '🦵',
    retsu: '🔄',
    doppo: '⚡'
};

const RANKS = [
    { level: 1, name: 'NOVATO', xpNeeded: 1000 },
    { level: 2, name: 'INICIANTE', xpNeeded: 2500 },
    { level: 3, name: 'LUTADOR', xpNeeded: 5000 },
    { level: 4, name: 'GUERREIRO', xpNeeded: 8000 },
    { level: 5, name: 'CAMPEÃO', xpNeeded: 12000 },
    { level: 6, name: 'MESTRE', xpNeeded: 18000 },
    { level: 7, name: 'LENDA', xpNeeded: 25000 },
    { level: 8, name: 'DEMÔNIO', xpNeeded: 35000 },
    { level: 9, name: 'OGRO', xpNeeded: 50000 },
    { level: 10, name: 'HANMA', xpNeeded: 999999 },
];

const MUSCLE_DATA = {
    chest: {
        name: 'PEITO',
        desc: 'Peito destruidor usando Smith e polias para máxima hipertrofia.',
        exercises: [
            { name: 'Supino Reto Smith', sets: '4x10' },
            { name: 'Supino Inclinado Smith', sets: '4x10' },
            { name: 'Crucifixo Polia Fixa', sets: '3x12' },
            { name: 'Crossover Cabo Baixo', sets: '3x15' },
            { name: 'Flexão Fechada (Falha)', sets: '2x Falha' }
        ]
    },
    shoulders: {
        name: 'OMBROS',
        desc: 'Deltóides 3D com militar no Smith e cabos para isolação.',
        exercises: [
            { name: 'Desenv. Militar Smith', sets: '4x10' },
            { name: 'Elevação Lateral Cabo', sets: '4x15' },
            { name: 'Elevação Frontal Halter', sets: '3x12' },
            { name: 'Face Pull Polia Alta', sets: '4x15' },
            { name: 'Crucifixo Inverso Cabo', sets: '3x15' }
        ]
    },
    biceps: {
        name: 'BÍCEPS',
        desc: 'Braços de Oliva com tensão constante nas polias.',
        exercises: [
            { name: 'Rosca Direta Polia', sets: '4x12' },
            { name: 'Rosca Martelo Halter', sets: '3x12' },
            { name: 'Rosca 21s Polia', sets: '2x21' },
            { name: 'Rosca Concentrada Halter', sets: '3x12' },
            { name: 'Rosca Inversa Polia', sets: '3x15' }
        ]
    },
    abs: {
        name: 'ABDÔMEN',
        desc: 'Core de aço com abdominal na polia e isometria.',
        exercises: [
            { name: 'Abdominal Polia Alta', sets: '4x15' },
            { name: 'Prancha Isométrica', sets: '3x60s' },
            { name: 'Wood Chop Polia', sets: '3x12/lado' },
            { name: 'Crunch no Banco Inclinado', sets: '4x15' },
            { name: 'Pallof Press Polia', sets: '3x12/lado' }
        ]
    },
    forearms: {
        name: 'ANTEBRAÇO',
        desc: 'Grip destruidor como Hanayama usando cabos e halteres.',
        exercises: [
            { name: 'Rosca Punho Halter', sets: '4x20' },
            { name: 'Rosca Inversa Polia', sets: '3x15' },
            { name: 'Dead Hang na Smith', sets: '4x45s' },
            { name: 'Farmer Walk (Halteres)', sets: '3x30m' },
            { name: 'Extensão de Punho', sets: '3x15' }
        ]
    },
    quads: {
        name: 'QUADRÍCEPS',
        desc: 'Quadríceps massivos com Smith, leg press e extensora.',
        exercises: [
            { name: 'Agachamento Smith', sets: '4x10' },
            { name: 'Leg Press Sentado', sets: '4x12' },
            { name: 'Extensora', sets: '4x12' },
            { name: 'Avanço Smith', sets: '3x10/perna' },
            { name: 'Hack Squat Smith', sets: '3x12' }
        ]
    },
    calves: {
        name: 'PANTURRILHA',
        desc: 'Panturrilhas definidas com variações no Smith.',
        exercises: [
            { name: 'Panturrilha Smith (em pé)', sets: '5x15' },
            { name: 'Panturrilha Sentado Halter', sets: '4x20' },
            { name: 'Panturrilha Unilateral', sets: '3x15/perna' },
            { name: 'Tibial Anterior', sets: '3x20' },
            { name: 'Panturrilha Leg Press', sets: '4x15' }
        ]
    }
};

// ===== STATE =====
let timerInterval = null;
let timerTotal = 300;
let timerRemaining = 300;
let timerRunning = false;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    const canvas = document.getElementById('particles-canvas');
    if (canvas) new ParticleSystem(canvas);

    // Nav scroll
    initNav();

    // Scroll reveal
    initReveal();

    // Filters
    initFilters();

    // Muscle map
    initMuscleMap();

    // Load progress
    loadProgress();

    // Schedule
    initSchedule();

    // Nav toggle (mobile)
    const toggle = document.getElementById('nav-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('show');
        });
    }
});

// ===== NAVIGATION =====
function initNav() {
    const nav = document.getElementById('main-nav');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Nav background
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active link
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for nav links
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            // Close mobile nav
            document.querySelector('.nav-links').classList.remove('show');
        });
    });
}

// ===== SCROLL REVEAL =====
function initReveal() {
    const revealElements = document.querySelectorAll('.workout-card, .stat-card, .section-header, .timer-container, .level-display, .muscle-container');

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
}

// ===== WORKOUT FILTERS =====
function initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.workout-card');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                    card.style.animation = 'fadeSlideUp 0.5s ease both';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== TIMER =====
function setTimer(seconds) {
    if (timerRunning) return;

    timerTotal = seconds;
    timerRemaining = seconds;
    updateTimerDisplay();
    updateTimerProgress();

    // Update active preset
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.getAttribute('onclick').match(/\d+/)[0]) === seconds) {
            btn.classList.add('active');
        }
    });
}

function toggleTimer() {
    const btn = document.getElementById('timer-start');
    const label = document.getElementById('timer-label');

    if (timerRunning) {
        // Pause
        clearInterval(timerInterval);
        timerRunning = false;
        btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
        btn.classList.remove('active-timer');
        label.textContent = 'PAUSADO';
    } else {
        // Start
        if (timerRemaining <= 0) {
            timerRemaining = timerTotal;
        }
        timerRunning = true;
        btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        btn.classList.add('active-timer');
        label.textContent = 'LUTANDO';

        timerInterval = setInterval(() => {
            timerRemaining--;
            updateTimerDisplay();
            updateTimerProgress();

            if (timerRemaining <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
                btn.classList.remove('active-timer');
                label.textContent = 'COMPLETO!';
                label.style.color = '#d4a017';

                // Flash effect
                document.querySelector('.timer-ring').style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    document.querySelector('.timer-ring').style.animation = '';
                    label.style.color = '';
                }, 500);
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerRemaining = timerTotal;
    updateTimerDisplay();
    updateTimerProgress();

    const btn = document.getElementById('timer-start');
    const label = document.getElementById('timer-label');
    btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
    btn.classList.remove('active-timer');
    label.textContent = 'PRONTO';
    label.style.color = '';
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerRemaining / 60);
    const seconds = timerRemaining % 60;
    document.getElementById('timer-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('timer-seconds').textContent = String(seconds).padStart(2, '0');
}

function updateTimerProgress() {
    const progress = document.getElementById('timer-progress');
    const circumference = 2 * Math.PI * 120; // r=120
    const offset = circumference * (1 - timerRemaining / timerTotal);
    progress.style.strokeDashoffset = offset;
}

// ===== WORKOUT COMPLETION =====
function startWorkout(id, xp) {
    // Show modal
    const modal = document.getElementById('workout-modal');
    document.getElementById('modal-icon').textContent = WORKOUT_ICONS[id] || '🥊';
    document.getElementById('modal-title').textContent = WORKOUT_NAMES[id] || 'TREINO COMPLETO';
    document.getElementById('modal-desc').textContent = 'Protocolo registrado com sucesso!';
    document.getElementById('modal-xp-value').textContent = '+' + xp;

    modal.classList.add('show');

    // Add XP
    addXP(xp, id);
}

function closeModal() {
    document.getElementById('workout-modal').classList.remove('show');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.id === 'workout-modal') closeModal();
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ===== PROGRESS / XP SYSTEM =====
function getProgress() {
    const saved = localStorage.getItem('demonTraining');
    if (saved) return JSON.parse(saved);
    return {
        xp: 0,
        level: 1,
        totalWorkouts: 0,
        streak: 0,
        lastWorkoutDate: null,
        bestWorkout: null,
        history: []
    };
}

function saveProgress(data) {
    localStorage.setItem('demonTraining', JSON.stringify(data));
}

function loadProgress() {
    const data = getProgress();
    updateProgressUI(data);
}

function addXP(amount, workoutId) {
    const data = getProgress();

    data.xp += amount;
    data.totalWorkouts++;

    // Streak
    const today = new Date().toDateString();
    if (data.lastWorkoutDate) {
        const last = new Date(data.lastWorkoutDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (last.toDateString() === yesterday.toDateString()) {
            data.streak++;
        } else if (last.toDateString() !== today) {
            data.streak = 1;
        }
    } else {
        data.streak = 1;
    }
    data.lastWorkoutDate = today;

    // Best workout
    if (!data.bestWorkout || amount > (data.bestXP || 0)) {
        data.bestWorkout = WORKOUT_NAMES[workoutId] || workoutId;
        data.bestXP = amount;
    }

    // History
    data.history.unshift({
        name: WORKOUT_NAMES[workoutId] || workoutId,
        xp: amount,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });
    if (data.history.length > 20) data.history.pop();

    // Level check
    const oldLevel = data.level;
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (data.xp < RANKS[i].xpNeeded) {
            data.level = RANKS[i].level;
        }
    }
    // Recalculate: find the highest rank the player qualifies for
    data.level = 1;
    for (let i = 0; i < RANKS.length; i++) {
        if (data.xp >= (i === 0 ? 0 : RANKS[i - 1].xpNeeded)) {
            data.level = RANKS[i].level;
        }
    }

    saveProgress(data);
    updateProgressUI(data);

    // Level up notification
    if (data.level > oldLevel) {
        showLevelUp(data.level);
    }
}

function updateProgressUI(data) {
    // Level
    document.getElementById('level-number').textContent = data.level;

    // Rank name
    const rank = RANKS.find(r => r.level === data.level);
    document.getElementById('level-rank').textContent = rank ? rank.name : 'NOVATO';

    // XP Bar
    const currentRankIndex = data.level - 1;
    const prevXP = currentRankIndex > 0 ? RANKS[currentRankIndex - 1].xpNeeded : 0;
    const nextXP = RANKS[currentRankIndex] ? RANKS[currentRankIndex].xpNeeded : 999999;
    const progress = ((data.xp - prevXP) / (nextXP - prevXP)) * 100;
    document.getElementById('xp-bar').style.width = Math.min(progress, 100) + '%';
    document.getElementById('xp-text').textContent = `${data.xp} / ${nextXP} XP`;

    // Stats
    document.getElementById('stat-total-workouts').textContent = data.totalWorkouts;
    document.getElementById('stat-total-xp').textContent = data.xp.toLocaleString();
    document.getElementById('stat-streak').textContent = data.streak;
    document.getElementById('stat-best-workout').textContent = data.bestWorkout || '-';

    // History
    const historyList = document.getElementById('history-list');
    if (data.history.length === 0) {
        historyList.innerHTML = '<div class="history-empty"><span>Nenhum treino registrado ainda. Comece agora!</span></div>';
    } else {
        historyList.innerHTML = data.history.map(item => `
            <div class="history-item">
                <div>
                    <span class="history-item-name">${item.name}</span>
                    <span class="history-item-date">${item.date} às ${item.time}</span>
                </div>
                <span class="history-item-xp">+${item.xp} XP</span>
            </div>
        `).join('');
    }
}

function showLevelUp(level) {
    const rank = RANKS.find(r => r.level === level);
    const toast = document.getElementById('level-up-toast');
    document.getElementById('toast-level-desc').textContent = `Nível ${level} — ${rank ? rank.name : '???'}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ===== MUSCLE MAP =====
function initMuscleMap() {
    const points = document.querySelectorAll('.muscle-point');
    const infoPanel = document.getElementById('muscle-info');

    points.forEach(point => {
        point.addEventListener('click', () => {
            // Normalize muscle key (remove -r suffix for right-side duplicates)
            let muscle = point.dataset.muscle.replace('-r', '');
            const data = MUSCLE_DATA[muscle];

            if (!data) return;

            // Active state
            points.forEach(p => p.classList.remove('active'));
            // Activate both sides
            document.querySelectorAll(`[data-muscle="${muscle}"], [data-muscle="${muscle}-r"]`).forEach(p => {
                p.classList.add('active');
            });

            // Show info
            infoPanel.innerHTML = `
                <div class="muscle-info-content">
                    <h3>${data.name}</h3>
                    <p>${data.desc}</p>
                    <ul class="muscle-exercises">
                        ${data.exercises.map(ex => `
                            <li>
                                <span class="muscle-ex-name">${ex.name}</span>
                                <span class="muscle-ex-sets">${ex.sets}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });
    });
}

// ===== WEEKLY SCHEDULE =====
function initSchedule() {
    const today = new Date().getDay(); // 0=Sun, 1=Mon, ...
    const days = document.querySelectorAll('.schedule-day');

    const SCHEDULE = {
        0: { name: 'DESCANSO TOTAL', protocol: 'Recuperação — Sono & Nutrição', rest: true },
        1: { name: 'PEITO & TRÍCEPS', protocol: 'Protocolo Baki — Drop Sets', rest: false },
        2: { name: 'COSTAS & BÍCEPS', protocol: 'Fúria do Ogro — Rest-Pause', rest: false },
        3: { name: 'DESCANSO ATIVO', protocol: 'Alongamento & Cardio leve', rest: true },
        4: { name: 'OMBROS & TRAPÉZIO', protocol: 'Grip de Hanayama — Myo-Reps', rest: false },
        5: { name: 'PERNAS COMPLETO', protocol: 'Tanque Oliva — Tempo Training', rest: false },
        6: { name: 'PUSH-PULL', protocol: 'Fluxo de Retsu — Supersets', rest: false }
    };

    // Highlight today's card
    days.forEach(day => {
        const dayNum = parseInt(day.dataset.day);
        if (dayNum === today) {
            day.classList.add('today-highlight');
        }
    });

    // Update today banner
    const todayText = document.getElementById('today-text');
    if (todayText && SCHEDULE[today]) {
        const info = SCHEDULE[today];
        if (info.rest) {
            todayText.textContent = `${info.name} — ${info.protocol}`;
        } else {
            todayText.textContent = `${info.name} → ${info.protocol}`;
        }
    }
}
