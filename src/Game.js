import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	sounds,
	stateMachine,
} from "./globals.js";

export default class Game {
	/**
	 * This class encapsulates our game loop logic so that `main.js` stays clean.
	 */
	constructor() {
		this.lastTime = 0;
	}

	start() {
		this.gameLoop();
		// sounds.music.play();
	};

	/**
	 * This function is the heartbeat of the application. It is called
	 * 60 times per second (depending on your monitor's refresh rate) and
	 * it is what we will use to drive our game's animations. The way
	 * that this function is called 60 times per second is by using JavaScript's
	 * `requestAnimationFrame()` API.
	 *
	 * @param {Number} currentTime How much time has elapsed since the page loaded.
	 */
	gameLoop(currentTime = 0) {
		// Calculates delta time and converts it to seconds instead of milliseconds.
		const deltaTime = (currentTime - this.lastTime) / 1000;

		this.update(deltaTime);
		this.lastTime = currentTime;
		requestAnimationFrame((time) => this.gameLoop(time));
	}

	/**
	 * This function is called by `gameLoop()` at each frame of program execution;
	 * `dt` (i.e., DeltaTime) will be the elapsed time in seconds since the last
	 * frame, and we can use this to scale any changes in our game for even behavior
	 * across frame rates. This is where the logic of our game will be executed.
	 *
	 * @param {Number} dt How much time has elapsed since the last time this was called.
	 */
	update(dt) {
		stateMachine.update(dt);
		this.render();
	}

	/**
	 * This function is also executed at each frame since it is called by
	 * `update()`. It is called after the update step completes so that we
	 * can draw things to the screen once they've changed.
	 */
	render() {
		context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		stateMachine.render();
	}
}
