let params = {
    rOperation: '% 255',
    gOperation: '% 255',
    bOperation: '% 255',
    xFormula: '',
    rFormula: '',
    gFormula: '',
    bFormula: '',
    useTime: false
};

let timeCounter = 0;
let lastFrameTime = 0;
const FRAME_DELAY = 200; // milliseconds between frames

function redrawCanvas() {
    background(0);
    // Reset frame timer so manual evaluation renders immediately
    lastFrameTime = Date.now() - FRAME_DELAY;
    loop();
}

function applyOperation(value, operation) {
    if (operation === '% 255') {
        return value % 255;
    } else if (operation === '[0,255]') {
        return Math.min(255, Math.max(0, value));
    }
    return value;
}

function evaluateFormula(formula, i, j, x = 0, t = 1) {
    if (!formula || formula.trim() === '') {
        return 0;
    }
    
    try {
        // Replace i, j, x, and t with their actual values
        // Use word boundaries to avoid replacing parts of other identifiers like "Math"
        let expression = formula
            .replace(/\bi\b/g, i.toString())
            .replace(/\bj\b/g, j.toString())
            .replace(/\bx\b/g, x.toString())
            .replace(/\bt\b/g, t.toString());
                
        const result = Function('"use strict"; return ' + expression)();
        return Math.floor(Number(result)) || 0;
    } catch (e) {
        console.error('Error evaluating formula:', formula, e);
        return 0;
    }
}

