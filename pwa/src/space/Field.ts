import { Particle } from "./Particle";
import { Util } from "../core/Util";
import { Battleship } from "../objects/Battleship";
import { Fleet, Aircraft } from "../objects/Fleet";
import { combineLatest, interval, range } from "rxjs";
import { map, toArray, flatMap, sample, scan, distinctUntilKeyChanged } from "rxjs/operators";

const STAR_COUNT = 140
const THROTTLE_PERIOD: number = 40; // The final data stream used for rendering canvas will not yield values faster than 40ms
const SHIP_PROJECTILE_SPEED = 15;

class Field {
    width: number;
    height: number;
    totalStars: number;
    totalEnemies: number;
    
    canvas: HTMLCanvasElement;
    context: any;

    ship: Battleship;
    enemyFleet: Fleet;

    constructor(container: Element) {
        this.width = window.innerWidth - 20;
        this.height = window.innerHeight - 20;

        let canvas = document.createElement("canvas");
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        container.appendChild(canvas);
        canvas.width = this.width;
        canvas.height = this.height;

        this.ship = new Battleship(canvas);
        this.enemyFleet = new Fleet(canvas);

        let fleet = this.enemyFleet.streamCoordinates();
        let stars = this.streamStarCoordinates();
        let shipLocations = this.ship.streamCoordinates();

        const SHIP_Y = this.ship.y;

        let projectiles = combineLatest(
                                this.ship.streamProjectiles(),
                                shipLocations,
                                (shotEvents: any, spaceShip: any) => {
                                    return {
                                        timestamp: shotEvents.timestamp,
                                        x: spaceShip.x
                                    };
                                }
                            )
                            .pipe(distinctUntilKeyChanged("timestamp"))
                            .pipe(
                                scan((projectiles: any, shot: any) => {
                                    let temp = projectiles;
                                    projectiles = projectiles.filter((s: any) => s.y > 0);
                                    //console.log("before: %s, after: %s", temp.length, projectiles.length);
                                    projectiles.push({x: shot.x, y: SHIP_Y, width: 3, height: 10});
                                    //console.log(shots.length);
                                    return projectiles;
                                }, [])
                            );

        let game = combineLatest(
                        stars,
                        shipLocations,
                        projectiles,
                        fleet,
                        (stars, shipLocation, projectiles, fleet) => {
                            return {stars: stars, shipLocation: shipLocation, projectiles: projectiles, fleet: fleet};
                        }
                    )
                    // Ensure that combineLatest never yields values faster 
                    // than the configured THROTTLE_PERIOD (40ms default)
                    .pipe(sample(interval(THROTTLE_PERIOD)));

        game.subscribe(
            (scene: any) => {
                this.renderScene(scene.stars, scene.shipLocation, scene.projectiles, scene.fleet);
            }
        );
    }

    renderScene(stars: any, shipLocation: any, projectiles: any, fleet: any) {
        this.context.fillStyle = "#000000";
        this.context.fillRect(0, 0, this.width, this.height);

        stars.forEach((star: Particle) => star.render());

        this.ship.render(shipLocation);
        projectiles.forEach(
            (missile: any) => {
                missile.y -= SHIP_PROJECTILE_SPEED;
                this.ship.renderProjectile(missile);
            });

        fleet.forEach(
            (aircraft: Aircraft) => {

                aircraft.y += aircraft.speed;

                projectiles.forEach(
                    (missile: any) => {
                        if (aircraft.y > 0 && missile.y > 0 && Util.didObjectOverlap(aircraft, missile)) {
                            aircraft.isDestroyed = true;
                            missile.y = -20;
                        }
                    }
                );

                aircraft.render()
            });
    }

    public streamStarCoordinates() {
        return range(1, STAR_COUNT) // creates a stream of sequential values emitted 
                                    // as per the provided range.
                // 1st transform the sequential-value-stream to a new stream 
                //    where each sequential-value is changed to a particle-object and then projected.
                // 2nd take this new stream of partical-object-values,
                //    accumulate all values in a single array object (toArray() operator) and then 
                //    create another stream that just emits 'the whole array' as a single value in the stream.
                .pipe(map(() => Particle.CreateParticleWithinFrame(this.canvas, this.width, this.height)), toArray())
                .pipe(flatMap((arr: any) => { // flatMap will apply the projection function on each value of
                                              // its source stream (the o/p of toArray() => 'arr' argument) 
                                              // and then merge it back to the source stream 
                                              // i.e. the stream/observable created by the toArray() fn.
                    return interval(90)
                        .pipe(map(() => { // transform/project each value 
                                          // (which is the whole array, not separate items in it) 
                                          // in the source stream by updating its y coordinate.
                            arr.forEach((p: any) => {
                                if (p.y >= this.height) {
                                    p.y = 0;
                                }
                                p.y += 3;
                            });
                            return arr;
                        }));
                }));
    }
}

export { Field };