let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 850;

let painting = false;
let brushColor = 'black';
let brushSize = 5;
let paths = [];
let currentPath = null;

function startPosition(e) {
    painting = true;
    let pos = getMousePos(canvas, e);
    currentPath = {
        points: [{x: pos.x, y: pos.y}],
        color: brushColor,
        size: brushSize,
        vy: 0,
        y: 0
    };
    paths.push(currentPath);
}

function endPosition() {
    painting = false;
    currentPath = null;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function draw(e) {
    if (!painting) return;
    let pos = getMousePos(canvas, e);
    currentPath.points.push({x: pos.x, y: pos.y});
}

function applyGravity() {
    const gravity = 0.2;
    paths.forEach(path => {
        path.vy += gravity;
        path.y += path.vy;
        
        let lowestPoint = Math.max(...path.points.map(p => p.y)) + path.y;
        if (lowestPoint > canvas.height) {
            path.y -= lowestPoint - canvas.height;
            path.vy = 0;
        }
    });
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths.forEach(path => {
        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y + path.y);
        for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i].x, path.points[i].y + path.y);
        }
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.size;
        ctx.lineCap = 'round';
        ctx.stroke();
    });
}

function animate() {
    applyGravity();
    render();
    requestAnimationFrame(animate);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

function changeColor(color) {
    brushColor = color;
}

document.getElementById('size').addEventListener('input', function() {
    brushSize = this.value;
});

animate();