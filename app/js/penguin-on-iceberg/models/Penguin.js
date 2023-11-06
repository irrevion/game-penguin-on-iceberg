class Penguin {
	constructor(config) {
		this.map = config.map;
		this.state = null; // null, "alive", "dead"
		this.pos = {x: 1, y: 1};
		this.direction = {up: 0, right: 0, down: 0, left: 0};
	}

	restore() {
		this.state = "alive";
		this.pos = {x: 1, y: 1};
		this.direction = {up: 0, right: 0, down: 0, left: 0};
		this.clear();
		var center = this.map.getCenter();
		this.putAt(center);
	}

	die() {
		this.state = "dead";
	}

	move(pos) {
		this.clear();
		this.putAt(pos);
	}

	moveToDirection() {
		var new_pos = this.pos;
		if (this.direction.up) {
			new_pos.y--;
		}
		if (this.direction.down) {
			new_pos.y++;
		}
		if (this.direction.left) {
			new_pos.x--;
		}
		if (this.direction.right) {
			new_pos.x++;
		}
		if ((new_pos.x<1) || (new_pos.x>this.map.config.cols)) {
			throw new Error("Penguin on Iceberg: out of map horizontal boundaries");
		}
		if ((new_pos.y<1) || (new_pos.y>this.map.config.rows)) {
			throw new Error("Penguin on Iceberg: out of map vertical boundaries");
		}
		this.move(new_pos);
	}

	clear() {
		this.map.removePenguinFrom(this.pos);
	}

	putAt(pos) {
		this.map.drawPenguinAt(pos);
		this.pos = pos;
	}

	chooseRandomDirection() {
		var rand = Math.ceil(Math.random()*4);
		if (rand==1) {
			this.direction = {up: 1, right: 1, down: 0, left: 0};
		} else if (rand==2) {
			this.direction = {up: 0, right: 1, down: 1, left: 0};
		} else if (rand==3) {
			this.direction = {up: 0, right: 0, down: 1, left: 1};
		} else if (rand==4) {
			this.direction = {up: 1, right: 0, down: 0, left: 1};
		} else {
			throw new Error("Penguin on Iceberg: invalid direction");
		}
	}

	setDirection(new_direction) {
		if (typeof new_direction == "string") {
			this.direction = {up: 0, right: 0, down: 0, left: 0};
			this.direction[new_direction] = 1;
		} else {
			this.direction = new_direction;
		}
	}
}

export default Penguin;