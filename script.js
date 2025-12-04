/* script.js */
// State Variables
let floor = 1.0; 
let ceiling = 5.0; 
let isRunning = true; // Auto-start enabled

// Timing Variables
let startTime = 0;
let nextChangeDuration = 0;
let animationFrameId = null;

// DOM Elements
const elDisplay = document.getElementById('main-display');
const elText = document.getElementById('action-text');
const elFloorVal = document.getElementById('floor-value');
const elCeilingVal = document.getElementById('ceiling-value');
const btnPause = document.getElementById('btn-pause');
const elProbVal = document.getElementById('prob-value');
const elTimerVal = document.getElementById('timer-value');

// Options Config
const options = [
    { text: "I COMMIT!", color: "var(--bg-green)" },
    { text: "DO A MIX-UP!", color: "var(--bg-red)" }
];

// Helper: Format Time
const formatTime = (val) => val.toFixed(1);

// Helper: Box-Muller Transform (Bell Curve Generator)
// Returns a random number with a standard normal distribution (mean=0, stdev=1)
function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Logic: Get Random Duration using Normal Distribution
function getBellCurveDuration(min, max) {
    const mean = (min + max) / 2;
    const range = max - min;
    // We assume the range (max - min) covers about 6 standard deviations (-3 to +3)
    // This creates a bell curve centered between floor and ceiling.
    const stdDev = range / 6; 
    
    let num = randn_bm() * stdDev + mean;

    // Clamp values to ensure strictly within floor/ceiling
    return Math.max(min, Math.min(max, num)) * 1000; // Return in ms
}

// Logic: Calculate Visual Probability Percentage
// Quadratic curve: 0% at <floor, 20% at floor, 30% at mid, 20% at ceiling
function calculateProbability(elapsedMs, floorSec, ceilingSec) {
    const elapsedSec = elapsedMs / 1000;

    if (elapsedSec < floorSec) return 0; // 0% before floor
    if (elapsedSec > ceilingSec) return 20; // Cap at 20% if we hit ceiling

    // Normalize progress (0.0 to 1.0) between floor and ceiling
    const range = ceilingSec - floorSec;
    if (range <= 0) return 20; // Edge case
    const progress = (elapsedSec - floorSec) / range;

    // Quadratic Formula: y = -40(x - 0.5)^2 + 30
    // At x=0 (floor), y=20. At x=0.5 (mid), y=30. At x=1 (ceiling), y=20.
    const percent = -40 * Math.pow(progress - 0.5, 2) + 30;
    
    return Math.max(0, Math.round(percent));
}

// Update UI Text
function updateUI() {
    elFloorVal.textContent = formatTime(floor);
    elCeilingVal.textContent = formatTime(ceiling);
}

// Main Loop (Runs every frame)
function gameLoop(timestamp) {
    if (!isRunning) return;

    // Check time
    const elapsed = timestamp - startTime;
    const elapsedSec = elapsed / 1000;

    // Update Stats Display
    elTimerVal.textContent = elapsedSec.toFixed(3);
    const prob = calculateProbability(elapsed, floor, ceiling);
    elProbVal.textContent = `${prob}%`;

    // Trigger Change
    if (elapsed >= nextChangeDuration) {
        triggerChange(timestamp);
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

function triggerChange(timestamp) {
    // 1. Pick Option
    const choice = options[Math.floor(Math.random() * options.length)];
    
    // 2. Update Visuals
    elDisplay.style.backgroundColor = choice.color;
    elText.textContent = choice.text;

    // 3. Reset Timing
    startTime = timestamp || performance.now();
    nextChangeDuration = getBellCurveDuration(floor, ceiling);
}

// Controls

function togglePlay() {
    if (isRunning) {
        // Stop
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
        btnPause.textContent = "Start";
        elText.textContent = "PAUSED";
        elDisplay.style.backgroundColor = "var(--bg-neutral)";
    } else {
        // Start
        isRunning = true;
        btnPause.textContent = "Pause";
        // Reset timer immediately
        startTime = performance.now();
        nextChangeDuration = getBellCurveDuration(floor, ceiling);
        requestAnimationFrame(gameLoop);
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

// Event Listeners
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

// Initialization
updateUI();
// Start immediately
triggerChange(performance.now());
requestAnimationFrame(gameLoop);
