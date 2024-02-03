import {c, canvas} from '/src/canvas.js';
import Sprite from './sprite.js';
import GLOBAL from './global.js';

class Fighter extends Sprite {
    // passing in an object and destructuring lets us
    // not worry about the parameter positions
    constructor({position, velocity, color, offset}) {
        super({position})
        // this.position = position; // starting position
        this.velocity = velocity; // how fast the sprite moves
        // this.height = 150;
        // this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: { // follows the same xy origin as the character
                x: this.position.x,
                y: this.position.y
            },
            width: 100,
            height: 50,
            offset
        }
        this.color = color;
        this.isAttacking = false;
        this.health = 100;
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }

    draw() {
        // determines what color the fillStytle will use
        // draw the character
        c.fillStyle = this.color;
        c.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        // need to update the position of the attack box each frame to follow character, not just their spawn location
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y

        // draw the attackBox WHEN attack is active
        if(this.isAttacking) {
            c.fillStyle = 'green';
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }
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
            this.velocity.y += GLOBAL.GRAVITY;
        }
    }
}

export default Fighter;
