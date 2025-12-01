const body = document.body;
const instruction = document.getElementById('instruction');
const startStopBtn = document.getElementById('start-stop-btn');
const signalBox = document.getElementById('signal-box'); 
let timer;
let isRunning = false;
const minDelay = 1000; 
const maxDelay = 5000; 

let lastChoiceWasRed = null; 
let consecutiveDuration = 0; 

// --- Fullscreen Toggle (Targeting body again) ---

function toggleFullscreen() {
    // Request fullscreen on the body element, which contains all elements
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
    consecutiveDuration = 0;
    
    timer = setTimeout(changeSignal, 1500); 
}

function stopSignals() {
    clearTimeout(timer);
    isRunning = false;
    startStopBtn.textContent = 'Start';
    
    // Target the signal box to reset color
    signalBox.style.backgroundColor = 'black'; 
    
    instruction.textContent = 'PAUSED';
    
    lastChoiceWasRed = null; 
    consecutiveDuration = 0;
}

function toggleSignals() {
    if (isRunning) {
        stopSignals();
    } else {
        startSignals();
    }
}

function changeSignal() {
    if (!isRunning) return;

    let nextIsRed;
    const nextDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    
    // Check if the 5-second consecutive rule needs to be enforced
    if (lastChoiceWasRed !== null && consecutiveDuration + nextDelay > 5000) {
        
        nextIsRed = !lastChoiceWasRed; 
        consecutiveDuration = 0; 
        
    } else {
        
        nextIsRed = Math.random() < 0.5;
        
        if (nextIsRed === lastChoiceWasRed) {
            consecutiveDuration += nextDelay;
        } else {
            consecutiveDuration = nextDelay;
        }
    }

    // --- Update the display ---

    if (nextIsRed) {
        // Target the signal box to change color
        signalBox.style.backgroundColor = 'red';
        instruction.textContent = 'MIX UP';
    } else {
        // Target the signal box to change color
        signalBox.style.backgroundColor = 'green';
        instruction.textContent = 'COMMIT';
    }

    lastChoiceWasRed = nextIsRed;

    // --- Schedule the next signal ---
    
    clearTimeout(timer);
    timer = setTimeout(changeSignal, nextDelay);
}

// --- Initialization ---
startSignals();
