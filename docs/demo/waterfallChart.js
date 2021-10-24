let scn = atlas.scene();
let dt = await atlas.csv("csv/account_balance.csv");

let rect = scn.mark("rect", {top: 150, left: 100, width: 55, height: 160, strokeWidth: 0, fillColor: "#ddd"})

let collection = scn.repeat(rect, dt, {field: "Period"});
collection.layout = atlas.layout("grid", {numRows: 1, colGap: 3});

let enc = scn.encode(rect.topSegment,{field: "Current", channel:"y"});
scn.encode(rect.bottomSegment,{field: "Previous", channel:"y", scale: enc.scale});
enc.scale.rangeExtent = 300;
let colorMapping = {"Total": "#00acec", "Down": "#cc1a59", "Up": "#2e944f"};
scn.encode(rect, {field: "Category", channel:"fillColor", mapping: colorMapping});

let label = scn.mark("text", {x: 100, y:100, fillColor: "white"});
scn.repeat(label, dt, {field: "Period"});
scn.encode(label, {field: "Delta", channel: "text"});
scn.affix(label, rect, "x");
scn.affix(label, rect, "y");

scn.axis("x", "Period", {orientation: "bottom"});
scn.axis("y", "Current", {orientation: "left", pathVisible: false, tickVisible: false, labelFormat: ".2s"});
scn.legend("fillColor", "Category", {x: 960, y: 100});
scn.gridlines("y", "Current");

// let r = atlas.renderer("svg");
// r.render(scn, "svgElement");	