import Ball from "../Ball.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	keys,
	sounds,
	stateMachine,
} from "../globals.js";
import LevelMaker from "../LevelMaker.js";
import Paddle from "../Paddle.js";
import SpriteManager from "../SpriteManager.js";
import State from "./State.js";
import UserInterface from "../UserInterface.js";

/**
 * Before the game starts, the player is allowed to select
 * the colour of their paddle.
 */
export default class PaddleSelectState extends State {
	constructor() {
		super();

		this.sprites = SpriteManager.generateArrowSprites();
	}

	enter(parameters) {
		this.paddle = new Paddle();
	}

	update(dt) {
		// Select the current skin and move on to the serve state.
		if (keys.Enter) {
			keys.Enter = false;

			sounds.confirm.play();

			const health = 3;
			const score = 0;
			const level = 1;
			var balls = new Array();
			balls.push(new Ball())
			stateMachine.change('serve', {
				paddle: this.paddle,
				balls: balls,
				bricks: LevelMaker.createMap(level),
				health: health,
				score: score,
				userInterface: new UserInterface(health, score, level),
				level: level,
			});
		}

		// Cycle through the paddles with A and D.
		if (keys.a) {
			keys.a = false;

			if (this.paddle.skin === 0) {
				sounds.noSelect.play();
			}
			else {
				sounds.select.play();
				this.paddle.skin--;
			}
		}

		if (keys.d) {
			keys.d = false;

			if (this.paddle.skin === 3) {
				sounds.noSelect.play();
			}
			else {
				sounds.select.play();
				this.paddle.skin++;
			}
		}
	}

	render() {
		images.background.render(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		/**
		 * Draw the paddle itself. It will be drawn in the selected colour
		 * since we are updating paddle.skin when A or D are pressed in update().
		 */
		this.paddle.render();

		context.save();

		/**
		 * Draw the arrows as half transparent if we're on the first or last
		 * paddle to visually indicate that we cannot go past these bounds.
		 */
		if (this.paddle.skin === 0) {
			context.globalAlpha = 0.5;
		}

		// Left arrow.
		this.sprites[0].render(CANVAS_WIDTH * 0.25 - this.sprites[0].width / 2, CANVAS_HEIGHT * 0.85 - this.sprites[0].height / 2);

		// Reset the alpha to draw the next arrow.
		context.globalAlpha = 1;

		if (this.paddle.skin === 3) {
			context.globalAlpha = 0.5;
		}

		// Right arrow.
		this.sprites[1].render(CANVAS_WIDTH * 0.75 - this.sprites[1].width / 2, CANVAS_HEIGHT * 0.85 - this.sprites[1].height / 2);

		// Reset the alpha to draw the text.
		context.globalAlpha = 1;

		context.fillStyle = "white";
		context.font = "20px Joystix";
		context.textAlign = 'center';
		context.fillText(`Select your paddle with A and D`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.15);
		context.restore();
	}
}
