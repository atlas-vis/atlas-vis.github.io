let scn = atlas.scene();
let dt = await atlas.csv("csv/nbaRedraft.csv");
let rect = scn.mark("rect", {top: 50, left: 50, width: 45, height: 8, strokeWidth: 1, fillColor: "#ddd"});

let coll = scn.repeat(rect, dt);
let xEnc = scn.encode(rect, {field: "Draft_Year", channel: "x", rangeExtent: 910});
let yEnc = scn.encode(rect, {field: "Draft_Pick", channel: "y", invertScale: true, rangeExtent: 500});

let mapping = {"-20": "#d7d7d7", "-10": "#ecdba7", "20": "#b87187", "50": "#9d326a"};
scn.encode(rect, {field: "VORP", channel: "fillColor", mapping: mapping});
scn.axis("x", "Draft_Year", {orientation: "top", ruleVisible: false});
scn.axis("y", "Draft_Pick", {orientation: "left"});
scn.legend("fillColor", "VORP", {x: 1050, y: 50});

let r = atlas.renderer("svg");
r.render(scn, "svgElement", {collectionBounds: false});	