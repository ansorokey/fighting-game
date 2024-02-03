import {c, canvas} from '/src/canvas.js';

class Sprite {
    // passing in an object and destructuring lets us
    // not worry about the parameter positions
    constructor({position, imgSrc, scale=1, maxFrames=1}) {
        this.position = position; // starting position
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale;
        // an animated sprite will have different sprites on the same sheet
        // we're just moving where we crop the image based on how many animation frames there are
        this.maxFrames = maxFrames;
        this.curFrame = 0;
        this.elapsedFrames = 0; // how many frames have we elapsed in the animation
        this.heldFrames = 8; // how many frames should we go through before changing, every xth frame, change
    }

    draw() {
        c.drawImage(
            this.image, //src
            this.curFrame * (this.image.width / this.maxFrames), // x crop
            0, // y crop
            (this.image.width / this.maxFrames), // width crop
            this.image.height, // height crop
            this.position.x, // x
            this.position.y, // y
            (this.image.width / this.maxFrames) * this.scale, // width
            this.image.height * this.scale // height
        )
    }

    // draw and update the position of the sprite every frame
    // also move the animation to the next frame
    // if there is no animation frame, it resets back to 0 (1 - 1 = 0)
    update() {
        this.draw();
        this.elapsedFrames += 1;
        // every time we hit the frame changing threshold
        if(this.elapsedFrames % this.heldFrames === 0) {
            // change to the enxt frame
            if(this.curFrame < this.maxFrames - 1) {
                this.curFrame += 1;
            } else {
                this.curFrame = 0;
            }
        }

    }
}

export default Sprite;
