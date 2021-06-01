let scn = atlas.scene();
let path = scn.mark("path", {
	vertices: [
		[200, 50], [350, 50], [500, 50], [650, 50]
	],
	strokeColor: "#95D0F5",
	opacity: 0.3
} );
let dt = atlas.csv("csv/cars.csv");

let paths = scn.repeat(path, dt);;
let enc1 = scn.encode(path.vertices[0], {field: "economy(mpg)", channel: "y"});
let enc2 = scn.encode(path.vertices[1], {field: "cylinders", channel: "y"});
let enc3 = scn.encode(path.vertices[2], {field: "displacement(cc)", channel: "y"});
let enc4 = scn.encode(path.vertices[3], {field: "power(hp)", channel: "y"});

enc1.scale.rangeExtent = 500;
enc2.scale.rangeExtent = 500;
enc3.scale.rangeExtent = 500;
enc4.scale.rangeExtent = 500;

scn.axis("y", "economy(mpg)", {orientation: "left", x: 200});
scn.axis("y", "cylinders", {orientation: "left", x: 350});
scn.axis("y", "displacement(cc)", {orientation: "left", x: 500});
scn.axis("y", "power(hp)", {orientation: "right", x: 650});


let r = atlas.renderer("svg");
r.render(scn, "svgElement");	