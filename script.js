const body = document.body;
const instruction = document.getElementById('instruction');
const startStopBtn = document.getElementById('start-stop-btn');
let timer;
let isRunning = false;
const minDelay = 1000; 
const maxDelay = 5000; 

// New variables to track the current state and time
let lastChoiceWasRed = null; // null, true, or false
let consecutiveDuration = 0; // Time the current choice has been active

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
    
    // Reset consecutive tracking when starting
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
    
    // Reset consecutive tracking when stopping
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

    // --- 1. Determine the next signal ---
    let nextIsRed;
    const nextDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    
    // Check if the 5-second consecutive rule needs to be enforced
    if (lastChoiceWasRed !== null && consecutiveDuration + nextDelay > 5000) {
        
        // Rule enforced: Force the opposite signal
        nextIsRed = !lastChoiceWasRed; 
        console.log("Forcing switch due to 5-second consecutive rule.");

        // Since we forced a switch, reset the duration for the new signal
        consecutiveDuration = 0; 
        
    } else {
        
        // Rule not enforced: Use pure 50/50 randomization
        nextIsRed = Math.random() < 0.5;
        
        // Check if the choice remains the same
        if (nextIsRed === lastChoiceWasRed) {
            consecutiveDuration += nextDelay;
        } else {
            // New choice selected, reset consecutive duration
            consecutiveDuration = nextDelay;
        }
    }

    // --- 2. Update the display ---

    if (nextIsRed) {
        body.style.backgroundColor = 'red';
        instruction.textContent = 'MIX UP';
    } else {
        body.style.backgroundColor = 'green';
        instruction.textContent = 'COMMIT';
    }

    // Update tracking variables for the next cycle
    lastChoiceWasRed = nextIsRed;

    // --- 3. Schedule the next signal ---
    
    clearTimeout(timer);
    timer = setTimeout(changeSignal, nextDelay);
}

// --- Initialization ---
startSignals();
