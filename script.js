
import { GoogleGenAI } from "@google/genai";

// --- CONFIG & STATE ---
const NAME = "Sifat";
const BIRTH_MONTH = 0; // January
const BIRTH_DAY = 30;
const AGE = 22;

const getDates = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const targetThisYear = new Date(currentYear, BIRTH_MONTH, BIRTH_DAY, 0, 0, 0);
    const endOfBirthday = new Date(currentYear, BIRTH_MONTH, BIRTH_DAY, 23, 59, 59);
    
    let targetDate = targetThisYear;
    let isBirthdayToday = false;

    if (now > endOfBirthday) {
        targetDate = new Date(currentYear + 1, BIRTH_MONTH, BIRTH_DAY, 0, 0, 0);
    } else if (now >= targetThisYear && now <= endOfBirthday) {
        isBirthdayToday = true;
    }

    return { targetDate, isBirthdayToday };
};

// --- CONFETTI LOGIC ---
const confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    colors: ['#fb7185', '#fb923c', '#f472b6', '#facc15', '#ffffff'],
    
    init() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    fire() {
        for (let i = 0; i < 150; i++) {
            this.particles.push({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.8) * 20,
                size: Math.random() * 8 + 4,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                life: 1
            });
        }
        this.animate();
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.5; // Gravity
            p.life -= 0.01;
            
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (p.life <= 0) this.particles.splice(i, 1);
        }
        
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
};

// --- DOM ELEMENTS ---
const getElements = () => ({
    countdown: document.getElementById('section-countdown'),
    envelope: document.getElementById('section-envelope'),
    card: document.getElementById('section-card'),
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    heartsContainer: document.getElementById('hearts-container'),
    envelopeTrigger: document.getElementById('envelope-trigger'),
    envelopeUi: document.getElementById('envelope-ui'),
    aiMessage: document.getElementById('ai-message'),
    seal: document.getElementById('seal')
});

// --- FLOATING HEARTS SYSTEM ---
function initHearts() {
    const container = document.getElementById('hearts-container');
    if (!container) return;

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart-particle text-rose-300';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (10 + Math.random() * 30) + 'px';
        heart.style.animationDuration = (5 + Math.random() * 10) + 's';
        heart.style.opacity = (0.1 + Math.random() * 0.4).toString();
        
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 15000);
    }, 1500);
}

// --- NAVIGATION ---
function showSection(sectionName) {
    const el = getElements();
    if (!el.countdown || !el.envelope || !el.card) return;

    el.countdown.classList.add('hidden');
    el.envelope.classList.add('hidden');
    el.card.classList.add('hidden');

    if (sectionName === 'countdown') el.countdown.classList.remove('hidden');
    if (sectionName === 'envelope') el.envelope.classList.remove('hidden');
    if (sectionName === 'card') {
        el.card.classList.remove('hidden');
        generateMessage();
        confetti.fire(); // Trigger confetti when card appears
    }
}

// --- COUNTDOWN LOGIC ---
function updateCountdown() {
    const el = getElements();
    const { targetDate, isBirthdayToday } = getDates();

    if (isBirthdayToday) {
        showSection('envelope');
        return true;
    }

    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
        showSection('envelope');
        return true;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    if (el.days) el.days.textContent = String(d).padStart(2, '0');
    if (el.hours) el.hours.textContent = String(h).padStart(2, '0');
    if (el.minutes) el.minutes.textContent = String(m).padStart(2, '0');
    if (el.seconds)