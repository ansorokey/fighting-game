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

// sprite class
class Sprite {
    constructor(position) {
        this.position = position;
    }

    draw() {
        // determines what color the fillStytle will use
        c.fillStyle = 'red';
        c.fillRect(
            this.position.x,
            this.position.y,
            50,
            150
        )
    }
}

const player = new Sprite({
    x: 0,
    y: 0
})

const enemy = new Sprite({
    x: 400,
    y: 100
})

player.draw();
enemy.draw();
console.log(player);
