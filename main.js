// JavaScript source code
const player = {
    tiles: 4,
    grid: [[0, 0], [0, 0]],
    money: 0,
    xp: { cur: 0, next: 34 },
    lvl: 1,
    clicks: { cur: 0, next: 10 },
    charge: false,
}

function draw() {
    let table = document.getElementById("main");
    for (let i = 0; i < 6; i++) {
        let row = table.rows[(i+2) % 6];
        for (let j = 0; j < 6; j++) {
            let cell = row.cells[(j+2) % 6];
            let textbox = cell.childNodes[0];
            cell.style.visibility = "hidden";
            if (checkIndex(player.grid, i) || checkIndex(player.grid[i], j)) continue;
            cell.style.visibility = "visible";
            cell.textAlign = "center";
            cell.style.backgroundColor = "white";
            cell.ondragover = function (event) {
                event.preventDefault();
            };
            cell.ondrop = function (event) {
                event.preventDefault();
                if (drag.row === i && drag.col === j) return;
                if (player.grid[i][j] === 0) {
                    player.grid[i][j] = drag.val;
                    player.grid[drag.row][drag.col] = 0;
                } else if (player.grid[i][j] === drag.val) {
                    player.grid[i][j] += drag.val;
                    if(!player.charge)player.xp.cur += drag.val;
                    player.grid[drag.row][drag.col] = 0;
                }
                draw();
            };
            let check = player.grid[i][j];
            textbox.style.fontSize = "5vw";
            if (check === 0) {
                textbox.innerHTML = "";
                if (player.charge) cell.style.backgroundColor = "darkred";
            } else {
                textbox.draggable = "true";
                textbox.innerHTML = "<div class='content'>" + check + "</div>"
                textbox.ondragstart = function (event) {
                    window.drag = { val: check, row: i, col: j }
                    event.dataTransfer.setData("Text", event.target.id);
                }
            }
        }
    }
    
    let bar = document.getElementById("bar");
    bar.style.width = (player.xp.cur / player.xp.next) * 100 + "%";

    let lvl = document.getElementById("lvl");
    lvl.innerHTML = "Lvl " + player.lvl;

    let button = document.getElementById("click");
    let count = document.getElementById("clickcnt");
    if (player.charge) {
        button.style.backgroundColor = "darkslateblue";
        button.innerHTML = "No Power";
        count.innerHTML = "Acquire a " + Math.pow(2, player.tiles);
        button.onclick = "";
        button.ondragover = function (event) {
            event.preventDefault();
        };
        button.ondrop = function (event) {
            event.preventDefault();
            if (drag.val === 2 ^ player.tiles) {
                player.charge = false;
                player.grid[drag.row][drag.col] = 0;
            }
            draw();
        };
    } else {
        button.onclick = function () {
            player.clicks.cur++;
            if (player.clicks.cur === player.clicks.next) {
                player.clicks.cur = 0;
                Spawn(2);
                if (player.xp.cur === player.xp.next) LvlUp();
            }
            draw();
        }
        button.ondrop = "";
        button.ondragover = "";
        button.innerHTML = "Generate";
        button.style.backgroundColor = "aqua";
        count.innerHTML = player.clicks.cur + "/" + player.clicks.next;
    }
}

function Spawn(num) {
    if (num === undefined) num = 2;
    for (let i = 0; i < player.grid.length; i++) {
        for (let j = 0; j < player.grid.length; j++) {
            if (player.grid[i][j] === 0) {
                player.grid[i][j] = num;
                draw()
                return;
            }
        }
    }
}

function LvlUp() {
    player.charge = true;
    player.xp.cur = 0;
    player.xp.next = player.xp.next + 2 ^ (player.tiles) * (player.tiles);
    player.lvl++;
    newTile();
    Spawn(2);
    draw();
}

function newTile() {
    let prevsq = Math.pow(Math.floor(Math.sqrt(player.tiles)),2);
    if (Math.sqrt(player.tiles) === Math.round(Math.sqrt(player.tiles))) player.grid.push([0]);
    else if (player.tiles - prevsq >= Math.ceil(Math.sqrt(player.tiles))) player.grid[player.tiles - prevsq - Math.ceil(Math.sqrt(player.tiles))].push(0);
        else player.grid[Math.floor(Math.sqrt(player.tiles))].push(0);
    player.tiles++;
    draw();
}
//[Math.round(tiles / Math.floor(Math.sqrt(tiles)))]
function checkIndex(arr, id) {
    if (typeof arr[id] === 'undefined') return true
    else return false
}


function move(num, row, col) {
    window.drag
    let elem = document.getElementsByClassName("drag")[0];
    elem.style.visibility = "visible";
    elem.innerHTML = num;
    document.getElementById("playarea").onmousemove = function (event) {
        elem.style.top = "calc(" + event.clientY + "px - 2.5%)";
        elem.style.left = "calc(" + event.clientX + "px - 2.5%)";
    };
    document.getElementById("playarea").ondrop = function () {
        console.log("Yes")
        player.grid[row][col] = num;
        elem.style.visibility = "hidden";
        document.getElementById("playarea").onclick = "";
        document.getElementById("playarea").onmousemove = "";
        draw();
    };
}