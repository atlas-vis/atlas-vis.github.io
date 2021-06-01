let scene = atlas.scene();
let data = atlas.csv("csv/unemployment-2.csv");

let rect = scene.mark("rectangle", {top:60, left: 100, width: 400, height: 150, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});
let industries = scene.repeat(rect, data, {field: "industry"});
industries.layout = atlas.layout("grid", {numRows: 2, hGap: 15, vGap: 10});
let anyArea = scene.densify(industries.firstChild,  data, {orientation: "horizontal", field: "date"});
scene.setProperties(industries.layout, {"baseline": "bottom"})
scene.encode(anyArea, {channel: "fillColor", field: "industry"});
let disEncoding = scene.encode(anyArea, {channel: "height", field: "unemployments"});
let htEncoding = scene.encode(anyArea, {channel: "x", field: "date"});
disEncoding.scale.domain = [0,2500];
disEncoding.scale.rangeExtent = 200;
scene.axis("x", "date", {orientation: "bottom", y: 475, labelFormat: "%m/%y"});
scene.axis("height", "unemployments", {orientation: "left", x: 90});
scene.legend("fillColor", "industry", {x: 980, y: 100});


let r = atlas.renderer("svg");
r.render(scene, "svgElement", {collectionBounds: true});	