
import { GoogleGenAI } from "@google/genai";

// --- CONFIG & STATE ---
const NAME = "Sifat";
const TARGET_DATE = (() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const target = new Date(currentYear, 0, 30, 0, 0, 0); // Jan 30
    if (now > target) target.setFullYear(currentYear + 1);
    return target;
})();

// --- DOM ELEMENTS ---
const elements = {
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
};

// --- FLOATING HEARTS SYSTEM ---
function initHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart-particle text-rose-300';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (10 + Math.random() * 30) + 'px';
        heart.style.animationDuration = (5 + Math.random() * 10) + 's';
        heart.style.opacity = (0.1 + Math.random() * 0.4).toString();
        
        elements.heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 15000);
    }, 1500);
}

// --- COUNTDOWN LOGIC ---
function updateCountdown() {
    const now = new Date();
    const diff = TARGET_DATE.getTime() - now.getTime();

    if (diff <= 0) {
        showSection('envelope');
        return true;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    elements.days.textContent = String(d).padStart(2, '0');
    elements.hours.textContent = String(h).padStart(2, '0');
    elements.minutes.textContent = String(m).padStart(2, '0');
    elements.seconds.textContent = String(s).padStart(2, '0');
    return false;
}

// --- NAVIGATION ---
function showSection(sectionName: 'countdown' | 'envelope' | 'card') {
    elements.countdown.classList.add('hidden');
    elements.envelope.classList.add('hidden');
    elements.card.classList.add('hidden');

    if (sectionName === 'countdown') elements.countdown.classList.remove('hidden');
    if (sectionName === 'envelope') elements.envelope.classList.remove('hidden');
    if (sectionName === 'card') {
        elements.card.classList.remove('hidden');
        generateMessage();
    }
}

// --- AI MESSAGE GENERATION ---
async function generateMessage() {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Write a poetic, deeply romantic, and soul-stirring birthday letter for Sifat. 
                       It should be about 60-80 words, mentioning her special day (Jan 30th). 
                       Keep it elegant and heartfelt.`
        });
        
        const text = response.text || "To my dearest Sifat, every heartbeat of mine wishes you the most magical birthday. You are the light that Jan 30th was made to celebrate.";
        elements.aiMessage.innerHTML = text.replace(/\n/g, '<br>');
    } catch (error) {
        console.error("AI Error:", error);
        elements.aiMessage.textContent = "To my dearest Sifat, on your special day, I want you to know how much you are loved. Every moment with you is a gift. Happy Birthday!";
    }
}

// --- INITIALIZATION ---
initHearts();

// Check countdown every second
const timerInterval = setInterval(() => {
    const isFinished = updateCountdown();
    if (isFinished) clearInterval(timerInterval);
}, 1000);

// Envelope click event
elements.envelopeTrigger.addEventListener('click', () => {
    elements.envelopeUi.classList.add('open');
    elements.seal.classList.add('hidden');
    
    // Smooth transition to the card
    setTimeout(() => {
        showSection('card');
    }, 1500);
});

// Initial check
if (new Date() >= TARGET_DATE) {
    showSection('envelope');
} else {
    updateCountdown();
}
