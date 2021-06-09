let scn = atlas.scene();
let data = await atlas.csv("csv/pieChartData.csv");

let circ = scn.mark("circle", {radius: 120, cx: 300, cy: 200, fillColor: "orange"});
let pieChart = scn.divide(circ, data, {field: "type"});

let anyPie = pieChart.children[0];
scn.encode(anyPie, {field: "type", channel: "fillColor"});
scn.encode(anyPie, {field: "amount", channel: "angle"});

scn.legend("fillColor", "type", {x: 450, y: 100});

atlas.renderer("svg").render(scn, "svgElement");	