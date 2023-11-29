import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	stateMachine
} from "../globals.js";
import LevelMaker from "../LevelMaker.js";
import State from "./State.js";

/**
 * Represents the state that the game is in when we've just completed a level.
 * Very similar to the ServeState, except here we increment the level.
 */
export default class VictoryState extends State {
	constructor() {
		super();
	}

	enter(parameters) {
		this.level = parameters.level;
		this.score = parameters.score;
		this.paddle = parameters.paddle;
		this.health = parameters.health;
		this.balls = parameters.balls;
		this.userInterface = parameters.userInterface;
		this.level = parameters.level;
	}

	update(dt) {
		this.paddle.update(dt);

		// Have the ball track the player.
		this.balls[0].x = this.paddle.x + (this.paddle.width / 2) - this.balls[0].width / 2;
		this.balls[0].y = this.paddle.y - this.balls[0].height;

		// Go to serve state if the player presses Enter.
		if (keys.Enter) {
			keys.Enter = false;

			this.userInterface.update(this.health, this.score, this.level + 1);

			stateMachine.change('serve', {
				balls: this.balls,
				bricks: LevelMaker.createMap(this.level + 1),
				paddle: this.paddle,
				health: this.health,
				score: this.score,
				userInterface: this.userInterface,
				level: this.level + 1,
			});
		}
	}

	render() {
		this.userInterface.render();
		this.paddle.render();
		this.balls[0].render();

		context.save();
		context.fillStyle = "white";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.font = "20px Joystix";
		context.fillText(`Level ${this.level} Complete!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.6);
		context.fillText(`Press Enter to continue...`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.7);
		context.restore();
	}
}
