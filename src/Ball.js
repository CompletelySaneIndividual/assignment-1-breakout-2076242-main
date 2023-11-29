import Brick from "./Brick.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	sounds,
	TILE_SIZE
} from "./globals.js";
import Paddle from "./Paddle.js";
import SpriteManager from "./SpriteManager.js";
import { getRandomNegativeNumber, getRandomNumber, getRandomPositiveNumber } from "./utils.js";

/**
 * Represents a ball which will bounce back and forth between the sides
 * of the world space, the player's paddle, and the bricks laid out above
 * the paddle. The ball can have a colour, which is chosen at random, just
 * for visual variety.
 */
export default class Ball {
	constructor() {
		this.width = TILE_SIZE / 2;
		this.height = TILE_SIZE / 2;
		this.x = CANVAS_WIDTH / 2 - this.width / 2;
		
		this.y = CANVAS_HEIGHT / 2 - this.height / 2;
		
		this.dx = getRandomNumber(0, 200);
		this.dy = getRandomNegativeNumber(90, 110);

		this.colour = Math.floor(getRandomPositiveNumber(0, 5));
		this.sprites = SpriteManager.generateBallSprites();
	}

	reset() {
		this.dx = 0;
		this.dy = 0;
		this.x = CANVAS_WIDTH / 2 - this.width / 2;
		this.y = CANVAS_HEIGHT / 2 - this.height / 2;
	}

	/**
	 * @returns Whether the ball fell below the screen.
	 */
	didFall() {
		return this.y > CANVAS_HEIGHT;
	}

	/**
	 * AABB collision detection that expects a target
	 * which will have an X, Y, width, and height values.
	 *
	 * @param {Object} target
	 * @returns Whether the ball collided with the target or not.
	 */
	didCollide(target) {
		/**
		 * First, check to see if the left edge of either is
		 * farther to the right than the right edge of the other.
		 * Then check to see if the bottom edge of either is
		 * higher than the top edge of the other.
		 */
		if (this.x + this.width >= target.x
			&& this.x <= target.x + target.width
			&& this.y + this.height >= target.y
			&& this.y <= target.y + target.height) {
			return true;
		}

		// If the above isn't true, they're overlapping.
		return false;
	}

	/**
	 * Tweak angle of bounce based on where it hits the paddle.
	 * The farther away from the center of the paddle the ball hits,
	 * the steeper the angle should be.
	 * @param {Paddle} paddle
	 */
	handlePaddleCollision(paddle) {
		const paddleBallDistance = paddle.x + paddle.width / 2 - this.x;
		const scaleFactor = 8;
		const minimumVelocity = 50;

		// If we hit the paddle on its left side while moving left...
		if (this.x < paddle.x + (paddle.width / 2) && paddle.dx < 0) {
			this.dx = -minimumVelocity + -(scaleFactor * paddleBallDistance);
		}
		//  If we hit the paddle on its right side while moving right...
		else if (this.x > paddle.x + (paddle.width / 2) && paddle.dx > 0) {
			this.dx = minimumVelocity + (scaleFactor * Math.abs(paddleBallDistance));
		}
	}

	/**
	 * We check to see if the opposite side of our velocity is outside of the brick;
	 * if it is, we trigger a collision on that side. Otherwise, we're within the
	 * X + width of the brick and should check to see if the top or bottom edge is
	 * outside of the brick, colliding on the top or bottom accordingly.
	 *
	 * @param {Brick} brick
	 */
	handleBrickCollision(brick) {
		// Left edge; only check if we're moving right.
		if (this.x < brick.x && this.dx > 0) {
			this.dx = -this.dx; // Flip x velocity.
		}
		// Right edge; only check if we're moving left.
		else if (this.x > brick.x + brick.width && this.dx < 0) {
			this.dx = -this.dx; // Flip x velocity.
		}
		// Top edge if there are no X collisions.
		else if (this.y < brick.y) {
			this.dy = -this.dy; // Flip y velocity.
		}
		// Bottom edge if there are no X collisions or top collision.
		else {
			this.dy = -this.dy; // Flip y velocity.
		}

		// Slightly scale the y velocity to speed up the game.
		this.dy *= 1.02;
	}

	// Allows the ball to bounce off the walls and ceiling.
	handleEdgeCollision() {
		if (this.x < 0) {
			this.x = 0;
			this.dx = -this.dx;
			sounds.wallHit.play();
		}

		if (this.x > CANVAS_WIDTH - this.width) {
			this.x = CANVAS_WIDTH - this.width;
			this.dx = -this.dx;
			sounds.wallHit.play();
		}

		if (this.y < 0) {
			this.y = 0;
			this.dy = -this.dy;
			sounds.wallHit.play();
		}
	}

	update(dt) {
		this.handleEdgeCollision();

		this.x += this.dx * dt;
		this.y += this.dy * dt;
	}

	render() {
		this.sprites[this.colour].render(this.x, this.y);
	}
}
