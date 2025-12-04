const body = document.body;
const instruction = document.getElementById('instruction');
const startStopBtn = document.getElementById('start-stop-btn');
const waitBtn = document.getElementById('wait-btn'); // NOTE: Make sure to add id="wait-btn" to HTML
const signalBox = document.getElementById('signal-box'); 
const durationTimerDisplay = document.getElementById('duration-timer');
const probabilityDisplay = document.getElementById('probability-display'); 
const floorDisplay = document.getElementById('floor-display');
const ceilingDisplay = document.getElementById('ceiling-display');

let timer; 
let counterInterval; 
let startTime = 0;
let isRunning = false;
let isWaitEnabled = false;

// 0: Green (Commit), 1: Red (Mixup), 2: Yellow (Wait)
let lastChoice = null; 

// Text Constants
const INSTRUCTION_COMMIT = 'I COMMIT!';
const INSTRUCTION_MIXUP = 'DO A MIX-UP!';
const INSTRUCTION_WAIT = 'I DO NOTHING!';

// Defined constraints
let MIN_DELAY = 1000; 
let MAX_DELAY = 5000; 
let MEAN_DELAY = (MIN_DELAY + MAX_DELAY) / 2; 
const SIGMA = 850; 

// --- Utility Functions ---

function formatDelayControls(ms) {
    const seconds = Math.floor(ms / 1000);
    const tenthsOfSecond = Math.floor((ms % 1000) / 100); 
    return `${seconds}.${tenthsOfSecond}`;
}

function formatDelayTimer(ms) {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    const formattedMilliseconds = String(milliseconds).padStart(3, '0');
    return `${seconds}.${formattedMilliseconds}`;
}

// --- Toggle Logic for Wait Choice ---

function toggleWaitChoice() {
    isWaitEnabled = !isWaitEnabled;
    
    if (isWaitEnabled) {
        waitBtn.textContent = "Remove Wait Choice";
    } else {
        waitBtn.textContent = "Add Wait Choice";
        
        // OPTIMIZATION: If we are currently "Waiting" but just removed that option...
        // ... force an immediate switch to Commit or Mixup.
        if (lastChoice === 2 && isRunning) {
            clearTimeout(timer); // Cancel the pending schedule
            changeSignal(true); // Force switch immediately
        }
    }
}

// --- Delay Change Control Logic ---

function changeDelay(target, step) {
    let newDelay;
    if (target === 'floor') {
        newDelay = MIN_DELAY + step;
        if (newDelay < 500) return;
        if (newDelay > MAX_DELAY - 500) return;

        MIN_DELAY = newDelay;
        floorDisplay.textContent = formatDelayControls(MIN_DELAY);
    } else if (target === 'ceiling') {
        newDelay = MAX_DELAY + step;
        if (newDelay > 9500) return;
        if (newDelay < MIN_DELAY + 500) return;

        MAX_DELAY = newDelay;
        ceilingDisplay.textContent = formatDelayControls(MAX_DELAY);
    }
    
    MEAN_DELAY = (MIN_DELAY + MAX_DELAY) / 2;
    if (isRunning) {
        stopSignals();
        startSignals();
    }
}

// --- Normal Distribution Function ---

function getRandomNormalDelay() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); 
    
    let randomDelay = z * SIGMA + MEAN_DELAY;
    randomDelay = Math.max(MIN_DELAY, Math.min(MAX_DELAY, randomDelay));

    return Math.floor(randomDelay);
}

// --- Probability Calculation ---

function getLinearProbability(elapsedTime) {
    const t = elapsedTime;
    let probabilityPercent = 0;
    const T1 = MIN_DELAY; 
    const P1 = 20;   
    const T_MEAN = MEAN_DELAY; 
    const P_MEAN = 30;
    const T5 = MAX_DELAY; 
    const P5 = 20;   

    if (t < T1) {
        probabilityPercent = 0;
    } else if (t >= T1 && t <= T_MEAN) {
        const slope = (P_MEAN - P1) / (T_MEAN - T1);
        probabilityPercent = P1 + slope * (t - T1);
    } else if (t > T_MEAN && t <= T5) {
        const slope = (P5 - P_MEAN) / (T5 - T_MEAN);
        probabilityPercent = P_MEAN + slope * (t - T_MEAN);
    } else if (t > T5) {
        probabilityPercent = 0;
    }
    return Math.round(probabilityPercent);
}

