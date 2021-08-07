let scene = atlas.scene();
let csv = await atlas.csv("csv/iris_setosa.csv");
let data = csv.transform("kde", ["sepal_length"], {min: 4, interval: 0.1, max: 6, bandwidth: 0.13});
let rect = scene.mark("rect", {top:60, left: 200, width: 200, height: 400, strokeColor: "white", strokeWidth: 1, fillColor: "#69B3A2"});
let setose = scene.densify(rect, data, {orientation: "vertical", field: "sepal_length"});
scene.setProperties(setose, {baseline: "center"});
let xEncoding = scene.encode(setose, {channel: "y", field: "sepal_length"});
let htEncoding = scene.encode(setose, {channel: "width", field: "sepal_length_density"});
xEncoding.scale.rangeExtent = 300;
scene.setProperties(setose, {curveMode: "basis"})
scene.axis("y", "sepal_length", {orientation: "bottom"});
let line = scene.mark("line", {x1: 300, y1: 20, x2: 300, y2: 480, strokeColor: "#555", strokeWidth: 2}),
    box = scene.mark("rect", {top: 70, left: 295, width: 10, height: 400, fillColor: "black", strokeColor: "#111"}),
    medianCircle = scene.mark("circle", {radius: 4, x: 300, y: 90, fillColor: "white", strokeWidth: 0});

let glyph = scene.glyph(line, box, medianCircle);
scene.repeat(glyph, csv, {field: "species"});
scene.encode(line.vertices[0], {field: "sepal_length", channel: "y", aggregator: "max", scale: xEncoding.scale});
scene.encode(line.vertices[1], {field: "sepal_length", channel: "y", aggregator: "min", scale: xEncoding.scale});
scene.encode(box.topSegment, {field: "sepal_length", channel: "y", aggregator: "percentile 75", scale: xEncoding.scale});
scene.encode(box.bottomSegment, {field: "sepal_length", channel: "y", aggregator: "percentile 25", scale: xEncoding.scale});
scene.encode(medianCircle, {field: "sepal_length", channel: "y", aggregator: "avg", scale: xEncoding.scale})
// let r = atlas.renderer("svg");
// r.render(scene, "svgElement", {collectionBounds: false});
