import { ParticleMotion } from "./ParticleMotion";
import { Particle } from "./Particle";
import { BattleshipMotion } from "../objects/BattleshipMotion";
import { Battleship } from "../objects/Battleship";
import { EnemyMotion } from "../objects/EnemyMotion";
import { Enemy } from "../objects/Enemy";
import { BattleshipFiring } from "../objects/BattleshipFiring";
import { combineLatest, interval } from "rxjs";
import { sample } from "rxjs/operators";

const TOTAL_STARS: number = 140;
const MAX_ENEMIES: number = 14;
const REFRESH_RATE: number = 40;

class Field {
    width: number;
    height: number;
    totalStars: number;
    totalEnemies: number;
    
    context: any;

    ship: Battleship;

    constructor(container: Element) {
        this.width = window.innerWidth - 20;
        this.height = window.innerHeight - 20;
        this.totalStars = TOTAL_STARS;

        let canvas = document.createElement("canvas");
        this.context = canvas.getContext("2d");
        container.appendChild(canvas);
        canvas.width = this.width;
        canvas.height = this.height;

        this.ship = new Battleship(canvas);

        this.totalEnemies = MAX_ENEMIES;
        let enemySource = new EnemyMotion(this.width, this.height, this.totalEnemies);

        let particleSource = new ParticleMotion(this.width, this.height, this.totalStars);

        let shipMotion = new BattleshipMotion(canvas);

        let shipFires = new BattleshipFiring(canvas);

        let game = combineLatest(
                        enemySource.stream(),
                        particleSource.stream(),
                        this.ship.streamCoordinates(),
                        (enemies: any, stars: any, shipCoordinates) => {
                            return {enemies: enemies, stars: stars, shipCoordinates: shipCoordinates};
                        }
                    )
                    // Ensure that combineLatest never yields values faster 
                    // than the configured REFRESH_RATE (40ms default)
                    .pipe(sample(interval(REFRESH_RATE)));

        game.subscribe(
            (scene: any) => {
                this.renderScene(scene.enemies, scene.stars, scene.shipCoordinates);
            }
        )
    }

    renderScene(enemies: any, stars: any, shipCoordinates: any) {
        this.context.fillStyle = "#000000";
        this.context.fillRect(0, 0, this.width, this.height);

        enemies.forEach(
            (enemy: Enemy) => enemy.render(this.context)
        );

        stars.forEach(
            (star: Particle) => star.render(this.context)
        );

        this.ship.render(this.context, shipCoordinates, "up");
    }
}

export { Field };