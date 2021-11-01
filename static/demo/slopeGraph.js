let scn = atlas.scene();
let line = scn.mark("line", {x1: 200, y1: 80, x2: 400, y2: 80, strokeColor: "green"});

let dt = await atlas.csv("csv/obesityEducation.csv");

scn.repeat(line, dt, {field: "State"});
let enc = scn.encode(line.vertices[0], {field: "Obesity Percentage", channel: "y"});
scn.encode(line.vertices[1], {field: "BA Degree Percentage", channel: "y", scale: enc.scale});
enc.scale.domain = [15, 50];
enc.scale.rangeExtent = 500;
scn.encode(line, {field: "Obesity vs Higher Education", channel: "strokeColor"});

scn.setProperties(line.vertices[0], {shape: "circle", radius: 4, opacity: "0.7"});
scn.setProperties(line.vertices[1], {shape: "circle", radius: 4, opacity: "0.7"});

scn.axis("y", "Obesity Percentage", {orientation: "left", pathX: 200});
scn.axis("y", "BA Degree Percentage", {orientation: "right", pathX: 400});
scn.legend("strokeColor", "Obesity vs Higher Education", {x: 460, y: 100});

// let r = atlas.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: false});	
