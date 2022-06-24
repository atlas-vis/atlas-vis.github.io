let scn = atlas.scene();
let data = await atlas.csv("csv/pieChartData.csv");

let circ = scn.mark("circle", {radius: 120, x: 300, y: 200, fillColor: "orange", strokeColor: "#888"});
let pieChart = scn.divide(circ, data, {field: "category"});

let anyPie = pieChart.children[0];
scn.encode(anyPie, {field: "category", channel: "fillColor", scheme: "schemePaired"});
scn.encode(anyPie, {field: "minutes", channel: "angle"});

scn.legend("fillColor", "category", {x: 450, y: 80});