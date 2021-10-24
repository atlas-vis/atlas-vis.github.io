let scene = atlas.scene();
let dt = await atlas.csv("csv/waffle.csv");

let rect = scene.mark("rect", {top:100, left: 200, width: 20, height: 20, strokeWidth: 0, opacity: 0.8});
let c = scene.repeat(rect, dt);
c.layout = atlas.layout("grid", {numCols: 10, rowGap: 2, colGap: 2});
scene.encode(rect, {field: "Age Bin", channel: "fillColor"});
scene.legend("fillColor", "Age Bin", {x: 500, y: 120});

// let r = atlas.renderer("svg");
// r.render(scene, "svgElement", {collectionBounds: false});