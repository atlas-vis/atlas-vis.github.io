let scn = atlas.scene();
let line = scn.mark("line", {x1: 120, y1: 80, x2: 820, y2: 550, strokeColor: "gray", vxShape: "circle", vxRadius: 3, vxStrokeColor: "white", vxStrokeWidth: 1} );
let dt = await atlas.csv("csv/caltrain.csv");

scn.repeat(line, dt, {field: "Train"});
let path = scn.densify(line, dt, {field: "Station"});

let xEnc = scn.encode(path.firstVertex, {field: "Time", channel: "x"});
xEnc.scale.rangeExtent = 700;

let yEnc = scn.encode(path.firstVertex, {field: "Station", channel: "y"});
yEnc.scale.domain = ["Gilroy", "San Martin", "Morgan Hill", "Blossom Hill", "Capitol", "Tamien", "San Jose", "College Park", "Santa Clara", "Lawrence", "Sunnyvale", "Mountain View",  "San Antonio", "California Ave", "Palo Alto", "Menlo Park", "Redwood City", "San Carlos", "Belmont", "Hillsdale", "Hayward Park", "San Mateo", "Burlingame", "Millbrae", "San Bruno", "So. San Francisco", "Bayshore", "22nd Street", "San Francisco"];

scn.propagate(path, "sortVertices", "x", "asd");

scn.encode(path, {field: "Direction", channel: "strokeColor"});

scn.axis("y", "Station", {orientation: "left", rotateTitle: false, titlePosition: [95, 60], titleAnchor: ["right", "top"]});
scn.axis("x", "Time", {orientation: "bottom"});
scn.legend("strokeColor", "Direction", {x: 860, y: 100});
scn.gridlines("y", "Station");