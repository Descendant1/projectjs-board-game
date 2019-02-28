
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
        if( ! target instanceof  Actor || target._isDead)
        {
            alert('error')    
            return;
        }
        var res =  throwDice();
        var points  = this._attack - target._armor;
        if(res == 3 )
        {
            points =  (points)/2;   
            target._health -= points;
        }
        else if ( res  == target._health )
        {
            points = 0;
        }
        else 
        {
            target._health -= points;
        }
        if( target._health < 1  )
        {
            target._isDead = true;
            target._available =  false;
            console.log(target._type + ' is dead!');
        }
        game.getCurrentPlayer().updatePoints( points );
    }
    
    createSpan()
    {
        var span = document.createElement('span');
        span.id =  this._id;
        span.innerText =  this._type + ' ' + this._health + ' health';
        span.style.display = 'block';
        span.style.backgroundColor = 'aquamarine';
        span.style.padding = '5px';
        span.style.textAlign = 'center';
        span.style.border='1px solid black';
        span.onclick = () => {
           // alert(`was selected ${this._type + '' + this._id}`)
            game._selectedActor =  this;
        }
        return span;
    }
    getTextHolder()
    {
        this._textHolder.innerText = this._type + ' ' + this._health + ' health';
        return this._textHolder;
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
                                new Elf(plNum+1),    
                                new Elf(plNum+2),
                                new Dwarf(plNum+3),   new Dwarf(plNum+4),
                                new Knight(plNum+5),  new Knight(plNum+6)
                            ];  
        this._currentPoints = 100; //getRandomNext(100,200);

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
        this._currentPlayer =  this._firstPlayer;
        this._selectedActor =  null;
        this._board         =  new Board('canvas','2d');
        this._scoresBoard   =  document.getElementById('pScores');
        this._currentActorTextHolder  =  document.getElementById('CurrentActor');
        this._currentPlayerTextHolder =  document.getElementById('CurrentPlayer');
        this._gameStarted   =  false;
    }
    getFirstPlayer () { return this._firstPlayer }
    getSecondPlayer() { return this._secondPlayer }
    getCurrentPlayer()
    {
        return this._currentPlayer;
    }

    render()
    {
        refreshIntervalId = setInterval(()=>{
            
            this.getCurrentPlayer()._pointsTextHolder.innerText       =  `${this.getCurrentPlayer()._playerName} current points = ${this.getCurrentPlayer()._currentPoints}`;
            Array.from(document.querySelectorAll('div#pActors span')).map(i=>i.remove())
            this.getCurrentPlayer().getActors(i=>!i._isDead && i._available ).map(i=> this.getCurrentPlayer()._availActorsTextHolder.appendChild(i.getTextHolder())) ;
            this._scoresBoard.innerHTML = `${this.getFirstPlayer()._playerName} score is ${this.getFirstPlayer()._currentPoints } &nbsp; ${this.getSecondPlayer()._playerName} score is ${this.getSecondPlayer()._currentPoints }`;
            this._currentActorTextHolder.innerText = this._selectedActor? 'Current actor: '+ this._selectedActor._type : ''; 
            this._currentPlayerTextHolder.innerText =  `${this._currentPlayer._playerName} turn`;
            this._board.reInit();
        },300)
    }
    cleareCanvas()
    {
        this._board._context.clearRect(0,0, this._board._canvas.width,this._board._canvas.height);
        this._board._cells = [];
    }
    switchActor()
    {
        if(this._currentPlayer === this._firstPlayer)
        { this._currentPlayer =  this._secondPlayer }
        else
        { this._currentPlayer =  this._firstPlayer }
    }
}



