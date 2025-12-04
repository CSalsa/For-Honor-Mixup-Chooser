I have processed your uploaded files. I have kept your JavaScript logic (including the specific distribution math and forced toggle at ceiling) and HTML structure exactly as they were in your files.

My only changes are in the CSS, where I added the logic to handle Mobile Portrait (stacking/scaling) and Mobile Landscape (moving controls to a sidebar).

Here are the complete, synchronized files:

HTML

<!DOCTYPE html>
<html>
<head>
    <title>For Honor Mixup Maker</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="signal-box">
        <h1 id="instruction">Loading...</h1>
    </div>
    
    <div id="controls">
        <div id="config">
            <div class="setting">
                <label>Change Floor</label>
                <div id="floor-display" class="delay-display">1.0</div>
                <button id="floor-plus" onclick="changeDelay('floor', 500)">+</button>
                <button id="floor-minus" onclick="changeDelay('floor', -500)">-</button>
            </div>
            <div class="setting">
                <label>Change Ceiling</label>
                <div id="ceiling-display" class="delay-display">5.0</div>
                <button id="ceiling-plus" onclick="changeDelay('ceiling', 500)">+</button>
                <button id="ceiling-minus" onclick="changeDelay('ceiling', -500)">-</button>
            </div>
        </div>
        
        <div id="main-buttons">
            <button id="fullscreen-btn" onclick="toggleFullscreen()">Full Screen</button> 
            <button id="start-stop-btn" onclick="toggleSignals()">Pause</button>
        </div>
        
        <div id="stats-wrapper">
             <div id="probability-display">0%</div>
             <div id="duration-timer">0.000</div>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
CSS

/* style.css */
body {
    margin: 0;
    overflow: hidden;
    height: 100vh;
    position: relative; 
    display: flex;
    flex-direction: column; 
    justify-content: center;
    align-items: center; 
    background-color: transparent; 
}

#signal-box {
    position: absolute; 
    top: 0;
    left: 0;
    height: 100vh; 
    width: 100%;
    background-color: black; 
    display: flex;
    justify-content: center; 
    align-items: center; 
    transition: background-color 0.1s ease-in-out; 
    z-index: 1;
}

#instruction {
    color: white; 
    font-family: Arial, sans-serif;
    /* Changed from fixed 8em to viewport based for basic responsiveness */
    font-size: 15vw; 
    font-weight: bold; 
    text-align: center;
    user-select: none;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); 
    z-index: 3; 
    pointer-events: none; /* Let clicks pass through text */
}

#controls {
    position: fixed; 
    bottom: 0;
    left: 0;
    width: 100%; 
    z-index: 1000; 
    padding: 15px 30px; 
    display: flex;
    justify-content: space-between; 
    align-items: center;
    box-sizing: border-box;
    pointer-events: none; /* Let clicks pass through control area background */
}

/* --- Main Button Styling (Full Screen/Pause) --- */

#main-buttons {
    display: flex;
    justify-content: center; 
    flex-grow: 1;
    pointer-events: auto; /* Re-enable clicks */
}

#main-buttons button {
    padding: 15px 30px;
    margin: 10px;
    font-size: 1.5em;
    cursor: pointer;
    border: 3px solid white;
    background-color: rgba(0, 0, 0, 0.4); 
    color: white;
    touch-action: manipulation; /* Improves mobile touch response */
}

/* --- Config Panel Styling --- */

#config {
    display: flex;
    gap: 30px; 
    pointer-events: auto; /* Re-enable clicks */
}

.setting {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    font-family: Arial, sans-serif;
    text-shadow: 1px 1px 2px black; /* Added shadow for readability */
}

.setting label {
    font-size: 1.2em;
    margin-bottom: 5px;
}

.delay-display {
    font-family: monospace;
    font-size: 1.2em;
    margin-bottom: 5px;
}

