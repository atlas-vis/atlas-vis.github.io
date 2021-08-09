let scn = atlas.scene();
let data = await atlas.csv("csv/monthlySales.csv");

let ring = scn.mark("ring", {innerRadius: 50, outerRadius: 120, x: 400, y: 300, fillColor: "#1D90FF", strokeColor: "white"});
let coll = scn.divide(ring, data, {field: "Month"});

let arc = coll.firstChild;
scn.encode(arc, {field: "Sales", channel: "outerRadius", rangeExtent: 200});

let text = scn.mark("text", {fillColor: "white", fontWeight: "bold", fontSize: "14px"});
scn.repeat(text, data, {field: "Month"});
scn.encode(text, {channel: "text", field: "Month"});

scn.affix(text, arc, "radialDistance", {itemAnchor: "top", baseAnchor: "top", offset: -10});
scn.affix(text, arc, "angle");