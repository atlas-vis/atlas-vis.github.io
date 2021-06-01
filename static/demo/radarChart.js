let scn = atlas.scene();
let circle = scn.mark("circle", {radius: 260, cx: 400, cy: 300, fillColor: "blue", strokeWidth: 5, strokeColor:"crimson", opacity:0.35});
let dt = atlas.csv("csv/monthlySales.csv");

let polygon = scn.densify(circle, dt, {field: "Month"});
scn.encode(polygon.anyVertex, {field: "Sales", channel: "radialDistance"});
scn.setProperties(polygon.anyVertex, {shape: "circle", radius: 8, fillColor: "crimson", opacity: 0.35});

for (let i = 0; i < 360; i+= 30)
    scn.axis("radialDistance", "Sales", {rotation: i, ticks: [15, 30, 45, 55]});
scn.gridlines("radialDistance", "Sales", {values: [15, 30, 45, 55]});

atlas.renderer("svg").render(scn, "svgElement");	