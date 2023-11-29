import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	sounds,
	stateMachine,
	TILE_SIZE
} from "../globals.js";
import State from "./State.js";
import PowerUp from "../PowerUp.js";
import KeyPowerUp from "../KeyPowerUp.js";
import { getRandomPositiveNumber } from "../utils.js";
import Ball from "../Ball.js";

/**
 * Represents the state of the game in which we are actively playing;
 * player should control the paddle, with the ball actively bouncing between
 * the bricks, walls, and the paddle. If the ball goes below the paddle, then
 * the player should lose one point of health and be taken either to the Game
 * Over screen if at 0 health or the Serve screen otherwise.
 */
export default class PlayState extends State {
	 

	constructor() {
		super();

		this.keys = 0;
		this.baseScore = 10;
		this.powerUps = new Array(); //doesn't need to be passed as its not persistent through states
		this.keyPowerUps = new Array(); // doesn't need to be passed as its not persistent through states
	}

	enter(parameters) {
		this.paddle = parameters.paddle;
		this.bricks = parameters.bricks;
		this.health = parameters.health;
		this.score = parameters.score;
		this.balls = parameters.balls;
		this.userInterface = parameters.userInterface;
		this.level = parameters.level;
	}

	checkVictory() {
		/**
		 * The every method executes the provided callback function once for
		 * each element present in the array until it finds the one where callback
		 * returns a falsy value. If such an element is found, the every method
		 * immediately returns false. Otherwise, if callback returns a truthy value
		 * for all elements, every returns true.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
		 */
		return this.bricks.every(brick => !brick.inPlay);
	}

