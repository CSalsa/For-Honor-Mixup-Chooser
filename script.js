const body = document.body;
const instruction = document.getElementById('instruction');
const startStopBtn = document.getElementById('start-stop-btn');
let timer;
let isRunning = false;
// Signals will appear randomly between 1 second and 3 seconds
const minDelay = 1000; 
const maxDelay = 3000; 

// --- Signal Controls ---

function startSignals() {
    if (isRunning) return; 
    isRunning = true;
    startStopBtn.textContent = 'Pause';
    instruction.textContent = 'GET READY';
    
    // Start the first signal after a short delay
    timer = setTimeout(changeSignal, 1500); 
}

function stopSignals() {
    clearTimeout(timer);
    isRunning = false;
    startStopBtn.textContent = 'Start';
    // Reset to black and show PAUSED state
    body.style.backgroundColor = 'black'; 
    instruction.textContent = 'PAUSED';
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

    // 50% chance of Red (Mix Up)
    const isRed = Math.random() < 0.5; 
    
    if (isRed) {
        // RED: MIX UP (Feint, change combo)
        body.style.backgroundColor = 'red';
        instruction.textContent = 'MIX UP';
    } else {
        // GREEN: COMMIT (Let attack fly, finish combo)
        body.style.backgroundColor = 'green';
        instruction.textContent = 'COMMIT';
    }

    // Calculate a random delay between minDelay and maxDelay
    const nextDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    
    // Clear and schedule the next signal
    clearTimeout(timer);
    timer = setTimeout(changeSignal, nextDelay);
}

// --- Initialization: Automatically start the signals on page load ---
// This runs as soon as the script is parsed, ensuring automatic start.
startSignals();
