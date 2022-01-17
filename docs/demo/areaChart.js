let scene = atlas.scene();
let data = await atlas.csv("csv/bitcoin-price.csv");
// rect.divide first
let fill = atlas.linearGradient({x1: 0, y1: 0, x2: 0, y2: 100});
fill.addStop(0, "#EFC030", 1.0);
fill.addStop(80, "#EFC030", 1.0);
fill.addStop(100, "#F9E5AF", 1.0);
let rect = scene.mark("rect", {top:60, left: 100, width: 700, height: 450, strokeColor: "#ffcc00", strokeWidth: 0.25, fillColor: fill});
let anyArea = scene.densify(rect, data, {orientation: "horizontal", field: "date"});
scene.encode(anyArea, {channel: "height", field: "value"});
scene.encode(anyArea, {channel: "x", field: "date"});
scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y"});
scene.axis("height", "value", {orientation: "left", labelFormat: ".2s"});