let scene = atlas.scene();
let csv = await atlas.csv("csv/car-weight.csv");
let data = csv.transform("kde", ["weight(lbs)"], {min: 1500, interval: 100, bandwidth: 10});

let rect = scene.mark("rect", {top:60, left: 200, width: 700, height: 400, strokeColor: "#222", strokeWidth: 1, fillColor: "orange", opacity: 0.75});
let pg = scene.densify(rect, data, {orientation: "horizontal", field: "weight(lbs)"});
scene.encode(pg, {channel: "x", field: "weight(lbs)"});
scene.encode(pg, {channel: "height", field: "weight(lbs)_density"});
pg.curveMode = "basis";

scene.axis("x", "weight(lbs)", {orientation: "bottom"});
scene.axis("height", "weight(lbs)_density", {orientation: "left", titleOffset: 60});

// let r = atlas.renderer("svg");
// r.render(scene, "svgElement", {collectionBounds: false});