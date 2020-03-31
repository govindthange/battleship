import { Field } from './space/Field';
import { Battleship } from './objects/Battleship';
import { Fleet, Aircraft } from './objects/Fleet';
import { combineLatest, interval, range } from 'rxjs';
import { distinctUntilKeyChanged, scan, sample, map, toArray, flatMap } from 'rxjs/operators';
import { Particle } from './space/Particle';
import { Util } from './core/Util';

const THROTTLE_PERIOD: number = 40; // The final data stream used for rendering canvas will not yield values faster than 40ms
const SHIP_PROJECTILE_SPEED = 15;

class Game {

    field: Field;
    ship: Battleship;
    enemyFleet: Fleet;
    
    canvas: HTMLCanvasElement;
    explosion: any;

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this.canvas = canvas;
        
        this.field = new Field(canvas, width, height);
        this.ship = new Battleship(canvas);
        this.enemyFleet = new Fleet(canvas);        

        this.explosion = new Image();
        this.explosion.src = "/images/explosion.svg";
    }

    public start() {
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
                        (stars, shipLocation, projectiles, enemyFleet) => {
                            return {stars: stars, shipLocation: shipLocation, projectiles: projectiles, enemyFleet: enemyFleet};
                        }
                    )
                    // Ensure that combineLatest never yields values faster 
                    // than the configured THROTTLE_PERIOD (40ms default)
                    .pipe(sample(interval(THROTTLE_PERIOD)));

        game.subscribe(
            (scene: any) => {
                this.render(scene.stars, scene.shipLocation, scene.projectiles, scene.enemyFleet);
            }
        );
    }

    render(stars: any, shipLocation: any, projectiles: any, enemyFleet: any) {
        this.field.render();

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

                projectiles.forEach(
                    (missile: any) => {
                        if (aircraft.y > 0 && missile.y > 0 && Util.didObjectOverlap(aircraft, missile)) {
                            aircraft.isDestroyed = true;
                            missile.y = -20;
                            this.destroyObject(aircraft, aircraft.width*2, aircraft.height * 2);
                        }
                    }
                );

                if (Util.didObjectOverlap(aircraft, this.ship)) {
                    aircraft.isDestroyed = true;
                    this.ship.isDestroyed = true;

                    this.destroyObject(this.ship, 0, 0);
                }

                aircraft.render()
            });
    }

    destroyObject(object: any, offsetX: number, offsetY: number) {

        let imageWidth = this.explosion.naturalWidth;
        let imageHeight = this.explosion.naturalHeight;
        let explosionSize = 100;
        let x = object.x - imageWidth / 2 + object.width + offsetX;
        let y = object.y - imageHeight / 2 + offsetY;
        //console.log("width: %d, height: %d, x: %d, y: %d, width: %d, height: %d", imageWidth, imageHeight, object.x, object.y, object.width, object.height);
        this.canvas.getContext("2d").drawImage(this.explosion, x, y, 100, 100);
    }
}

export { Game };