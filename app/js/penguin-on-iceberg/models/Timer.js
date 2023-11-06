class Timer {
	constructor(config) {
		this.config = config;
		this.interval = config.interval;
		this.speed_multiplier = config.speed_multiplier;
		this.ticker = null;
		this.stack = [];
		this.delayed_stack = [];
		this.flaqs = {
			isFrozen: false
		};
		this.flaqs_defaults = Object.assign({}, this.flaqs);
	}

	go() {
		this.flaqs.isFrozen = false;
		var context = this;
		this.ticker = setTimeout(function() {
			context.tick();
		}, this.interval);
	}

	freeze() {
		this.flaqs.isFrozen = true;
		clearTimeout(this.ticker);
	}

	rewind() {
		// this.freeze();
		clearTimeout(this.ticker);
		this.go();
	}

	clear() {
		this.freeze();
		this.stack = [];
		this.delayed_stack = [];
		this.flaqs = Object.assign({}, this.flaqs_defaults);
	}

	eachTick(f) {
		// call function every tick
		this.stack.push(f);
	}

	afterTick(x, f) {
		// call function once after some ticks passed
		this.delayed_stack.push({
			delay: x,
			callback: f
		});
	}

	tick() {
		if (this.flaqs.isFrozen) {
			console.log("Timer #"+this.ticker+" is frozen");
			return;
		}

		if (this.stack && this.stack.length) {
			this.stack.forEach(function(f, i) {
				f();
			});
		}

		if (this.delayed_stack && this.delayed_stack.length) {
			this.delayed_stack.forEach((item, i) => {
				this.delayed_stack[i].delay--;
				if (this.delayed_stack[i].delay==0) {
					this.delayed_stack[i].callback();
					delete this.delayed_stack[i];
				} else if (this.delayed_stack[i].delay<0) {
					throw new Error("Penguin on Iceberg: invalid delayed stack delay in timer");
				}
			});
		}

		if (this.flaqs.isFrozen) {
			console.log("Timer #"+this.ticker+" is frozen");
		} else {
			this.rewind();
		}
	}
}

export default Timer;