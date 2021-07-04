let scene = atlas.scene();
let data = await atlas.csv("csv/gender-job-level.csv");
let rect = scene.mark("rectangle", {top:60, left: 100, width: 800, height: 650, strokeColor: "#aaa", strokeWidth: 1, fillColor: "#fff"});

let jobs = scene.divide(rect, data, {orientation: "vertical", field: "Job Type"});
let genderInJob = scene.divide(jobs.firstChild, data, {orientation: "horizontal", field: "Gender"});

scene.encode(genderInJob.firstChild, {channel: "fillColor", field: "Gender"});
let wdEncoding = scene.encode(genderInJob.firstChild, {channel: "width", field: "Percent Total"});
let htEncoding = scene.encode(genderInJob.firstChild, {field: "Percent Gender", channel: "height"});
wdEncoding.scale.rangeExtent = 450;

scene.axis("x", "Job Type", {orientation: "bottom", labelRotation: -45});
scene.legend("fillColor", "Gender", {x: 20, y: 60});


// let r = atlas.renderer("svg");
// r.render(scene, "svgElement", {collectionBounds: false});	