let scene = atlas.scene();
let data = await atlas.csv("csv/unemployment-2_gender_included.csv");

let rect = scene.mark("rect", {top:60, left: 100, width: 400, height: 150, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});
let industries = scene.repeat(rect, data, {field: "industry"});
industries.layout = atlas.layout("grid", {numRows: 2, colGap: 15, rowGap: 10});
let anyArea = scene.densify(industries.firstChild, data, {orientation: "horizontal", field: "date"});
let areas = scene.divide(anyArea, data, {orientation: "vertical", field: "gender"});
scene.encode(anyArea, {channel: "fillColor", field: "gender", mapping: {"male": "#60bdf0", "female": "#f768a1"}});
let disEncoding = scene.encode(anyArea, {channel: "height", field: "unemployments"});
let htEncoding = scene.encode(anyArea, {channel: "x", field: "date"});
disEncoding.scale.domain = [0,4500];
disEncoding.scale.rangeExtent = 200;
scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%y"});
scene.axis("height", "unemployments", {orientation: "left", pathX: 90, labelFormat: ".2s", titleOffset: 50});
scene.legend("fillColor", "gender", {x: 980, y: 100});