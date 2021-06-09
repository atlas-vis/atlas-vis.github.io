let scn = atlas.scene();
let line = scn.mark("line", {x1: 120, y1: 50, x2: 820, y2: 550, strokeColor: "gray"} );
let dt = await atlas.csv("csv/caltrain.csv");

scn.repeat(line, dt, {field: "Train"});
let path = scn.densify(line, dt, {field: "Station"});

let xEnc = scn.encode(path.anyVertex, {field: "Time", channel: "x"});
xEnc.scale.rangeExtent = 700;

let yEnc = scn.encode(path.anyVertex, {field: "Station", channel: "y"});
yEnc.scale.domain = ["Gilroy", "San Martin", "Morgan Hill", "Blossom Hill", "Capitol", "Tamien", "San Jose", "College Park", "Santa Clara", "Lawrence", "Sunnyvale", "Mountain View",  "San Antonio", "California Ave", "Palo Alto", "Menlo Park", "Redwood City", "San Carlos", "Belmont", "Hillsdale", "Hayward Park", "San Mateo", "Burlingame", "Millbrae", "San Bruno", "So. San Francisco", "Bayshore", "22nd Street", "San Francisco"];

scn.sortVertices(path, {channel: "x"});

scn.encode(path, {field: "Direction", channel: "strokeColor"});
scn.setProperties(path.anyVertex, {shape: "circle", radius: 3, strokeColor: "white", strokeWidth: 1});

scn.axis("y", "Station", {orientation: "left"});
scn.axis("x", "Time", {orientation: "bottom"});
scn.legend("strokeColor", "Direction", {x: 860, y: 100});
scn.gridlines("y", "Station");

let r = atlas.renderer("svg");
r.render(scn, "svgElement", {collectionBounds: false});	