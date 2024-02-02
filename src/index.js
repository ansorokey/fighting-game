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
const GRAVITY = 0.2;

// sprite class
class Sprite {
    // passing in an object and destructuring lets us
    // not worry about the parameter positions
    constructor({position, velocity}) {
        this.position = position; // starting position
        this.velocity = velocity; // how fast the sprite moves
        this.height = 150;
    }

    draw() {
        // determines what color the fillStytle will use
        c.fillStyle = 'red';
        c.fillRect(
            this.position.x,
            this.position.y,
            50,
            this.height
        )
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

    // the chatacter should not move across x axis by default
    player.velocity.x = 0;

    // check if/which key is currently held
    // the lastKey boolean prevents us from ignoring the entire
    // if-else when a is pressed and we're holding down multiple keys
    if (KEYS.a.pressed === true && lastKey === 'a') {
        player.velocity.x = -1;
    } else if (KEYS.d.pressed === true && lastKey === 'd') {
        player.velocity.x = 1;
    }
}

animate();

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'a':
            KEYS.a.pressed = true;
            lastKey = 'a';
            break;
        case 'd':
            KEYS.d.pressed = true;
            lastKey = 'd';
            break;
        case 'w':
            // shoots the character upward, and gravity activates slowly catching up
            player.velocity.y = -10;
            break;

            @TODO
            // ADD MORE CASES for arrow keys
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'a':
            KEYS.a.pressed = false;
            break;
        case 'd':
            KEYS.d.pressed = false;
            break;
        case 'w':
            KEYS.w.pressed = false;
            break;

    }
});
