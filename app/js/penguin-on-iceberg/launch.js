import Game from "./models/Game.js";
import config from "./config/game.js";

var game = new Game(config);
game.launch();