import {c, canvas} from '/src/canvas.js';

class Sprite {
    // passing in an object and destructuring lets us
    // not worry about the parameter positions
    constructor({position}) {
        this.position = position; // starting position
        this.height = 150;
        this.width = 50;
    }

    draw() {

    }

    // draw and update the position of the sprite every frame
    update() {
        this.draw();
    }
}

export default Sprite;
