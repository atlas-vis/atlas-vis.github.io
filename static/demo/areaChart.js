let scene = atlas.scene();
let data = atlas.csv("csv/bitcoin-price.csv");
// rect.divide first
let rect = scene.mark("rectangle", {top:60, left: 100, width: 800, height: 450, strokeColor: "#ffcc00", strokeWidth: 0.25, fillColor: "#ffcc00"});
let anyArea = scene.densify(rect, data, {orientation: "horizontal", field: "date"});
// scene.setProperties(anyArea, {"baseline": "center"})
let disEncoding = scene.encode(anyArea, {channel: "height", field: "value"});
let htEncoding = scene.encode(anyArea, {channel: "x", field: "date"});
scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y"});
scene.axis("height", "value", {orientation: "left"});

let r = atlas.renderer("svg");
r.render(scene, "svgElement", {collectionBounds: true});	