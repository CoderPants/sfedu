

function Point (){
    this.is_mine=false;
    this.mine_around=0;
    this.is_open=false;
}


var game = {
    rows:25,
    columns:25,
    mine_count:50,//amount of mines
    cell_open:0,//amount of open cells
    field:[],
	
	status: 0,//status of our game


    fill_field:function(){
        //preventing saved values
        this.field=[];

        for(var i = 0; i < this.rows; i++) {
            var tmp=[];
            for (var j=0 ; j<this.columns;j++){
                tmp.push(new Point());
            }

            this.field.push(tmp);
        }
        //arrangement of mines
        for(var i=0;i<this.mine_count;){
            var x = parseInt( Math.random() * this.rows);
            var y = parseInt( Math.random() * this.columns);

            if (!(this.field[x][y].is_mine)){
                this.field[x][y].is_mine=true;//place mine
                i++;//count it
            }
        }
    },

    mine_around_counter:function(x,y){
        //checking the ends of the field (right,left,top,bottom)
        var x_start = x>0?x-1:x;
        var y_start = y>0?y-1:y;
        var x_end = x<this.rows-1?x+1:x;
        var y_end = y<this.columns-1?y+1:y;
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


    start_mine_counter:function(){

        for(var i = 0; i<this.rows ; i++){
            for(var j = 0; j<this.columns;j++){
                this.mine_around_counter(i,j);
            }
        }
    },



    start:function(){
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
        menu:null,
        init:function(){
            game.start();//generate new field
            this.div = document.querySelector(".field");
            this.table_create();
            var self=this;//save this

            this.div.addEventListener("click", function(event){
                //if this is "td" and this "td" isn't locked. Btw,webkitMatchesSelector works only in chrome
                if(event.target.webkitMatchesSelector("td") && !(event.target.webkitMatchesSelector(".lock")))
                    self.open(event)
            });

            this.div.addEventListener("contextmenu", function(event){
                //if this is "td"
                if(event.target.webkitMatchesSelector("td"))
                    self.lock(event)
            });
        },

        table_create:function(){
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
        //open popup window
        popup_menu:function(text){
            var menu = document.getElementById("template-popup");
            var menu_block = document.createElement('div');

            menu_block.setAttribute('id', 'popup-div');
            //change text
            menu_block.innerHTML = menu.textContent.replace("{{text}}",text);
            this.div.appendChild(menu_block);
        },

        delete_popup_menu:function() {
            this.div.removeChild(document.getElementById('popup-div'));
            game.start();
            this.table_create();
            game.status = 0;
        },

        recurse_open:function(x,y){
            var td = this.table.rows[y].children[x];//getting row and column of the current cell

            if(game.field[x][y].is_open) return;
			
			if(game.status != 0) return;//make field unclickable

            if (game.field[x][y].is_mine){
                //game over
				game.status = 1;
                this.popup_menu("Game over!");
            }else{
                if(td.classList.contains("lock")) return;

                game.field[x][y].is_open=true;
                td.innerHTML = game.field[x][y].mine_around;
                td.classList.add("open");
                game.cell_open++;

                if(game.rows * game.columns - game.mine_count == game.cell_open){
                    //you win
					game.status = 1;
                    this.popup_menu("Victory!");
                }

                if(game.field[x][y].mine_around==0){
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

        open:function(event){
            x = event.target.cellIndex;
            y = event.target.parentNode.rowIndex;
            this.recurse_open(x,y);
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

//start of the game
page.init();



