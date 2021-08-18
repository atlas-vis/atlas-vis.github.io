let scn = atlas.scene();
let line = scn.mark("line", {x1: 100, y1: 100, x2: 100, y2: 450, strokeColor: "#ccc"});

let dt = await atlas.csv("csv/bostonWeather.csv");

scn.repeat(line, dt, {field: "date"});
let xEnc = scn.encode(line, {field: "date", channel: "x"});
xEnc.scale.rangeExtent = 680;

let topEnc = scn.encode(line.vertices[0], {field: "maxTemp", channel: "y"});
let btmEnc = scn.encode(line.vertices[1], {field: "minTemp", channel: "y", scale: topEnc.scale});
topEnc.scale.rangeExtent = 300;

scn.encode(line, {field: "meanTemp", channel: "strokeColor", scheme: "interpolateTurbo"});

scn.axis("x", "date", {orientation: "bottom", labelFormat: "%b %d, %Y", labelRotation: -45});
scn.axis("y", "maxTemp", {orientation: "left", title: "temperature"});
scn.legend("strokeColor", "meanTemp", {x: 300, y: 500, orientation: "horizontal"});