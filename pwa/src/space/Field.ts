import { Particle } from "./Particle";
import { Battleship } from "../objects/Battleship";
import { Enemy } from "../objects/Enemy";
import { combineLatest, interval } from "rxjs";
import { sample, scan, distinctUntilChanged, distinctUntilKeyChanged } from "rxjs/operators";
import { range } from "rxjs";
import { map, mapTo, toArray, flatMap, mergeMap } from "rxjs/operators";

const FIELD_PARTICLE_DENSITY = 140
const MAX_ENEMIES: number = 14;
const REFRESH_RATE: number = 40;
const SHOOTING_SPEED = 15;

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

        let canvas = document.createElement("canvas");
        this.context = canvas.getContext("2d");
        container.appendChild(canvas);
        canvas.width = this.width;
        canvas.height = this.height;

        this.ship = new Battleship(canvas);

        let enemyStream = this.streamEnemyCoordinates(canvas);
        let starStream = this.streamParticleCoordinates();
        let shipLocationStream = this.ship.streamCoordinates();

        const SHIP_Y = this.ship.y;

        let shipShotStream = combineLatest(
                                this.ship.streamHits(),
                                shipLocationStream,
                                (shotEvents: any, spaceShip: any) => {
                                    return {
                                        timestamp: shotEvents.timestamp,
                                        x: spaceShip.x
                                    };
                                }
                            )
                            .pipe(distinctUntilKeyChanged("timestamp"))
                            .pipe(
                                scan((shots: any, shot: any) => {
                                    let temp = shots;
                                    shots = shots.filter((s: any) => s.y > 0);
                                    //console.log("before: %s, after: %s", temp.length, shots.length);
                                    shots.push({x: shot.x, y: SHIP_Y});
                                    console.log(shots.length);
                                    return shots;
                                }, [])
                            );

        let game = combineLatest(
                        enemyStream,
                        starStream,
                        shipLocationStream,
                        shipShotStream,
                        (enemies: any, stars: any, shipLocation, shipShots) => {
                            return {enemies: enemies, stars: stars, shipLocation: shipLocation, shipShots: shipShots};
                        }
                    )
                    // Ensure that combineLatest never yields values faster 
                    // than the configured REFRESH_RATE (40ms default)
                    .pipe(sample(interval(REFRESH_RATE)));

        game.subscribe(
            (scene: any) => {
                this.renderScene(scene.enemies, scene.stars, scene.shipLocation, scene.shipShots);
            }
        );
    }

    renderScene(enemies: any, stars: any, shipLocation: any, shipShots: any) {
        this.context.fillStyle = "#000000";
        this.context.fillRect(0, 0, this.width, this.height);

        enemies.forEach((enemy: Enemy) => enemy.render(this.context, "down"));
        stars.forEach((star: Particle) => star.render(this.context));

        this.ship.render(this.context, shipLocation, "up");
        shipShots.forEach(
            (shot: any) => {
                shot.y -= SHOOTING_SPEED;
                this.ship.renderHits(this.context, shot, "up");
            });
    }

    createParticle() {

        let point = {
            x: (Math.random() * this.width),
            y: (Math.random() * this.height)
        };

        let temp = (Math.random() * 3 + 1);
        let size =  {width: temp, height: temp};
        
        return new Particle(point, size);
    }

    public streamParticleCoordinates() {
        return range(1, FIELD_PARTICLE_DENSITY) // creates a stream of sequential values emitted 
                                                // as per the provided range.
                // 1st transform the sequential-value-stream to a new stream 
                //    where each sequential-value is changed to a particle-object and then projected.
                // 2nd take this new stream of partical-object-values,
                //    accumulate all values in a single array object (toArray() operator) and then 
                //    create another stream that just emits 'the whole array' as a single value in the stream.
                .pipe(map(() => this.createParticle()), toArray())
                .pipe(flatMap((arr: any) => { // flatMap will apply the projection function on each value of
                                              // its source stream (the o/p of toArray() => 'arr' argument) 
                                              // and then merge it back to the source stream 
                                              // i.e. the stream/observable created by the toArray() fn.
                    return interval(90)
                        .pipe(map(() => { // transform/project each value 
                                          // (which is the whole array, not separate items in it) 
                                          // in the source stream by updating its y coordinate.
                            arr.forEach((p: any) => {
                                if (p.point.y >= this.height) {
                                    p.point.y = 0;
                                }
                                p.point.y += 3;
                            });
                            return arr;
                        }));
                }));
    }

    createEnemy(canvas: HTMLCanvasElement) {

        let x = Math.random() * this.width,
            y = Math.random() * this.height,
            width = Math.random() * 10 + 1,
            height = Math.random() * 10 + 1; 

        let speed = (Math.random() * 3) + 1;
        
        return new Enemy(canvas, x, y, width, height, speed);
    }

    public streamEnemyCoordinates(canvas: HTMLCanvasElement) {
        return range(1, MAX_ENEMIES) // creates a stream of sequential values emitted 
                                     // as per the provided range.
                // 1st transform the sequential-value-stream to a new stream 
                //    where each sequential-value is changed to a particle-object and then projected.
                // 2nd take this new stream of partical-object-values,
                //    accumulate all values in a single array object (toArray() operator) and then 
                //    create another stream that just emits 'the whole array' as a single value in the stream.
                .pipe(map(() => this.createEnemy(canvas)), toArray())
                .pipe(flatMap((arr: any) => { // flatMap will apply the projection function on each value of
                                              // its source stream (the o/p of toArray() => 'arr' argument) 
                                              // and then merge it back to the source stream 
                                              // i.e. the stream/observable created by the toArray() fn.
                    return interval(70) // projection fn, the 1st parameter to flatMap fn, 
                                        // will update array values every 70ms and merge back 
                                        // the updated array to the main arr object, which is 
                                        // a value of the source stream.
                        .pipe(map(()=> { // transform/project each value 
                                         // (which is the whole array, not separate items in it) 
                                         // in the source stream by updating its y coordinate.
                            arr.forEach((e: any) => {
                                if (e.y >= this.height) {
                                    e.y = 0;
                                }
                                e.y += (3 * e.speed);
                            });
                            return arr;
                        }));
                }));
    }
}

export { Field };