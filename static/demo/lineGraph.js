let scn = atlas.scene();
let line = scn.mark("line", {x1: 100, y1: 100, x2: 700, y2: 400, strokeColor: "green", vxShape: "circle", vxRadius: 4, vxFillColor: "green"});
let dt = await atlas.csv("csv/monthlySales.csv");

let polyLine = scn.densify(line, dt, {field: "Month"});
polyLine.curveMode = "natural";
let vertex = polyLine.firstVertex;

scn.encode(vertex, {field: "Month", channel: "x"});
scn.encode(vertex, {field: "Sales", channel: "y"});

scn.axis("x", "Month", {orientation: "bottom"});
scn.axis("y", "Sales", {orientation: "left"});