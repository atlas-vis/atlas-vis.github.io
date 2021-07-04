let scn = atlas.scene();

let line = scn.mark("line", {x1: 150, y1: 80, x2: 700, y2: 80, strokeColor: "#555", vxShape: "rect", vxWidth: 1, vxHeight: 20, vxFillColor: "#555"}),
    box = scn.mark("rectangle", {top: 70, left: 200, width: 400, height: 20, fillColor: "#95D0F5", strokeColor: "#111"}),
    medianLine = scn.mark("line", {x1: 300, y1: 70, x2: 300, y2: 90, strokeColor: "#000"});

let glyph = scn.glyph(line, box, medianLine);
let dt = await atlas.csv("csv/probability.csv");

let collection = scn.repeat(glyph, dt, {field: "Category"});
collection.layout = atlas.layout("grid", {numCols: 1, vGap: 15});

let enc = scn.encode(line.vertices[0], {field: "Probability", channel: "x", aggregator: "min"});
scn.encode(line.vertices[1], {field: "Probability", channel: "x", aggregator: "max", scale: enc.scale});
scn.encode(box.leftSegment, {field: "Probability", channel: "x", aggregator: "percentile 25", scale: enc.scale});
scn.encode(box.rightSegment, {field: "Probability", channel: "x", aggregator: "percentile 75", scale: enc.scale});
scn.encode(medianLine, {field: "Probability", channel: "x", aggregator: "median", scale: enc.scale});

scn.axis("x", "Probability", {orientation: "bottom"});
scn.axis("y", "Category", {orientation: "left", pathVisible: false, tickVisible: false});