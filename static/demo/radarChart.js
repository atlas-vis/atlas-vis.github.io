let scn = atlas.scene();
let circle = scn.mark("circle", {radius: 240, cx: 400, cy: 300, fillColor: "blue", strokeWidth: 5, strokeColor:"crimson", opacity:0.35, vxShape: "circle", vxRadius: 8, vxFillColor: "crimson", vxOpacity: 0.35});
let dt = await atlas.csv("csv/monthlySales.csv");

let polygon = scn.densify(circle, dt, {field: "Month"});
scn.encode(polygon.firstVertex, {field: "Sales", channel: "radialDistance"});

for (let i = 0; i < 360; i+= 30)
    scn.axis("radialDistance", "Sales", {rotation: i, tickValues: [15, 30, 45, 55]});
scn.gridlines("radialDistance", "Sales", {values: [15, 30, 45, 55]});