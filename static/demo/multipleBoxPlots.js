let scn = atlas.scene();

let line = scn.mark("line", {x1: 150, y1: 80, x2: 150, y2: 450, strokeColor: "#555", vxShape: "rect", vxWidth: 20, vxHeight: 1, vxFillColor: "#555"}),
    box = scn.mark("rect", {top: 100, left: 135, width: 30, height: 200, fillColor: "#95D0F5", strokeWidth: 0}),
    medianLine = scn.mark("line", {x1: 135, y1: 200, x2: 165, y2: 200, strokeColor: "#fff"});

let glyph = scn.glyph(line, box, medianLine);
let dt = await atlas.csv("csv/genderPayGap.csv");

let genders = scn.repeat(glyph, dt, {field: "Gender"});
genders.layout = atlas.layout("grid", {numRows: 1, colGap: 15});

let payGrades = scn.repeat(genders, dt, {field: "Pay Grade"});
payGrades.sortChildrenByData("Pay Grade", false, ["One", "Two", "Three", "Four", "Five"]);
payGrades.layout = atlas.layout("grid", {numRows: 1, colGap: 45});


let enc = scn.encode(line.vertices[0], {field: "Min", channel: "y"});
scn.encode(line.vertices[1], {field: "Max", channel: "y", scale: enc.scale});
scn.encode(box.topSegment, {field: "75-Percentile", channel: "y", scale: enc.scale});
scn.encode(box.bottomSegment, {field: "25-Percentile", channel: "y", scale: enc.scale});
scn.encode(medianLine, {field: "Median", channel: "y", scale: enc.scale});

scn.encode(box, {field: "Gender", channel: "fillColor"});
scn.axis("x", "Pay Grade", {orientation: "bottom", pathVisible: false, tickVisible: false, labelOffset: 35});
scn.axis("x", "Gender", {orientation: "bottom", "pathVisible": false,tickVisible: false});
scn.axis("y", "Max", {orientation: "left", "pathX": 100, labelFormat: ".2s", title: "annual income"});
scn.legend("fillColor", "Gender", {x: 160, y: 120});