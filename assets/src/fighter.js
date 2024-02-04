import {canvas} from './canvas.js';
import Sprite from './sprite.js';
import GLOBAL from './global.js';

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
        }
    }) {
        super({
            position,
            imgSrc,
            scale,
            maxFrames,
            offset
        })
        // this.position = position; // starting position
        this.velocity = velocity; // how fast the sprite moves
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

        for(const s in this.sprites) {
            sprites[s].image = new Image();
            sprites[s].image.src = sprites[s].imgSrc;
        }
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
        // setTimeout(() => {
        //     this.isAttacking = false;
        // }, 100);
    }

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
        if(this.image === this.sprites.death.image) {
            // make sure character finishes death aimation before stopping others
            if(this.curFrame === this.sprites.death.maxFrames - 1) {
                this.isDead = true;
            }
            return;
        }

        // if we're attacking, we don't want to switch to other animations
        // if the animation is not done, return to prevent switching
        if (
            this.image === this.sprites.attack1.image &&
            this.curFrame < this.sprites.attack1.maxFrames - 1
        ) return;

        // same thing for taking a hit, needs to override all other animations
        if (
            this.image === this.sprites.takeHit.image &&
            this.curFrame < this.sprites.takeHit.maxFrames - 1
        ) return;

        // each animation might has a different frame count,
        // need to update that in the player properties
        switch (sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.maxFrames = this.sprites.idle.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'run':
                if(this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.maxFrames = this.sprites.run.maxFrames;
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
            case 'jump':
                if(this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.maxFrames = this.sprites.jump.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.maxFrames = this.sprites.fall.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'attack1':
                if(this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.maxFrames = this.sprites.attack1.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.maxFrames = this.sprites.takeHit.maxFrames;
                    this.curFrame = 0;
                }
                break;
            case 'death':
                if(this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.maxFrames = this.sprites.death.maxFrames;
                    this.curFrame = 0;
                }
        }
    }

    // draw() {
    //     // determines what color the fillStytle will use
    //     // draw the character
    //     c.fillStyle = this.color;
    //     c.fillRect(
    //         this.position.x,
    //         this.position.y,
    //         this.width,
    //         this.height
    //     )

    //     // need to update the position of the attack box each frame to follow character, not just their spawn location
    //     this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    //     this.attackBox.position.y = this.position.y

    //     // draw the attackBox WHEN attack is active
    //     if(this.isAttacking) {
    //         c.fillStyle = 'green';
    //         c.fillRect(
    //             this.attackBox.position.x,
    //             this.attackBox.position.y,
    //             this.attackBox.width,
    //             this.attackBox.height
    //         )
    //     }
    // }

    // draw and update the position of the sprite every frame

    update() {
        this.draw();
        // only animate if character is alive/active
        if(!this.isDead) this.animateFrames();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // // draws the attackBox (dev)
        // c.fillStyle = 'green';
        // c.fillRect(
        //     this.attackBox.position.x,
        //     this.attackBox.position.y,
        //     this.attackBox.width,
        //     this.attackBox.height
        // )

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;


        // checks for ground collision, sets downward move speed to 0
        // set the spoition so the character is in the place where it no longer needs to move down
        // prevents idle switch spasms
        if((this.position.y + this.height) + this.velocity.y >= canvas.height - 99) {
            this.velocity.y = 0;
            this.position.y = 327;
        } else {
            // gravity only applies when the character is above the ground
            this.velocity.y += GLOBAL.GRAVITY;
        }
    }
}

export default Fighter;