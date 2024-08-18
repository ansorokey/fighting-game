import {c, canvas} from './canvas.js'; // keep this in for dev stuff
import Sprite from './sprite.js';
import GLOBAL from './global.js';

// Sprite class manages drawing
class Fighter extends Sprite {
    // passing in an object and destructuring lets us
    // not worry about the parameter positions
    constructor({
        position,
        velocity,
        color,
        imgSrc,
        scale=1,
        maxFrames=1,
        offset={x:0, y:0},
        sprites,
        attackBox = {
            offset: { x: 0, y: 0},
            width: undefined,
            height: undefined
        },
        facing,
    }) {
        super({
            position,
            imgSrc,
            scale,
            maxFrames,
            offset
        })
        // this.position = position; // starting position
        this.velocity = velocity; // how fast the sprite moves/pixels moved
        this.height = 150;
        this.width = 50;

        // this tracks the last key that was pressed
        // two keys can be held down at the same time, but only one can be the last key
        this.lastKey;
        this.attackBox = {
            position: { // follows the same xy origin as the character
                x: this.position.x,
                y: this.position.y
            },
            width: attackBox.width,
            height: attackBox.height,
            offset: attackBox.offset
        }
        this.color = color;
        this.isAttacking = false;
        this.health = 100;
        this.maxFrames = maxFrames;
        this.curFrame = 0;
        this.elapsedFrames = 0;
        this.heldFrames = 8;
        this.sprites = sprites;
        this.isDead = false;
        this.facing = facing;
        this.canJump = true;

        for(const s in this.sprites) {
            sprites[s].image = new Image();
            sprites[s].image.src = sprites[s].imgSrc;
        }
    }

    // Set attack state to true and move into attack animation
    attack() {
        this.isAttacking = true;
        this.switchSprite('attack1');
    }

    // Calculates damage or death
    takeHit() {
        this.health -= 20;

        if(this.health <= 0) {
            this.switchSprite('death');
        } else {
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {
        // character death takes top priority over all other naimations
        if(this.image === this.sprites.deathLeft.image || this.image === this.sprites.deathRight.image) {
            // make sure character finishes death aimation before stopping others
            if(this.curFrame === this.sprites.deathLeft.maxFrames - 1) {
                this.isDead = true;
            }
            return;
        }

        // if we're attacking, we don't want to switch to other animations
        // if the animation is not done, return to prevent switching
        if (
            (this.image === this.sprites.attack1Left.image || this.image === this.sprites.attack1Right.image) &&
            this.curFrame < this.sprites.attack1Left.maxFrames - 1
        ) return;

        // same thing for taking a hit, needs to override all other animations
        if (
            (this.image === this.sprites.takeHitLeft.image || this.image === this.sprites.takeHitRight.image) &&
            this.curFrame < this.sprites.takeHitLeft.maxFrames - 1
        ) return;

        // each animation might has a different frame count,
        // need to update that in the player properties
        switch (sprite + this.facing) {
            case 'idleLeft':
                if(this.image !== this.sprites.idleLeft.image) {
                    this.image = this.sprites.idleLeft.image;
                    this.maxFrames = this.sprites.idleLeft.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'idleRight':
                if(this.image !== this.sprites.idleRight.image) {
                    this.image = this.sprites.idleRight.image;
                    this.maxFrames = this.sprites.idleRight.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'runRight':
                if(this.image !== this.sprites.runRight.image) {
                    this.image = this.sprites.runRight.image;
                    this.maxFrames = this.sprites.runRight.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'runLeft':
                if(this.image !== this.sprites.runLeft.image) {
                    this.image = this.sprites.runLeft.image;
                    this.maxFrames = this.sprites.runLeft.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'jumpLeft':
                if(this.image !== this.sprites.jumpLeft.image) {
                    this.image = this.sprites.jumpLeft.image;
                    this.maxFrames = this.sprites.jumpLeft.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'jumpRight':
                if(this.image !== this.sprites.jumpRight.image) {
                    this.image = this.sprites.jumpRight.image;
                    this.maxFrames = this.sprites.jumpRight.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'fallLeft':
                if(this.image !== this.sprites.fallLeft.image) {
                    this.image = this.sprites.fallLeft.image;
                    this.maxFrames = this.sprites.fallLeft.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'fallRight':
                if(this.image !== this.sprites.fallRight.image) {
                    this.image = this.sprites.fallRight.image;
                    this.maxFrames = this.sprites.fallRight.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'attack1Left':
                if(this.image !== this.sprites.attack1Left.image) {
                    this.image = this.sprites.attack1Left.image;
                    this.maxFrames = this.sprites.attack1Left.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'attack1Right':
                if(this.image !== this.sprites.attack1Right.image) {
                    this.image = this.sprites.attack1Right.image;
                    this.maxFrames = this.sprites.attack1Right.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'takeHitRight':
                if(this.image !== this.sprites.takeHitRight.image) {
                    this.image = this.sprites.takeHitRight.image;
                    this.maxFrames = this.sprites.takeHitRight.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'takeHitLeft':
                if(this.image !== this.sprites.takeHitLeft.image) {
                    this.image = this.sprites.takeHitLeft.image;
                    this.maxFrames = this.sprites.takeHitLeft.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'deathLeft':
                if(this.image !== this.sprites.deathLeft.image) {
                    this.image = this.sprites.deathLeft.image;
                    this.maxFrames = this.sprites.deathLeft.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'deathRight':
                if(this.image !== this.sprites.deathRight.image) {
                    this.image = this.sprites.deathRight.image;
                    this.maxFrames = this.sprites.deathRight.maxFrames;
                    this.curFrame = 0;
                }
                break;
        }
    }


    update() {
        // draw and update the position of the sprite every frame
        this.draw();
        // only animate if character is alive/active
        if(!this.isDead) this.animateFrames();

        // need to update the position of the attack box each frame to follow character, not just their spawn location
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // draws the attackBox (dev)
        // c.fillStyle = this.color;
        // c.fillRect(
        //     this.attackBox.position.x,
        //     this.attackBox.position.y,
        //     this.attackBox.width,
        //     this.attackBox.height
        // )

        // draws the sprite xy origin point (dev)
        // c.fillStyle = this.color;
        // c.fillRect(
        //     this.position.x,
        //     this.position.y,
        //     5,
        //     5,
        // )

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // checks for ground collision, sets downward move speed to 0
        // set the spoition so the character is in the place where it no longer needs to move down
        // prevents idle switch spasms
        if((this.position.y + this.height) + this.velocity.y >= GLOBAL.FLOOR_HEIGHT) {
            this.velocity.y = 0;
            this.position.y = 327;
            this.canJump = true;
        } else {
            // gravity only applies when the character is above the ground
            this.velocity.y += GLOBAL.GRAVITY;
        }
    }
}

export default Fighter;