function setup() {
    createCanvas(256, 256);
    background(0);
    frameRate(160);
    
    // Update canvas size to account for sidebar
    let canvasElement = document.querySelector('canvas');
    let container = document.getElementById('canvas-container');
    let size = Math.min(window.innerWidth - 500, window.innerHeight);
    canvasElement.style.width = size + 'px';
    canvasElement.style.height = size + 'px';
    
    // Initialize frame timer so first frame renders immediately
    lastFrameTime = Date.now() - FRAME_DELAY;
    
    // Setup HTML controls
    const xInput = document.getElementById('x-input');
    const rInput = document.getElementById('r-input');
    const gInput = document.getElementById('g-input');
    const bInput = document.getElementById('b-input');
    const rSelect = document.getElementById('r-select');
    const gSelect = document.getElementById('g-select');
    const bSelect = document.getElementById('b-select');
    
    // Initialize formulas from inputs
    if (xInput) params.xFormula = xInput.value || '';
    if (rInput) params.rFormula = rInput.value || '';
    if (gInput) params.gFormula = gInput.value || '';
    if (bInput) params.bFormula = bInput.value || '';
    
    // Helper function to update all formulas from inputs
    function updateFormulasFromInputs() {
        if (xInput) params.xFormula = xInput.value || '';
        if (rInput) params.rFormula = rInput.value || '';
        if (gInput) params.gFormula = gInput.value || '';
        if (bInput) params.bFormula = bInput.value || '';
    }
    
    // Function to trigger evaluation
    function triggerEvaluation() {
        updateFormulasFromInputs();
        // Reset time counter when manually evaluating
        if (!params.useTime) {
            timeCounter = 1;
        }
        redrawCanvas();
        // Resume animation if time toggle is enabled
        if (params.useTime) {
            loop();
        }
    }
    
    // Function to pause animation when editing
    function pauseAnimation() {
        noLoop();
    }
    
    // Add change listeners for inputs (just update params, don't redraw)
    if (xInput) {
        xInput.addEventListener('focus', pauseAnimation);
        xInput.addEventListener('input', function() {
            params.xFormula = this.value;
            pauseAnimation();
        });
        xInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                triggerEvaluation();
            }
        });
    }
    
    if (rInput) {
        rInput.addEventListener('focus', pauseAnimation);
        rInput.addEventListener('input', function() {
            params.rFormula = this.value;
            pauseAnimation();
        });
        rInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                triggerEvaluation();
            }
        });
    }
    
    if (gInput) {
        gInput.addEventListener('focus', pauseAnimation);
        gInput.addEventListener('input', function() {
            params.gFormula = this.value;
            pauseAnimation();
        });
        gInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                triggerEvaluation();
            }
        });
    }
    
    if (bInput) {
        bInput.addEventListener('focus', pauseAnimation);
        bInput.addEventListener('input', function() {
            params.bFormula = this.value;
            pauseAnimation();
        });
        bInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                triggerEvaluation();
            }
        });
    }
    
    // Add button listener for evaluating formulas
    const evaluateButton = document.getElementById('evaluate-button');
    if (evaluateButton) {
        evaluateButton.addEventListener('click', triggerEvaluation);
    }
    
    // Handle time variable toggle
    const useTimeToggle = document.getElementById('use-time-toggle');
    const timeDisplay = document.getElementById('time-display');
    const timeValue = document.getElementById('time-value');
    
    if (useTimeToggle) {
        useTimeToggle.addEventListener('change', function() {
            params.useTime = this.checked;
            if (params.useTime) {
                // If enabled, reset counter and start the loop
                timeCounter = 0;
                if (timeDisplay) timeDisplay.style.display = 'block';
                if (timeValue) timeValue.textContent = timeCounter;
                loop();
            } else {
                // If disabled, stop after current frame
                // The draw function will call noLoop() at the end
                if (timeDisplay) timeDisplay.style.display = 'none';
            }
        });
    }
    
    // Preset definitions as array (index 0 is null for Custom)
    const presets = [
        null, // Custom (index 0)
        { // sketch_01 (index 1)
            x: '((i % 255) + (j % 255)) % 255',
            r: '((i % 255) ^ (j % 255)) % 255',
            g: '(x & i) & 255',
            b: '(x & j) & 255'
        },
        { // sketch_02 (index 2)
            x: '((i % 255) + (j % 255)) % 255',
            r: 'x % 255',
            g: '(x & i) & 255',
            b: '(x & j) & 255'
        },
        { // sketch_03 (index 3)
            x: '((i % 255) + (j % 255)) % 255',
            r: '(x & i) & 255',
            g: 'x % 255',
            b: '(x & j) & 255'
        },
        { // sketch_04 (index 4)
            x: '((i % 255) + (j % 255)) % 255',
            r: '(x & i) & 255',
            g: '(x & j) & 255',
            b: 'x % 255'
        },
        { // sketch_05 (index 5)
            x: 'Math.abs((i & j - 2*(i^j) + j & i) % 255)',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        { // sketch_06 (index 6)
            x: '(i & j - 2*(i^j) + j & i) % 255',
            r: '(x + i & j) % 255',
            g: 'x % 255',
            b: 'x % 255'
        },
        { // sketch_07 (index 7)
            x: '(i & j - 2*(i^j) + i & j) % 255',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        { // sketch_08 (index 8)
            x: '(i & j - 2*(i^j) + i & j) % 255',
            r: '(x + i) % 255',
            g: '((x + i & j) * 2) % 255',
            b: '(x + j) / 2'
        },
        { // sketch_09 (index 9)
            x: '(i & j + 2*(i^j) + i & j) % 255',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        { // sketch_10 (index 10)
            x: '(i & j + 2*(i^j) + i & j) % 255',
            r: '((x + i & j) * 2) % 255',
            g: 'x&t',
            b: 'x&t'
        },
        { // sketch_11 (index 11)
            x: 'i*i + 2*(i|j) + j*j',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        { // sketch_12 (index 12)
            x: 'i*i + 2*(i|j) + j*j',
            r: 'x',
            g: 'x ^ j',
            b: 'x ^ (i | j)'
        },
        { // sketch_13 (index 13)
            x: '(i * j) % 255',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        { // sketch_14 (index 14)
            x: 'Math.abs((i & j) * Math.sin(i | j) + (i & j) * Math.cos(i | j))',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        { // sketch_15 (index 15)
            x: 'Math.abs((i & j) * Math.tan(i | j))',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        { // sketch_16 (index 16)
            x: 'Math.abs((i & j) * Math.sin(i | j))',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        { // sketch_17 (index 17)
            x: 'Math.abs((i & j) * Math.tan(i | j))',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        { // sketch_18 (index 18)
            x: 'Math.abs((i & j & t) * Math.tan(i | j | t))',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        { // sketch_19 (index 19)
            x: '((i ^ j) * Math.tan(i ^ j))',
            r: '(i & j) * Math.atan(x)',
            g: '(i | j) * Math.cos(x)',
            b: '(i ^ j) * Math.sin(x)'
        },
        { // sketch_20 (index 20)
            x: '((i ^ j ^ t) * Math.tan(i ^ j ^ t))',
            r: 'x',
            g: '',
            b: ''
        }
    ];

    // Handle preset selection
    const presetSelect = document.getElementById('preset-select');
    if (presetSelect) {
        presetSelect.addEventListener('change', function() {
            const presetIndex = this.selectedIndex;
            
            if (presetIndex === 0) {
                // Custom - don't change anything
                return;
            }
            
            const preset = presets[presetIndex];
            if (preset) {
                // Set the formulas in the input fields
                if (xInput) xInput.value = preset.x || '';
                if (rInput) rInput.value = preset.r || '';
                if (gInput) gInput.value = preset.g || '';
                if (bInput) bInput.value = preset.b || '';
                
                // Update params and immediately evaluate
                updateFormulasFromInputs();
                redrawCanvas();
            }
        });
    }
    
    // Selects trigger immediate redraw with current formulas
    rSelect.addEventListener('change', function() {
        params.rOperation = this.value;
        updateFormulasFromInputs();
        redrawCanvas();
    });
    
    gSelect.addEventListener('change', function() {
        params.gOperation = this.value;
        updateFormulasFromInputs();
        redrawCanvas();
    });
    
    bSelect.addEventListener('change', function() {
        params.bOperation = this.value;
        updateFormulasFromInputs();
        redrawCanvas();
    });
}

function windowResized() {
    let canvasElement = document.querySelector('canvas');
    const sidebar = document.getElementById('sidebar');
    const isHidden = sidebar && sidebar.classList.contains('hidden');
    const availableWidth = isHidden ? window.innerWidth : window.innerWidth - 500;
    let size = Math.min(availableWidth, window.innerHeight);
    canvasElement.style.width = size + 'px';
    canvasElement.style.height = size + 'px';
}

function draw() {
    // Check if enough time has passed since last frame (100ms delay)
    const currentTime = Date.now();
    if (currentTime - lastFrameTime < FRAME_DELAY) {
        return; // Skip this frame if not enough time has passed
    }
    lastFrameTime = currentTime;
    
    // Use time counter: starts at 0, increases by 5 each frame
    const t = timeCounter;
    
    // Update time display in GUI
    const timeValueElement = document.getElementById('time-value');
    if (timeValueElement && params.useTime) {
        timeValueElement.textContent = t;
    }
    
    for (let i = 0; i < 256; i++) {
        for (let j = 0; j < 256; j++) {
            // Evaluate X formula if provided
            let x = 0;
            if (params.xFormula && params.xFormula.trim() !== '') {
                x = evaluateFormula(params.xFormula, i, j, 0, t);
            }
        
            // Evaluate R, G, B formulas (can use i, j, x, and t)
            let r = 0;
            if (params.rFormula && params.rFormula.trim() !== '') {
                r = evaluateFormula(params.rFormula, i, j, x, t);
            }
            
            let g = 0;
            if (params.gFormula && params.gFormula.trim() !== '') {
                g = evaluateFormula(params.gFormula, i, j, x, t);
            }
            
            let b = 0;
            if (params.bFormula && params.bFormula.trim() !== '') {
                b = evaluateFormula(params.bFormula, i, j, x, t);
            }
            
            // Apply final operations
            r = applyOperation(r, params.rOperation);
            g = applyOperation(g, params.gOperation);
            b = applyOperation(b, params.bOperation);
            
            stroke(r, g, b);
            point(i, j);
        }
    }

    // Increment time counter by 5
    timeCounter += 5;
    timeCounter %= 200;
    if (timeCounter === 0) {
        timeCounter = 5;
    }

    // Only call noLoop() if time variable is not enabled
    if (!params.useTime) {
        noLoop();
    }
}

