let scn = atlas.scene();
let dt = await atlas.csv("csv/Revenue.csv");

let rect1 = scn.mark("rect", {top: 110, left: 200, width: 600, height: 40, fillColor: "#eee", strokeWidth: 0})
let rect2 = scn.mark("rect", {top: 110, left: 200, width: 580, height: 40, fillColor: "#ddd", strokeWidth: 0})
let rect3 = scn.mark("rect", {top: 110, left: 200, width: 560, height: 40, fillColor: "#ccc", strokeWidth: 0})

let measure = scn.mark("rect", {top: 125, left: 200, width:200, height: 10, fillColor: "steelblue",  strokeWidth: 0});

let marker = scn.mark("line", {x1: 200, y1: 115, x2: 200, y2: 145, strokeColor: "red", strokeWidth: 3});

let glyph = scn.glyph(rect1, rect2, rect3, measure, marker);
let collection = scn.repeat(glyph, dt, {field: "Region"});

collection.layout = atlas.layout("grid", {numCols: 1, rowGap: 25});

let enc = scn.encode(rect1,{field: "Good", channel:"width"});
scn.encode(rect2,{field: "Satisfactory", channel:"width", scale: enc.scale});
scn.encode(rect3,{field: "Poor", channel:"width", scale: enc.scale});
scn.encode(measure,{field: "Measure", channel:"width", scale: enc.scale});
scn.encode(marker,{field: "Target", channel:"x", scale: enc.scale});

scn.axis("x", "Target", {orientation: "bottom"});
scn.axis("y", "Region", {orientation: "left", pathVisible: false, tickVisible: false});

// let r = atlas.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: false});	


