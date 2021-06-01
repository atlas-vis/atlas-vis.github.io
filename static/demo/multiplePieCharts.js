let scn = atlas.scene();
let data = atlas.csv("csv/olympic-medals.csv");

let circ = scn.mark("circle", {radius: 100, cx: 300, cy: 200, fillColor: "white", strokeColor: "black"});
let collection = scn.repeat(circ, data, {field: "Medal_Type"})
collection.layout = atlas.layout("grid", {numCols: 3, numRows: 1, hGap: 35});
let pieCharts = scn.divide(circ, data, {field: "Country_Code"});
let anyPie = pieCharts.children[0];
scn.encodeWithinCollection(anyPie, {field: "Country_Code", channel: "fillColor"});
scn.encodeWithinCollection(anyPie, {field: "Count", channel: "angle"});

scn.legend("fillColor", "Country_Code", {x: 70, y: 50});
scn.axis("x", "Medal_Type", {orientation: "bottom", ruleVisible: false, tickVisible: false}) 

let r = atlas.renderer("svg");
r.render(scn, "svgElement", {collectionBounds: false});