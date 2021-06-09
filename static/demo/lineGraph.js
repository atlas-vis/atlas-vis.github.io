let scn = atlas.scene();
let line = scn.mark("line", {x1: 100, y1: 100, x2: 700, y2: 400, strokeColor: "green"});
let dt = await atlas.csv("csv/monthlySales.csv");

let polyLine = scn.densify(line, dt, {field: "Month"});
polyLine.curveMode = "natural";
scn.setProperties(polyLine.vertices[0], {shape: "circle", radius: 4, fillColor: "green"});

let vertex = polyLine.anyVertex;
scn.encode(vertex, {field: "Month", channel: "x"});
scn.encode(vertex, {field: "Sales", channel: "y"});

scn.axis("x", "Month", {orientation: "bottom"});
scn.axis("y", "Sales", {orientation: "left"});

let r = atlas.renderer("svg");
r.render(scn, "svgElement", {collectionBounds: true});	