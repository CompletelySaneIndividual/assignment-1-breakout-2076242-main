import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	keys,
	sounds,
	stateMachine,
} from "../globals.js";
import HighScoreManager from "../HighScoreManager.js";
import State from "./State.js";

/**
 * The state in which we've lost all of our health and get our score displayed to us.
 * Should transition to the EnterHighScore state if we exceeded one of our stored high
 * scores, else back to the StartState.
 */
export default class GameOverState extends State {
	constructor() {
		super();
	}

	enter(parameters) {
		this.score = parameters.score;
	}

	/**
	 * The some() method tests whether at least one element in the array passes the
	 * test implemented by the provided function. It returns true if, in the array,
	 * it finds an element for which the provided function returns true; otherwise
	 * it returns false. It doesn't modify the array.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
	 *
	 * @returns Whether the score is greater than any current high score.
	 */
	wasHighScore() {
		return HighScoreManager.loadHighScores().some((highScore) => this.score > highScore.score);
	}

	update(dt) {
		if (keys.Enter) {
			keys.Enter = false;

			// If the player's score is higher than any score currently in the high score table...
			if (this.wasHighScore()) {
				sounds.highScore.play();
				stateMachine.change('enter-high-score', {
					score: this.score,
				});
			}
			else {
				stateMachine.change('title-screen');
			}
		}
	}

	render() {
		images.background.render(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.save();
		context.font = "40px Joystix";
		context.fillStyle = "white";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`GAME OVER`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
		context.font = "20px Joystix";
		context.fillText(`Final Score: ${this.score}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.8);
		context.fillText(`Press Enter to continue...`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.9);
		context.restore();
	}
}
