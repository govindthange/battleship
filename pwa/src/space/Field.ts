import { ParticleMotion } from "./ParticleMotion";
import { Particle } from "./Particle";
import { BattleshipMotion } from "../objects/BattleshipMotion";
import { Battleship } from "../objects/Battleship";
import { EnemyMotion } from "../objects/EnemyMotion";
import { Enemy } from "../objects/Enemy";
import { BattleshipFiring } from "../objects/BattleshipFiring";

class Field {
    width: number;
    height: number;
    totalStars: number;
    totalEnemies: number;
    
    context: any;

    ship: Battleship;

    constructor(container: Element) {
        this.width = window.innerWidth - 20;
        this.height = window.innerHeight;
        this.totalStars = 140;

        let canvas = document.createElement("canvas");
        this.context = canvas.getContext("2d");
        container.appendChild(canvas);
        canvas.width = this.width;
        canvas.height = this.height;

        this.ship = new Battleship(canvas);

        this.totalEnemies = 14;
        let enemySource = new EnemyMotion(this.width, this.height, this.totalEnemies);
        enemySource.stream().subscribe((arr: any) => this.renderEnemies(arr));

        let particleSource = new ParticleMotion(this.width, this.height, this.totalStars);
        particleSource.stream().subscribe((arr: any) => this.renderParticles(arr));

        let shipMotion = new BattleshipMotion(canvas);
        shipMotion.stream().subscribe((coord: any) => this.renderShip(coord));

        let shipFires = new BattleshipFiring(canvas);

    }

    renderSpace() {
        this.context.fillStyle = "#000000";
        this.context.fillRect(0, 0, this.width, this.height);
    }

    renderEnemies(enemies: Array<Enemy>) {
        this.renderSpace();

        enemies.forEach(
            (enemy: Enemy) => enemy.render(this.context)
        );

        this.renderShip(null);
    }

    renderParticles(stars: Array<Particle>) {
        this.renderSpace();

        stars.forEach(
            (star: Particle) => star.render(this.context)
        );

        this.renderShip(null);
    }

    renderShip(point: any) {
        this.ship.render(this.context, point, "up");
    }
}

export { Field };