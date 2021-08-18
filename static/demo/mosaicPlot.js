let scene = atlas.scene();
let data = await atlas.csv("csv/gender-job-level.csv");
let rect = scene.mark("rect", {top:60, left: 100, width: 800, height: 650, strokeColor: "#fff", strokeWidth: 1, fillColor: "#ccc"});

let jobs = scene.divide(rect, data, {orientation: "horizontal", field: "Job Type"});
let genderInJob = scene.divide(jobs.firstChild, data, {orientation: "vertical", field: "Gender"});

scene.encode(genderInJob.firstChild, {channel: "fillColor", field: "Gender", mapping: {"Male": "#3F73B8", "Female": "#E97075"}});
let wdEncoding = scene.encode(genderInJob.firstChild, {channel: "width", field: "Percent Total"});
let htEncoding = scene.encode(genderInJob.firstChild, {field: "Percent Gender", channel: "height"});
wdEncoding.scale.rangeExtent = 450;

scene.axis("x", "Job Type", {orientation: "bottom", labelRotation: -45});
scene.legend("fillColor", "Gender", {x: 20, y: 60});