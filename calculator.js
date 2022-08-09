const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const FPS = 30;

const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
const PLAYER_COLOR = 'rgb(255, 0, 0)';

const GRAVITY = 50;

const CAMERA_X_OFFSET = 0.1 * WIDTH;

const PLAYER_X_SPEED = 400;

const OJBECT_GAPS = 1000;

const PLAYER_JUMP_FORCE = 20;

const time = {
    currTime: new Date() / 1000,
    pastTime: new Date() / 1000,
    get deltaTime() {
        return this.currTime - this.pastTime;
    },
    updateTime() {
        this.pastTime = this.currTime;
        this.currTime = new Date() / 1000;
    }
}

class Rect {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + CAMERA_X_OFFSET, this.y, this.width, this.height);
    }
}

class Player extends Rect {
    constructor(x, y) {
        super(x, y, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR);
        this.velocityY = 0;
    }
}

const objects = [new Rect(0, 2 * HEIGHT / 3, WIDTH / 3, HEIGHT / 3, "white"), new Rect(OJBECT_GAPS, 2 * HEIGHT / 3, WIDTH / 3, HEIGHT / 3, "white")];
const player = new Player(0, 2 * HEIGHT / 3 - PLAYER_HEIGHT);

function spawnObject(x, y) {
    
}

function init() {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.width = WIDTH;
    canvas.style.height = HEIGHT;
    canvas.style.margin = 0;
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.position = 'fixed';

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            player.velocityY = -PLAYER_JUMP_FORCE;
        }
    })

    setTimeout(loop, 1000 / FPS)
}

function reset() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function loop() {
    reset();

    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        obj.draw();
        obj.x -= time.deltaTime * PLAYER_X_SPEED;

        if (obj.x + obj.width + 2 * CAMERA_X_OFFSET < 0) {
            objects.splice(i, 1);
            objects.push(new Rect(objects[objects.length-1].x + OJBECT_GAPS, 2 * HEIGHT / 3, WIDTH / 3, HEIGHT / 3, "white"))
            i--;
        }
    }

    let saveY = player.y;
    
    saveY += player.velocityY;

    if (objects.length > 0) {
        if (player.x < objects[0].x + objects[0].width && player.x > objects[0].x && saveY + player.height >= objects[0].y) {
            saveY -= player.velocityY;
            player.velocityY = 0;
        }
    }

    player.y = saveY;
    player.velocityY += GRAVITY * time.deltaTime;

    ctx.fillStyle = 'red';
    player.draw();

    time.updateTime();

    setTimeout(loop, 1000 / FPS);
}

init();
