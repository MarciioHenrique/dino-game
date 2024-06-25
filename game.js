import { parallax } from "./parallax.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth / 2;
const context = canvas.getContext("2d");
const ambientSound = document.getElementById("ambientSound");
ambientSound.loop = true;
ambientSound.volume = 1;
const failSound = document.getElementById("failSound");
ambientSound.volume = 1;

const jumpSound = document.getElementById("jumpSound");
ambientSound.volume = 1;

const dinoImage = new Image();
dinoImage.src = "./assets/dino.png";

const obstacleImage1 = new Image();
obstacleImage1.src = "./assets/obstacle1.png";

const obstacleImage2 = new Image();
obstacleImage2.src = "./assets/obstacle2.png";

const obstacleImage3 = new Image();
obstacleImage3.src = "./assets/obstacle3.png";

const obstacleImages = [obstacleImage1, obstacleImage2, obstacleImage3];

let isJumping = false;
let gameSpeed = 5;
let isGameRunning = true;
let imageSelector = 0;
let nextDistance = 300;

// Variáveis do jogo
let dino = {
  x: 50,
  y: 100,
  width: 40,
  height: 40,
  dy: 0,
  jumpStrength: 10,
  gravity: 0.5,
  grounded: false,
  countFrames: 0,
  draw: function (context) {
    context.drawImage(
      dinoImage,
      this.x,
      this.y - 40,
      this.width,
      this.height + 10
    );
  },
  update: function () {
    if (this.grounded && this.dy === 0 && isJumping) {
      this.dy = -this.jumpStrength;
      this.grounded = false;
    }

    this.dy += this.gravity;
    this.y += this.dy;

    if (this.y + this.height > canvas.height - 10) {
      this.y = canvas.height - 10 - this.height;
      console.log(this.y);
      this.dy = 0;
      this.grounded = true;
    }

    this.countFrames++;
    if (this.countFrames >= 10) {
      if (!this.grounded) {
        dinoImage.src = "./assets/dino.png";
      } else if (dinoImage.src.includes("dino-run1")) {
        dinoImage.src = "./assets/dino-run2.png";
      } else {
        dinoImage.src = "./assets/dino-run1.png";
      }
      this.countFrames = 0;
    }
  },
  deadDino: function (context) {
    dinoImage.src = "./assets/dino-dead.png";
    context.drawImage(
      dinoImage,
      this.x,
      this.y - 40,
      this.width,
      this.height + 10
    );
  },
};

let obstacles = {
  list: [],
  draw: function (context) {
    this.list.forEach((obstacle) => {
      context.drawImage(
        obstacle.image,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height + 5
      );
    });
  },
  update: function () {
    this.list.forEach((obstacle) => {
      obstacle.x -= gameSpeed;
    });

    if (
      this.list.length === 0 ||
      this.list[this.list.length - 1].x < canvas.width - nextDistance
    ) {
      let obstacle = {
        image: obstacleImages[imageSelector],
        x: canvas.width,
        y: 120,
        width: obstacleImages[imageSelector].width,
        height: 40,
      };
      this.list.push(obstacle);
      imageSelector = randomIntFromRange(0, 2);
      nextDistance = randomIntFromRange(300, 650);
    }

    if (this.list[0].x + this.list[0].width < 0) {
      this.list.shift();
    }
  },
};

let score = {
  points: 0,
  highestPoints: 0,
  draw: function (context) {
    context.font = "32px tiny5";
    context.fillStyle = "black";

    context.fillText(this.points.toFixed(0), canvas.width / 2 - 10, 35);

    context.font = "20px tiny5";
    context.fillText("Best", canvas.width - 50, 20);
    if (this.highestPoints < 10) {
      context.fillText(
        "00" + this.highestPoints.toFixed(0),
        canvas.width - 45,
        40
      );
    } else if (this.highestPoints < 100) {
      context.fillText(
        "0" + this.highestPoints.toFixed(0),
        canvas.width - 45,
        40
      );
    } else {
      context.fillText(this.highestPoints.toFixed(0), canvas.width - 45, 40);
    }
  },
  updateHighestScore: function () {
    if (this.points > this.highestPoints) {
      this.highestPoints = this.points;
    }
  },
};

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Função para detectar colisão
function detectCollision() {
  obstacles.list.forEach((obstacle) => {
    if (
      dino.x - 20 < obstacle.x + obstacle.width &&
      dino.x + dino.width > obstacle.x &&
      dino.y - 50 < obstacle.y + obstacle.height &&
      dino.y + dino.height - 20 > obstacle.y
    ) {
      // Colisão detectada
      dino.deadDino(context);
      score.updateHighestScore();
      isGameRunning = false;
      ambientSound.pause();
      failSound.play();
    }
  });
}

// Função para desenhar o jogo
function drawGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  parallax();
  dino.draw(context);
  obstacles.draw(context);
  score.draw(context);
}

// Função para atualizar o jogo
function updateGame() {
  dino.update();
  obstacles.update();
  detectCollision();
}

// Função para reiniciar o jogo
function reloadGame() {
  //reset the obstacles
  obstacles.list = [];

  //reset the score
  score.points = 0;

  //reset the game state
  isGameRunning = true;

  //play the ambient sound
  ambientSound.play();

  //start the game loop
  gameLoop();
}

// Função principal do jogo
function gameLoop() {
  if (isGameRunning) {
    drawGame();
    updateGame();
    score.points += 0.1;
    requestAnimationFrame(gameLoop);
  } else {
    alert("Game Over!");
    reloadGame();
  }
}

// Iniciar o loop do jogo
gameLoop();

// Variável para detectar se o jogador está tentando pular

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    isJumping = true;
    jumpSound.play();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    isJumping = false;
  }
});
