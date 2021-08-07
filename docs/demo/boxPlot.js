let scn = atlas.scene();

let line = scn.mark("line", {x1: 150, y1: 130, x2: 700, y2: 130, strokeColor: "#555", vxShape: "rect", vxWidth: 1, vxHeight: 30, vxFillColor: "#555"}),
    box = scn.mark("rect", {top: 110, left: 200, width: 400, height: 40, fillColor: "#95D0F5", strokeColor: "#111"}),
    medianLine = scn.mark("line", {x1: 300, y1: 110, x2: 300, y2: 150, strokeColor: "#000"});

let glyph = scn.glyph(line, box, medianLine);

let dt = await atlas.csv("csv/monthlySales.csv");
scn.attach(glyph, dt);

let enc = scn.encode(line.vertices[0], {field: "Sales", channel: "x", aggregator: "min"});
scn.encode(line.vertices[1], {field: "Sales", channel: "x", scale: enc.scale, aggregator: "max"});
scn.encode(box.leftSegment, {field: "Sales", channel: "x", scale: enc.scale, aggregator: "percentile 25"});
scn.encode(box.rightSegment, {field: "Sales", channel: "x", scale: enc.scale, aggregator: "percentile 75"});
scn.encode(medianLine, {field: "Sales", channel: "x", scale: enc.scale, aggregator: "median"});
enc.scale.rangeExtent = 500;
scn.axis("x", "Sales", {orientation: "bottom"});

let circ = scn.mark("circle", {strokeColor: "#32A457", fillColor: "none", strokeWidth: 4, radius: 6,  y: 130, opacity: 0.75});
scn.repeat(circ, dt);
scn.encode(circ, {channel: "x", field: "Sales", scale: enc.scale});