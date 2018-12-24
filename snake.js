const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');
const scale = 10;
const size = canvas.width / scale
context.scale(scale, scale);

const arena = createMatrix(size, size);
const player = {
    pos: { x: 5, y: 5 },
    prev: { x: 5, y: 5 },
    next: { x: 0, y: -1 },
    body: [],
    remove: { x: 0, y: 0 },
    score: 0,
    bonus: []
}

/**
 * check if the player hits the border
 * @param {*} arena 
 * @param {*} player 
 */
function collide() {
    return player.pos.x < 0 || player.pos.y < 0 || player.pos.x >= size || player.pos.y >= size;
}

/**
 * Create the map
 * @param {width} w 
 * @param {height} h 
 */
function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function draw() {
    context.fillStyle = '#f0f';
    player.bonus.forEach(element => {
        context.fillRect(element.x, element.y, 1, 1);
    })
    context.fillStyle = '#fff';
    player.body.forEach(element => {
        context.fillRect(element.x, element.y, 1, 1);
    });
    context.fillStyle = '#000';
    context.fillRect(player.pos.x + 0.25, player.pos.y + 0.25, 0.5, 0.5);
}

function undraw() {
    context.fillStyle = '#202028';
    context.fillRect(player.remove.x, player.remove.y, 1, 1);
}

function is_eating() {

    for (let i = 0; i < player.bonus.length; ++i) {
        if (player.bonus[i].x === player.pos.x && player.bonus[i].y === player.pos.y) {
            player.bonus.splice(i, 1);
            console.log('miam');
            return true;
        }
    }
    return false;
}

function playerMove() {
    if (collide(arena)) {
        playerReset();
    } else {
        let isEating = is_eating();
        player.prev.x = player.pos.x;
        player.prev.y = player.pos.y;
        player.pos.x += player.next.x;
        player.pos.y += player.next.y;
        const pos = { x: 0, y: 0 };
        pos.x = player.pos.x;
        pos.y = player.pos.y;
        player.body.unshift(pos);

        if (!isEating) {
            player.remove = player.body.pop();
            undraw();
        }
    }
    updateScore();
}

function playerReset() {
    player.pos = { x: 5, y: 5 };
    player.score = 0;
    player.body = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }];
    player.remove = { x: 0, y: 0 };
    player.next = { x: 0, y: -1 };
    context.fillStyle = '#202028';
    context.fillRect(0, 0, size, size);
    player.bonus = [{ x: 10, y: 10 }];
}

let dropCounter = 0;
let dropInterval = 250; //250
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerMove();
        dropCounter = 0;
    }
    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        player.next = { x: -1, y: 0 };
    } else if (event.keyCode === 38) {
        player.next = { x: 0, y: -1 };
    } else if (event.keyCode === 39) {
        player.next = { x: 1, y: 0 };
    } else if (event.keyCode === 40) {
        player.next = { x: 0, y: 1 };
    }
})

playerReset();
updateScore();
update();