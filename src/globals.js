import Graphic from "./Graphic.js";
import SoundPool from "./SoundPool.js";
import StateMachine from "./StateMachine.js";

/**
 * We initialize our game by grabbing the `canvas` element from
 * the DOM located in `index.html` and getting the `context` object
 * from it.
 */
export const canvas = document.createElement('canvas');
export const context = canvas.getContext('2d') || new CanvasRenderingContext2D();
export const CANVAS_WIDTH = 432;
export const CANVAS_HEIGHT = 243;
export const keys = {};
export const TILE_SIZE = 16;
export const MAX_HIGH_SCORES = 10;

export const images = {
	arrows: new Graphic('./images/arrows.png', 48, 24),
	background: new Graphic('./images/background.png', CANVAS_WIDTH, CANVAS_HEIGHT),
	hearts: new Graphic('./images/hearts.png', 20, 9),
	spriteSheet: new Graphic('./images/sprite_sheet.png', 1152, 1536),
};

export const sounds = {
	brickHit: new SoundPool('./sounds/brick_hit.wav', 10, 0.1),
	confirm: new SoundPool('./sounds/confirm.wav', 5, 0.1),
	highScore: new SoundPool('./sounds/high_score.wav', 5, 0.1),
	hurt: new SoundPool('./sounds/hurt.wav', 5, 0.1),
	music: new SoundPool('./sounds/music.wav', 1, 0.1, true),
	noSelect: new SoundPool('./sounds/no-select.wav', 5, 0.1),
	paddleHit: new SoundPool('./sounds/paddle_hit.wav', 5, 0.1),
	pause: new SoundPool('./sounds/pause.wav', 5, 0.1),
	select: new SoundPool('./sounds/select.wav', 5, 0.1),
	victory: new SoundPool('./sounds/victory.wav', 5, 0.1),
	wallHit: new SoundPool('./sounds/wall_hit.wav', 5, 0.1),
};

export const stateMachine = new StateMachine();
