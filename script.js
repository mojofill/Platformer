const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const UNIT_WIDTH = 10;
const WIDTH = 150 * UNIT_WIDTH;
const HEIGHT = 100 * UNIT_WIDTH;
const FPS = 60;
const mouse = {
    x: 0,
    y: 0
};

const selectorColor = 'rgba(128, 128, 128)';

const WALL = 0;

const WALL_COLOR = "white";

const GAME_DISTANCE_LEFT = (window.innerWidth - WIDTH) / 2;
const GAME_DISTANCE_TOP = (window.innerHeight - HEIGHT) / 2;

let selectedObj = {
    obj: null,
    left: false,
    top: false,
    right: false,
    bottom: false,
    setObj(_obj) {
        this.obj = _obj;
    },
    getSelectors() {
        if(this.obj !== null) {
            return {
                left: new Rect(this.obj.x - UNIT_WIDTH / 2, this.obj.y - UNIT_WIDTH / 2, UNIT_WIDTH, this.obj.height + UNIT_WIDTH, selectorColor),
                top: new Rect(this.obj.x + UNIT_WIDTH / 2, this.obj.y - UNIT_WIDTH / 2, this.obj.width - UNIT_WIDTH, UNIT_WIDTH, selectorColor),
                right: new Rect(this.obj.x + this.obj.width - UNIT_WIDTH / 2, this.obj.y - UNIT_WIDTH / 2, UNIT_WIDTH, this.obj.height + UNIT_WIDTH, selectorColor),
                bottom: new Rect(this.obj.x + UNIT_WIDTH / 2, this.obj.y + this.obj.height - UNIT_WIDTH / 2, this.obj.width - UNIT_WIDTH, UNIT_WIDTH, selectorColor)
            }
        }
    },
    draw() {
        if (this.obj !== null) {
            let { left, top, right, bottom } = this.getSelectors();
            left.draw();
            top.draw();
            right.draw();
            bottom.draw();
        }
    },
    offset: { // this is for selectors enlargening the selector
        leftX: 0,
        bottomY: 0,
        rightX: 0,
        topY: 0,
        x: 0,
        y: 0
    },
    selectors: {
        left: false,
        top: false,
        right: false,
        bottom: false
    }
};

let freeze = false;

let brush = {
    start: null,
    end: null,
    type: WALL
}

const objects = [];

class Rect {
    constructor(x, y, width, height, color="white") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Physics {
    static collisionDetect(obj1, obj2) {
        let border = 0;
        let collider = new Rect(obj1.x - border, obj1.y - border, obj1.width + 2 * border, obj1.length + 2 * border);

        return (obj2 !== obj1 &&
            collider.x < obj2.x + obj2.width &&
            collider.x + collider.width > obj2.x &&
            collider.y < obj2.y + obj2.length &&
            collider.length + collider.y > obj2.y)
    }

    static pointInObj(point, obj) {
        return (point.x > obj.x && point.x < obj.x + obj.width && point.y > obj.y && point.y < obj.y + obj.height);
    }
}

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

    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case "Escape":
                brush.start = null;
                break;
        }
    })

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.x - GAME_DISTANCE_LEFT;
        mouse.y = e.y - GAME_DISTANCE_TOP;
    });

    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case "KeyW":
                brush.type = WALL;
                break;
        }
    });

    document.addEventListener('mousedown', (e) => {
        let mouseVector = new Vector(mouse.x, mouse.y);

        if (selectedObj.obj !== null) {
            if (selectedObj.selectors.left || selectedObj.selectors.top || selectedObj.selectors.right || selectedObj.selectors.bottom) {
                if (selectedObj.selectors.left) selectedObj.offset.leftX = selectedObj.obj.x - mouse.x;
                else if (selectedObj.selectors.right) selectedObj.offset.rightX = mouse.x - selectedObj.obj.x + selectedObj.obj.width;
                else if (selectedObj.selectors.top) selectedObj.offset.topX = mouse.y - selectedObj.obj.y;
            }
            else {
                let selectors = selectedObj.getSelectors();
                for (const key of Object.keys(selectors)) {
                    let selector = selectors[key];
                    if (Physics.pointInObj(mouseVector, selector)) {
                        selectedObj.selectors[key] = true;
                        break;
                    }
                }
            }
        }

        if (brush.start === null) {
            for (const obj of objects) {
                if(Physics.pointInObj(mouseVector, obj)) {
                    selectedObj.setObj(obj);
                    return;
                }
            }
            brush.start = [mouse.x, mouse.y];
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (brush.start === null) {
            return;
        }

        brush.end = [mouse.x, mouse.y];

        let otherCorner1 = [brush.start[0], brush.end[1]];
        let otherCorner2 = [brush.end[0], brush.start[1]];

        let corners = [brush.start, brush.end, otherCorner1, otherCorner2];
        let topLeft;
        ctx.fillStyle = 'white'
        for (const coord of corners) {
            let i = 0;
            ctx.fillRect(coord[0], coord[1], UNIT_WIDTH, UNIT_WIDTH);
            for (const _coord of corners) {
                if (coord[0] !== _coord[0] || coord[1] !== _coord[1]) {
                    if (coord[0] <= _coord[0] && coord[1] <= _coord[1]) {
                        i++;
                    }
                }
            }

            if (i === 3) { // all three corners are "greater" than coord - that means that coord is top left
                topLeft = coord;
                break;
            }
        }

        if (topLeft === undefined) {
            brush.start = null;
            brush.end = null;
            return;
        }

        let color;

        switch(brush.type) {
            case WALL:
                color = WALL_COLOR;
                break;
        }

        let width = Math.abs(brush.start[0] - brush.end[0]);
        let height = Math.abs(brush.start[1] - brush.end[1]);
        let obj = new Rect(topLeft[0], topLeft[1], width, height, color);
        objects.push(obj);

        brush.start = null;
        brush.end = null;
    })
    
    setTimeout(loop, 1000 / FPS);
}

function loop() {
    if (freeze) return;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if (brush.start !== null && brush.end === null) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(brush.start[0], brush.start[1], mouse.x - brush.start[0], mouse.y - brush.start[1]);
    }

    for (const obj of objects) {
        obj.draw();
    }

    selectedObj.draw();

    setTimeout(loop, 1000 / FPS);
}

init();
