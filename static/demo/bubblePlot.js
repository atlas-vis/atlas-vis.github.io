let scn = atlas.scene({fillColor: "#333"});
let dt = await atlas.csv("csv/planets.csv");
let circle = scn.mark("circle", {radius: 6, x: 200, y: 60, fillColor: "orange", strokeWidth: 1, strokeColor: "white", opacity: 0.35});

let collection = scn.repeat(circle, dt, {field: "name"});

let xEncoding = scn.encode(circle, {field: "hzd", channel: "x"});
let yEncoding = scn.encode(circle, {field: "mass", channel: "y", flipScale: true, scaleType: "log"});
let sizeEnc = scn.encode(circle, {field: "radius", channel: "radius"});
let mapping = {"-3": "#cc3333", "-1": "#669933", "1": "#669933", "3": "#006666"};
let fillEncoding = scn.encode(circle, {field: "hzd", channel: "fillColor", mapping: mapping});

xEncoding.scale.rangeExtent = 500;
yEncoding.scale.rangeExtent = 600;
sizeEnc.scale.rangeExtent = 40;

scn.axis("x", "hzd", {orientation: "bottom", strokeColor: "#ccc", textColor: "#ccc"});
scn.axis("y", "mass", {orientation: "left", tickValues: [0.1, 1, 10, 100, 1000, 10000], strokeColor: "#ccc", textColor: "#ccc"});
scn.gridlines("x", "hzd", {strokeColor: "#555"});
scn.gridlines("y", "mass", {values: [0.1, 1, 10, 100, 1000, 10000], strokeColor: "#555"});


// let r = atlas.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: false});	