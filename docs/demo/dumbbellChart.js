let scn = atlas.scene();
let dt = await atlas.csv("csv/orlandoShooting.csv");

let line = scn.mark("line", {x1: 420, y1: 100, x2: 500, y2: 100, strokeWidth: 8}),
    topic = scn.mark("text", {x: 100, y: 100, anchor: ["left", "middle"], fontWeight: "bold"}),
    rep = scn.mark("text", {x: 330, y: 100, anchor: ["left", "middle"], fillColor: "#a20e19", fontWeight: "bold"}),
    dem = scn.mark("text", {x: 370, y: 100, anchor: ["left", "middle"], fillColor: "#185a97", fontWeight: "bold"});

let row = scn.glyph(line, topic, rep, dem);
scn.repeat(row, dt, {field: "Topic"});
let g1 = scn.find([{fields: ["Republican", "Democrat"], operator: ">"}, {channel: "type", value: "glyph"}]),
    g2 = scn.find([{fields: ["Republican", "Democrat"], operator: "<"}, {channel: "type", value: "glyph"}]);

g1.forEach((d, i) => {d.firstChild.strokeColor = "#f8ecf3"; d.translate(0, i * 30);});
g2.forEach((d, i) => {d.firstChild.strokeColor = "#e1f1fc"; d.translate(0, 250 + i * 30)});

scn.mark("text", {x: 100, y: 65, anchor: ["left", "middle"], fillColor: "#a20e19", fontWeight: "bold", fontSize: "1em", text: "Topics Mentioned More by Republicans"});
scn.mark("text", {x: 100, y: 315, anchor: ["left", "middle"], fillColor: "#185a97", fontWeight: "bold", fontSize: "1em", text: "Topics Mentioned More by Democrats"});
scn.mark("line", {x1: 100, y1: 77, x2: 500, y2: 77, strokeColor: "#ddd"});
scn.mark("line", {x1: 100, y1: 327, x2: 500, y2: 327, strokeColor: "#ddd"});

let enc = scn.encode(line.vertices[0], {field: "Republican", channel: "x"});
scn.encode(line.vertices[1], {field: "Democrat", channel: "x", scale: enc.scale});
enc.scale.rangeExtent = 400;

scn.encode(topic, {field: "Topic", channel: "text"});
scn.encode(rep, {field: "Republican", channel: "text"});
scn.encode(dem, {field: "Democrat", channel: "text"});

scn.setProperties(line.vertices[0], {shape: "circle", radius: 4, fillColor: "#a20e19"});
scn.setProperties(line.vertices[1], {shape: "circle", radius: 4, fillColor: "#185a97"});

scn.axis("x", "Republican", {orientation: "bottom"});