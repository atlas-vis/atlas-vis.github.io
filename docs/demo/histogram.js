let scene = atlas.scene();
let csv = await atlas.csv("csv/car-weight.csv");
let data = csv.transform("bin", ["weight(lbs)"]);

let rect = scene.mark("rect", {top:100, left: 200, width: 50, height: 200, strokeColor: "#222", strokeWidth: 0.5, fillColor: "#ccc"});
scene.repeat(rect, data);
let enc = scene.encode(rect.leftSegment, {channel: "x", field: "x0"});
scene.encode(rect.rightSegment, {channel: "x", field: "x1", scale: enc.scale});
enc.scale.rangeExtent = 50 * data.getRowCount();
scene.encode(rect, {channel: "height", field: "weight(lbs)_count"});

scene.axis("x", "x0", {orientation: "bottom", showTitle: false});
scene.axis("height", "weight(lbs)_count", {orientation: "left"});