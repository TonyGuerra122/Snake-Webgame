document.addEventListener("DOMContentLoaded", function () {
  const initialPosition = { x: 270, y: 240 };
  let loopId;

  const score = document.querySelector(".score-value");
  const finalScore = document.querySelector(".final-score > span");
  const menu = document.querySelector(".menu-screen");
  const btnPlay = document.querySelector(".btn-play");

  const incrementScore = () => {
    score.innerText = +score.innerText + 10;
  };

  const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`;
  };

  const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + 5);
  };

  const randomPosition = () => {
    const number = randomNumber(0, 570 - 30);
    return Math.round(number / 30) * 30;
  };
  let food = { x: randomPosition(), y: randomPosition(), color: randomColor() };

  const gameOver = () => {
    snake.direction = null;
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    snake.canvas.style.filter = "blur(4px)";
  };

  snake = new Snake([initialPosition], {
    randomColor: randomColor,
    randomPosition: randomPosition,
    incrementScore: incrementScore,
    gameOver: gameOver,
  });

  const gameLoop = () => {
    clearInterval(loopId);

    snake.clearMove();
    snake.moveSnake();
    snake.drawGrid();
    snake.drawFood(food);
    snake.drawSnake();
    food = snake.checkEat(food);
    snake.checkCollision();

    loopId = setTimeout(() => {
      gameLoop();
    }, 300);
  };

  gameLoop();
  document.addEventListener("keydown", snake.handleKeyBoard);
  btnPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    snake.canvas.style.filter = "none";
    snake.snakePosition = [initialPosition];
  });
});
