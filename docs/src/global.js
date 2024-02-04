// instead of a set downward speed, we are adding this much distance everyt frame
// gives a smoother acceleration downwards
const GRAVITY = 0.7;

// shoots the character upward, and gravity activates slowly catching up
const JUMP_HEIGHT = -20;

// horizontal movement
const WALK_SPEED = 5;

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

const GLOBAL = {
    GRAVITY,
    JUMP_HEIGHT,
    WALK_SPEED,
    KEYS
}

export default GLOBAL;
