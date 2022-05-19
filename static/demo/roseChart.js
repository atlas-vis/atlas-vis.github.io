let scn = atlas.scene({fillColor: "#FFFAFC"});
let circ = scn.mark("circle", {radius: 120, x: 400, y: 400, fillColor: "orange", strokeColor: "white"});
let data = await atlas.csv("csv/nightingale.csv");

// let rings = scn.divide(circ, data, {field: "Type", orientation: "radial"});
// let arcs = scn.divide(rings.firstChild, data, {field: "Month", orientation: "angular"});

let pies = scn.divide(circ, data, {field: "Month", orientation: "angular"});
let arcs = scn.divide(pies.firstChild, data, {field: "Type", orientation: "radial"});

scn.encode(arcs.firstChild, {field: "Type", channel: "fillColor", mapping: {"Disease": "#CFDFE3", "Wounds": "#EBC3BE", "Other": "#77746F"}});
scn.encode(arcs.firstChild, {field: "Death", channel: "thickness", scaleType: "sqrt", rangeExtent: 200});
scn.legend("fillColor", "Type", {x: 150, y: 100});