import { context } from "./globals.js";
import { getRandomNumber, getRandomNegativeNumber } from "./utils.js";
import Vector from "./Vector.js";

export default class Particle {
	/**
	 * A simple particle that can be affected by physics.
	 * Taken from The Coding Train: https://youtu.be/syR0klfncCk
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Object} colour An object containing 3 keys: 'r', 'g', and 'b'.
	 */
	constructor(x, y, colour) {
		this.position = new Vector(x, y);
		this.velocity = new Vector(getRandomNumber(-20, 20), getRandomNegativeNumber(10, 20));
		this.acceleration = new Vector(0, 0);
		this.gravity = new Vector(0, 100);
		this.radius = 4;
		this.lifetime = 200;
		this.life = this.lifetime;
		this.isAlive = true;
		this.colour = colour;

		this.applyForce(this.gravity);
	}

	applyForce(force) {
		this.acceleration.add(force);
	}

	/**
	 * Updates the velocity and position of the particle.
	 * as well as decrements the life value over time.
	 */
	update(dt) {
		this.velocity.add(this.acceleration, dt);
		this.position.add(this.velocity, dt);
		this.life--;

		if (this.life < 0) {
			this.isAlive = false;
		}
	}

	/**
	 * Draws the particle to the screen based on its position, radius, and colour.
	 * The opacity/alpha for the particle is determined by its remaining life.
	 * The smaller the life value gets, the more transparent the particle will be.
	 */
	render() {
		context.save();
		context.fillStyle = `rgb(${this.colour.r}, ${this.colour.g}, ${this.colour.b})`;
		context.globalAlpha = this.life / this.lifetime;
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		context.closePath();
		context.fill();
		context.restore();
	}
}
