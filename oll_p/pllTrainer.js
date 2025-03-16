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

function doOll(name) {
     var el = document.getElementById("solution");
     el.innerHTML = lastPll;
     ollAlg = ollData.find(item => item[1].startsWith(name))[2]
     doMoves(ollAlg)
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
    ["Runway", "OLL 1 Runway", "R U2 R2 F R F' U2 R' F R F'"],
    ["Runway", "OLL 2 Zamboni", "f U R U' R' S' U R U' R' F'"],
    ["Nazi", "OLL 3 Nazi F", "R' F2 R2 U2 R' F R U2 R2 F2 R"],
    ["Nazi", "OLL 4 Nazi F'", "R' F2 R2 U2 R' F' R U2 R2 F2 R"],

    ["P", "OLL 31 Couch R' U' F", "R' U' F U R U' R' F' R"],
    ["P", "OLL 32 Couch S sexy", "S R U R' U' R' F R f'"],
    ["P", "OLL 43 P R' U' F'", "R' U' F' U F R"],
    ["P", "OLL 44 F usexy", "F U R U' R' F'"],

    ["Fish", "OLL 37 Fish Hedge", "F R' F' R U R U' R'"],
    ["Fish", "OLL 35 Fish Sledge", "R U2 R2' F R F' R U2 R'"],
    ["Fish_Kite", "OLL 9 Kite sexy sledge", "R U R' U' R' F R2 U R' U' F'"],
    ["Fish_Kite", "OLL 10 Kite RUR'U sledge", "R U R' U R' F R F' R U2 R'"],

    ["C", "OLL 46 C Easy", "R' U' R' F R F' U R"],
    ["C", "OLL 34 C Hard", "R U R2 U' R' F R U R U' F'"],
    ["W", "OLL 36 W Left", "L' U' L U' L' U L U L F' L' F"],
    ["W", "OLL 38 W Right", "R U R' U R U' R' U' R' F R F'"],
];

var ollVisibility  = {
    "Runway": false,
    "Nazi": false,
    "P": false,
    "C": true,
    "W": true,
    "Fish": true,
    "Fish_Kite": true,
};

var plls = [];

function toggleOllVisibility(ollName, isChecked) {
    ollVisibility[ollName] = isChecked;

    if (ollName === "Nazi" || ollName === "Runway") {
        ollName = "Nazi"
        isChecked = ollVisibility.Runway || ollVisibility.Nazi
    }
    if (ollName === "Fish" || ollName === "Fish_Kite") {
        ollName = "Fish"
        isChecked = ollVisibility.Fish || ollVisibility.Fish_Kite
    }
    if (ollName === "C" || ollName === "W") {
        ollName = "C"
        isChecked = ollVisibility.C || ollVisibility.W
    }

    const element = document.getElementById(ollName);
    if (element) {
        element.style.display = isChecked ? "flex" : "none";
    }
    updateOllAlgPool()
}

function initializeCheckboxesAndButtons() {
    for (const ollName in ollVisibility) {
        toggleOllVisibility(ollName,ollVisibility[ollName]);

        const checkbox = document.getElementById(ollName + "_check");
        if (checkbox) {
            checkbox.checked = ollVisibility[ollName];
        }
    }
}

function updateOllAlgPool() {
    plls = [];
    for(var i = 0; i < pllsData.length; ++i) {
        for(var j = 0; j < pllsData[i][2]; ++j) {
            for(var k = 0; k < ollData.length; ++k) {
                if (ollVisibility[ollData[k][0]]) {
                    plls.push([pllsData[i][0], pllsData[i][1], ollData[k][1], ollData[k][2]]);
                }
            }
        }
    }
}

updateOllAlgPool()

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

    // lastPll = ollAufPretty + " " + pll[2]

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
    canvas.setAttribute("height", "250");
    canvas.style.background = backgroundColor;
    canvas.setAttribute("id", "cube");
    parentNode.appendChild(canvas);
    rendermgr = new Rubikjs.Render.RenderManager(Rubikjs.Render[rendererName].Renderer);
    cube = new Rubikjs.Puzzle.ClassicRubiksCube(rendermgr, opt);

    initializeCheckboxesAndButtons();
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

function next() {
    var el = document.getElementById("solution");
    el.innerHTML = "&nbsp;";
    restart(options);
    newPll();
}

function repeat() {
    var el = document.getElementById("solution");
    restart(optionsBackStickers);
    doMoves(lastMoves);
    el.innerHTML = lastPll;
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
        doOll("OLL 43","")
        return false;
//    } else if(event.key === "z") {
//        doMoves("F R U R' U' F'")
//        return false;
    } else if(event.key === "v") {
        doOll("OLL 44","")
        return false;
    } else if(event.key === "x") {
        doOll("OLL 31","")
        return false;
    } else if(event.key === "z") {
        doOll("OLL 32","")
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

