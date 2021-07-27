let scn = atlas.scene();
let dt = await atlas.csv("csv/lollipop.csv");

let line = scn.mark("line", {x1: 200, y1: 100, x2: 500, y2: 100, strokeColor: "#aaa"});
scn.setProperties(line.vertices[1], {shape: "circle", radius: 4.5});

let c = scn.repeat(line, dt, {field: "Name"});
c.layout = atlas.layout("grid", {numCols: 1, vGap: 15});

let c2 = scn.repeat(c, dt, {field: "Group"});
c2.layout = atlas.layout("grid", {numCols: 1, vGap: 30});

let enc = scn.encode(line.vertices[1], {field: "Value", channel: "x"});
scn.encode(line.vertices[1], {field: "Group", channel: "fillColor"});
enc.scale.rangeExtent = 400;

scn.axis("x", "Value", {orientation: "bottom", y: 300});
scn.axis("y", "Name", {orientation: "left", pathVisible: false, tickVisible: false, x: 190});
scn.axis("y", "Group", {orientation: "left", pathVisible: false, tickVisible: false, x: 160});

scn.gridlines("x", "Value", {strokeColor: "#eee"});

// atlas.renderer("svg").render(scn, "svgElement");