	update(dt) {
		if (this.paused) {
			if (keys.p) {
				keys.p = false;
				this.paused = false;
				sounds.pause.play();
			}
			else {
				return;
			}
		}
		else if (keys.p) {
			keys.p = false;
			this.paused = true;
			sounds.pause.play();
			return;
		}

		this.balls.forEach((ball) =>{
			if (ball.didCollide(this.paddle)) {
				// Flip y velocity and reset position to on top of the paddle.
				ball.dy *= -1;
				ball.y = CANVAS_HEIGHT - TILE_SIZE * 2 - TILE_SIZE / 2;
	
				// Vary the angle of the ball depending on where it hit the paddle.
				ball.handlePaddleCollision(this.paddle);
	
				sounds.paddleHit.play();
			}
		})

		this.bricks.forEach((brick) => {
			this.balls.forEach((ball) => {
				if (brick.inPlay && ball.didCollide(brick)) {
					if(!brick.isLocked){
						this.score += this.baseScore * (brick.tier + 1);
					}
					this.userInterface.update(this.health, this.score);

					// Call the brick's hit function, which removes it from play.
					if(this.keys > 0){
						if(brick.isLocked){
							this.keys--;
							this.userInterface.update(this.health, this.score, this.level, this.keys);
						}
						brick.hit(true);
					}else{
						brick.hit(false);
					}

					if(!brick.inPlay){
						if(getRandomPositiveNumber(0, 10) > 9){//1 / 10 chance
							//hishest tier is used to keep track of the highest tier the brick was at, as otherwise you'd only get tier 1 powerups
							this.powerUps.push(new PowerUp(brick.highestTier, brick.x, brick.y)); //tier will increase the maximum amount of balls the power up can spawn
							// tier 1 => max 2
							// tier 2 => max 3
							// tier 3 => max 4
							// etc
						}
						if(getRandomPositiveNumber(0, 10) > 8){//2 / 10 chance
							//theres a 2/10 chance a key spawns and a 1/10 chance that a locked brick spawns to minimize soft locking
							this.keyPowerUps.push(new KeyPowerUp(brick.x, brick.y));
						}
					}
	
					if (this.checkVictory()) {
						sounds.victory.play();

						//must remove all balls except one
						while (this.balls.length > 1) {
							this.balls.pop(); //removing until one left standing
						}
						while (this.powerUps.length !== 0){
							this.powerUps.pop();
						}
						while (this.keyPowerUps.length !== 0){
							this.keyPowerUps.pop();
						}
						
						stateMachine.change('victory', {
							level: this.level,
							paddle: this.paddle,
							health: this.health,
							score: this.score,
							balls: this.balls,
							userInterface: this.userInterface,
						});
					}
	
					ball.handleBrickCollision(brick);
				}
			})
		});

		//checking if the power up is hit by the paddle, in which case, we spawn balls according to the tier
		for(let i = 0; i < this.powerUps.length; i++){
			if(this.powerUps[i].didCollide(this.paddle)){
				let rand = Math.round(getRandomPositiveNumber(1, this.powerUps[i].tier + 1));
				for(let j = 0; j < rand; j++){
					this.balls.push(new Ball());
					this.balls[this.balls.length-1].x = this.powerUps[i].position.x;
					this.balls[this.balls.length-1].y = this.powerUps[i].position.y;
				}
				
				for(let j = i + 1; j < this.powerUps.length; j++){
					this.powerUps[j-1] = this.powerUps[j];
				}
				this.powerUps.pop();
			}
		}

		//doing more or less the same thing as the original power ups but for keys this time
		for(let i = 0; i < this.keyPowerUps.length; i++){
			if(this.keyPowerUps[i].didCollide(this.paddle)){
				this.keys++;
				console.log("playstate keys: " + this.keys);
				this.userInterface.update(this.health, this.score, this.level, this.keys);
				for(let j = i + 1; j < this.keyPowerUps.length; j++){
					this.keyPowerUps[j-1] = this.keyPowerUps[j];
				}
				this.keyPowerUps.pop();
			}
		}

		//using a for loop for this because its easy to get the index of the ball
		for(let i = 0; i < this.balls.length; i++){
			if(this.balls.length === 1){ //if this is the last ball
				if (this.balls[i].didFall()) {
					this.health--;
					this.userInterface.update(this.health, this.score);
					sounds.hurt.play();
		
					if (this.health === 0) {
						//must remove all balls except one
						while (this.balls.length > 1) {
							this.balls.pop(); //removing until one left standing
						}
						while (this.powerUps.length !== 0){
							this.powerUps.pop();
						}
						while (this.keyPowerUps.length !== 0){
							this.keyPowerUps.pop();
						}
						stateMachine.change('game-over', {
							score: this.score,
						});
					}
					else { //can only get here by there being one ball so no need to remove any balls
						//must remove all balls except one
						while (this.balls.length > 1) {
							this.balls.pop(); //removing until one left standing
						}
						while (this.powerUps.length !== 0){
							this.powerUps.pop();
						}
						while (this.keyPowerUps.length !== 0){
							this.keyPowerUps.pop();
						}
						stateMachine.change('serve', {
							paddle: this.paddle,
							balls: this.balls,
							bricks: this.bricks,
							health: this.health,
							score: this.score,
							userInterface: this.userInterface,
							level: this.level,
						});
					}
				}
			}else{//if it not the last one
				if(this.balls[i].didFall()){
					//did fall, must remove the ball from array
					for(let j = i + 1; j < this.balls.length; j++){
						this.balls[j-1] = this.balls[j];
					}
					this.balls.pop(); //by the end the last 2 indexes should refer to the same Object
					//so pop of one so length property remains accurate
				}
			}
		}
		for(let i = 0; i < this.powerUps.length; i++){
			if(this.powerUps[i].didFall()){
				for(let j = i + 1; j < this.powerUps.length; j++){
					this.powerUps[j-1] = this.powerUps[j];
				}
				this.powerUps.pop();
			}
		}
		for(let i = 0; i < this.keyPowerUps.length; i++){
			if(this.keyPowerUps[i].didFall()){
				for(let j = i + 1; j < this.keyPowerUps.length; j++){
					this.keyPowerUps[j-1] = this.keyPowerUps[j];
				}
				this.keyPowerUps.pop();
			}
		}
		
		if(this.paddle.size === 0 && this.paddle.pointThreshold + 50 <= this.userInterface.score){
			//console.log("Add To Size 50");
			//console.log("size: " + this.paddle.size);
			//console.log("Prior points: " + this.paddle.pointThreshold);
			//console.log("Current points: " + this.userInterface.score);
			this.paddle.changeSize(this.paddle.size+1, this.userInterface.score, this.userInterface.health)
		}
		if(this.paddle.size === 1 && this.paddle.pointThreshold + 100 <= this.userInterface.score){
			//console.log("Add To Size 100");
			//console.log("size: " + this.paddle.size);
			//console.log("Prior points: " + this.paddle.pointThreshold);
			//console.log("Current points: " + this.userInterface.score);
			this.paddle.changeSize(this.paddle.size+1, this.userInterface.score, this.userInterface.health)
		}
		if(this.paddle.size === 2 && this.paddle.pointThreshold + 200 <= this.userInterface.score){
			//console.log("Add To Size 200");
			//console.log("size: " + this.paddle.size);
			//console.log("Prior points: " + this.paddle.pointThreshold);
			//console.log("Current points: " + this.userInterface.score);
			this.paddle.changeSize(this.paddle.size+1, this.userInterface.score, this.userInterface.health)
		}
		if(this.userInterface.health < this.paddle.lifeThreshold){
			//console.log("Subract from size")
			this.paddle.changeSize(this.paddle.size-1, this.userInterface.score, this.userInterface.health)
		}
		

		
		this.paddle.update(dt);
		this.balls.forEach((ball) => {
			ball.update(dt);
		})
		this.bricks.forEach((brick) => {
			brick.update(dt);
		});
		this.powerUps.forEach((powerUp) => {
			powerUp.update(dt);
		});
		this.keyPowerUps.forEach((keyPowerUp) => {
			keyPowerUp.update(dt);
		});
	}

	render() {
		this.userInterface.render();
		this.paddle.render();

		this.balls.forEach((ball) => {
			ball.render();
		})
		this.bricks.forEach((brick) => {
			brick.render();
		});
		this.powerUps.forEach((powerUp) => {
			powerUp.render();
		})
		this.keyPowerUps.forEach((keyPowerUp) => {
			keyPowerUp.render();
		})

		if (this.paused) {
			context.save();
			context.font = "50px Joystix";
			context.fillStyle = "white";
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			context.fillText(`⏸`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
			context.restore();
		}
	}
}
