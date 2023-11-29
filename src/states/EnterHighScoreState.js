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
 * Screen that allows us to input a new high score in the form of three characters, arcade-style.
 */
export default class EnterHighScoreState extends State {
	constructor() {
		super();

		this.chars = [65, 65, 65]; // Individual characters of our string.
		this.highlightedChar = 0; // Character that is currently highlighted.
	}

	enter(parameters) {
		this.score = parameters.score;
		this.highlightedChar = 0;
	}

	update(dt) {
		if (keys.Enter) {
			keys.Enter = false;

			const name = String.fromCharCode(this.chars[0]) + String.fromCharCode(this.chars[1]) + String.fromCharCode(this.chars[2]);

			HighScoreManager.addHighScore(name, this.score);

			stateMachine.change('high-score');
		}

		// Scroll through character slots.
		if (keys.a && this.highlightedChar > 0) {
			keys.a = false;
			this.highlightedChar = this.highlightedChar - 1;
			sounds.select.play();
		}
		else if (keys.d && this.highlightedChar < 2) {
			keys.d = false;
			this.highlightedChar = this.highlightedChar + 1;
			sounds.select.play();
		}

		// Scroll through characters.
		if (keys.w) {
			keys.w = false;
			this.chars[this.highlightedChar] = this.chars[this.highlightedChar] + 1;
			if (this.chars[this.highlightedChar] > 90) {
				this.chars[this.highlightedChar] = 65;
			}
		}
		else if (keys.s) {
			keys.s = false;
			this.chars[this.highlightedChar] = this.chars[this.highlightedChar] - 1;
			if (this.chars[this.highlightedChar] < 65) {
				this.chars[this.highlightedChar] = 90;
			}
		}
	}

	render() {
		images.background.render(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.save();
		context.fillStyle = "white";
		context.font = "20px Joystix";
		context.textAlign = 'center';
		context.fillText(`Your high score: ${this.score}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.15);
		context.font = "15px Joystix";
		context.fillText(`W/S to choose a letter`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.3);
		context.fillText(`A/D to change slot`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.4);
		context.font = "50px Joystix";
		context.fillStyle = this.highlightedChar === 0 ? "cornflowerblue" : "white";
		context.fillText(`${String.fromCharCode(this.chars[0])}`, CANVAS_WIDTH * 0.4, CANVAS_HEIGHT * 0.7);
		context.fillStyle = this.highlightedChar === 1 ? "cornflowerblue" : "white";
		context.fillText(`${String.fromCharCode(this.chars[1])}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.7);
		context.fillStyle = this.highlightedChar === 2 ? "cornflowerblue" : "white";
		context.fillText(`${String.fromCharCode(this.chars[2])}`, CANVAS_WIDTH * 0.6, CANVAS_HEIGHT * 0.7);
		context.fillStyle = "white";
		context.font = "10px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Enter to confirm!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.9);
		context.restore();
	}
}
