// JavaScript source code
const player = {
    tiles: 4,
    grid: [[0, 0], [0, 0]],
    money: 0,
    xp: { cur: 0, next: 34 },
    lvl: 1,
    clicks: { cur: 0, next: 10, time:Date.now()},
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
            let check = player.grid[i][j];
            cell.style.visibility = "visible";
            cell.textAlign = "center";
            cell.style.backgroundColor = "white";
            cell.ondragover = function (event) {
                event.preventDefault();
            };
            cell.ondragenter = function (event) {
                cell.style.backgroundColor = "lightgreen";
                if (drag.row === i && drag.col === j || check === 0) return;
                if(drag.val !== check) {
                    cell.style.backgroundColor = "lightcoral";
                    return;
                }
                    var num = check + drag.val;
                    if (num < 128) textbox.innerHTML = num;
                    else textbox.innerHTML = 2 + "<sup style='font-size:0.5em'>" + Math.log2(num) + "</sup>";
                    textbox.style.color = "lightgrey";
            };
            cell.ondragleave = function (event) {
                cell.style.backgroundColor = "white";
                textbox.style.fontSize = "5vw";
                textbox.style.color = "black";
                if (check === 0) {
                    textbox.innerHTML = "";
                    if (player.charge) cell.style.backgroundColor = "darkred";
                } else {
                    textbox.draggable = "true";
                    if (check < 128) textbox.innerHTML = check;
                    else textbox.innerHTML = 2 + "<sup style='font-size:0.5em'>" + Math.log2(check) + "</sup>"
                }
            };
            cell.ondrop = function (event) {
                event.preventDefault();
                draw();
                if (drag.row === i && drag.col === j) return;
                if (check === 0) {
                    player.grid[i][j] = drag.val;
                    player.grid[drag.row][drag.col] = 0;
                } else if (check === drag.val) {
                    player.grid[i][j] += drag.val;
                    if(!player.charge)player.xp.cur += drag.val;
                    player.grid[drag.row][drag.col] = 0;
                }
                textbox.style.color = "black";
                draw();
            };
            textbox.style.fontSize = "5vw";
            textbox.style.color = "black";
            if (check === 0) {
                textbox.innerHTML = "";
                if (player.charge) cell.style.backgroundColor = "darkred";
            } else {
                textbox.draggable = "true";
                if (check < 128) textbox.innerHTML = check;
                else textbox.innerHTML = 2+"<sup style='font-size:0.5em'>"+Math.log2(check)+"</sup>"
                textbox.ondragstart = function (event) {
                    window.drag = { val: check, row: i, col: j }
                    event.dataTransfer.setData("Text", event.target.id);
                    event.dataTransfer.effectAllowed = "move";
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
        count.innerHTML = "Drag a " + Math.pow(2, player.tiles) + " over the button";
        button.onclick = "";
        button.ondragover = function (event) {
            event.preventDefault();
        };
        button.ondrop = function (event) {
            event.preventDefault();
            if (drag.val === Math.pow(2,  player.tiles)) {
                player.charge = false;
                player.grid[drag.row][drag.col] = 0;
            }
            if (player.lvl === 3) startAutoGen();
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
            player.clicks.time = Date.now();
            draw();
        }
        button.ondrop = "";
        button.ondragover = "";
        button.innerHTML = "Generate";
        button.style.backgroundColor = "aqua";
        let ret = player.clicks.cur + "/" + player.clicks.next;
        if (player.lvl >= 3) {
            if(player.clicks.time < Date.now() - 10000)ret = ret + "<br>AutoGen: 1/sec";
            else ret = ret + "<br>AutoGen: off";
        }
        count.innerHTML = ret;
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
    player.xp.next = player.xp.next + Math.pow(2, player.tiles) * player.tiles;
    player.lvl++;
    newTile();
    Spawn(2);
    draw();
}

function startAutoGen() {
    function generate() {
        if (player.clicks.time < Date.now() - 10000) {
            player.clicks.cur++;
            if (player.clicks.cur === player.clicks.next) {
                player.clicks.cur = 0;
                Spawn(2);
                if (player.xp.cur === player.xp.next) LvlUp();
            }
            draw();
        }
        setTimeout(generate, 1000);
    }
    setTimeout(generate,1000)
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