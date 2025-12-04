// State Variables
let floor = 1.0; 
let ceiling = 5.0; 
let isRunning = false;
let timeoutId = null;

// DOM Elements
const elDisplay = document.getElementById('main-display');
const elText = document.getElementById('action-text');
const elFloorVal = document.getElementById('floor-value');
const elCeilingVal = document.getElementById('ceiling-value');
const btnPause = document.getElementById('btn-pause');

// Options Config
const options = [
    { text: "I COMMIT!", color: "var(--bg-green)" },
    { text: "DO A MIX-UP!", color: "var(--bg-red)" }
];

// Helper
const formatTime = (val) => val.toFixed(1);

// Update UI
function updateUI() {
    elFloorVal.textContent = formatTime(floor);
    elCeilingVal.textContent = formatTime(ceiling);
}

// Logic
function getRandomTime(min, max) {
    return (Math.random() * (max - min) + min) * 1000;
}

function triggerNext() {
    if (!isRunning) return;

    const choice = options[Math.floor(Math.random() * options.length)];
    
    // Apply colors to the MAIN DISPLAY area
    elDisplay.style.backgroundColor = choice.color;
    elText.textContent = choice.text;

    const delay = getRandomTime(floor, ceiling);
    timeoutId = setTimeout(triggerNext, delay);
}

function togglePlay() {
    if (isRunning) {
        isRunning = false;
        clearTimeout(timeoutId);
        btnPause.textContent = "Start";
        elDisplay.style.backgroundColor = "transparent"; // Reverts to body grey
        elText.textContent = "PAUSED";
    } else {
        isRunning = true;
        btnPause.textContent = "Pause";
        triggerNext(); 
    }
}

function adjustFloor(delta) {
    const newVal = floor + delta;
    if (newVal >= 0.1 && newVal <= ceiling) {
        floor = newVal;
        updateUI();
    }
}

function adjustCeiling(delta) {
    const newVal = ceiling + delta;
    if (newVal >= floor) {
        ceiling = newVal;
        updateUI();
    }
}

// Listeners
document.getElementById('btn-floor-inc').addEventListener('click', () => adjustFloor(0.5));
document.getElementById('btn-floor-dec').addEventListener('click', () => adjustFloor(-0.5));
document.getElementById('btn-ceiling-inc').addEventListener('click', () => adjustCeiling(0.5));
document.getElementById('btn-ceiling-dec').addEventListener('click', () => adjustCeiling(-0.5));
btnPause.addEventListener('click', togglePlay);

document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(e => console.log(e));
    } else {
        document.exitFullscreen();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { 
        e.preventDefault(); 
        togglePlay();
    }
});

updateUI();
