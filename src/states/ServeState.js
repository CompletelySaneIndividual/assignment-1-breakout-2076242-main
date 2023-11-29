import State from "./State.js";
import SpriteManager from "../SpriteManager.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, stateMachine } from "../globals.js";

/**
 * The state in which we are waiting to serve the ball; here, we are
 * basically just moving the paddle left and right with the ball until we
 * press Enter, though everything in the actual game now should render in
 * preparation for the serve, including our current health and score, as
 * well as the level we're on.
 */
export default class ServeState extends State {
	constructor() {
		super();
	}

	enter(parameters) {
		this.paddle = parameters.paddle;
		this.balls = parameters.balls;
		this.bricks = parameters.bricks;
		this.health = parameters.health;
		this.score = parameters.score;
		this.userInterface = parameters.userInterface;
		this.level = parameters.level;
	}

	update(dt) {
		this.paddle.update(dt);

		// Have the ball track the player.
		this.balls[0].x = this.paddle.x + (this.paddle.width / 2) - this.balls[0].width / 2;
		this.balls[0].y = this.paddle.y - this.balls[0].height; //dealing with an array now

		if (keys.Enter) {
			keys.Enter = false;

			// Pass in all important state info to the PlayState.
			stateMachine.change('play', {
				paddle: this.paddle,
				bricks: this.bricks,
				health: this.health,
				score: this.score,
				balls: this.balls,
				userInterface: this.userInterface,
				level: this.level,
			});
		}
	}

	render() {
		this.userInterface.render();

		this.bricks.forEach((brick) => {
			if (brick.inPlay) {
				brick.render();
			}
		});

		this.paddle.render();
		this.balls[0].render();//there will only ever be one ball at play at this time.

		context.save();
		context.fillStyle = "white";
		context.font = "20px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Enter to serve!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.7);
		context.restore();
	}
}
