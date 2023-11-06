class UI {
	updateScore(score) {
		document.getElementById('gameGaugeScore').innerText = score;
	}

	updateSpeed(speed) {
		document.getElementById('gameGaugeSpeed').innerText = speed;
	}

	updateHiscore(hiscore) {
		document.getElementById('gameGaugeHiscore').innerText = hiscore;
	}

	updateStatus(state) {
		var p_info = document.getElementById('gameInfo');
		if (state=="over") {
			p_info.innerText = "GAME OVER";
		} else if (state=="pending") {
			p_info.innerText = "Press Enter to start the game";
		} else if (state=="running") {
			p_info.innerText = "Press Space to pause/resume the game";
		} else if (state=="paused") {
			p_info.innerText = "Pause. Press Space to resume";
		}
	}
}

export default new UI;