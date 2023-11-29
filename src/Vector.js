export default class Vector {
	/**
	 * A simple vector class that can add two vectors together.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(vector, dt = 1) {
		this.x += vector.x * dt;
		this.y += vector.y * dt;
	}
}
