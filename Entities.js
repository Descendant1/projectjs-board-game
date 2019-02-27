class Actor {

    constructor(id,type, attack, armor, health, attackSquares, speed)
    {
        this._id             =   id;
        this._type           =   type;
        this._attack         =   attack; 
        this._armor          =   armor; 
        this._health         =   health; 
        this._attackSquares  =   attackSquares; 
        this._speed          =   speed;
        this._available      =   true;
        this._isDead         =   false;    
        this._textHolder     =   this.createSpan();    
    }
    
    attack(target)
    {
        if( ! target instanceof  Actor )
            console.log('error')

        console.log(this)
        console.log('attacked ')
        console.log(target)
        
    }
    createSpan()
    {
        var span = document.createElement('span');
        span.id =  this._id;
        span.innerText =  this._type;
        span.style.display = 'block';
        span.style.backgroundColor = 'aquamarine';
        span.style.padding = '5px';
        span.style.textAlign = 'center';
        span.style.border='1px solid black';
        span.onclick = () => {
            alert(`was selected ${this._type + '' + this._id}`)
            game._selectedActor =  this;
        }
        return span;
    }
}

class Elf extends Actor
{
    constructor(id)
    {
        super(id,'Elf',5,1,10,1,1);
    }
}
class Dwarf  extends Actor
{
    constructor(id)
    {
        super(id,'Dwarf',6,2,12,2,2);
    }
}
class Knight extends Actor
{
    constructor(id)
    {
        super(id,'Knight',8,3,15,1,1);
    }
}

class Player 
{
    constructor(plNum, plName)
    {
        this._playerNumber =  plNum;
        this._playerName =  plName
        this._gameActors =  
                            [ 
                                new Elf(plNum+1),     new Elf(plNum+2),
                                new Dwarf(plNum+3),   new Dwarf(plNum+4),
                                new Knight(plNum+5),  new Knight(plNum+6)
                            ];  
        this._currentPoints = getRandomNext(100,200);

        this._pointsTextHolder =  document.getElementById('pPoints');
        this._availActorsTextHolder =  document.getElementById('pActors');
    }
    getActors(func)
    {
        return this._gameActors.filter(func);
    }
    updatePoints( number )
    {
        if(typeof number === 'string')
            return;
        this._currentPoints += number;
    }
    

}

class Game 
{
    constructor()
    {
        this._firstPlayer   =  new Player(1,'Player1')
        this._secondPlayer  =  new Player(2,'Player2')
        this._currentPlayer = this._firstPlayer;
        this._selectedActor     = null;
        this._board =  new Board('canvas','2d');

    }
    getFirstPlayer () { return this._firstPlayer }
    getSecondPlayer() { return this._secondPlayer }
    getCurrentPlayer()
    {
        return this._currentPlayer;
    }

    render()
    {
        setInterval(()=>{
            
            this.getCurrentPlayer()._pointsTextHolder.innerText       =  `${this.getCurrentPlayer()._playerName} current points = ${this.getCurrentPlayer()._currentPoints}`;
        //  this.getCurrentPlayer().getActors(i=>!i._isDead).map(i=> this.getCurrentPlayer()._availActorsTextHolder.appendChild(i._textHolder)) ;
            
        },500)
        this.getCurrentPlayer().getActors(i=>!i._isDead).map(i=> this.getCurrentPlayer()._availActorsTextHolder.appendChild(i._textHolder)) ;

    }
}



class Board 
{
    constructor(canvasId, dimension)
    {
        this._boardWidth        = 9;
        this._boardHeight       = 7;
        this._totalBoardCells   = this._boardHeight * this._boardWidth; 
        this._canvas            = document.getElementById(canvasId);
        this._context           = this._canvas.getContext(dimension);
        this._cells             = [];
        this.init();
    }
    init()
    {
        this.initializeBoard()
    }
    initializeBoard () 
    {
        this.fillCells();
    }
    fillCells()
    {

    }
    
}


class Cell 
{
    constructor()
    {
        this._id = 1 + this._x * 1 + this._y
        this._status = '';
        this._positionInheritence =  '';
        this._currentActor  = null;
        this._x = x;
        this._y = y;

    }
}

const game =  new Game();
game.render();
var p1 = game.getFirstPlayer();
var p2 =  game.getSecondPlayer();