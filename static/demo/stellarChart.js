let scn = atlas.scene();
let circle = scn.mark("circle", {radius: 240, x: 400, y: 300, fillColor:"red", opacity:0.75});
let dt = await atlas.csv("csv/monthlySales.csv");

let polygon = scn.densify(circle, dt, {field: "Month"});
scn.encode(polygon.firstVertex, {field: "Sales", channel: "radialDistance"});

let polarAngles = polygon.vertices.map(d => d.polarAngle);
polarAngles.push(polarAngles[0] + (polarAngles[0] < polarAngles[1] ? 360 : - 360));
let newVertices = [];
for (let i = 0; i < polarAngles.length - 1; i++) {
    let deg = (polarAngles[i] + polarAngles[i+1])/2;
    newVertices.push(atlas.polarToCartesian(polygon.x, polygon.y, 45, deg));
}
newVertices.forEach((d,i) => polygon.addVertex(d[0], d[1], 1 + i * 2));

for (let i = 0; i < 360; i+= 30)
    scn.axis("radialDistance", "Sales", {rotation: i, showTitle: false, strokeColor: "#bbb", textColor: "#bbb", labelFormat: ".2s", tickValues:[10000, 20000, 30000, 40000]});
scn.gridlines("radialDistance", "Sales", {values: [10000, 20000, 30000, 40000]});