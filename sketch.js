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

function redrawCanvas() {
    background(0);
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
    if (useTimeToggle) {
        useTimeToggle.addEventListener('change', function() {
            params.useTime = this.checked;
            if (params.useTime) {
                // If enabled, reset counter and start the loop
                timeCounter = 0;
                loop();
            } else {
                // If disabled, stop after current frame
                // The draw function will call noLoop() at the end
            }
        });
    }
    
    // Preset definitions
    const presets = {
        sketch_01: {
            x: '((i % 255) + (j % 255)) % 255',
            r: '((i % 255) ^ (j % 255)) % 255',
            g: '(x & i) & 255',
            b: '(x & j) & 255'
        },
        sketch_02: {
            x: '((i % 255) + (j % 255)) % 255',
            r: 'x % 255',
            g: '(x & i) & 255',
            b: '(x & j) & 255'
        },
        sketch_03: {
            x: '((i % 255) + (j % 255)) % 255',
            r: '(x & i) & 255',
            g: 'x % 255',
            b: '(x & j) & 255'
        },
        sketch_04: {
            x: '((i % 255) + (j % 255)) % 255',
            r: '(x & i) & 255',
            g: '(x & j) & 255',
            b: 'x % 255'
        },
        sketch_05: {
            x: 'Math.abs((i & j - 2*(i^j) + j & i) % 255)',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        sketch_06: {
            x: '(i & j - 2*(i^j) + j & i) % 255',
            r: '(x + i & j) % 255',
            g: 'x % 255',
            b: 'x % 255'
        },
        sketch_07: {
            x: '(i & j - 2*(i^j) + j & i) % 255',
            r: 'x % 255',
            g: '(x + i & j) % 255',
            b: 'x % 255'
        },
        sketch_08: {
            x: '(i & j - 2*(i^j) + j & i) % 255',
            r: 'x % 255',
            g: 'x % 255',
            b: '(x + i & j) % 255'
        },
        sketch_09: {
            x: '(i & j - 2*(i^j) + i & j) % 255',
            r: '(x + i) % 255',
            g: '((x + i & j) * 2) % 255',
            b: '(x + j) / 2'
        },
        sketch_10: {
            x: '(i & j - 2*(i^j) + i & j) % 255',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        sketch_11: {
            x: '(i & j + 2*(i^j) + i & j) % 255',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        sketch_12: {
            x: '(i & j + 2*(i^j) + i & j) % 255',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        sketch_13: {
            x: 'i*i + 2*(i|j) + j*j',
            r: 'x',
            g: 'x ^ j',
            b: 'x ^ (i | j)'
        },
        sketch_14: {
            x: '(i * j) % 255',
            r: '(x * i) % 255',
            g: '(i * j) % 255',
            b: '(j * x) % 255'
        },
        sketch_15: {
            x: '(i + j) * (i - j)',
            r: 'x & i',
            g: '0',
            b: '0'
        },
        sketch_16: {
            x: 'i & j + i & j',
            r: 'x + i / 4 + 3 * j / 4',
            g: 'x + (i / 2 + j / 2)',
            b: 'x + j / 4 + 3 * i / 4'
        },
        sketch_17: {
            x: 'Math.abs((i & j) * Math.sin(i | j) + (i & j) * Math.cos(i | j))',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        sketch_18: {
            x: 'Math.abs((i & j) * Math.tan(i | j))',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        sketch_19: {
            x: 'Math.abs((i & j) * Math.sin(i | j))',
            r: 'x',
            g: 'x',
            b: 'x'
        },
        sketch_20: {
            x: 'Math.abs((i & j) * Math.tan(i | j))',
            r: 'x',
            g: 'x',
            b: 'x'
        }
    };
    
    // Handle preset selection
    const presetSelect = document.getElementById('preset-select');
    if (presetSelect) {
        presetSelect.addEventListener('change', function() {
            const preset = this.value;
            
            if (preset === 'custom') {
                // Don't change anything for custom
                return;
            }
            
            if (presets[preset]) {
                // Set the formulas in the input fields
                if (xInput) xInput.value = presets[preset].x || '';
                if (rInput) rInput.value = presets[preset].r || '';
                if (gInput) gInput.value = presets[preset].g || '';
                if (bInput) bInput.value = presets[preset].b || '';
                
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
    // Use time counter: starts at 0, increases by 5 each frame
    const t = timeCounter;
    
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

    // Only call noLoop() if time variable is not enabled
    if (!params.useTime) {
        noLoop();
    }
}

