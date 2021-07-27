let scn = atlas.scene();
let data = await atlas.csv("csv/pieChartData.csv");

let ring = scn.mark("ring", {innerRadius: 70, outerRadius: 120, cx: 300, cy: 200, fillColor: "orange"});
let donutChart = scn.divide(ring, data, {field: "type"});

let arc = donutChart.firstChild;
scn.encode(arc, {field: "type", channel: "fillColor"});
scn.encode(arc, {field: "amount", channel: "angle"});

scn.legend("fillColor", "type", {x: 450, y: 100});