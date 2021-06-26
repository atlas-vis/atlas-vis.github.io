//data source: U.S. Bureau of Economic Analysis
//Percent Change of Real Gross Domestic Product from Preceding Period
let scn = atlas.scene();
let rect = scn.mark("rectangle", {top:60, left: 200, width: 350, height: 16, fillColor: "#84BC66", strokeWidth: 0} );
let dt = await atlas.csv("csv/GDP Change.csv");

let quarters = scn.repeat(rect, dt, {field: "Quarter"});
quarters.layout = atlas.layout("grid", {numRows: 4, vGap: 1});

let years = scn.repeat(quarters, dt, {field: "Year"});
years.layout = atlas.layout("grid", {numCols: 1, vGap: 16});

scn.encode(rect, {field: "% Change", channel: "width"});
scn.axis("y", "Quarter", {orientation: "left", tickVisible: false, pathVisible: false});
scn.axis("y", "Year", {orientation: "right", x: 370, labelFormat: "%Y", tickVisible: false, labelOffset: 220});
scn.axis("width", "% Change", {orientation: "bottom", y: 380});

let r = atlas.renderer("svg");
r.render(scn, "svgElement", {collectionBounds: false});	
