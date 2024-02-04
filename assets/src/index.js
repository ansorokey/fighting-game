import Sprite from "./sprite.js";
import Fighter from "./fighter.js";
import {c, canvas} from './canvas.js';
import GLOBAL from "./global.js";
import { timerId, decreaseTimer, determineWinner, rectangularCollision } from "./utils.js";

console.log('Game is running! FIGHT!')
// ...git

// color in the canvas, default black
c.fillRect(0, 0, canvas.width, canvas.height)

// BACKGROUND
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: '../assets/assets/images/background/decorated background.png'
})

console.log(background);

// SHOP
const shop = new Sprite({
    position: {
        x: 500,
        y: 125
    },
    imgSrc: '../assets/assets/images/decorations/shop_anim.png',
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
    },
    imgSrc: '../assets/assets/images/player1/Idle.png',
    maxFrames: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 155
    },
    sprites: {
        idle: {
            imgSrc: '../assets/assets/images/player1/Idle.png',
            maxFrames: 8
        },
        run: {
            imgSrc: '../assets/assets/images/player1/Run.png',
            maxFrames: 8
        },
        runLeft: {
            imgSrc: '../assets/assets/images/player1/Run_left.png',
            maxFrames: 8
        },
        jump: {
            imgSrc: '../assets/assets/images/player1/Jump.png',
            maxFrames: 2
        },
        fall: {
            imgSrc: '../assets/assets/images/player1/Fall.png',
            maxFrames: 2
        },
        attack1: {
            imgSrc: '../assets/assets/images/player1/Attack1.png',
            maxFrames: 6
        },
        takeHit: {
            imgSrc: '../assets/assets/images/player1/Take Hit.png',
            maxFrames: 4
        },
        death: {
            imgSrc: '../assets/assets/images/player1/Death.png',
            maxFrames: 6
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 150,
        height: 50
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
    },
    imgSrc: '../assets/assets/images/player2/Idle.png',
    maxFrames: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imgSrc: '../assets/assets/images/player2/Idle.png',
            maxFrames: 4
        },
        run: {
            imgSrc: '../assets/assets/images/player2/Run.png',
            maxFrames: 8
        },
        runLeft: {
            imgSrc: '../assets/assets/images/player2/Run_left.png',
            maxFrames: 8
        },
        jump: {
            imgSrc: '../assets/assets/images/player2/Jump.png',
            maxFrames: 2
        },
        fall: {
            imgSrc: '../assets/assets/images/player2/Fall.png',
            maxFrames: 2
        },
        attack1: {
            imgSrc: '../assets/assets/images/player2/Attack1.png',
            maxFrames: 4
        },
        takeHit: {
            imgSrc: '../assets/assets/images/player2/Take hit.png',
            maxFrames: 3
        },
        death: {
            imgSrc: '../assets/assets/images/player2/Death.png',
            maxFrames: 7
        },
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})

decreaseTimer({player, enemy});

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

    // white half opacity overlay to make the characters stand out more
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // redraw the player and enemy every frame
    player.update();
    enemy.update();

    // the character should not move across x axis by default
    // the character moves 0 per frame when a key is not being held down
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // check if/which key is currently held
    // the lastKey boolean prevents us from ignoring the entire
    // if-else when a is pressed and we're holding down multiple keys
    // also change to run animation
    // playermovements
    if (GLOBAL.KEYS.a.pressed === true && player.lastKey === 'a') {
        player.velocity.x = -GLOBAL.WALK_SPEED;
        player.switchSprite('runLeft');
    } else if (GLOBAL.KEYS.d.pressed === true && player.lastKey === 'd') {
        player.velocity.x = GLOBAL.WALK_SPEED;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    if(player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // enemy movements
    if (GLOBAL.KEYS.ArrowLeft.pressed === true && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -GLOBAL.WALK_SPEED;
        enemy.switchSprite('runLeft');
    } else if (GLOBAL.KEYS.ArrowRight.pressed === true && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = GLOBAL.WALK_SPEED;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // PLAYER ATTACKS ENEMY
    if(
        rectangularCollision({
            rec1: player,
            rec2: enemy
        }) &&
        // is player hitbox active AND in the attack animation?
        player.isAttacking && player.curFrame === 4
    ){ //
        // immediatly set attacking to false, othersise we get several hits per second
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to('#enemy-health', {
            width: enemy.health + '%'
        })
    }

    // player misses attack
    if(player.isAttacking && player.curFrame == 4) {
        player.isAttacking = false;
    }

    // ENEMY ATTACKS PLAYER
    if(
        rectangularCollision({
            rec1: enemy,
            rec2: player
        }) &&
        // is player hitbox active?
        enemy.isAttacking && enemy.curFrame === 2
    ){
        // immediatly set attacking to false, othersise we get several hits per second
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to('#player-health', {
            width: player.health + '%'
        })
    }

        // player misses attack
        if(enemy.isAttacking && enemy.curFrame == 2) {
            enemy.isAttacking = false;
        }

    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId});
    }

}

animate();

window.addEventListener('keydown', (e) => {

    // player movements
    if(!player.isDead) {
        switch(e.key) {
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
        }
    }



    // enemy movements
    if(!enemy.isDead) {
        switch(e.key) {
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
