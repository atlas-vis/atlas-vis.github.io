let scn = atlas.scene({fillColor: "#333"});
let dt = await atlas.csv("csv/nbaRedraft.csv");
let rect = scn.mark("rect", {top: 100, left: 80, width: 45, height: 8, strokeWidth: 0, fillColor: "#ddd"});

let coll = scn.repeat(rect, dt);
let xEnc = scn.encode(rect, {field: "Draft_Year", channel: "x", rangeExtent: 910});
let yEnc = scn.encode(rect, {field: "Draft_Pick", channel: "y", flipScale: true, rangeExtent: 500});

let mapping = {"-20": "#d7d7d7", "-10": "#ecdba7", "20": "#b87187", "50": "#9d326a"};
scn.encode(rect, {field: "VORP", channel: "fillColor", mapping: mapping});
scn.axis("x", "Draft_Year", {orientation: "top", pathVisible: false, strokeColor: "#ccc", textColor: "#ccc"});
scn.axis("y", "Draft_Pick", {orientation: "left", strokeColor: "#ccc", textColor: "#ccc"});
scn.legend("fillColor", "VORP", {x: 1050, y: 50, textColor: "#ccc", strokeColor: "#777"});