class Board 
{
    constructor(canvasId, dimension)
    {
        this._boardWidth        = 900;
        this._boardHeight       = 700;
        this._boardWidthSize    = 9;
        this._boardHeightSize   = 7;
        this._totalBoardCells   = this._boardWidthSize * this._boardHeightSize; 
        this._canvas            = document.getElementById(canvasId);
            this._canvas.width      = this._boardWidth;
            this._canvas.height     = this._boardHeight;
            this._canvas.onclick    = (e) => 
                                            {
                                                var rect = this.collides( e.offsetX, e.offsetY);              
                                                if(!game._gameStarted)                                      
                                                { 
                                                    if(game._selectedActor != null && rect._currentActor == null )
                                                    {
                                                        console.log('ji')
                                                        if( rect._positionInheritance === 'battleField' )  { return; }
                                                        if( rect._positionInheritance !=  game.getCurrentPlayer()._playerName ) { return; }
                                                        if( rect) 
                                                        {
                                                            rect._currentActor  =  game._selectedActor;
                                                            game._selectedActor._available =  false;
                                                            game._selectedActor = null;
                                                            game.switchActor();
                                                            if ( game.getFirstPlayer()._gameActors.filter(i=>i._available == true).length == 0 &&
                                                                game.getSecondPlayer()._gameActors.filter(i=>i._available== true).length == 0 )
                                                            {
                                                                alert('GameStarted');
                                                                game._gameStarted =  true;
                                                            }
                                                        } 
                                                        else { return; }
                                                    }  
                                                }
                                                else{
                                                    game._selectedActor =  rect._positionInheritance == game.getCurrentPlayer()._playerName ? rect._currentActor : alert('it is not yours');
                                                    console.log(game._selectedActor);

                                                }
                                            }        
        this._context           = this._canvas.getContext(dimension);
        this._cells             = [];
        this.initializeBoard()
    }
    reInit()
    {
        let i, x, y = -1;
        for (i = 0; i <  this._totalBoardCells; i++) {
          x++;
          if (i % this._boardWidthSize == 0) {
            y++; 
            x = 0;
          }     
          let tempCell =  this._cells[i];
          tempCell.drawRectangleCell(this._context,x,y) ;
        } 
    }
    initializeBoard () 
    {
        let squareWidth = this._boardWidth / this._boardWidthSize;
        let i, x, y = -1;
        let battleField = null;
                
        for (i = 0; i <  this._totalBoardCells; i++) {
          x++;
          if (i % this._boardWidthSize == 0) {
            y++; 

            x = 0;
          }     
          if(y>=2 && y <=4)
            battleField =  'battleField';
          else if( y >= 0 && y <=1 )
            battleField = 'Player1';
          else if (y >= 5 && y<=6)
            battleField = 'Player2';
          let tempCell =  new Cell(x * squareWidth, y * squareWidth, squareWidth, this._boardHeight / this._boardHeightSize, battleField);
          battleField = null;
          this.push(tempCell) ? tempCell.drawRectangleCell(this._context,x,y) : alert('error');
        }
    }
    push(tempCell)
    {
       if( ! tempCell instanceof  Cell) { return false; }
       this._cells.push(tempCell);
       return true;
    }
    collides(x, y) 
    {
            var isCollision = false;
            for (var i = 0 ; i < this._cells.length; i++) {
                let left = this._cells[i]._x , 
                    right  = this._cells[i]._x + this._cells[i]._width;

                let top =  this._cells[i]._y , 
                    bottom = this._cells[i]._y + this._cells[i]._height;
                if ( right >= x && left <= x
                     && bottom >= y && top <= y) 
                {
                    isCollision = this._cells[i];
                }
            }
            return isCollision;
    }
}


class Cell 
{
    constructor(x,y,width,height, inh)
    {
        this._id =  getRandomNext(1,100000)- (width - x) ;
        this._status = '';
        this._positionInheritance =  inh? inh : null;
        this._currentActor  = null;
        this._x         = x;
        this._y         = y;
        this._width     =  width;
        this._height    =  height;
        this.options            = {
            light: '#d1eefc',
            dark : '#1f1f21'
            }   
    }

    drawRectangleCell(ctx,x,y){
        ctx.beginPath();
        ctx.rect(this._x, this._y, this._width, this._height);
        ctx.font="20px Georgia";
        if(this._positionInheritance === 'battleField' )
        {
            ctx.fillStyle = (x + y) % 2 ?  '#0015ff':'#ff0000';
        }
        else
        {

            ctx.fillStyle = (x + y) % 2 ? this.options.dark : this.options.light; 
        }
        ctx.fill();
        console.log()
        ctx.lineWidth =  0.1;
        ctx.stroke();
        if(this._currentActor)
        {
            ctx.fillStyle = '#ff0000';
            ctx.font = '22px Courier';
            ctx.fillText( this._currentActor._type, this._x + 5 , this._y +(this._height/2)  )
            
            ctx.lineWidth = 7;
        }
    }

}
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