Rubikjs.Core.Logger.addListener(function(who, text) {console.log(who + ": " + text);}, "info", "info");
Rubikjs.Core.Logger.addListener(function(who, text) {console.warn(who + ": " + text);}, "warn", "warn");
Rubikjs.Core.Logger.addListener(function(who, text) {console.error(who + ": " + text);}, "error", "error");

var rendermgr = null;
var cube = null;
var options = {};
var optionsBackStickers = {
    backStickerEnabled: true,
};
var backgroundColor = "#A0A0A0";
var rendererName = "WebGL";

function doOll(name, auf) {
    var el = document.getElementById("solution");
    el.innerHTML = lastPll;
    ollAlg = ollData.find(item => item[0] === name)[1]
    doMoves(ollAlg)
    // doMoves(auf + " " + ollAlg)
}

function doMoves(moves) {
    console.log("doMoves: " + moves);
    cube.sendMultipleInstructions(cube.notation.parse(moves));
}

function rand(n) {
    return Math.floor(Math.random()*n);
}

var pllsData  = [
    ["H", "M2' U M2' U2 M2' U M2'", 1],
    ["Ua", "R2 U' R' U' R U R U R U' R", 4],
    ["Ub", "R' U R' U' R' U' R' U R U R2", 4],
    ["Z", "M2 U M2 U M' U2 M2 U2 M' U2", 2],
    ["Aa", "x' R' D R' U2 R D' R' U2 R2 x", 4],
    ["Ab", "x' R2 U2 R D R' U2 R D' R x", 4],
    ["E", "x' R U' R' D R U R' D' R U R' D R U' R' D' x", 2],
    ["F", "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", 4],
    ["Ga", "R2 U R' U R' U' R U' R2 U' D R' U R D'", 4],
    ["Gb", "R' U' R D' U R2 U R' U R U' R U' R2 D", 4],
    ["Gc", "R2' F2 R U2 R U2' R' F R U R' U' R' F R2", 4],
    ["Gd", "R U R' D U' R2 U' R U' R' U R' U R2 D'", 4],
    ["Ja", "x U2 r' U' r U2 l' U R' U' l2", 4],
    ["Jb", "R U R' F' R U R' U' R' F R2 U' R' U'", 4],
    ["Na", "z U R' D R2 U' R D' U R' D R2 U' R D' z'", 1],
    ["Nb", "z U' R D' R2' U R' D U' R D' R2' U R' D z'", 1],
    ["Ra", "R U R' F' R U2 R' U2 R' F R U R U2 R' U'", 4],
    ["Rb", "R' U2 R U2 R' F R U R' U' R' F' R2 U'", 4],
    ["T", "R U R' U' R' F R2 U' R' U' R U R' F'", 4],
    ["V", "z D' R2 D R2 U R' D' R U' R U R' D R U' z'", 4],
    ["Y", "F R' F R2 U' R' U' R U R' F' R U R' U' F'", 4],
];

var ollData  = [
    ["OLL Sune", "R U R' U R U2 R'", 1],
    ["OLL Anti-sune", "R U2 R' U' R U' R'", 1],
];

var plls = [];

for(var i = 0; i < pllsData.length; ++i) {
    for(var j = 0; j < pllsData[i][2]; ++j) {
        for(var k = 0; k < ollData.length; ++k) {
            plls.push([pllsData[i][0], pllsData[i][1], ollData[k][0], ollData[k][1]]);
        }
    }
}

var lastPll = "";
var lastMoves = "";
var isCN = false;
var setupMoves = "x2";

function newPll() {
    var pll = plls[rand(plls.length)];
    lastPll = pll[2];
    if(isCN) {
        lastMoves = "x" + rand(4) + " y" + rand(4) + " z" + rand(4);
    } else {
        lastMoves = setupMoves + " y" + rand(4);
    }
    lastMoves +=  " U" + rand(4) + " (" + pll[1] + ")' U" + rand(4);

    var ollAuf = "U" + rand(4);
    lastMoves +=  " (" + pll[3] + ")' " + ollAuf;

    var ollAufPretty
    switch (ollAuf) {
        case 'U0':
            ollAufPretty = "&nbsp;-";
            break;
        case 'U1':
            ollAufPretty = "<-";
            break;
        case 'U2':
            ollAufPretty = "U2";
            break;
        case 'U3':
            ollAufPretty = "->";
            break;
    }

    lastPll = ollAufPretty + " " + pll[2]

    console.log("lastMoves: " + lastMoves);
    doMoves(lastMoves);
}

function restart(opt) {
    opt = opt || options;
    //Reset the context...
    var canvas = document.getElementById("cube");
    var parentNode = canvas.parentNode;
    parentNode.removeChild(canvas);
    canvas = document.createElement("canvas");
    canvas.setAttribute("width", "330");
    canvas.setAttribute("height", "330");
    canvas.style.background = backgroundColor;
    canvas.setAttribute("id", "cube");
    parentNode.appendChild(canvas);
    rendermgr = new Rubikjs.Render.RenderManager(Rubikjs.Render[rendererName].Renderer);
    cube = new Rubikjs.Puzzle.ClassicRubiksCube(rendermgr, opt);
}

function changeRenderer(name) {
    rendererName = name;
    restart();
}

function updateCN() {
    isCN = document.getElementById("cn").checked;
    document.getElementById("setup").disabled = isCN;
    setupMoves = document.getElementById("setup").value;
}

window.onkeydown = function(event) {
    if(event.key === " " || event.key === "6") {
        var el = document.getElementById("solution");
//        if(el.innerHTML == "&nbsp;") {
//            restart(optionsBackStickers);
//            doMoves(lastMoves);
//            el.innerHTML = lastPll;
//        } else {
            el.innerHTML = "&nbsp;";
            restart(options);
            newPll();
//        }
        return false;
    } else if(event.key === "Enter") {
        var el = document.getElementById("solution");
        restart(optionsBackStickers);
        doMoves(lastMoves);
        el.innerHTML = lastPll;
        return false;
//    } else if(event.key === "f") {
//        doMoves("F");

    } else if(event.key === "c") {
        doMoves("f R U R' U' f'")
        return false;
//    } else if(event.key === "z") {
//        doMoves("F R U R' U' F'")
//        return false;
    } else if(event.key === "v") {
        doOll("OLL Sune","")
        return false;
    } else if(event.key === "z") {
        doOll("OLL Anti-sune","")
        return false;
    } else if(event.keyCode == 39 || event.key === "r") {
        // lastMoves += " y";
        doMoves("U");
        return false;
    } else if(event.keyCode == 37 || event.key === "q") {
        // lastMoves += " y'";
        doMoves("U'");
        return false;
    } else if(event.key === "Enter") {

    }
};

window.onload = restart;

