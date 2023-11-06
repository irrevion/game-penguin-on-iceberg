import Map from "./Map.js";
import Penguin from "./Penguin.js";
import Timer from "./Timer.js";
import UI from "./UI.js";

class Game {
	constructor(config) {
		this.config = config;
		this.map = new Map(config);
		this.penguin = new Penguin({map: this.map});
		this.timer = new Timer(config);
		this.state = "pending"; // "pending", "running", "paused", "over"
		this.score = 0;
		this.hiscore = 0;
		this.speed = 1;
		this.speedup_countdown = 10;
	}

	launch() {
		// prepare new game
		this.state = "pending";
		UI.updateStatus(this.state);
		console.log("Game state changed to "+this.state);
		this.map.draw();
		this.penguin.restore();
		this.listenPlayerCommands();
	}

	start() {
		// starts new game
		this.state = "running";
		UI.updateStatus(this.state);
		console.log("Game state changed to "+this.state);
		this.penguin.chooseRandomDirection();
		var context = this;
		this.timer.eachTick(function() {
			context.penguin.moveToDirection();
			context.checkIfPenguinAlive();
		});
		this.timer.go();
	}

	changeDirectionByCommand(toward) {
		this.timer.clear();
		this.penguin.setDirection(toward);
		var context = this;
		this.timer.eachTick(function() {
			context.penguin.moveToDirection();
			context.checkIfPenguinAlive();
		});
		this.timer.afterTick(3, function() {
			context.penguin.chooseRandomDirection();
			context.countScore();
		});
		this.timer.go();
	}

	pause() {
		// pauses game
		this.state = "paused";
		UI.updateStatus(this.state);
		console.log("Game state changed to "+this.state);
		this.timer.freeze();
	}

	resume() {
		// resumes game after pause
		this.state = "running";
		UI.updateStatus(this.state);
		console.log("Game state changed to "+this.state);
		this.timer.go();
	}

	over() {
		// game over
		this.state = "over";
		UI.updateStatus(this.state);
		console.log("Game state changed to "+this.state);
		this.timer.clear();
		this.timer.interval = 1000;
		if (this.score>this.hiscore) {
			this.hiscore = this.score;
			UI.updateHiscore(this.hiscore);
		}
	}

	stop() {
		// stop game and clean state
		this.state = "pending";
		UI.updateStatus(this.state);
		console.log("Game state changed to "+this.state);
		this.score = 0;
		UI.updateScore(this.score);
		this.speed = 1;
		UI.updateSpeed(this.speed);
		this.penguin.restore();
		this.map.clear();
		this.timer.clear();
		if (this.commands_listener) {
			window.removeEventListener("keyup", this.commands_listener);
		}
	}

	reset() {
		// stop this game and start new
		this.stop();
		this.launch();
	}

	checkIfPenguinAlive() {
		var terrain_type = this.map.checkTerrainAtPos(this.penguin.pos);
		if (terrain_type=="sea") {
			this.penguin.die();
			this.over();
		}
	}

	listenPlayerCommands() {
		this.commands_listener = (event) => {
			/*if (event.isComposing || event.keyCode === 229) {
				return;
			}*/
			console.log(event.keyCode);
			if (event.keyCode==13) {
				// ENTER key pressed
				if (this.state=="pending") {
					this.start();
				} else {
					console.log("KB#13 [ENTER] key ignored");
				}
			} else if (event.keyCode==32) {
				// SPACE key pressed
				if (this.state=="running") {
					this.pause();
				} else if (this.state=="paused") {
					this.resume();
				} else {
					console.log("KB#32 [SPACE] key ignored");
				}
			} else if (event.keyCode==8) {
				// BACKSPACE key pressed
				this.reset();
			} else if (event.keyCode==27) {
				// ESCAPE key pressed
				this.stop();
			} else if (event.keyCode==37) {
				// LEFT ARROW key pressed
				if (this.state=="running") {
					this.changeDirectionByCommand("left");
				} else {
					console.log("KB#37 [LEFT ARROW] key ignored");
				}
			} else if (event.keyCode==38) {
				// UP ARROW key pressed
				if (this.state=="running") {
					this.changeDirectionByCommand("up");
				} else {
					console.log("KB#38 [UP ARROW] key ignored");
				}
			} else if (event.keyCode==39) {
				// RIGHT ARROW key pressed
				if (this.state=="running") {
					this.changeDirectionByCommand("right");
				} else {
					console.log("KB#39 [RIGHT ARROW] key ignored");
				}
			} else if (event.keyCode==40) {
				// DOWN ARROW key pressed
				if (this.state=="running") {
					this.changeDirectionByCommand("down");
				} else {
					console.log("KB#40 [DOWN ARROW] key ignored");
				}
			}
		};
		window.addEventListener("keyup", this.commands_listener);
	}

	countScore() {
		var add = 100;
		add = add + ((this.speed - 1) * Math.pow(this.timer.speed_multiplier, this.speed) * 100);
		add = Math.floor(add);
		this.score+=add;
		UI.updateScore(this.score);
		console.log(this.score);

		this.speedup_countdown--;
		if (this.speedup_countdown==0) {
			this.speed++;
			UI.updateSpeed(this.speed);
			this.speedup_countdown = 10;
			this.timer.interval = Math.ceil(this.timer.interval/this.timer.speed_multiplier);
		}
	}
}

export default Game;