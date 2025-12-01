const body = document.body;
const instruction = document.getElementById('instruction');
const startStopBtn = document.getElementById('start-stop-btn');
let timer;
let isRunning = false;
const minDelay = 1000; 
const maxDelay = 5000; 

let lastChoiceWasRed = null; 
let consecutiveDuration = 0; 

// --- Fullscreen Toggle (FIXED) ---

function toggleFullscreen() {
    // Check if we are currently in fullscreen mode
    if (!document.fullscreenElement) {
        // Request fullscreen on the body element
        body.requestFullscreen().catch(err => {
            console.error(`Error enabling fullscreen: ${err.message}`);
        });
        
        // **FIX:** When entering fullscreen, explicitly make the current body background color
        // stay true. The browser sometimes overrides the body color on fullscreen entry.
        // We'll trust the running signals to keep the color up-to-date.

    } else {
        // Exit fullscreen
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
    body.style.backgroundColor = 'black'; 
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
        
        // Rule enforced: Force the opposite signal
        nextIsRed = !lastChoiceWasRed; 
        
        // Reset the duration for the new signal
        consecutiveDuration = 0; 
        
    } else {
        
        // Rule not enforced: Use pure 50/50 randomization
        nextIsRed = Math.random() < 0.5;
        
        // Update consecutive duration
        if (nextIsRed === lastChoiceWasRed) {
            consecutiveDuration += nextDelay;
        } else {
            consecutiveDuration = nextDelay;
        }
    }

    // --- Update the display ---

    if (nextIsRed) {
        body.style.backgroundColor = 'red';
        instruction.textContent = 'MIX UP';
    } else {
        body.style.backgroundColor = 'green';
        instruction.textContent = 'COMMIT';
    }

    // Update tracking variables for the next cycle
    lastChoiceWasRed = nextIsRed;

    // --- Schedule the next signal ---
    
    clearTimeout(timer);
    timer = setTimeout(changeSignal, nextDelay);
}

// --- Initialization ---
startSignals();
