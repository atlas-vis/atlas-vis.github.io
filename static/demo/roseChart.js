let scn = atlas.scene({fillColor: "#FFFAFC"});
let circ = scn.mark("circle", {radius: 120, x: 300, y: 300, fillColor: "orange", strokeColor: "white"});
let data = await atlas.csv("csv/nightingale.csv");

//need to handle divide angular then radial
let rings = scn.divide(circ, data, {field: "Type", orientation: "radial"});
let arcs = scn.divide(rings.firstChild, data, {field: "Month", orientation: "angular"});

scn.encode(arcs.firstChild, {field: "Type", channel: "fillColor", mapping: {"Disease": "#CFDFE3", "Wounds": "#EBC3BE", "Other": "#77746F"}});
scn.encode(arcs.firstChild, {field: "Death", channel: "thickness", rangeExtent: 200});
scn.legend("fillColor", "Type", {x: 150, y: 100});