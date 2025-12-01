const body = document.body;
const instruction = document.getElementById('instruction');
const startStopBtn = document.getElementById('start-stop-btn');
let timer;
let isRunning = false;
const minDelay = 1000; 
const maxDelay = 5000; 

// --- Fullscreen Toggle (Now Independent) ---

function toggleFullscreen() {
    // This function only handles the browser window state.
    if (!document.fullscreenElement) {
        body.requestFullscreen().catch(err => {
            console.error(`Error enabling fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// --- Signal Controls (Unaffected by Fullscreen) ---

function startSignals() {
    if (isRunning) return; 
    isRunning = true;
    startStopBtn.textContent = 'Pause';
    instruction.textContent = 'GET READY';
    
    timer = setTimeout(changeSignal, 1500); 
}

function stopSignals() {
    clearTimeout(timer);
    isRunning = false;
    startStopBtn.textContent = 'Start';
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

    const isRed = Math.random() < 0.5; 
    
    if (isRed) {
        body.style.backgroundColor = 'red';
        instruction.textContent = 'MIX UP';
    } else {
        body.style.backgroundColor = 'green';
        instruction.textContent = 'COMMIT';
    }

    const nextDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    
    clearTimeout(timer);
    timer = setTimeout(changeSignal, nextDelay);
}

// --- Initialization ---

// REMOVED the document.addEventListener('fullscreenchange', ...) listener.
// This ensures that hitting ESC or using the Full Screen button only changes the window size, 
// and DOES NOT stop the signals.

startSignals();
