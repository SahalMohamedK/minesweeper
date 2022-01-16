var Cell = function(grid, cellElem, x, y,level){
    this.grid = grid;
    this.cellElem = cellElem;
    this.x = x;
    this.y = y;
    this.isRevealed = false;
    this.isBomb = Math.random()*8 <= level;
    this.isFlagged = false;
    var cell = this;
    this.cellElem.onclick = function(){
        cell.onClick()
    };
    this.cellElem.oncontextmenu = function(e){
        e.preventDefault();
        cell.onRightClick()
    };
    cellElem.className  = "cell";
}

Cell.prototype.onRightClick = function(){
    if(this.grid.play && !this.isRevealed){
        var flags = parseInt(this.grid.flagsElem.innerHTML);
        if(!this.isFlagged && flags){
            this.cellElem.classList.add('flagged');
            this.grid.flagsElem.innerHTML = flags-1; 
            this.isFlagged = true;
            return
        }
        if(this.isFlagged){
            this.cellElem.classList.remove('flagged');
            this.grid.flagsElem.innerHTML = flags+1; 
            this.isFlagged = false;
        }
    }
}

Cell.prototype.onClick = function(){
    if(this.grid.play && !this.isRevealed && !this.isFlagged){
        this.isRevealed = true;
        if(this.isBomb){
            this.cellElem.classList.add('bomb');
            this.grid.gameOver()
        }else{
            var results = this.getNeighbourCells();
            var nBombs = results[0];
            var neighbourCells = results[1];
            if(!nBombs){
                nBombs = '';
                for(var i in neighbourCells){
                    var neighbourCell = neighbourCells[i];
                    neighbourCell.onClick();
                }
            }
            this.cellElem.innerHTML = nBombs;
            this.cellElem.classList.add('revealed');
            if(this.grid.isWin()){
                setGameStatus('You are won.','game-win');
                this.grid.play = false;
            }
        }
    }
}

Cell.prototype.getNeighbourCells = function(){
    var neighbourCells = [ ];
    var nBombs = 0;
    for(var x = this.x-1; x<=this.x+1; x++){
        for(var y = this.y-1; y<=this.y+1; y++){
            if(0<=x && x<this.grid.gridSize && 0<=y && y<this.grid.gridSize){
                var neighbourCell = this.grid.grid[x][y];
                if(neighbourCell){
                    if(neighbourCell.isBomb){
                        nBombs ++;
                    }
                    neighbourCells.push(neighbourCell);
                }
            }
        }
    }
    return [nBombs,neighbourCells];
}

var Grid = function(gridElem, gridSize, level, flagsElem){
    this.gridElem = gridElem;
    this.gridSize = gridSize;
    this.level = level;
    this.flagsElem = flagsElem;
    this.grid = [];
    this.flags = 0;
    this.play = false
}

Grid.prototype.isWin = function(){
    for(var x in this.grid){
        for(var y in this.grid[x]){
            if(!this.grid[x][y].isBomb && !this.grid[x][y].isRevealed){
                return false;
            }
        }
    }
    return true;
}


Grid.prototype.gameOver = function(){
    for(var x in this.grid){
        for(var y in this.grid[x]){
            this.grid[x][y].onClick();
        }
    }
    setGameStatus('Game over','game-over')
    this.grid.play = false;
}

Grid.prototype.create = function(){
    setGameStatus('','')
    this.flags = 0;
    this.gridElem.innerHTML = '';
    for(var x  = 0; x < this.gridSize; x++){
        var row = this.gridElem.insertRow();
        var gridRow = [];
        for(var y = 0; y < this.gridSize; y++){
            var cell = new Cell(this,row.insertCell(), x, y,this.level);
            gridRow.push(cell);
            if (cell.isBomb){
                this.flags ++;
            }
        }
        this.grid.push(gridRow);
    }
    this.flagsElem.innerHTML = this.flags;
}

function setGameStatus(msg,className){
    var gameStatus = document.getElementById('gameStatus');
    gameStatus.innerHTML= msg;
    gameStatus.className = className;
}

function play(){
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    var gridSize = document.getElementById('gridSize').value;
    var level = document.getElementById('level').value;

    var gridElem = document.getElementById('grid');
    var flagsElem = document.getElementById('flags');

    var grid = new Grid(gridElem, gridSize, level, flagsElem);
    grid.create();
    grid.play = true;
}

function back(){ 
    document.getElementById('start-menu').style.display = 'block';
    document.getElementById('game').style.display = 'none';
}
