import Sprite from "/src/sprite.js";
import Fighter from "/src/fighter.js";
import {c, canvas} from '/src/canvas.js';
import GLOBAL from "/src/global.js";
import { timerId, decreaseTimer, determineWinner, rectangularCollision } from "./utils.js";

console.log('Game script running')

// color in the canvas, default black
c.fillRect(0, 0, canvas.width, canvas.height)

// BACKGROUND
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: '/assets/background/decorated background.png'
})

// SHOP
const shop = new Sprite({
    position: {
        x: 500,
        y: 125
    },
    imgSrc: '/assets/decorations/shop_anim.png',
    scale: 2.75,
    maxFrames: 6
})

// PLAYER CHARACTER
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    offset: {
        x: 0,
        y: 0
    }
})

// ENEMY CHARACTER
const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

decreaseTimer();

function animate() {
    // An infinite loop that draws the game
    window.requestAnimationFrame(animate);

    // redraw the canvas for the next frame
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // draw the background first
    background.update();

    // next, draw the shop
    shop.update();

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
    if (GLOBAL.KEYS.a.pressed === true && player.lastKey === 'a') {
        player.velocity.x = -GLOBAL.WALK_SPEED;
    } else if (GLOBAL.KEYS.d.pressed === true && player.lastKey === 'd') {
        player.velocity.x = GLOBAL.WALK_SPEED;
    }

    // enemy movements
    if (GLOBAL.KEYS.ArrowLeft.pressed === true && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -GLOBAL.WALK_SPEED;
    } else if (GLOBAL.KEYS.ArrowRight.pressed === true && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = GLOBAL.WALK_SPEED;
    }

    // detect player attacking collision
    if(
        rectangularCollision({
            rec1: player,
            rec2: enemy
        }) &&
        // is player hitbox active?
        player.isAttacking
    ){
        // immediatly set attacking to false, othersise we get several hits per second
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemy-health').style.width = enemy.health + '%';
        console.log('player hit enemy')
    }

    // detect enemy attacking collision
    if(
        rectangularCollision({
            rec1: enemy,
            rec2: player
        }) &&
        // is player hitbox active?
        enemy.isAttacking
    ){
        // immediatly set attacking to false, othersise we get several hits per second
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#player-health').style.width = player.health + '%';
        console.log('enemy hit player')
    }

    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId});
    }

}

animate();

window.addEventListener('keydown', (e) => {
    // console.log(e.key)
    switch(e.key) {
        // player movements
        case 'a':
            GLOBAL.KEYS.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'd':
            GLOBAL.KEYS.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'w':
            player.velocity.y = GLOBAL.JUMP_HEIGHT;
            break;
        case ' ':
            player.attack();
            break;

        // enemy movements
        case 'ArrowLeft':
            GLOBAL.KEYS.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowRight':
            GLOBAL.KEYS.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowUp':
            enemy.velocity.y = GLOBAL.JUMP_HEIGHT;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
        }
});

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        // player movements
        case 'a':
            GLOBAL.KEYS.a.pressed = false;
            break;
        case 'd':
            GLOBAL.KEYS.d.pressed = false;
            break;
        case 'w':
            GLOBAL.KEYS.w.pressed = false;
            break;

        // enemy movements
        case 'ArrowLeft':
            GLOBAL.KEYS.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            GLOBAL.KEYS.ArrowRight.pressed = false;
            break;
        case 'ArrowUp':
            GLOBAL.KEYS.ArrowUp.pressed = false;
            break;

    }
});
