let scene = atlas.scene();
let csv = await atlas.csv("csv/iris_species.csv");
let data = csv.transform("kde", ["sepal_length"], {min: 3, interval: 0.1, max: 8, bandwidth: 0.25});
let rect = scene.mark("rect", {top:60, left: 200, width: 200, height: 400, strokeColor: "white", strokeWidth: 1, fillColor: "#69B3A2"});
let species = scene.repeat(rect, data, {field: "species"})
species.layout = atlas.layout("grid", {numCols: 3, rowGap: 15, "horzCellAlignment": "center" });
let anySpecies = scene.densify(rect, data, {orientation: "vertical", field: "sepal_length"});
let yEnc = scene.encode(anySpecies, {channel: "y", field: "sepal_length", rangeExtent: 300});
scene.encode(anySpecies, {channel: "width", field: "sepal_length_density"});
scene.encode(anySpecies, {channel: "fillColor", field: "species"});
scene.setProperties(anySpecies, {curveMode: "basis", baseline: "center"})
scene.axis("x", "species", {orientation: "bottom", pathVisible: false, tickVisible: false});
scene.axis("y", "sepal_length", {orientation: "right", pathX: 800});
scene.legend("fillColor", "species", {x: 200, y: 50});

let line = scene.mark("line", {x1: 300, y1: 20, x2: 300, y2: 480, strokeColor: "#555", strokeWidth: 2}),
    box = scene.mark("rect", {top: 70, left: 295, width: 10, height: 400, fillColor: "black", strokeColor: "#111"}),
    medianCircle = scene.mark("circle", {radius: 4, x: 300, y: 90, fillColor: "white", strokeWidth: 0});

let glyph = scene.glyph(line, box, medianCircle);
let collection = scene.repeat(glyph, csv, {field: "species"});
scene.encode(line.vertices[0], {field: "sepal_length", channel: "y", aggregator: "max", scale: yEnc.scale});
scene.encode(line.vertices[1], {field: "sepal_length", channel: "y", aggregator: "min", scale: yEnc.scale});
scene.encode(box.topSegment, {field: "sepal_length", channel: "y", aggregator: "percentile 75", scale: yEnc.scale});
scene.encode(box.bottomSegment, {field: "sepal_length", channel: "y", aggregator: "percentile 25", scale: yEnc.scale});
scene.encode(medianCircle, {field: "sepal_length", channel: "y", aggregator: "avg", scale: yEnc.scale})
scene.affix(glyph, anySpecies, "x");
