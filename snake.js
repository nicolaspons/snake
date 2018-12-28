const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');
const scale = 10;
const size = canvas.width / scale
context.scale(scale, scale);

function collide(p) {
    return p.pos.x < 0 || p.pos.y < 0 || p.pos.x >= size || p.pos.y >= size;
}

function collideItself(p) {
    let ct = 0;
    p.body.forEach(element => {
        if (element.x == p.pos.x && element.y == p.pos.y) {
            ct++;
        }
    })
    return ct > 1;
}

function draw() {
    context.fillStyle = '#f0f';
    context.fillRect(player.bonus.x, player.bonus.y, 1, 1);
    context.fillStyle = '#fff';
    player.body.forEach(element => {
        context.fillRect(element.x, element.y, 1, 1);
    });
    context.fillStyle = '#0ff';
    ia.body.forEach(element => {
        context.fillRect(element.x, element.y, 1, 1);
    });
    context.fillStyle = '#000';
    context.fillRect(player.pos.x + 0.25, player.pos.y + 0.25, 0.5, 0.5);
    context.fillRect(ia.pos.x + 0.25, ia.pos.y + 0.25, 0.5, 0.5);

}

function undraw(p) {
    context.fillStyle = '#202028';
    context.fillRect(p.remove.x, p.remove.y, 1, 1);
}

function is_eating(p) {
    return player.bonus.x === p.pos.x && player.bonus.y === p.pos.y;
}

function fillBonus() {
    let isOk = false;
    let x;
    let y;
    while (!isOk) {
        x = Math.floor(Math.random() * Math.floor(size));
        y = Math.floor(Math.random() * Math.floor(size));
        isOk = !player.body.includes({ x, y });
    }
    player.bonus = { x, y };
}



let dropCounter = 0;
let dropInterval = 100;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerMove();
        iaMove();
        dropCounter = 0;
    }
    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37 || event.keyCode === 81) {
        player.next = { x: -1, y: 0 };
    } else if (event.keyCode === 38 || event.keyCode === 90) {
        player.next = { x: 0, y: -1 };
    } else if (event.keyCode === 39 || event.keyCode === 68) {
        player.next = { x: 1, y: 0 };
    } else if (event.keyCode === 40 || event.keyCode === 83) {
        player.next = { x: 0, y: 1 };
    }
})

// IA
const ia = {
    pos: { x: size - 5, y: size - 5 },
    prev: { x: size - 5, y: size - 5 },
    body: [],
    remove: { x: 0, y: 0 },
}

function getPos() {
    return { x: player.bonus.x - ia.pos.x, y: player.bonus.y - ia.pos.y };
}

function checkIaMove(currPos) {
    let newPos = getPos();
    let a = !collide(ia);
    debugger;

    let b = !collideItself(ia)
    debugger;
    if (a && b) {
        let pos = { x: 0, y: 0 };
        pos.x = ia.pos.x;
        pos.y = ia.pos.y;
        ia.body.unshift(pos);

        if (is_eating(ia)) {
            fillBonus();
        } else {
            ia.remove = ia.body.pop();
            undraw(ia);
        }
        return true;
    }
    debugger;
    return false;
}

function iaMove() {
    if (collide(ia) || collideItself(ia)) {
        reset();
    } else {
        const currPos = getPos();

        if (currPos.x != 0) {
            if (currPos.x < 0) {
                ia.pos.x -= 1;
                if (checkIaMove(currPos)) { return; }
            }
            ia.pos.x += 2;
            if (checkIaMove(currPos)) { return; }
            ia.pos.x -= 1;
        }
        if (currPos.y != 0)  {
            if (currPos.y < 0) {
                ia.pos.y -= 1;
                if (checkIaMove(currPos)) { return; }
            }
            ia.pos.y += 2;
            if (checkIaMove(currPos)) { return; }
            ia.pos.y -= 1;
        }
        console.log('cant move');
        reset();
    }
}


// PLAYER
const player = {
    pos: { x: 5, y: 5 },
    next: { x: 0, y: -1 },
    body: [],
    remove: { x: 0, y: 0 },
    score: 0,
    bonus: null
}

function reset() {
    //PLAYER
    player.pos = { x: 5, y: 5 };
    player.score = 0;
    player.body = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }];
    player.remove = { x: 0, y: 0 };
    player.next = { x: 0, y: -1 };

    //IA
    ia.pos = { x: size - 5, y: size - 5 };
    ia.body = [{ x: size - 5, y: size - 5 }, { x: size - 5, y: size - 6 }, { x: size - 5, y: size - 7 }];
    ia.remove = { x: 0, y: 0 };

    context.fillStyle = '#202028';
    context.fillRect(0, 0, size, size);
    fillBonus();

}

function playerMove() {
    if (collide(player) || collideItself(player)) {
        reset();
    } else {
        player.pos.x += player.next.x;
        player.pos.y += player.next.y;
        const pos = { x: 0, y: 0 };
        pos.x = player.pos.x;
        pos.y = player.pos.y;
        player.body.unshift(pos);

        if (is_eating(player)) {
            player.score++;
            fillBonus();
        } else {
            player.remove = player.body.pop();
            undraw(player);
        }
    }
    updateScore();
}

reset();
updateScore();
update();