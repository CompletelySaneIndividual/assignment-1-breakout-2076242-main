import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	keys,
	sounds,
	stateMachine
} from "../globals.js";
import State from "./State.js";

/**
 * Represents the state the game is in when we've just started; should
 * simply display "Breakout" in large text, as well as a menu to select
 * either "Start" or "High Scores".
 */
export default class TitleScreenState extends State {
	constructor() {
		super();

		this.menuOptions = {
			start: 'Start',
			highScores: 'High Scores',
		};

		// Whether we're highlighting "Start" or "High Scores".
		this.highlighted = this.menuOptions.start;
	}

	update(dt) {
		// Toggle highlighted option if we press w or s.
		if (keys.w || keys.s) {
			keys.w = false;
			keys.s = false;
			this.highlighted = this.highlighted === this.menuOptions.start ? this.menuOptions.highScores : this.menuOptions.start;
			sounds.paddleHit.play();
		}

		// Confirm whichever option we have selected to change screens.
		if (keys.Enter) {
			keys.Enter = false;
			sounds.confirm.play();

			if (this.highlighted === this.menuOptions.start) {
				stateMachine.change('paddle-select');
			}
			else {
				stateMachine.change('high-score');
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
		context.fillText(`BREAKOUT`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
		context.font = "20px Joystix";

		// Set the fill style based on which option is highlighted.
		context.fillStyle = this.highlighted === this.menuOptions.start ? "cornflowerblue" : "white";
		context.fillText(`${this.menuOptions.start}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.8);
		context.fillStyle = this.highlighted === this.menuOptions.highScores ? "cornflowerblue" : "white";
		context.fillText(`${this.menuOptions.highScores}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.9);
		context.restore();
	}
}
