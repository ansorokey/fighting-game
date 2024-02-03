export function determineWinner({player, enemy, timerId}) {
    // stops the timer when a victor is determined
    clearTimeout(timerId);

    document.querySelector('#results').style.display = 'flex';

    let winText;
    if(player.health === enemy.health) {
        winText = 'DRAW';
    } else if(player.health > enemy.health) {
        winText = 'Player 1 wins';
    } else {
        winText = 'Player 2 wins';
    }
    document.querySelector('#results').innerHTML = winText;
}

let time = 60;
export let timerId;
export function decreaseTimer() {
    timerId = setTimeout(decreaseTimer, 1000);
    if(time > 0) {
        time -= 1;
        document.querySelector('#timer').innerHTML = time;
    } else if(time === 0) {
        determineWinner({player, enemy});
    }
}

export function rectangularCollision({
    rec1,
    rec2
}) {
    return (
        // x axis coliision
        rec1.attackBox.position.x + rec1.attackBox.width >= rec2.position.x &&
        rec1.attackBox.position.x <= rec2.position.x + rec2.width &&
        // y axis collision
        rec1.attackBox.position.y + rec1.attackBox.height >= rec2.position.y &&
        rec1.attackBox.position.y <= rec2.position.y + rec2.height
    )
}
