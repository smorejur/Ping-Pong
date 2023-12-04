var bar1 = document.getElementById("bar-1");
var bar2 = document.getElementById("bar-2");
var ball = document.getElementById("ball");
var movement = 20;
const thisBar1 = "Bar-1";
const thisBar2 = "Bar-2";
const storeScore = "highScore";
const storeDifficulty = "difficulty";
let moveX = 2;
let moveY = 2;
let ballMoving;
let border = 12;
let score;
let difficulty = 0;

let gameStart = false;
localStorage.setItem(storeScore, "null");

(function () {
    highScore = localStorage.getItem(storeScore);
    if (highScore === "null") {
        alert("Mueve tu pala con las flechas de tu teclado, pulsa enter para comenzar, ¡y no dejes que se te escape!");
        
        let difficultyInput = prompt("Elige la dificultad (0-6):");
        // Para el nivel
        difficulty = parseInt(difficultyInput);
        if (isNaN(difficulty) || difficulty < 0 || difficulty > 6) {
            alert("Dificultad no válida. Se establecerá en 0 (sin aceleración).");
            difficulty = 0;
        }
        
        localStorage.setItem(storeDifficulty, difficulty);
        
        highScore = 0;
    }
    gameReset();
})();

function gameReset() {
    bar1.style.left = ((window.innerWidth - bar1.offsetWidth) / 2) + "px";
    bar2.style.left = ((window.innerWidth - bar2.offsetWidth) / 2) + "px";

    resetBall(thisBar2);
    score = 0;
    gameStart = false;

    //Volver a la velocidad inicial
    moveX = 2; 
    moveY = 2;
}

function resetBall(barName) {
    let initialBallTop;
    if (barName === thisBar1) {
        initialBallTop = bar2.getBoundingClientRect().bottom + "px";
    } else {
        initialBallTop = bar1.getBoundingClientRect().top + "px";
    }

    ball.style.left = ((window.innerWidth - ball.offsetWidth) / 2) + "px";
    ball.style.top = initialBallTop;
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 68 || event.keyCode == 39) {
        //Para mover la barra (izq.)
        if (parseInt(bar2.style.left) < (window.innerWidth - bar2.offsetWidth - border)) {
            bar2.style.left = parseInt(bar2.style.left) + movement + 'px';
        }
    }
    if (event.keyCode == 65 || event.keyCode == 37) {
        //derecha
        if (parseInt(bar2.style.left) > border) {
            bar2.style.left = parseInt(bar2.style.left) - movement + 'px';
        }
    }
    if (event.keyCode == 13) {
        if (!gameStart) {
            gameStart = true;          
            gameReset();
            
            score = 0;

            ballMoving = setInterval(function () {
                let ballRect = ball.getBoundingClientRect();
                let ballX = ballRect.x;
                let ballY = ballRect.y;
                let ballDia = ballRect.width;
                let bar2Height = bar2.offsetHeight;
                let bar2Width = bar2.offsetWidth;

                let bar1X = bar1.getBoundingClientRect().x;
                let bar2X = bar2.getBoundingClientRect().x;
                let ballCentre = ballX + ballDia / 2;

                ballX += moveX;
                ballY += moveY;

                ball.style.left = ballX + "px";
                ball.style.top = ballY + "px";

                if (((ballX + ballDia) > window.innerWidth) || (ballX < 0)) {
                    moveX = -moveX;
                }

                if (ballY <= 0) {
                    moveY = -moveY;
                    score++;
                    //para la aceleracion al dar con bar1
                    moveX = moveX < 0 ? moveX - (0.2 * difficulty) : moveX + (0.2 * difficulty);
                    moveY = moveY < 0 ? moveY - (0.2 * difficulty) : moveY + (0.2 * difficulty);
                }

                if ((ballY + ballDia) >= (window.innerHeight - bar2Height)) {
                    moveY = -moveY;
                    score++;
                    if ((ballCentre < bar2X) || (ballCentre > (bar2X + bar2Width))) {
                        dataStoring(score);
                    }
                }
            }, 10);
        }
    }
});

function dataStoring(scoreObtained) {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(storeScore, highScore);
    }
    clearInterval(ballMoving);
    alert("¡Has perdido! Conseguiste " + (scoreObtained) + " puntos, con una puntuación máxima de " + (highScore) +"\nVuelve a pulsar Enter.");
}