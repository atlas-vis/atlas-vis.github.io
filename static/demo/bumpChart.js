let scn = atlas.scene();
let line = scn.mark("line", {x1: 100, y1: 100, x2: 700, y2: 400, strokeColor: "green"});
let dt = atlas.csv("csv/newCarColors.csv");

scn.repeat(line, dt, {field: "Color"});
line = scn.densify(line, dt, {field: "Year"});
scn.setProperties(line, {curveMode: "bumpX"});
scn.setProperties(line.vertices[0], {shape: "circle", radius: 4, fillColor: "green"});
vertex = line.vertices[0];
scn.encode(vertex, {field: "Year", channel:"x"});
scn.encode(vertex, {field: "Rank", channel:"y", invertScale: true});
let colorMapping = {"White (solid+pearl)": "#eee", "Red": "red", "Gold/yellow": "#c9b037", "Silver": "silver", "Green": "green", "Brown/beige": "brown", "Blue": "blue", "Black (solid+effect)": "black", "Other": "magenta", "Gray": "gray"}
scn.encode(line, {field: "Color", channel:"strokeColor", mapping: colorMapping});
scn.axis("x", "Year", {orientation: "bottom", y: 420, labelFormat: "%Y"});
scn.axis("y", "Rank", {orientation: "left", x: 80});
scn.legend("strokeColor", "Color", {x: 660, y: 100});

let r = atlas.renderer("svg");
r.render(scn, "svgElement", {collectionBounds: false});	



