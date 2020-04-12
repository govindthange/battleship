import { Field } from './space/Field';
import { Battleship } from './objects/Battleship';
import { Fleet, Aircraft } from './objects/Fleet';
import { combineLatest, interval, range, Subject, concat, Observable, of } from 'rxjs';
import { distinctUntilKeyChanged, scan, sample, map, toArray, flatMap, startWith, concatAll } from 'rxjs/operators';
import { Particle } from './space/Particle';
import { Util } from './core/Util';

const THROTTLE_PERIOD: number = 40; // The final data stream used for rendering canvas will not yield values faster than 40ms
const SHIP_PROJECTILE_SPEED = 15;
const FLEET_PROJECTILE_SPEED = 15;

class Game {

    field: Field;
    ship: Battleship;
    enemyFleet: Fleet;
    
    canvas: HTMLCanvasElement;
    explosion: any;

    scoreSubject: Subject<any>;

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this.canvas = canvas;

        this.scoreSubject = new Subject();

        
        this.field = new Field(canvas, width, height);
        this.ship = new Battleship(canvas);
        this.enemyFleet = new Fleet(canvas);        

        this.explosion = new Image();
        this.explosion.src = "/images/explosion.svg";
    }

    public start() {

        let score =this.scoreSubject
                    .pipe(scan((prev: number, curr: number) => {
                        console.log("prev: %d, curr: %d", prev, curr);
                        return prev + curr;
                    }, 0))
                    .pipe(startWith(0));

        let enemyFleet = this.enemyFleet.streamCoordinates();
        let stars = this.field.streamStarCoordinates();
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
                        enemyFleet,
                        score,
                        (stars, shipLocation, projectiles, enemyFleet, score) => {
                            return {stars: stars, shipLocation: shipLocation, projectiles: projectiles, enemyFleet: enemyFleet, score: score};
                        }
                    )
                    // Ensure that combineLatest never yields values faster 
                    // than the configured THROTTLE_PERIOD (40ms default)
                    .pipe(sample(interval(THROTTLE_PERIOD)));

        game.subscribe(
            (scene: any) => {
                this.render(scene.stars, scene.shipLocation, scene.projectiles, scene.enemyFleet, scene.score);
            }
        );
    }

    render(stars: any, shipLocation: any, projectiles: any, enemyFleet: any, score: number) {
        this.field.render();
        this.field.renderScore(score);

        stars.forEach((star: Particle) => star.render());

        this.ship.render(shipLocation);

        projectiles.forEach(
            (missile: any) => {
                missile.y -= SHIP_PROJECTILE_SPEED;
                this.ship.renderProjectile(missile);
            });

        enemyFleet.forEach(
            (aircraft: Aircraft) => {

                aircraft.y += aircraft.speed;

                aircraft.projectiles.forEach(
                    (missile: any) => {
                        missile.y += FLEET_PROJECTILE_SPEED;
                        if (Util.didPointsOverlap(this.ship, missile, 20)) {
                            this.ship.isDestroyed = true;
                            this.destroyShip();
                        }
                    }
                )

                projectiles.forEach(
                    (missile: any) => {
                        if (aircraft.y > 0 && missile.y > 0 && Util.didPointsOverlap(aircraft, missile, 20)) {
                            if (!aircraft.isDestroyed) {
                                this.scoreSubject.next(1);
                            }
                            aircraft.isDestroyed = true;
                            missile.y = -20;
                            this.destroyObject(aircraft, 0, -aircraft.height*1.65);
                        }
                    }
                );

                if (Util.didPointsOverlap(aircraft, this.ship, 50)) {
                    aircraft.isDestroyed = true;
                    this.ship.isDestroyed = true;

                    this.destroyShip();
                }

                aircraft.render();
            });
    }
    
    destroyShip() {
        this.destroyObject(this.ship, 25, -this.ship.height * 1.25);
    }

    destroyObject(object: any, offsetX: number, offsetY: number) {
        let explosionSize = 100;
        let x = object.x  - object.width + offsetX;
        let y = object.y + offsetY;
        //console.log("width: %d, height: %d, x: %d, y: %d, width: %d, height: %d", imageWidth, imageHeight, object.x, object.y, object.width, object.height);
        this.canvas.getContext("2d").drawImage(this.explosion, x, y, explosionSize, explosionSize);
    }
}

export { Game };