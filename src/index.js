console.log('Game script running')

const canvas = document.querySelector('canvas');
// could also do this in css, but it'll load at a different time
// 16 x 9 ratio, default pixels
canvas.width = 1024;
canvas.height = 576;

// the canvas API and all methods/properties
const c = canvas.getContext('2d');

// color in the canvas, default black
c.fillRect(0, 0, canvas.width, canvas.height)

// instead of a set downward speed, we are adding this much distance everyt frame
// gives a smoother acceleration downwards
const GRAVITY = 0.7;

// shoots the character upward, and gravity activates slowly catching up
const JUMP_HEIGHT = -20;

// horizontal movement
const WALK_SPEED = 5;

// sprite class
class Sprite {
    // passing in an object and destructuring lets us
    // not worry about the parameter positions
    constructor({position, velocity}) {
        this.position = position; // starting position
        this.velocity = velocity; // how fast the sprite moves
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: this.position, // follows the same xy origin as the character
            width: 100,
            height: 50
        }
    }

    draw() {
        // determines what color the fillStytle will use
        // draw the character
        c.fillStyle = 'red';
        c.fillRect(
            this.position.x,
            this.position.y,
            50,
            this.height
        )

        // draw the attackBox
        c.fillStyle = 'green';
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    }

    // draw and update the position of the sprite every frame
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // checks for ground collision, sets downward move speed to 0
        if((this.position.y + this.height) + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            // gravity only applies when the character is above the ground
            this.velocity.y += GRAVITY;
        }
    }
}


const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }
})

// a global object to keep track of what keys are currently held down
const KEYS = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

// this tracks the last key that was pressed
// two keys can be held down at the same time, but only one can be the last key
let lastKey;

function animate() {
    // An infinite loop that draws the game
    window.requestAnimationFrame(animate);

    // redraw the canvas for the next frame
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // redraw the player and enemy every frame
    player.update();
    enemy.update();

    // the character should not move across x axis by default
    // the character moves 0 perf rame when a key is not being held down
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // check if/which key is currently held
    // the lastKey boolean prevents us from ignoring the entire
    // if-else when a is pressed and we're holding down multiple keys
    // playermovements
    if (KEYS.a.pressed === true && player.lastKey === 'a') {
        player.velocity.x = -WALK_SPEED;
    } else if (KEYS.d.pressed === true && player.lastKey === 'd') {
        player.velocity.x = WALK_SPEED;
    }

    // enemy movements
    if (KEYS.ArrowLeft.pressed === true && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -WALK_SPEED;
    } else if (KEYS.ArrowRight.pressed === true && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = WALK_SPEED;
    }
}

animate();

window.addEventListener('keydown', (e) => {
    // console.log(e.key)
    switch(e.key) {
        // player movements
        case 'a':
            KEYS.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'd':
            KEYS.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'w':
            player.velocity.y = JUMP_HEIGHT;
            break;

        // enemy movements
        case 'ArrowLeft':
            KEYS.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowRight':
            KEYS.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowUp':
            enemy.velocity.y = JUMP_HEIGHT;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        // player movements
        case 'a':
            KEYS.a.pressed = false;
            break;
        case 'd':
            KEYS.d.pressed = false;
            break;
        case 'w':
            KEYS.w.pressed = false;
            break;

        // enemy movements
        case 'ArrowLeft':
            KEYS.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            KEYS.ArrowRight.pressed = false;
            break;
        case 'ArrowUp':
            KEYS.ArrowUp.pressed = false;
            break;

    }
});
