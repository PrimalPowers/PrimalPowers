// JavaScript source code
const player = {
    tiles: 4,
    grid: [[0, 0], [0, 0]],
    money: 0,
    xp: { cur: 0, next: 34 },
    lvl: 1,
    clicks: { cur: 0, next: 10 },
}

function draw() {
    let table = document.getElementById("main");
    for (let i = 0; i < 6; i++) {
        let row = table.rows[i];
        for (let j = 0; j < 6; j++) {
            let cell = row.cells[j];
            cell.style.visibility = "hidden";
            cell.style.padding = "30px";
            if (checkIndex(player.grid, i) || checkIndex(player.grid[i], j)) continue;
            cell.style.visibility = "visible";
            cell.style.padding = "0px";
            cell.style.backgroundColor = "white";
            let check = player.grid[i][j];
            if (check === 0) cell.innerHTML = "";
            else cell.innerHTML = check;
        }
    }
    
    let bar = document.getElementById("bar");
    bar.style.width = (player.xp.cur / player.xp.next) * 100 + "%";

    let lvl = document.getElementById("lvl");
    lvl.innerHTML = "Lvl " + player.lvl;

    let button = document.getElementById("click");
    button.innerHTML = "<b>Spawn 2<b> (" + player.clicks.cur + "/" + player.clicks.next + ")";
    button.onclick = function () {
        player.clicks.cur++;
        if (player.clicks.cur === player.clicks.next) {
            player.clicks.cur = 0;
            Spawn(2);
        }
        draw();
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

function logic() { }




function checkIndex(arr, id) {
    if (typeof arr[id] === 'undefined') return true
    else return false
}