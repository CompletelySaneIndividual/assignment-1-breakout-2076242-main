/**
 * Breakout-8
 * The "Polish" Update
 *
 * Original Lua by: Colton Ogden (cogden@cs50.harvard.edu)
 * Adapted to JS by: Vikram Singh (vikram.singh@johnabbott.qc.ca)
 *
 * Originally developed by Atari in 1976. An effective evolution of
 * Pong, Breakout ditched the two-player mechanic in favor of a single-
 * player game where the player, still controlling a paddle, was tasked
 * with eliminating a screen full of differently placed bricks of varying
 * values by deflecting a ball back at them.
 *
 * This version is built to more closely resemble the NES than
 * the original Pong machines or the Atari 2600 in terms of
 * resolution, though in widescreen (16:9) so it looks nicer on
 * modern systems.
 *
 * Credit for graphics:
 * @see https://opengameart.org/users/buch
 *
 * Credit for music:
 * @see http://freesound.org/people/joshuaempyre/sounds/251461/
 * @see http://www.soundcloud.com/empyreanma
 */

import Game from "./Game.js";
import {
	canvas,
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	keys,
	stateMachine,
} from "./globals.js";
import PlayState from "./states/PlayState.js";
import TitleScreenState from "./states/TitleScreenState.js";
import GameOverState from "./states/GameOverState.js";
import ServeState from "./states/ServeState.js";
import VictoryState from "./states/VictoryState.js";
import HighScoreState from "./states/HighScoreState.js";
import EnterHighScoreState from "./states/EnterHighScoreState.js";
import PaddleSelectState from "./states/PaddleSelectState.js";

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to have user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

// Set the appropriate key in our `keys` object to `true` if a key was pressed.
canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

// Set the appropriate key in our `keys` object to `false` if a key was unpressed.
canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});

// Load custom fonts to use in the game.
const fonts = [
	new FontFace('Joystix', 'url(./fonts/Joystix.ttf)'),
];

fonts.forEach((font) => {
	font.load().then(font => {
		document.fonts.add(font);
	});
});

/**
 * The state machine we'll be using to transition between various states
 * in our game instead of clumping them together in our update and draw methods.
 *
 * Current game state can be any of the following:
 *   1. 'title-screen' (the beginning of the game, where we're told to press Enter)
 *   2. 'play' (the ball is in play, bouncing between paddles)
 *   3. 'serve' (waiting on a key press to serve the ball)
 *   4. 'game-over' (the player has lost; display score and allow restart)
 *   5. 'victory' (the current level is over, with a victory jingle)
 *   6. 'high-score' (displays all the high scores)
 *   7. 'enter-high-score' (player got a high score and can enter their name)
 *   8. 'paddle-select' (the player can select a skin for their paddle before playing)
 */
stateMachine.add('game-over', new GameOverState());
stateMachine.add('serve', new ServeState());
stateMachine.add('play', new PlayState());
stateMachine.add('victory', new VictoryState());
stateMachine.add('high-score', new HighScoreState());
stateMachine.add('enter-high-score', new EnterHighScoreState());
stateMachine.add('paddle-select', new PaddleSelectState());
stateMachine.add('title-screen', new TitleScreenState());

const game = new Game();

game.start();

// Focus the canvas so that user doesn't have to click on it.
canvas.focus();
