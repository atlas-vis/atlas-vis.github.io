let scn = atlas.scene();
let rect = scn.mark("rect", {top:100, left: 100, width: 16, height: 200, fillColor: "#fff"} );
let dt = await atlas.csv("csv/olympic-medals.csv");

let medals = scn.repeat(rect, dt, {field: "Medal_Type"});
medals.layout = atlas.layout("grid", {numCols: 3, colGap: 1});

let bars = scn.repeat(medals, dt, {field: "Country_Code"});
//todo: handle encoding before 2nd repeat
let htEncoding = scn.encode(rect, {field: "Count", channel: "height"});
scn.encode(rect, {field: "Medal_Type", channel: "fillColor", mapping: {"Gold": "#c9b037", "Silver": "#d7d7d7", "Bronze": "#ad8a56"}});

bars.layout = atlas.layout("grid", {numRows: 5, colGap: 20, rowGap: 15});
bars.layout.colGap = 15;
bars.layout.numCols = 10;

scn.axis("x", "Country_Code", {orientation: "bottom"});
scn.legend("fillColor", "Medal_Type", {x: 800, y: 100});

//TODO: fix bug in following line
//scn.axis("height", "Count", {"orientation": "left", "x-coordinate": 130});