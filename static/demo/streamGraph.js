let scene = atlas.scene();
let data = await atlas.csv("csv/unemployment-2.csv");
let rect = scene.mark("rect", {top:60, left: 100, width: 560, height: 450, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});

// // rect.divide first
// let industries = scene.divide(rect, {"partitionType":'divide', "orientation": "horizontal", "field": "industry", "datatable": data});
// let anyArea = scene.divide(industries.firstChild, {"partitionType":'BoundaryPartition', "orientation": "horizontal", "field": "date", "datatable": data});

// rect.densify first
let anyArea = scene.densify(rect, data, {orientation: "horizontal", field: "date"});
let areas = scene.divide(anyArea, data, {orientation: "vertical", field: "industry"});
scene.setProperties(areas.layout, {vertCellAlignment: "middle"});

scene.encode(anyArea, {channel: "fillColor", field: "industry"});
let disEncoding = scene.encode(anyArea, {channel: "height", field: "unemployments"});
let htEncoding = scene.encode(anyArea, {channel: "x", field: "date"});
disEncoding.scale.domain = [0,8000];
disEncoding.scale.rangeExtent = 450;
scene.axis("x", "date", {orientation: "bottom", pathY: 525, labelFormat: "%m/%y"})// scene.axis("distance", "unemployments", {"orientation": "left", "x-coordinate": 90})
scene.legend("fillColor", "industry", {x: 680, y: 100});

// let r = atlas.renderer("svg");
// r.render(scene, "svgElement", {collectionBounds: false})