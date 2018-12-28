const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');
const scale = 10;
const size = canvas.width / scale
context.scale(scale, scale);

function collide(p) {
    if (p.pos.x < 0 || p.pos.y < 0 || p.pos.x >= size || p.pos.y >= size)
        return true;
    return false;
}

function playercollideItself(p) {
    let ct = 0;
    p.body.forEach(element => {
        if (element.x == p.pos.x && element.y == p.pos.y) {
            ct++;
        }
    })
    return ct > 1;
}

function collideItself(p) {
    let ct = 0;
    p.body.forEach(element => {
        if (element.x == p.pos.x && element.y == p.pos.y) {
            ct++;
        }
    })
    return ct != 0;
}

function draw() {
    context.fillStyle = '#f0f';
    context.fillRect(player.bonus.x, player.bonus.y, 1, 1);
    context.fillStyle = '#fff';
    player.body.forEach(element => {
        context.fillRect(element.x, element.y, 1, 1);
    });
    //IA
    player.ennemies.forEach(ennemy => {
        context.fillStyle = ennemy.color;
        ennemy.body.forEach(element => {
            context.fillRect(element.x, element.y, 1, 1);
        });
        context.fillStyle = '#000';
        context.fillRect(ennemy.pos.x + 0.25, ennemy.pos.y + 0.25, 0.5, 0.5);
    })
    context.fillRect(player.pos.x + 0.25, player.pos.y + 0.25, 0.5, 0.5);
}

function undraw(p) {
    context.fillStyle = '#202028';
    context.fillRect(p.remove.x, p.remove.y, 1, 1);
}

function is_eating(p) {
    return player.bonus.x === p.pos.x && player.bonus.y === p.pos.y;
}

function fillBonus() {
    let x = Math.floor(Math.random() * Math.floor(size));
    let y = Math.floor(Math.random() * Math.floor(size));
    player.bonus = { x, y };
}



let dropCounter = 0;
let dropInterval = 100; //100
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerMove();
        ennemiesMove();
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
class ia {
    constructor(positionX, positionY, color) {
        this.pos = { x: positionX, y: positionY };
        this.prev = { x: positionX, y: positionY };
        this.body = [];
        this.remove = { x: 0, y: 0 };
        this.color = color;
    }
    getPos() {
        return { x: player.bonus.x - this.pos.x, y: player.bonus.y - this.pos.y };
    }
    checkMove(currPos) {
        debugger;
        let newPos = this.getPos();
        let a = !collide(this);
        let b = !collideItself(this)
        if (a && b) {
            let pos = { x: 0, y: 0 };
            pos.x = this.pos.x;
            pos.y = this.pos.y;
            this.body.unshift(pos);

            if (is_eating(this)) {
                fillBonus();
            } else {
                this.remove = this.body.pop();
                undraw(this);
            }
            return true;
        }
        return false;
    }

    getBody() {
        const temp = this.body[1];
        const x = temp.x - this.pos.x;
        const y = temp.y - this.pos.y;
        if (x == 0) {
            if (y == 1) { return 'down'; }
            return 'up';
        }
        if (x == 1) { return 'right'; }
        return 'left';
    }
    getMax(tab) {
        let max = 0;
        let id = '';
        for (var key in tab) {
            if (tab[key] > max) {
                max = tab[key];
                id = key;
            }
        }
        return id;
    }
    getCoord(move) {
        switch (move) {
            case 'up':
                return { x: 0, y: -1 };
            case 'down':
                return { x: 0, y: 1 };
            case 'left':
                return { x: -1, y: 0 };
            default:
                return { x: 1, y: 0 };
        }
    }
    move() {
        const currPos = this.getPos();
        var dictMove = { 'up': 1, 'down': 1, 'left': 1, 'right': 1 };
        if (currPos.x < 0) { dictMove['left'] += 1; } else if (currPos.x > 0) { dictMove['right'] += 1; }
        if (currPos.y < 0) { dictMove['up'] += 1; } else if (currPos.y > 0) { dictMove['down'] += 1; }

        delete dictMove[this.getBody()];
        debugger;
        for (let i = 0; i < 3; ++i) {
            let key = this.getMax(dictMove);
            let keyPos = this.getCoord(key);
            this.pos.x += keyPos.x;
            this.pos.y += keyPos.y;
            //bug ici 
            if (this.checkMove(currPos)) { return; }
            delete dictMove[key];
            this.pos.x -= keyPos.x;
            this.pos.y -= keyPos.y;
        }
        console.log(this.color, ' cannot move');
        reset();
    }
}

function ennemiesMove() {
    player.ennemies.forEach(element => {
        element.move();
    })
}

// PLAYER
const player = {
    pos: { x: 5, y: 5 },
    next: { x: 0, y: -1 },
    body: [],
    remove: { x: 0, y: 0 },
    score: 0,
    bonus: null,
    ennemies: []
}

function reset() {
    //PLAYER
    player.pos = { x: 5, y: 5 };
    player.score = 0;
    player.body = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }];
    player.remove = { x: 0, y: 0 };
    player.next = { x: 0, y: -1 };

    //IA
    player.ennemies = [];
    const ia1 = new ia(size - 5, size - 5, 'blue');
    const ia2 = new ia(size - 5, 5, 'yellow');
    const ia3 = new ia(5, size - 5, 'red');
    ia1.body = [{ x: size - 5, y: size - 5 }, { x: size - 5, y: size - 4 }, { x: size - 5, y: size - 3 }];
    ia2.body = [{ x: size - 5, y: 5 }, { x: size - 5, y: 4 }, { x: size - 5, y: 3 }];
    ia3.body = [{ x: 5, y: size - 5 }, { x: 5, y: size - 4 }, { x: 5, y: size - 3 }];
    player.ennemies.push(ia1);
    player.ennemies.push(ia2);
    player.ennemies.push(ia3);

    context.fillStyle = '#202028';
    context.fillRect(0, 0, size, size);
    fillBonus();
}

function playerMove() {
    if (collide(player) || playercollideItself(player)) {
        console.log('player connot move');
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