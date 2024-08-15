let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 850;

let painting = false;
let brushColor = 'black';
let brushSize = 5;
let paths = [];
let currentPath = null;

// Function to handle the start of drawing
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

// Function to handle the end of drawing
function endPosition() {
    painting = false;
    currentPath = null;
}

// Function to get the mouse position relative to the canvas
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Function to draw on the canvas
function draw(e) {
    if (!painting) return;
    let pos = getMousePos(canvas, e);
    currentPath.points.push({x: pos.x, y: pos.y});
}

// Function to apply gravity to the paths
function applyGravity() {
    const gravity = 0.2;
    paths.forEach((path, index) => {
        path.vy += gravity;
        path.y += path.vy;
        
        // Check collision with other paths
        for (let i = index + 1; i < paths.length; i++) {
            checkCollision(path, paths[i]);
        }
        
        let lowestPoint = Math.max(...path.points.map(p => p.y)) + path.y;
        if (lowestPoint > canvas.height) {
            path.y -= lowestPoint - canvas.height;
            path.vy = -path.vy * 0.5; // Add a bounce effect
        }
    });
}

// Function to check collision between two paths
function checkCollision(path1, path2) {
    let bbox1 = getBoundingBox(path1);
    let bbox2 = getBoundingBox(path2);
    
    if (bbox1.minX < bbox2.maxX && bbox1.maxX > bbox2.minX &&
        bbox1.minY < bbox2.maxY && bbox1.maxY > bbox2.minY) {
        // Collision detected, reverse velocities
        let temp = path1.vy;
        path1.vy = path2.vy;
        path2.vy = temp;
    }
}

// Function to get the bounding box of a path
function getBoundingBox(path) {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    path.points.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y + path.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y + path.y);
    });
    
    return {minX, minY, maxX, maxY};
}

// Function to render the paths on the canvas
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

// Function to animate the drawing
function animate() {
    applyGravity();
    render();
    requestAnimationFrame(animate);
}

// Event listeners for mouse actions
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Function to change the brush color
function changeColor(color) {
    brushColor = color;
}

// Event listener for brush size input
document.getElementById('size').addEventListener('input', function() {
    brushSize = this.value;
});

// Start the animation
animate();