// --- Timer Utility Functions ---

function hideTimerDisplay() {
    durationTimerDisplay.style.visibility = 'hidden';
    probabilityDisplay.style.visibility = 'hidden'; 
}

function showTimerDisplay() {
    durationTimerDisplay.style.visibility = 'visible';
    probabilityDisplay.style.visibility = 'visible';
}

function startCounter() {
    startTime = Date.now();
    clearInterval(counterInterval); 
    counterInterval = setInterval(updateCounter, 10);
}

function stopCounter() {
    clearInterval(counterInterval);
    durationTimerDisplay.textContent = '0.000';
    probabilityDisplay.textContent = '0%';
}

function updateCounter() {
    if (!isRunning) return;
    
    const elapsed = Date.now() - startTime;
    const dynamicPercent = getLinearProbability(elapsed);
    probabilityDisplay.textContent = `${dynamicPercent}%`;
    
    if (elapsed >= MAX_DELAY) {
        clearTimeout(timer);
        changeSignal(true); // Force switch
        return;
    }
    
    durationTimerDisplay.textContent = formatDelayTimer(elapsed);
}

// --- Fullscreen Toggle ---

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        body.requestFullscreen().catch(err => {
            console.error(`Error enabling fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// --- Signal Controls ---

function startSignals() {
    if (isRunning) return; 
    isRunning = true;
    startStopBtn.textContent = 'Pause';
    instruction.textContent = 'GET READY';
    signalBox.style.backgroundColor = 'black';
    
    lastChoice = null; 
    
    hideTimerDisplay();
    startCounter(); 
    
    timer = setTimeout(changeSignal, 1500);
}

function stopSignals() {
    clearTimeout(timer);
    stopCounter(); 
    isRunning = false;
    startStopBtn.textContent = 'Start';
    signalBox.style.backgroundColor = 'black'; 
    instruction.textContent = 'PAUSED';
    hideTimerDisplay();
    lastChoice = null; 
}

function toggleSignals() {
    if (isRunning) {
        stopSignals();
    } else {
        startSignals();
    }
}

function changeSignal(forceSwitch = false) {
    if (!isRunning) return;

    // Define options based on toggle
    // 0 = Commit, 1 = Mixup, 2 = Wait
    const options = isWaitEnabled ? [0, 1, 2] : [0, 1];
    let nextChoice;
    
    // Helper to pick random item from array
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (forceSwitch) {
        // Must be different from last
        const available = options.filter(opt => opt !== lastChoice);
        // EDGE CASE: If we just removed Wait (2) and lastChoice was 2, 
        // options are [0, 1]. 'available' is [0, 1]. It picks a valid new one.
        nextChoice = pick(available);
    } else {
        // Pure random
        nextChoice = pick(options);
        
        // Soft Constraint: If same choice and near ceiling, re-roll logic (force switch)
        const currentElapsed = Date.now() - startTime;
        if (nextChoice === lastChoice && currentElapsed > (MAX_DELAY - 1000)) {
             const available = options.filter(opt => opt !== lastChoice);
             nextChoice = pick(available);
        }
    }
    
    // If the choice changed, reset the timer
    if (nextChoice !== lastChoice) {
        startCounter();
    }
    
    // Apply Visuals
    if (nextChoice === 0) { // Green
        signalBox.style.backgroundColor = 'green';
        instruction.textContent = INSTRUCTION_COMMIT;
    } else if (nextChoice === 1) { // Red
        signalBox.style.backgroundColor = 'red';
        instruction.textContent = INSTRUCTION_MIXUP;
    } else if (nextChoice === 2) { // Yellow
        signalBox.style.backgroundColor = '#ffc400'; 
        instruction.textContent = INSTRUCTION_WAIT;
    }
    
    showTimerDisplay();
    lastChoice = nextChoice;

    const nextDelay = getRandomNormalDelay();
    clearTimeout(timer);
    timer = setTimeout(changeSignal, nextDelay);
}

// --- Initialization ---

MEAN_DELAY = (MIN_DELAY + MAX_DELAY) / 2;
if (floorDisplay && ceilingDisplay) {
    floorDisplay.textContent = formatDelayControls(MIN_DELAY);
    ceilingDisplay.textContent = formatDelayControls(MAX_DELAY);
}

startSignals();
