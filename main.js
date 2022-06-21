//change the canvas height and width
const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;

//get the drawing context
const ctx = canvas.getContext("2d");
const car = new Car(100, 100, 30, 50);
car.draw(ctx);
