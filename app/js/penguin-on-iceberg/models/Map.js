import Utils from "./Utils.js";

class Map {
	constructor(config) {
		this.config = config;
		this.canvas = document.getElementById(this.config.map_target_id);
	}

	draw() {
		this.adjustCanvas();
		this.fillGrid();
	}

	adjustCanvas() {
		var width = this.config.cols*this.config.cell_size;
		this.canvas.style.width = width+"px";
		var height = this.config.rows*this.config.cell_size;
		this.canvas.style.height = height+"px";

		this.ice_cols = Math.floor(this.config.cols*0.7);
		this.ice_rows = Math.floor(this.config.rows*0.7);
		if ((this.ice_cols<7) || (this.ice_rows<7)) {
			throw new Error("Penguin on Iceberg: map is too small ["+this.ice_cols+"x"+this.ice_rows+"]");
		}
		this.sea_cols_left = Math.floor((this.config.cols-this.ice_cols)/2);
		this.sea_cols_right = this.config.cols-this.sea_cols_left-this.ice_cols;
		this.sea_rows_top = Math.floor((this.config.rows-this.ice_rows)/2);
		this.sea_rows_bottom = this.config.rows-this.sea_rows_top-this.ice_rows;
	}

	getCell(col, row, type="sea") {
		return "<div class=\"penguee-cell penguee-cell-"+type+"\" data-col=\""+col+"\" data-row=\""+row+"\" data-type=\""+type+"\" style=\"width: "+this.config.cell_size+"px; height: "+this.config.cell_size+"px;\"></div>";
	}

	getCells(x, row=1, type="sea", offset=0) {
		var context = this;
		var cells = "";
		Utils.repeat(x, function(i) {
			cells+=context.getCell((i+offset), row, type);
		});
		return cells;
	}

	fillGrid() {
		var context = this;
		var html = "";
		Utils.repeat(this.config.rows, function(i) {
			var row = "";
			if ((i>context.sea_rows_top) && (i<=(context.sea_rows_top+context.ice_rows))) {
				row+=context.getCells(context.sea_cols_left, i);
				row+=context.getCells(context.ice_cols, i, "ice", context.sea_cols_left);
				row+=context.getCells(context.sea_cols_right, i, "sea", context.sea_cols_left+context.ice_cols);
			} else {
				row+=context.getCells(context.config.cols, i);
			}
			html+=row;
		});
		this.canvas.innerHTML = html;
	}

	drawPenguinAt(pos) {
		var top = (pos.y-1)*this.config.cell_size;
		var left = (pos.x-1)*this.config.cell_size;
		var html = "<div class=\"penguee-n\" style=\"width: "+this.config.cell_size+"px; height: "+this.config.cell_size+"px; top: "+top+"px; left: "+left+"px; font-size: "+this.config.cell_size+"px; line-height: "+this.config.cell_size+"px;\">🐧</div>";
		this.canvas.insertAdjacentHTML("beforeend", html);
	}

	removePenguinFrom(pos) {
		var div = document.querySelector('.penguee-n');
		if (div) {
			div.parentNode.removeChild(div);
		}
	}

	clear() {
		this.canvas.innerHTML = "";
	}

	getCenter() {
		var pos = {x: 1, y: 1};
		pos.x = this.sea_cols_left+((this.ice_cols%2)? Math.ceil(this.ice_cols/2): (this.ice_cols/2));
		pos.y = this.sea_rows_top+((this.ice_rows%2)? Math.ceil(this.ice_rows/2): (this.ice_rows/2));
		return pos;
	}

	checkTerrainAtPos(pos) {
		var terrain = document.querySelector('[data-row="'+pos.y+'"][data-col="'+pos.x+'"]');
		if (terrain) {
			return terrain.dataset.type;
		}
		return null;
	}
}

export default Map;