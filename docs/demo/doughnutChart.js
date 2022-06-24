let scn = atlas.scene();
let data = await atlas.csv("csv/pieChartData.csv");

let ring = scn.mark("ring", {innerRadius: 70, outerRadius: 120, x: 300, y: 200, fillColor: "orange", strokeColor: "#888"});
let donutChart = scn.divide(ring, data, {field: "category"});

let arc = donutChart.firstChild;
scn.encode(arc, {field: "category", channel: "fillColor",scheme: "schemeSet3"});
scn.encode(arc, {field: "minutes", channel: "angle"});

scn.legend("fillColor", "category", {x: 450, y: 80});