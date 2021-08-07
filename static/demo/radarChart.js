let scn = atlas.scene();
let circle = scn.mark("circle", {radius: 240, x: 400, y: 300, fillColor: "blue", strokeWidth: 0, opacity:0.2, vxShape: "circle", vxRadius: 6, vxFillColor: "crimson", vxOpacity: 0.5});
let dt = await atlas.csv("csv/monthlySales.csv");

let polygon = scn.densify(circle, dt, {field: "Month"});
scn.encode(polygon.firstVertex, {field: "Sales", channel: "radialDistance"});

for (let i = 0; i < 360; i+= 30)
    scn.axis("radialDistance", "Sales", {rotation: i, labelFormat: ".2s", strokeColor: "#bbb", textColor: "#bbb", showTitle: false, tickValues:[10000, 20000, 30000, 40000]});
scn.gridlines("radialDistance", "Sales", {values: [10000, 20000, 30000, 40000]});