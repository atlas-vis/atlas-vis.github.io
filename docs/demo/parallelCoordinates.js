let scn = atlas.scene();
let path = scn.mark("path", {
	vertices: [[100, 80], [350, 80], [600, 80], [850, 80]],
	strokeColor: "#95D0F5",
	opacity: 0.15
} );
let dt = await atlas.csv("csv/cars.csv");

let paths = scn.repeat(path, dt);
let enc1 = scn.encode(path.vertices[0], {field: "cylinders", channel: "y", rangeExtent: 400});
let enc2 = scn.encode(path.vertices[1], {field: "economy(mpg)", channel: "y", rangeExtent: 400});
let enc3 = scn.encode(path.vertices[2], {field: "displacement(cc)", channel: "y", rangeExtent: 400});
let enc4 = scn.encode(path.vertices[3], {field: "power(hp)", channel: "y", rangeExtent: 400});
let enc = scn.encode(path, {field: "cylinders", channel: "strokeColor", mapping: {"3": "#ffffb2", "4": "#fecc5c", "5": "#fd8d3c", "6": "#f03b20", "8": "#bd0026"}});
// scn.setProperties(path, {opacity: 0.1});
scn.legend("strokeColor", "cylinders", {x: 950, y: 100});
scn.axis("y", "economy(mpg)", {orientation: "left", x: 100});
scn.axis("y", "cylinders", {orientation: "left", x: 350});
scn.axis("y", "displacement(cc)", {orientation: "left", x: 600});
scn.axis("y", "power(hp)", {orientation: "right", x: 850});
scn.legend("strokeColor", "cylinders", {x: 950, y: 100});