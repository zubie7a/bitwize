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
        let expression = formula
            .replace(/i/g, i.toString())
            .replace(/j/g, j.toString())
            .replace(/x/g, x.toString());
        
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

