
var game = null;
var refreshIntervalId = null;
Game.prototype.startGame = () => {
    if(game) {return};
    game =  new Game();
    game.render();
}

Game.prototype.restartGame = () => {
    clearInterval(refreshIntervalId);
    game =  new Game();
    game.render();
}
Game.prototype.getCurrentGame = () => {
    return game;
}