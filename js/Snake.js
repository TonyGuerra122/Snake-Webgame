class Snake {
  static size = 30;
  static snakeEatAudio = new Audio("/public/assets/audio.mp3");

  constructor(snakePosition, callbackList) {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.snakePosition = snakePosition;
    this.callbackList = callbackList;
    this.direction = null;
  }

  drawGrid() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "#191919";

    for (let i = 30; i < this.canvas.width; i += 30) {
      this.ctx.beginPath();
      this.ctx.lineTo(i, 0);
      this.ctx.lineTo(i, 600);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.lineTo(0, i);
      this.ctx.lineTo(600, i);
      this.ctx.stroke();
    }
  }

  drawFood(food) {
    const { x, y, color } = food;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 50;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, Snake.size, Snake.size);
    this.ctx.shadowBlur = 0;
  }

  drawSnake() {
    this.ctx.fillStyle = "#DDD";

    this.snakePosition.forEach((position, index) => {
      if (index == this.snakePosition.length - 1) {
        this.ctx.fillStyle = "#ADADAD";
      }

      this.ctx.fillRect(position.x, position.y, Snake.size, Snake.size);
    });
  }

  moveSnake() {
    if (!this.direction) return;

    const head = this.snakePosition.at(-1);

    switch (this.direction) {
      case "right":
        this.snakePosition.push({ x: head.x + Snake.size, y: head.y });
        break;
      case "left":
        this.snakePosition.push({ x: head.x - Snake.size, y: head.y });
        break;
      case "down":
        this.snakePosition.push({ x: head.x, y: head.y + Snake.size });
        break;
      case "up":
        this.snakePosition.push({ x: head.x, y: head.y - Snake.size });
        break;
      default:
        break;
    }

    this.snakePosition.shift();
  }

  clearMove() {
    this.ctx.clearRect(0, 0, 600, 600);
  }

  checkEat(food) {
    const head = this.snakePosition.at(-1);
    if (head.x == food.x && head.y == food.y) {
      this.snakePosition.push(head);
      Snake.snakeEatAudio.play();
      this.callbackList.incrementScore();

      let x = this.callbackList.randomPosition();
      let y = this.callbackList.randomPosition();

      while (
        this.snakePosition.find(
          (position) => position.x == x && position.y == y
        )
      ) {
        x = this.callbackList.randomPosition();
        y = this.callbackList.randomPosition();
      }

      food.x = x;
      food.y = y;
      food.color = this.callbackList.randomColor();
    }
    return food;
  }

  checkCollision() {
    const head = this.snakePosition.at(-1);
    const canvasLimit = this.canvas.width - Snake.size;

    const neckIndex = this.snakePosition.length - 2;

    const wallCollision =
      head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = this.snakePosition.find((position, index) => {
      return index < neckIndex && position.x == head.x && position.y == head.y;
    });

    if (wallCollision || selfCollision) {
      this.callbackList.gameOver();
    }
  }
  handleKeyBoard = (event) => {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        if (this.direction != "down") this.direction = "up";
        break;
      case "s":
      case "ArrowDown":
        if (this.direction != "up") this.direction = "down";
        break;
      case "a":
      case "ArrowLeft":
        if (this.direction != "right") this.direction = "left";
        break;
      case "d":
      case "ArrowRight":
        if (this.direction != "left") this.direction = "right";
        break;
      default:
        break;
    }
  };
}
