import { Game } from './Game';

let container = document.getElementById("container");
let width = window.innerWidth - 20;
let height = window.innerHeight - 20;

let canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
container.appendChild(canvas);

let game = new Game(canvas, width, height);
game.start();
