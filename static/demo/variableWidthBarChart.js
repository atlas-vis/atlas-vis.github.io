//other names: Variable Width Bar Chart, variable width histogram, cascade chart, or Marimekko chart
let scn = atlas.scene();
let rect = scn.mark("rect", {top:100, left: 100, width: 800, height: 300, fillColor: "#fff"} );
let dt = await atlas.csv("csv/dummy.csv");

let names = scn.divide(rect, dt, {orientation: "horizontal", field: "name"});
let wdEncoding = scn.encode(rect, {field: "width", channel: "width"}),
	htEncoding = scn.encode(rect, {field: "height", channel: "height"});

// scn.setVertAlignment(rect, "top");
names.layout.vertCellAlignment = "top";

scn.setProperties(rect, {fillColor: "#B0D9E4", opacity: "0.9", strokeColor: "#fff"});

scn.axis("height", "height", {orientation: "left", flip: true});
scn.axis("x", "name", {orientation: "top", field: "name"});

// let r = atlas.renderer("svg");
// r.render(scn, "svgElement");	