let params = {
    rOperation: '% 255',
    gOperation: '% 255',
    bOperation: '% 255',
    xFormula: '',
    rFormula: '',
    gFormula: '',
    bFormula: ''
};

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

function evaluateFormula(formula, i, j, x = 0) {
    if (!formula || formula.trim() === '') {
        return 0;
    }
    
    try {
        // Replace i, j, and x with their actual values
        // Use word boundaries to avoid replacing parts of other identifiers like "Math"
        let expression = formula
            .replace(/\bi\b/g, i.toString())
            .replace(/\bj\b/g, j.toString())
            .replace(/\bx\b/g, x.toString());
        
        // Handle bitwise operations - need to ensure operands are integers
        // First, handle standalone bitwise operations
        // Replace patterns like "i & j" or "i^j" or "i|j"
        // We need to be careful with operator precedence
        
        // Tokenize and process bitwise operators
        // Split by operators but preserve them
        const tokens = expression.match(/(\d+|\w+|\S)/g) || [];
        
        // Process bitwise operators with proper precedence
        // JavaScript bitwise operators: & (AND), | (OR), ^ (XOR)
        // They have lower precedence than arithmetic, so we need parentheses
        
        // For now, use a simpler approach: replace bitwise ops directly
        // Since we've already replaced i, j, x with numbers, we can evaluate directly
        // But we need to handle operator precedence correctly
        
        // Use eval in a safer way by creating a function
        // The expression should now have numbers and operators
        const result = Function('"use strict"; return ' + expression)();
        return Math.floor(Number(result)) || 0;
    } catch (e) {
        console.error('Error evaluating formula:', formula, e);
        return 0;
    }
}

function setup() {
    createCanvas(512, 512);
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
        redrawCanvas();
    }
    
    // Add change listeners for inputs (just update params, don't redraw)
    if (xInput) {
        xInput.addEventListener('input', function() {
            params.xFormula = this.value;
        });
        xInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                triggerEvaluation();
            }
        });
    }
    
    if (rInput) {
        rInput.addEventListener('input', function() {
            params.rFormula = this.value;
        });
        rInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                triggerEvaluation();
            }
        });
    }
    
    if (gInput) {
        gInput.addEventListener('input', function() {
            params.gFormula = this.value;
        });
        gInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                triggerEvaluation();
            }
        });
    }
    
    if (bInput) {
        bInput.addEventListener('input', function() {
            params.bFormula = this.value;
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
    for (let i = 0; i < 512; i++) {
        for (let j = 0; j < 512; j++) {
            // Evaluate X formula if provided
            let x = 0;
            if (params.xFormula && params.xFormula.trim() !== '') {
                x = evaluateFormula(params.xFormula, i, j, 0);
            }
        
            // Evaluate R, G, B formulas (can use i, j, and x)
            let r = 0;
            if (params.rFormula && params.rFormula.trim() !== '') {
                r = evaluateFormula(params.rFormula, i, j, x);
            }
            
            let g = 0;
            if (params.gFormula && params.gFormula.trim() !== '') {
                g = evaluateFormula(params.gFormula, i, j, x);
            }
            
            let b = 0;
            if (params.bFormula && params.bFormula.trim() !== '') {
                b = evaluateFormula(params.bFormula, i, j, x);
            }
            
            // Apply final operations
            r = applyOperation(r, params.rOperation);
            g = applyOperation(g, params.gOperation);
            b = applyOperation(b, params.bOperation);
            
            stroke(r, g, b);
            point(i, j);
        }
    }

    noLoop();
}

