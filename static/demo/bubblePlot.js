let scn = atlas.scene();
let dt = atlas.csv("csv/planets.csv");
let circle = scn.mark("circle", {radius: 6, cx: 200, cy: 60, fillColor: "orange", strokeWidth: 0, opacity: 0.3});

let collection = scn.repeat(circle, dt, {field: "name"});

let xEncoding = scn.encode(circle, {field: "hzd", channel: "x"});
let yEncoding = scn.encode(circle, {field: "mass", channel: "y", invertScale: true});
let sizeEnc = scn.encode(circle, {field: "radius", channel: "radius"});
//let fillEncoding = scn.encode(circle, {"field": "Continent", "channel": "fillColor"});

xEncoding.scale.rangeExtent = 550;
yEncoding.scale.rangeExtent = 500;

scn.axis("x", "hzd", {orientation: "bottom"});
scn.axis("y", "mass", {orientation: "left"});
scn.gridlines("x", "hzd");
scn.gridlines("y", "mass");


let r = atlas.renderer("svg");
r.render(scn, "svgElement", {collectionBounds: false});	