'use strict'

//creation of the table
function tableCreate() {

    //get number of columns & rows
    var columns = prompt("Введите количество строк", "");
    var rows = prompt("Введите количество столбцов", "");

    //make them int
    columns = parseInt(columns);
    rows = parseInt(rows);

    //body reference
    var body = document.getElementsByTagName("body")[0];

    // create elements <table>
    var table= document.createElement("table");

    //change color of cell by click
    table.setAttribute('onclick', 'SwapColor(event.target)');

    // cells creation
    for (var i = 0; i < rows; i++) {

        // table row creation
        var row = document.createElement("tr");

        for (var j = 0; j < columns; j++) {

            // create element <td> and text node
            var cell = document.createElement("td");

            //add class 'white' to cell
            cell.classList.add("white")

            // put <td> at end of the table row
            row.appendChild(cell);
        }

        //row added to end of table body
        table.appendChild(row);
    }
    // put <table> in the <body>
    body.appendChild(table);

}

//Swap color of one cell
function SwapColor (cell)
{
    cell.className = (cell.className == 'white') ? 'black' : 'white';
}


//change colors of all cells
function ChangeColors()
{
    //get our table
    var table = document.getElementsByTagName('table')[0];
    //change colors of all cells
    table.classList.toggle('inverse');
}

//creation of our table
tableCreate();