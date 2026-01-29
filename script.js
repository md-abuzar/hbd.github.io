
import { GoogleGenAI } from "@google/genai";

// --- CONFIG & STATE ---
const NAME = "Sifat";
const BIRTH_MONTH = 0; // January (0-indexed)
const BIRTH_DAY = 30;

const getDates = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // The exact moment the birthday starts (12:00 AM)
    const targetThisYear = new Date(currentYear, BIRTH_MONTH, BIRTH_DAY, 0, 0, 0);
    // The moment the birthday ends (11:59:59 PM)
    const endOfBirthday = new Date(currentYear, BIRTH_MONTH, BIRTH_DAY, 23, 59, 59);
    
    let targetDate = targetThisYear;
    let isBirthdayToday = false;

    if (now > endOfBirthday) {
        // If today is after Jan 30th, target next year
        targetDate = new Date(currentYear + 1, BIRTH_MONTH, BIRTH_DAY, 0, 0, 0);
    } else if (now >= targetThisYear && now <= endOfBirthday) {
        // It is currently Jan 30th!
        isBirthdayToday = true;
    }

    return { targetDate, isBirthdayToday };
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
    if (el.seconds) el.seconds.textContent = String(s).padStart(2, '0');
    
    return false;
}

// --- AI MESSAGE GENERATION ---
async function generateMessage() {
    const el = getElements();
    
    // Fallback if process.env is not defined in the environment
    let apiKey = '';
    try {
        apiKey = process.env.API_KEY;
    } catch (e) {
        console.warn("API Key not found in process.env");
    }
    
    if (!apiKey) {
        if (el.aiMessage) el.aiMessage.textContent = `To my dearest ${NAME}, every moment with you is a treasure. Happy Birthday! You are the light that Jan 30th was made to celebrate.`;
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Write a poetic, deeply romantic, and soul-stirring birthday letter for ${NAME}. 
                       It should be about 60-80 words, mentioning her special day (Jan 30th). 
                       Keep it elegant and heartfelt.`
        });
        
        const text = response.text || `To my dearest ${NAME}, you are the light of my life. Happy Birthday!`;
        if (el.aiMessage) el.aiMessage.innerHTML = text.replace(/\n/g, '<br>');
    } catch (error) {
        console.error("AI Error:", error);
        if (el.aiMessage) el.aiMessage.textContent = `To my dearest ${NAME}, on your special day, I want you to know how much you are loved. Every moment with you is a gift. Happy Birthday!`;
    }
}

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    initHearts();
    const el = getElements();

    // Set up envelope click
    if (el.envelopeTrigger) {
        el.envelopeTrigger.addEventListener('click', () => {
            if (el.envelopeUi) el.envelopeUi.classList.add('open');
            if (el.seal) el.seal.classList.add('hidden');
            
            setTimeout(() => {
                showSection('card');
            }, 1500);
        });
    }

    // Start timer loop
    const initialCheck = updateCountdown();
    if (!initialCheck) {
        const timerInterval = setInterval(() => {
            const isFinished = updateCountdown();
            if (isFinished) clearInterval(timerInterval);
        }, 1000);
    }
});
