let scn = atlas.scene();
let dt = await atlas.csv("csv/orlandoShooting.csv");

let line = scn.mark("line", {x1: 300, y1: 100, x2: 500, y2: 100, strokeColor: "#aaa"});

scn.repeat(line, dt, {field: "Topic"}).layout = atlas.layout("grid", {numCols: 1, vGap: 30});
let enc = scn.encode(line.vertices[0], {field: "Republican", channel: "x"});
scn.encode(line.vertices[1], {field: "Democrat", channel: "x", scale: enc.scale});
enc.scale.rangeExtent = 400;

scn.setProperties(line.vertices[0], {shape: "circle", radius: 4, fillColor: "#a20e19"});
scn.setProperties(line.vertices[1], {shape: "circle", radius: 4, fillColor: "#185a97"});

scn.axis("x", "Republican", {orientation: "bottom", y: 360});
scn.axis("y", "Topic", {orientation: "left", pathVisible: false, tickVisible: false, x: 270});

atlas.renderer("svg").render(scn, "svgElement");