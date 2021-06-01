let scn = atlas.scene();
let dt = atlas.csv("csv/stocks.csv");
//dt.parseFieldAsDate("date", "%b %Y");
let line = scn.mark("line", {x1: 100, y1: 100, x2: 400, y2: 150, strokeColor: "#555"});

let collection = scn.repeat(line, dt, {field: "company"});
collection.layout = atlas.layout("grid", {numCols: 2, numRows: 2, hGap: 30, vGap: 25});

let polyLine = scn.densify(line, dt, {field: "date"});

let xEnc = scn.encode(polyLine.anyVertex, {field: "date", channel: "x"});
let yEnc = scn.encode(polyLine.anyVertex, {field: "price", channel: "y", startFromZero: true});
scn.encode(polyLine, {field: "company", channel: "strokeColor"});

scn.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y"});
let applVertex = scn.find([{field: "company", value: "AAPL"}, {type: "vertex"}])[0];
scn.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y", item: applVertex});

scn.axis("y", "price", {orientation: "left"});
let ibmVertex = scn.find([{field: "company", value: "IBM"}, {type: "vertex"}])[0];
scn.axis("y", "price", {orientation: "left", item: ibmVertex});
scn.legend("strokeColor", "company", {x: 780, y: 100});


let r = atlas.renderer("svg");
r.render(scn, "svgElement", {collectionBounds: false});	