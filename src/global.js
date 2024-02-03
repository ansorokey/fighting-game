// instead of a set downward speed, we are adding this much distance everyt frame
// gives a smoother acceleration downwards
const GRAVITY = 0.7;

// shoots the character upward, and gravity activates slowly catching up
const JUMP_HEIGHT = -20;

// horizontal movement
const WALK_SPEED = 5;

const GLOBAL = {
    GRAVITY,
    JUMP_HEIGHT,
    WALK_SPEED
}

export default GLOBAL;
