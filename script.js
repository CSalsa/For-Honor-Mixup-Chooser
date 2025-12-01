const body = document.body;
const instruction = document.getElementById('instruction');
let timer;
// Random delay will be between 1000 milliseconds (1 second) and 3000 milliseconds (3 seconds)
const minDelay = 1000; 
const maxDelay = 3000; 

function toggleFullscreen() {
    // If not in fullscreen, request it
    if (!document.fullscreenElement) {
        body.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
        instruction.textContent = 'Get Ready...';
        
        // Start the game loop after a short initial delay
        // Clear any existing timer just in case
        clearInterval(timer); 
        timer = setTimeout(changeSignal, 2000); // 2-second countdown before first signal
        
    } else {
        // If in fullscreen, exit it
        document.exitFullscreen();
        clearInterval(timer);
        body.style.backgroundColor = 'black';
        instruction.textContent = 'Click to Start Fullscreen';
    }
}

function changeSignal() {
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
    
    // Clear and restart the timer with the new, random delay
    clearInterval(timer);
    timer = setTimeout(changeSignal, nextDelay);
}

// Optional: Stop the timer if the user manually exits fullscreen (e.g., using ESC key)
document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement) {
        clearInterval(timer);
        body.style.backgroundColor = 'black';
        instruction.textContent = 'Click to Start Fullscreen';
    }
});