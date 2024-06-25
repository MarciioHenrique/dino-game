const canvas = document.getElementById("gameCanvas"); // Assuming you have a canvas with id "myCanvas"
const context = canvas.getContext("2d");

const city1 = document.getElementById("city1");
const city2 = document.getElementById("city2");
const city3 = document.getElementById("city3");
const city4 = document.getElementById("city4");
const clouds = document.getElementById("clouds");
const trees = document.getElementById("trees");
const ground = document.getElementById("ground");

class Layer {
  constructor(image, speed, yPosition = 0) {
    this.image = image;
    this.speed = speed;
    this.y = yPosition;
    this.firstImgX = 0;
    this.secondImgX = canvas.width;
  }

  draw() {
    context.drawImage(
      this.image,
      this.firstImgX,
      this.y,
      canvas.width,
      canvas.height
    );
    context.drawImage(
      this.image,
      this.secondImgX,
      this.y,
      canvas.width,
      canvas.height
    );
  }

  update() {
    if (this.firstImgX < -canvas.width) {
      this.firstImgX = canvas.width - this.speed + this.secondImgX;
    } else {
      this.firstImgX -= this.speed;
    }

    if (this.secondImgX < -canvas.width) {
      this.secondImgX = canvas.width - this.speed + this.firstImgX;
    } else {
      this.secondImgX -= this.speed;
    }
  }
}

const cloudsLayer = new Layer(clouds, 2);
const city1Layer = new Layer(city1, 1);
const city2Layer = new Layer(city2, 1.5);
const city3Layer = new Layer(city3, 2.5);
const city4Layer = new Layer(city4, 3);
const treesLayer = new Layer(trees, 3.5);
const groundLayer = new Layer(ground, 4);

const layers = [
  cloudsLayer,
  city1Layer,
  city2Layer,
  city3Layer,
  city4Layer,
  treesLayer,
  groundLayer,
];

export function parallax() {
  layers.forEach((layer) => {
    layer.update();
    layer.draw();
  });
}
