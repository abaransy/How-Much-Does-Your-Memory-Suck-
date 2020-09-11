import { createLevels } from './levels'; 
import { swapBalls } from './swap_balls';  
import { loadBalls } from './drag_and_drop'; 
import { setCountDown } from './start_game_modal'; 

let levels = createLevels(20); 
let currLevelIdx = 0
let currLevel = levels[currLevelIdx]; 
let instructionsBox;
let gameState;
let score; 
let balls; 
let modal; 
let levelBox; 
let seconds; 

const resetBallsPositionAndColor = (balls) => {
    balls.forEach(ball => {
        ball.style.top = "0px";
        ball.style.right = "0px";
        ball.style.left = "0px";
        ball.style.bottom = "0px";
        ball.style.transform = "none";
        ball.style.backgroundColor = "rgb(223, 22, 22)";
        ball.style.borderColor = "rgb(131, 50, 50)";
    });
}

export const play = () => {
    instructionsBox = document.getElementsByClassName('instructions')[0]; 
    gameState = document.getElementsByClassName("game_state")[0]; 
    score = document.getElementById("score"); 
    balls = loadBalls();
    balls.forEach(ball => ball.style.transition = "none"); 
    modal = document.getElementById("start_game_modal"); 
    levelBox = document.getElementById("level"); 
    seconds = document.getElementById('seconds'); 

    instructionsBox.style.visibility ="hidden"; 
    gameState.style.visibility = "visible"; 
    levelBox.innerHTML = `Level ${currLevelIdx + 1}`; 
    modal.style.opacity = "0"; 
    modal.style.visibility = "visible"; 
    seconds.style.visibility = "hidden"; 

    let instructions = currLevel.instructions; 
    let pairIdx = 0; 
    
    const shuffleBalls = () => {
        if (pairIdx === instructions.length) {
            clearInterval(interval); 
            resetBallsPositionAndColor(balls); 
            modal.style.visibility = "hidden";
        } else {
            let pair = instructions[pairIdx]; 
            swapBalls(pair[0], pair[1]); 
            resetBallsPositionAndColor(balls); 
        }
    }

    let interval = setInterval(() => {
        shuffleBalls();
        pairIdx += 1; 
    }, 1500);
}

const handleLoss = () => {
    console.log('lost')
}

const handleWinColors = () => {
    balls.forEach(ball => {
        ball.style.transition = "0.3s all";
        ball.style.backgroundColor = "rgb(4,128,1)"; 
        ball.style.borderColor = "darkgreen"; 
    }); 
}

const handleWin = () => {
    score.innerHTML = `Your Score: ${1000 * (currLevelIdx + 1)}`
    currLevelIdx++;
    currLevel = levels[currLevelIdx];
    handleWinColors(); 
    setTimeout( () => {
        resetBallsPositionAndColor(balls);
        setCountDown(seconds, false, modal, document.getElementById("start_button")); 
    }, 500)
}

export const evaluatePlacings = (placings) => {
    let lost = false; 

    for (let ball in currLevel.finalPlacings) {
        if (currLevel.finalPlacings[ball] !== placings[ball]) {
            lost = true;
            break; 
        } 
    }
    console.log(currLevel.finalPlacings); 
    console.log(placings); 
    if (lost) {
        handleLoss(); 
    } else {
        handleWin(); 
    }
}