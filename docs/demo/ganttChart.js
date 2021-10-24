let scn = atlas.scene();
let rect = scn.mark("rect", {top:100, left: 200, width: 400, height: 20, strokeWidth: 0, fillColor: "orange"} );
let dt = await atlas.csv("csv/projectTimeline.csv");

let bars = scn.repeat(rect, dt, {field: "Task"});
//bind y to Task would also work
bars.layout = atlas.layout("grid", {numCols: 1, rowGap: 5});

let enc = scn.encode(rect.leftSegment, {field: "Start Date", channel: "x"});
scn.encode(rect.rightSegment, {field: "End Date", channel: "x", scale: enc.scale});

scn.axis("x", "Start Date", {orientation: "top", labelFormat: "%m/%d"});
scn.axis("y", "Task", {orientation: "left"});
scn.gridlines("x", "Start Date");


// let r = atlas.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: false});