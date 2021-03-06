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
		let xEncoding = scn.encode(circle, {field: row, channel: "x"});
		let yEncoding = scn.encode(circle, {field: col, channel: "y"});
		scn.encode(circle, {field: "species", channel: "fillColor", scale: fillScale});
		scatterplots.addChild(sp);
	}
}

scatterplots.layout = atlas.layout("grid", {numCols: 4, numRows: 4, colGap: 20, rowGap: 20});
scn.legend("fillColor", "species", {x: 620, y: 100});


// let r = atlas.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: true});	