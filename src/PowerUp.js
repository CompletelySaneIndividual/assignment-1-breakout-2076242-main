import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	sounds,
	TILE_SIZE
} from "./globals.js";
import { getRandomNumber, getRandomNegativeNumber } from "./utils.js";
import Vector from "./Vector.js";
import SpriteManager from "./SpriteManager.js";

export default class PowerUp{
    constructor(tier, x, y){
        this.tier = tier;
        this.position = new Vector(x, y);
		this.velocity = new Vector(getRandomNumber(-20, 20), getRandomNegativeNumber(10, 20));
		this.acceleration = new Vector(0, 0);
		this.gravity = new Vector(0, 100); // we want a similar randomness to the power-up as we have
        //with the particle system, just have it fall down randomly.

        this.width = TILE_SIZE;
		this.height = TILE_SIZE;

        this.sprites = SpriteManager.generatePowerUpSprites();

        this.applyForce(this.gravity);
    }

    applyForce(force) {
		this.acceleration.add(force);
	}

    didCollide(target){
        /**
		 * First, check to see if the left edge of either is
		 * farther to the right than the right edge of the other.
		 * Then check to see if the bottom edge of either is
		 * higher than the top edge of the other.
		 */
		if (this.position.x + this.width >= target.x
			&& this.position.x <= target.x + target.width
			&& this.position.y + this.height >= target.y
			&& this.position.y <= target.y + target.height) {
			return true;
		}

		// If the above isn't true, they're overlapping.
		return false;
    }

    didFall() {
		return this.position.y > CANVAS_HEIGHT;
	}

    update(dt){
        this.velocity.add(this.acceleration, dt);
		this.position.add(this.velocity, dt);
    }

    render(){
        this.sprites[8].render(this.position.x, this.position.y);
        //console.log(this.sprites)
    }
}