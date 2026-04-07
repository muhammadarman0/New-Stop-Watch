document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById('display');
    const msDisplay = document.getElementById('ms-display');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const activityRing = document.getElementById('activity-ring');
    const loader = document.getElementById('loader');
    const stopwatchContainer = document.getElementById('stopwatch-container');

    // 1. Initial Loading Animation sequence
    setTimeout(() => {
        loader.classList.add('fade-out');
        stopwatchContainer.classList.remove('hidden');
        
        // Trigger entrance animation for main panel
        setTimeout(() => {
            stopwatchContainer.classList.add('show');
            loader.style.display = 'none'; // fully remove from flow
        }, 100);
    }, 1500); // 1.5 seconds loading preview

    // 2. Stopwatch Logic
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;

    // Helper to format timestamps into HH:MM:SS and MS
    function formatTime(time) {
        // Calculate based on purely numeric time passed in ms
        const hours = Math.floor(time / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((time / (1000 * 60)) % 60).toString().padStart(2, '0');
        const seconds = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
        const milliseconds = Math.floor((time % 1000) / 10).toString().padStart(2, '0');

        return {
            main: `${hours}:${minutes}:${seconds}`,
            ms: milliseconds
        };
    }

    // Main update loop
    function updateDisplay() {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        const formatted = formatTime(elapsedTime);
        display.textContent = formatted.main;
        msDisplay.textContent = formatted.ms;
    }

    // 3. Event Listeners for Controls
    startBtn.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(updateDisplay, 10); // Update frequently for smooth MS rendering
            
            // UI States: Active
            activityRing.classList.add('active');
            
            startBtn.style.opacity = '0.6';
            startBtn.style.pointerEvents = 'none';
            stopBtn.style.opacity = '1';
            stopBtn.style.pointerEvents = 'auto';
        }
    });

    stopBtn.addEventListener('click', () => {
        if (isRunning) {
            isRunning = false;
            clearInterval(timerInterval);
            
            // UI States: Paused
            activityRing.classList.remove('active');
            
            startBtn.style.opacity = '1';
            startBtn.style.pointerEvents = 'auto';
            stopBtn.style.opacity = '0.6';
            stopBtn.style.pointerEvents = 'none';
            
            startBtn.querySelector('.btn-text').textContent = 'Resume';
        }
    });

    resetBtn.addEventListener('click', () => {
        isRunning = false;
        clearInterval(timerInterval);
        elapsedTime = 0;
        
        // Reset Texts
        display.textContent = '00:00:00';
        msDisplay.textContent = '00';
        startBtn.querySelector('.btn-text').textContent = 'Start';
        
        // UI States: Reset
        activityRing.classList.remove('active');
        
        startBtn.style.opacity = '1';
        startBtn.style.pointerEvents = 'auto';
        stopBtn.style.opacity = '0.6';      // Cannot stop if not started
        stopBtn.style.pointerEvents = 'none';
        
        // Tiny visual bounce effect on reset
        display.style.transform = 'scale(0.92)';
        setTimeout(() => {
            display.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Set Initial Specific states
    stopBtn.style.opacity = '0.6';
    stopBtn.style.pointerEvents = 'none';
});
