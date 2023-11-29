import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images
} from "./globals.js";
import SpriteManager from "./SpriteManager.js";

export default class UserInterface {
	/**
	 * A helper class to draw the UI so that it can be used in many states.
	 *
	 * @param {Number} health
	 * @param {Number} score
	 * @param {Number} level
	 */
	constructor(health, score, level) {
		this.health = health;
		this.score = score;
		this.level = level;
		this.keys = 0;
	}

	update(health, score, level = this.level, keys) {
		this.health = health;
		this.score = score;
		this.level = level;
		if(keys !== undefined)
			this.keys = keys;
		console.log("Keys: " + this.keys + " " + keys);
	}

	render() {
		images.background.render(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Renders the current level at the top left.
		context.save();
		context.font = "10px Joystix";
		context.fillStyle = "white";
		context.fillText(`Level: ${this.level}`, 10, 20);
		context.restore();

		context.save();
		context.font = "10px Joystix";
		context.fillStyle = "white";
		let keyX = CANVAS_WIDTH - 200;

		context.fillText(`Keys:`, keyX, 20);
		context.textAlign = 'right';
		context.fillText(`${this.keys}`, keyX + 50, 20);
		context.restore();

		/*
			Renders hearts based on how much health the player has. First renders
			full hearts, then empty hearts for however much health we're missing.
		*/
		let healthX = CANVAS_WIDTH - 130;
		const sprites = SpriteManager.generateHeartSprites();



		// Render health left.
		for (let i = 0; i < this.health; i++) {
			sprites[0].render(healthX, 12);
			healthX = healthX + 11;
		}

		// Render missing health.
		for (let i = 0; i < 3 - this.health; i++) {
			sprites[1].render(healthX, 12);
			healthX = healthX + 11;
		}

		/*
			Renders the player's score at the top right, with left-side padding
			for the score number.
		*/
		context.save();
		context.font = "10px Joystix";
		context.fillStyle = "white";
		context.fillText(`Score:`, CANVAS_WIDTH - 85, 20);
		context.textAlign = 'right';
		context.fillText(`${this.score}`, CANVAS_WIDTH - 10, 20);
		context.restore();
	}
}
