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
 * Represents the screen where we can view all high scores previously recorded.
 */
export default class HighScoreState extends State {
	constructor() {
		super();
	}

	enter(parameters) {
		this.highScores = HighScoreManager.loadHighScores();
	}

	update(dt) {
		// Return to the start screen if we press escape.
		if (keys.Escape) {
			keys.Escape = false;
			sounds.wallHit.play();

			stateMachine.change('title-screen');
		}
	}

	render() {
		images.background.render(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.save();
		context.fillStyle = "white";
		context.font = "15px Joystix";
		context.textAlign = 'center';
		context.fillText(`🎉 HIGH SCORES 🎉`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.15);

		for (let i = 0; i < 10; i++) {
			const name = this.highScores[i].name ?? '---';
			const score = this.highScores[i].score ?? '---';

			context.textAlign = 'left';
			context.fillText(`${i + 1}.`, CANVAS_WIDTH * 0.25, 75 + i * 15);
			context.textAlign = 'center';
			context.fillText(`${name}`, CANVAS_WIDTH * 0.5, 75 + i * 15);
			context.textAlign = 'right';
			context.fillText(`${score}`, CANVAS_WIDTH * 0.75, 75 + i * 15);
		}

		context.font = "10px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Escape to return to the main menu!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.95);
		context.restore();
	}
}
