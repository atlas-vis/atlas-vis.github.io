let scn = atlas.scene();
let dt = await atlas.csv("csv/iris.csv");
let fields = ["sepal length","sepal width","petal length","petal width"];

let scatterplots = scn.group();
let fillScale = atlas.createScale("ordinalColor");
fillScale.domain = dt.getUniqueFieldValues("species");

for (let row of fields) {
	for (let col of fields) {
		let circle = scn.mark("circle", {radius: 6, x: 100, y: 80, fillColor: "orange", 
			strokeWidth: 0, opacity: 0.3});
		let sp = scn.repeat(circle, dt, {field: "id"});
		scn.encode(circle, {field: row, channel: "x", rangeExtent: 135});
		scn.encode(circle, {field: col, channel: "y", rangeExtent: 135});
		scn.encode(circle, {field: "species", channel: "fillColor", scale: fillScale});
		scn.axis("x", row, {"item": circle, "titleOffset": 25});
		scn.axis("y", col, {"item": circle, "titleOffset": 25});
		scn.gridlines("x", row, {"item": circle});
		scn.gridlines("y", col, {"item": circle});
		scatterplots.addChild(sp);
	}
}

scn.setProperties(scatterplots, {"layout": atlas.layout("grid", {numCols: 4, colGap: 65, rowGap: 65})});
scn.legend("fillColor", "species", {x: 920, y: 100});


// let r = atlas.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: true});	