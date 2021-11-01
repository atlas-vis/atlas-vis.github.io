let scn = atlas.scene();
let rect = scn.mark("rect", {top:100, left: 200, width: 20, height: 300, fillColor: "#84BC66", strokeWidth: 0} );
let dt = await atlas.csv("csv/GDP Change.csv");

let quarters = scn.repeat(rect, dt, {field: "Quarter"});
quarters.layout = atlas.layout("grid", {numRows: 1, colGap: 1});

let years = scn.repeat(quarters, dt, {field: "Year"});
years.layout = atlas.layout("grid", {numRows: 1, colGap: 16});

scn.encode(rect, {field: "% Change", channel: "height"});
scn.axis("x", "Quarter", {orientation: "bottom", tickVisible: false, pathVisible: false});
scn.axis("x", "Year", {orientation: "bottom", pathY: 255, labelFormat: "%Y", tickVisible: false, labelOffset: 180});
scn.axis("height", "% Change", {orientation: "left"});

// let r = atlas.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: false});	