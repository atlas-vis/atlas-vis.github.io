let scn = atlas.scene();
let xPos = [100, 350, 600, 850], top = 80;
let path = scn.mark("path", {
	vertices: [[xPos[0], top], [xPos[1], top], [xPos[2], top], [xPos[3], top]],
	strokeColor: "#95D0F5",
	opacity: 0.15
} );
let dt = await atlas.csv("csv/cars.csv");

let paths = scn.repeat(path, dt);
let fields = ["cylinders", "economy(mpg)", "displacement(cc)", "power(hp)"];
for (let i = 0; i < fields.length; i++)
	scn.encode(path.vertices[i], {field: fields[i], channel: "y", rangeExtent: 400});
let enc = scn.encode(path, {field: "cylinders", channel: "strokeColor", mapping: {"3": "#ffffb2", "4": "#fecc5c", "5": "#fd8d3c", "6": "#f03b20", "8": "#bd0026"}});
scn.legend("strokeColor", "cylinders", {x: 950, y: 100});
for (let i = 0; i < fields.length; i++)
	scn.axis("y", fields[i], {orientation: "left", pathX: xPos[i], titleAnchor: ["center", "top"], rotateTitle: false, titlePosition: [xPos[i], top - 20]});	
scn.legend("strokeColor", "cylinders", {x: 950, y: 100});