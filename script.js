let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 850;

let painting = false;
let brushColor = 'black';
let brushSize = 5;

function startPosition(e) {
    painting = true;
    draw(e);
}

function endPosition() {
    painting = false;
    ctx.beginPath();
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
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    let pos = getMousePos(canvas, e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
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
