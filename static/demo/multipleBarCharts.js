let scene = atlas.scene();
let data = await atlas.csv("csv/redBlueAmerica.csv");
let rect = scene.mark("rectangle", {top:100, left: 100, width: 60, height: 60, strokeColor: "#fff", strokeWidth: 1, fillColor: "#ccc"});

scene.repeat(rect, data, {field: "State"});
let xEnc = scene.encode(rect, {field: "MapX", channel: "x", rangeExtent: 900});
let yEnc = scene.encode(rect, {field: "MapY", channel: "y", rangeExtent: 550});

let coll = scene.divide(rect, data, {field: "Year", orientation: "horizontal"});
scene.encode(coll.firstChild, {field: "PVI Score", channel: "height"});
scene.encode(coll.firstChild, {field: "Inclination", channel: "fillColor", mapping: {red: "#B6293E", blue: "#477EC0"}});

let text = scene.mark("text", {x: 0, y:60});
scene.repeat(text, data, {field: "State"});
scene.encode(text, {channel: "text", field: "State"});
scene.affix(text, coll, "x");
scene.encode(text, {channel: "y", field: "MapY", rangeExtent: 550});

// atlas.renderer("svg").render(scene, "svgElement", {collectionBounds: false})