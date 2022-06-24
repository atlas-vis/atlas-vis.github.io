let scn = atlas.scene({fillColor: "#333"});
let line = scn.mark("line", {x1: 100, y1: 100, x2: 700, y2: 400, strokeColor: "green", vxShape: "circle", vxRadius: 4});
let dt = await atlas.csv("csv/newCarColors.csv");

// let coll = scn.repeat(line, dt, {field: "Color", layout: atlas.layout("grid", {"numCols": 1})});
scn.repeat(line, dt, {field: "Color"});
line = scn.densify(line, dt, {field: "Year"});
scn.setProperties(line, {curveMode: "bumpX"});
//scn.setProperties(line.vertices[0], {shape: "circle", radius: 4, fillColor: "green"});
let vertex = line.vertices[0];
scn.encode(vertex, {field: "Year", channel:"x"});
scn.encode(vertex, {field: "Rank", channel:"y", flipScale: true});
scn.axis("x", "Year", {orientation: "bottom", pathY: 420, labelFormat: "%Y", strokeColor: "#ccc", textColor: "#ccc"});
scn.axis("y", "Rank", {orientation: "left", pathX: 80, strokeColor: "#ccc", textColor: "#ccc"});
// scn.setProperties(coll, {"layout": undefined});
let colorMapping = {"White (solid+pearl)": "#eee", "Red": "red", "Gold/yellow": "#c9b037", "Silver": "silver", "Green": "green", "Brown/beige": "brown", "Blue": "blue", "Black (solid+effect)": "black", "Other": "magenta", "Gray": "gray"}
scn.encode(line, {field: "Color", channel:"strokeColor", mapping: colorMapping});
scn.legend("strokeColor", "Color", {x: 660, y: 100, textColor: "#ccc"});



