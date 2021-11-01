let scn = atlas.scene();
let line = scn.mark("line", {x1: 100, y1: 100, x2: 700, y2: 400, strokeColor: "#008BBE", strokeWidth: 3, vxShape: "circle", vxRadius: 3, vxFillColor: "#008BBE"});
let dt = await atlas.csv("csv/tempForecast.csv");

let rect = scn.mark("rect", {left: 100, top: 100, width: 600, height: 300, fillColor: "#E1F1FC", strokeWidth: 0});
let area = scn.densify(rect, dt, {field: "month", "orientation": "horizontal"});
let v = area.firstVertexPair;
let xEnc = scn.encode(v[0], {field: "month", channel: "x", rangeExtent: 600});
let yEnc = scn.encode(v[0], {field: "upper", channel: "y", includeZero: true});
scn.encode(v[1], {field: "month", channel: "x", scale: xEnc.scale});
scn.encode(v[1], {field: "lower", channel: "y", scale: yEnc.scale});

let polyLine = scn.densify(line, dt, {field: "month"});
polyLine.curveMode = "natural";
let vertex = polyLine.firstVertex;

scn.encode(vertex, {field: "month", channel: "x", scale: xEnc.scale});
scn.encode(vertex, {field: "median", channel: "y", scale: yEnc.scale});

yEnc.scale.rangeExtent = 300;

scn.axis("x", "month", {orientation: "bottom", pathY: 400});
scn.axis("y", "median", {orientation: "left"});