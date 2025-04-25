function get(elem) {
    return document.querySelector(elem);
}

let canvas = get("#drawingPad");
let ctx = canvas.getContext("2d");
let width = canvas.width = innerWidth;
let height = canvas.height = innerHeight;

let vectors = []; // Array to store vectors

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    normalize() {
        let mag = this.mag();
        if (mag === 0) return new Vector(0, 0);
        return new Vector(this.x / mag, this.y / mag);
    }
}

// Function to generate random rainbow colors
function getRandomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

// Draw grid
function drawGrid() {
    ctx.beginPath();
    for (let i = 0; i < width; i += 50) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
    }
    for (let i = 0; i < height; i += 50) {
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
    }
    ctx.strokeStyle = "lightgray";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

// Draw vectors
function drawVectors() {
    vectors.forEach((v, index) => {
        let color = getRandomColor();

        // Draw vector line
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(width / 2 + v.x, height / 2 + v.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Draw vector head (circle)
        ctx.beginPath();
        ctx.arc(width / 2 + v.x, height / 2 + v.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    });
}

// Main loop
function loop() {
    ctx.clearRect(0, 0, width, height); // Clear canvas
    drawGrid(); // Draw grid
    drawVectors(); // Draw vectors
    requestAnimationFrame(loop);
}

// Add vector button functionality
get("#addVector").addEventListener("click", () => {
    let mag = parseFloat(get("#magnitude").value);
    let dir = parseFloat(get("#direction").value) * (Math.PI / 180) * -1; // Convert to radians
    let x = Math.cos(dir) * mag;
    let y = Math.sin(dir) * mag;
    let newVector = new Vector(x, y);

    // Check the selected operation
    let operation = document.querySelector('input[name="operation"]:checked').value;
    if (operation === "add") {
        vectors.push(newVector); // Add new vector
    } else if (operation === "subtract") {
        vectors.push(newVector.sub(new Vector(0, 0))); // Subtract vector
    }
});

// Clear vectors button functionality
get("#clearVectors").addEventListener("click", () => {
    vectors = []; // Clear all vectors
});

loop();