let scn = atlas.scene();

let line = scn.mark("line", {x1: 150, y1: 130, x2: 700, y2: 130, strokeColor: "#555"}),
    box = scn.mark("rectangle", {top: 110, left: 200, width: 400, height: 40, fillColor: "#95D0F5", strokeColor: "#111"})
    medianLine = scn.mark("line", {x1: 300, y1: 110, x2: 300, y2: 150, strokeColor: "#000"})
    ;

for (let i = 0; i < 2; i++)
    scn.setProperties(line.vertices[i], {shape: "rect", width: 1, height: 30, fillColor: "#555"});

let glyph = scn.glyph(line, box, medianLine);

let dt = await atlas.csv("csv/boxplot.csv");

scn.repeat(glyph, dt);

let enc = scn.encode(line.vertices[0], {field: "Min", channel: "x"});
scn.encode(line.vertices[1], {field: "Max", channel: "x", scale: enc.scale});
scn.encode(box.leftSegment, {field: "25-Percentile", channel: "x", scale: enc.scale});
scn.encode(box.rightSegment, {field: "75-Percentile", channel: "x", scale: enc.scale});
scn.encode(medianLine, {field: "Median", channel: "x", scale: enc.scale});
enc.scale.rangeExtent = 700;
scn.axis("x", "Median", {orientation: "bottom"});

atlas.renderer("svg").render(scn, "svgElement");