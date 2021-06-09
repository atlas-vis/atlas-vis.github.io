let scene = atlas.scene();
let csv = await atlas.csv("csv/iris_species.csv");
let data = csv.transform("kde", ["sepal_length"], {min: 3, interval: 0.1, max: 8, bandwidth: 0.25});
let rect = scene.mark("rectangle", {top:60, left: 200, width: 200, height: 400, strokeColor: "white", strokeWidth: 1, fillColor: "#69B3A2"});
let species = scene.repeat(rect, data, {field: "species"})
species.layout = atlas.layout("grid", {numCols: 3, vGap: 15, baseline: "center"});
let anySpecies = scene.densify(rect, data, {orientation: "vertical", field: "sepal_length"});
let xEncoding = scene.encode(anySpecies, {channel: "y", field: "sepal_length"});
let htEncoding = scene.encode(anySpecies, {channel: "width", field: "sepal_length_density"});
let clEncoding = scene.encode(anySpecies, {channel: "fillColor", field: "species"});
xEncoding.scale.rangeExtent = 300;
scene.setProperties(anySpecies, {curveMode: "basis"})
scene.axis("y", "sepal_length", {orientation: "right"});
scene.axis("x", "species", {orientation: "bottom"});
scene.legend("fillColor", "species", {x: 200, y: 50});

let line = scene.mark("line", {x1: 300, y1: 20, x2: 300, y2: 480, strokeColor: "#555", strokeWidth: 2}),
    box = scene.mark("rectangle", {top: 70, left: 295, width: 10, height: 400, fillColor: "black", strokeColor: "#111"})
    medianCircle = scene.mark("circle", {radius: 4, cx: 300, cy: 90, fillColor: "white", strokeWidth: 0});
    ;

let glyph = scene.glyph(line, box, medianCircle);
let collection = scene.repeat(glyph, csv, {field: "species"});
scene.encode(line.vertices[0], {field: "sepal_length", channel: "y", aggregator: "max", scale: xEncoding.scale});
scene.encode(line.vertices[1], {field: "sepal_length", channel: "y", aggregator: "min", scale: xEncoding.scale});
scene.encode(box.topSegment, {field: "sepal_length", channel: "y", aggregator: "percentile 75", scale: xEncoding.scale});
scene.encode(box.bottomSegment, {field: "sepal_length", channel: "y", aggregator: "percentile 25", scale: xEncoding.scale});
scene.encode(medianCircle, {field: "sepal_length", channel: "y", aggregator: "avg", scale: xEncoding.scale})
scene.affix(glyph, anySpecies, "x");
let r = atlas.renderer("svg");
r.render(scene, "svgElement", {collectionBounds: false});
