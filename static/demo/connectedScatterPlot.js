let scn = atlas.scene();
let dt = await atlas.csv("csv/drivingShifts.csv");

let line = scn.mark("line", {x1: 100, y1: 100, x2: 900, y2:500, strokeWidth: 2.5, strokeColor: "black"});
let polyline = scn.densify(line, dt);
polyline.curveMode = "natural";
scn.setProperties(polyline.anyVertex, {shape: "circle", radius: 3.5, strokeColor: "black", strokeWidth: 1, fillColor: "white"});

scn.encode(polyline.anyVertex, {field: "miles", channel: "x"});
scn.encode(polyline.anyVertex, {field: "gas", channel: "y"});

scn.axis("x", "miles", {orientation: "top", ruleVisible: false});
scn.axis("y", "gas", {orientation: "left", ruleVisible: false});
scn.gridlines("x", "miles");
scn.gridlines("y", "gas");

atlas.renderer("svg").render(scn, "svgElement");