/* Styling for the small +/- buttons */
.setting button {
    padding: 5px 15px; 
    margin: 3px;
    font-size: 1.5em;
    cursor: pointer;
    border: 3px solid white;
    background-color: rgba(0, 0, 0, 0.4); 
    color: white;
    width: 70px; 
    box-sizing: border-box;
    touch-action: manipulation;
}

/* --- Validation Output Styling --- */

#stats-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* Align right */
    pointer-events: none;
}

#probability-display, #duration-timer {
    position: static; 
    margin-left: 10px;
    padding: 0;
    font-size: 1.5rem; /* Increased size for readability */
    color: white; 
    font-family: monospace; 
    z-index: 1001; 
    visibility: hidden;
    text-shadow: 2px 2px 2px black;
}

/* --- RESPONSIVE MEDIA QUERIES --- */

/* 1. Mobile Portrait: Prevent overlapping */
@media (max-width: 768px) {
    #controls {
        flex-wrap: wrap; /* Allow buttons to wrap to next line */
        justify-content: center;
        gap: 10px;
        padding: 10px;
    }

    #config {
        gap: 10px;
        width: 100%;
        justify-content: space-around;
        order: 1; /* Config on top */
    }
    
    #main-buttons {
        width: 100%;
        order: 2; /* Buttons below */
    }

    #main-buttons button {
        flex: 1; /* Stretch buttons */
        padding: 10px;
        font-size: 1.2em;
    }
    
    #stats-wrapper {
        position: absolute;
        bottom: 180px; /* Float above the controls */
        right: 10px;
        order: 0;
    }
}

/* 2. Mobile Landscape: Sidebar Layout */
@media (max-height: 500px) and (orientation: landscape) {
    #instruction {
        font-size: 15vh; /* Scale based on height so it fits */
        width: 70%; /* Leave room for sidebar */
        margin-right: 20%;
    }

    #controls {
        left: auto; /* Remove left anchor */
        right: 0;   /* Anchor to right */
        top: 0;     /* Anchor to top */
        bottom: auto;
        
        width: 200px; /* Fixed sidebar width */
        height: 100vh; /* Full height */
        
        flex-direction: column; /* Stack vertically */
        justify-content: center;
        overflow-y: auto; /* Scroll if needed */
        background-color: rgba(0,0,0,0.2); /* Slight background to separate */
    }

    #config {
        flex-direction: column; /* Stack floor/ceiling vertically */
        gap: 20px;
        margin-bottom: 20px;
    }

    #main-buttons {
        flex-direction: column; /* Stack buttons */
        width: 100%;
    }

    #main-buttons button {
        width: 100%;
        margin: 5px 0;
    }
    
    #stats-wrapper {
        position: static; /* Put inside flow of sidebar */
        align-items: center;
        margin-top: 20px;
    }
}
JavaScript

/* script.js */
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

// 
// --- Utility Functions ---
// 

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

// 
// --- Delay Change Control Logic ---
// 

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

// 
// --- Normal Distribution Function (For Next Delay) ---
// 

function getRandomNormalDelay() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); 
    
    let randomDelay = z * SIGMA + MEAN_DELAY;
    randomDelay = Math.max(MIN_DELAY, Math.min(MAX_DELAY, randomDelay));

    return Math.floor(randomDelay);
}

// 
// --- Piecewise Linear Probability Calculation (For Visualization) ---
// 

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

// 
// --- Timer Utility Functions ---
// 

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

// 
// --- Fullscreen Toggle ---
// 

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        body.requestFullscreen().catch(err => {
            console.error(`Error enabling fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// 
// --- Signal Controls ---
// 

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

// 
// --- Initialization ---
// 

// Recalculate mean in case MIN_DELAY or MAX_DELAY were changed above.
MEAN_DELAY = (MIN_DELAY + MAX_DELAY) / 2;

// Initialize display with current values for the user controls
if (floorDisplay && ceilingDisplay) {
    floorDisplay.textContent = formatDelayControls(MIN_DELAY);
    ceilingDisplay.textContent = formatDelayControls(MAX_DELAY);
}

startSignals();
