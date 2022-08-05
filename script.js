const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const UNIT_WIDTH = 10;
const WIDTH = 150 * UNIT_WIDTH;
const HEIGHT = 100 * UNIT_WIDTH;
const FPS = 60;
const mouse = { x: 0, y: 0 };

const WALL = 0;
const CACTUS = 1;

const GAME_DISTANCE_LEFT = (window.innerWidth - WIDTH) / 2;
const GAME_DISTANCE_TOP = (window.innerHeight - HEIGHT) / 2;

let currType = WALL;



function init() {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.width = WIDTH;
    canvas.style.height = HEIGHT;
    canvas.style.left = `${GAME_DISTANCE_LEFT}px`;
    canvas.style.top = `${GAME_DISTANCE_TOP}px`;
    canvas.style.position = 'fixed';
    canvas.style.border = '10px solid';
    canvas.style.borderColor = 'white';

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case "KeyW":
                currType = WALL;
                break;
        }
    })
    
    setTimeout(loop, 1000 / FPS);
}

function loop() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    let clampedX = UNIT_WIDTH * Math.floor((mouse.x - GAME_DISTANCE_LEFT - 2 * UNIT_WIDTH)  / UNIT_WIDTH);
    let clampedY = UNIT_WIDTH * Math.floor((mouse.y - GAME_DISTANCE_TOP - 2 * UNIT_WIDTH)  / UNIT_WIDTH);

    ctx.fillStyle = 'gray';
    ctx.fillRect(clampedX, clampedY, UNIT_WIDTH, UNIT_WIDTH);

    setTimeout(loop, 1000 / FPS);
}

init();
