
//creation of cell
function Point (){
    //initial values
    this.is_mine=false;//this cell isn't a mine
    this.mine_around=0;//there are no mines around
    this.is_open=false;//this cell is closed
}
//object game (virtual game)
var game = {
    //initial values
    rows:10,
    columns:10,
    mine_count:10,//amount of mines
    cell_open:0,//amount of open cells
    field:[],
    //filling field
    fill_field:function(){
        //preventing saved values
        this.field=[];
        //
        for(var i =0; i<this.rows; i++) {
            var tmp=[];//creating of the row
            for (var j=0 ; j<this.columns;j++){//filling it with the cells
                tmp.push(new Point());
            }
            this.field.push(tmp);//entering tmp in the field
        }
        //arrangement of mines
        for(var i=0;i<this.mine_count;){
            //randomize position of the mine
            // Math.random() counts only from 0 to 1,
            //that's why we multiplicate it
            var x = parseInt( Math.random() * this.rows);
            var y = parseInt( Math.random() * this.columns);
            if (!(this.field[x][y].is_mine)){
                this.field[x][y].is_mine=true;//place mine
                i++;//count it
            }
        }
    },
    //counting number of mines around the cell
    mine_around_counter:function(x,y){
        //checking the ends of the field (right,left,top,bottom)
        var x_start = x>0?x-1:x;
        var y_start = y>0?y-1:y;
        var x_end = x<this.rows-1?x+1:x;
        var y_end = y<this.columns-1?y+1:y;
        //counter (obviously)
        var count=0;
        for(var i = x_start ; i<=x_end; i++){
            for( var j = y_start; j<=y_end; j++){
                //if this cell is mine and this cell isn't the same
                if(this.field[i][j].is_mine && !(x == i && y == j)){
                    count++
                }
            }
        }
        this.field[x][y].mine_around=count;
    },

    //run through the all field and counting mines around this point
    start_mine_counter:function(){
        for(var i = 0; i<this.rows ; i++){
            for(var j = 0; j<this.columns;j++){
                this.mine_around_counter(i,j);
            }
        }
    },


    //start of our game
    start:function(){
        //rebuilding the field
        this.cell_open=0;
        this.fill_field();
        this.start_mine_counter();
    }
};

//real game
var page = {
    init:function(){
        this.game_interface.init();
    },
    game_interface:{
        table:null,
        init:function(){
            game.start();//generate new field
            this.div = document.querySelector(".field");//get div for conclusion
            this.table_create();//call creation of the table
            var self=this;//save this
            this.div.addEventListener("click",function(event){
                if(event.target.webkitMatchesSelector("td") && !(event.target.webkitMatchesSelector(".lock")))
                    self.open(event)
            });
            this.div.addEventListener("contextmenu",function(event){
                if(event.target.webkitMatchesSelector("td"))
                    self.lock(event)
            });
        },
        table_create:function(){//creation of the table for our game
            this.div.innerHTML="";//cleaning of the field
            this.table= document.createElement("table");
            for (var i = 0; i < game.rows; i++) {
                var tr = document.createElement("tr");
                for (var j = 0; j < game.columns; j++) {
                    var td = document.createElement("td");
                    tr.appendChild(td);
                }
                this.table.appendChild(tr);
            }
            this.div.appendChild(this.table);
        },
        open:function(event){//the handler of click on a cell
            x = event.target.cellIndex;//getting number of the column
            y = event.target.parentNode.rowIndex;//getting number of the row
            this.recurse_open(x,y);//open cells until mine
        },

        recurse_open:function(x,y){//recurse opening of the cells
            var td = this.table.rows[y].children[x];//getting row and column of the current cell
            if(game.field[x][y].is_open) return;//if this cell is already open,then we quit our function
            if (game.field[x][y].is_mine){//if we blew up
                alert("Game over");
                game.start();//start new game
                this.table_create();//create new table
            }else{
                if(td.classList.contains("lock")) return;//if this cell is closed , then exit this function
                //else
                game.field[x][y].is_open=true;//make this cell open
                td.innerHTML = game.field[x][y].mine_around;//write down number of mine around this cell
                td.classList.add("open");///add class "open" to the cell
                game.cell_open++;//inc counter of the open cells
                if(game.rows*game.columns-game.mine_count == game.open_count){//if this is the last not mine cell
                    alert("Victory!");
                    game.start();
                    this.table_create();
                }
                if(game.field[x][y].mine_around==0){//if number of mines around was 0,we'd go further
                    //we'd go through all our cell , seeking for the mines
                    var x_start = x>0?x-1:x;
                    var y_start = y>0?y-1:y;
                    var x_end = x<game.rows-1?x+1:x;
                    var y_end = y<game.columns-1?y+1:y;
                    var count=0;
                    for(var i = x_start ;i<=x_end;i++) {
                        for (var j = y_start; j <= y_end; j++) {
                            this.recurse_open(i,j);//recurse itself
                        }
                    }
                }
            }
        },
        lock:function(event){
            x = event.target.cellIndex;
            y = event.target.parentNode.rowIndex;
            if(game.field[x][y].is_open) return;
            event.target.classList.toggle("lock");
            event.preventDefault();//unlock cell
        }
    }
};

page.init();



