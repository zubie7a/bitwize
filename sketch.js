let params = {
    rOperation: '% 255',
    gOperation: '% 255',
    bOperation: '% 255'
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

function setup() {
    createCanvas(640, 640);
    background(0);
    frameRate(160);
    
    // Update canvas size to account for sidebar
    let canvasElement = document.querySelector('canvas');
    let container = document.getElementById('canvas-container');
    let size = Math.min(window.innerWidth - 300, window.innerHeight);
    canvasElement.style.width = size + 'px';
    canvasElement.style.height = size + 'px';
    
    // Setup HTML controls
    const rSelect = document.getElementById('r-select');
    const gSelect = document.getElementById('g-select');
    const bSelect = document.getElementById('b-select');
    
    rSelect.addEventListener('change', function() {
        params.rOperation = this.value;
        redrawCanvas();
    });
    
    gSelect.addEventListener('change', function() {
        params.gOperation = this.value;
        redrawCanvas();
    });
    
    bSelect.addEventListener('change', function() {
        params.bOperation = this.value;
        redrawCanvas();
    });
}

function windowResized() {
    let canvasElement = document.querySelector('canvas');
    const sidebar = document.getElementById('sidebar');
    const isHidden = sidebar && sidebar.classList.contains('hidden');
    const availableWidth = isHidden ? window.innerWidth : window.innerWidth - 300;
    let size = Math.min(availableWidth, window.innerHeight);
    canvasElement.style.width = size + 'px';
    canvasElement.style.height = size + 'px';
}

function draw() {
    for (let i = 0; i < 640; i++) {
        for (let j = 0; j < 640; j++) {
            let x = Math.floor((i ^ j) * Math.tan(i ^ j));
            x = Math.abs(x);
            let r = Math.floor((i & j) * Math.atan(x));
            let g = Math.floor((i | j) * Math.cos(x));
            let b = Math.floor((i ^ j) * Math.sin(x));
            
            r = applyOperation(r, params.rOperation);
            g = applyOperation(g, params.gOperation);
            b = applyOperation(b, params.bOperation);
            
            stroke(r, g, b);
            point(i, j);
        }
    }

    noLoop();
}

