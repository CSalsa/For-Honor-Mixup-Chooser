[cite_start]
const body = document.body;
const instruction = document.getElementById('instruction');
const startStopBtn = document.getElementById('start-stop-btn');
const signalBox = document.getElementById('signal-box'); 
const durationTimerDisplay = document.getElementById('duration-timer');
const probabilityDisplay = document.getElementById('probability-display'); 
const floorDisplay = document.getElementById('floor-display');
const ceilingDisplay = document.getElementById('ceiling-display');

let timer; 
let counterInterval; 
let startTime = 0;
let isRunning = false;

// Text Constants
const INSTRUCTION_MIXUP = 'DO A MIX-UP!';
const INSTRUCTION_COMMIT = 'I COMMIT!';

// Defined constraints (Variables for Floor/Ceiling controls)
let MIN_DELAY = 1000; // 1 second (Initial Floor)
let MAX_DELAY = 5000; // 5 seconds (Initial Ceiling)
let MEAN_DELAY = (MIN_DELAY + MAX_DELAY) / 2; 
const SIGMA = 850; 

let lastChoiceWasRed = null;

// --- Utility Functions ---

// Function for CONTROLS (S.M format)
function formatDelayControls(ms) {
    const seconds = Math.floor(ms / 1000);
    const tenthsOfSecond = Math.floor((ms % 1000) / 100); 
    return `${seconds}.${tenthsOfSecond}`;
}

// Function for TIMER DISPLAY (S.MMM format)
function formatDelayTimer(ms) {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    const formattedMilliseconds = String(milliseconds).padStart(3, '0');
    return `${seconds}.${formattedMilliseconds}`;
}

// --- Delay Change Control Logic ---

function changeDelay(target, step) {
    let newDelay;
    if (target === 'floor') {
        newDelay = MIN_DELAY + step;
        // Constraint 1: Floor minimum is 0.5 seconds (500ms)
        if (newDelay < 500) {
            return;
        }
        // Constraint 2: Floor must be at most 0.5 seconds less than the ceiling.
        if (newDelay > MAX_DELAY - 500) {
            return;
        }

        MIN_DELAY = newDelay;
        floorDisplay.textContent = formatDelayControls(MIN_DELAY);
    } else if (target === 'ceiling') {
        newDelay = MAX_DELAY + step;
        // Constraint 1: Ceiling maximum is 9.5 seconds (9500ms)
        if (newDelay > 9500) {
            return;
        }
        // Constraint 2: Ceiling must be at least 0.5 seconds greater than the floor.
        if (newDelay < MIN_DELAY + 500) {
            return;
        }

        MAX_DELAY = newDelay;
        ceilingDisplay.textContent = formatDelayControls(MAX_DELAY);
    }
    
    MEAN_DELAY = (MIN_DELAY + MAX_DELAY) / 2;
    if (isRunning) {
        stopSignals();
        startSignals();
    }
}

// --- Normal Distribution Function (For Next Delay) ---

function getRandomNormalDelay() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); 
    
    let randomDelay = z * SIGMA + MEAN_DELAY;
    randomDelay = Math.max(MIN_DELAY, Math.min(MAX_DELAY, randomDelay));

    return Math.floor(randomDelay);
}

// --- Piecewise Linear Probability Calculation (For Visualization) ---

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
        changeSignal(true); 
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
    
    lastChoiceWasRed = null; 
    
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
    lastChoiceWasRed = null; 
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

    let nextIsRed;
    const nextDelay = getRandomNormalDelay();
    if (forceSwitch) {
        nextIsRed = !lastChoiceWasRed;
    } else {
        nextIsRed = Math.random() < 0.5;
        const currentElapsed = Date.now() - startTime;
        if (nextIsRed === lastChoiceWasRed && currentElapsed > (MAX_DELAY - 1000)) {
            nextIsRed = !lastChoiceWasRed;
        }
    }
    
    if (nextIsRed !== lastChoiceWasRed) {
        startCounter();
    }
    
    if (nextIsRed) {
        signalBox.style.backgroundColor = 'red';
        instruction.textContent = INSTRUCTION_MIXUP;
    } else {
        signalBox.style.backgroundColor = 'green';
        instruction.textContent = INSTRUCTION_COMMIT;
    }
    
    showTimerDisplay();
    lastChoiceWasRed = nextIsRed;

    clearTimeout(timer);
    timer = setTimeout(changeSignal, nextDelay);
}

// --- Initialization ---

// MIN_DELAY and MAX_DELAY are correctly set at the top of the script.
// Recalculate mean in case MIN_DELAY or MAX_DELAY were changed above.
MEAN_DELAY = (MIN_DELAY + MAX_DELAY) / 2;
// Initialize display with current values for the user controls
if (floorDisplay && ceilingDisplay) {
    floorDisplay.textContent = formatDelayControls(MIN_DELAY);
    ceilingDisplay.textContent = formatDelayControls(MAX_DELAY);
}

startSignals();
