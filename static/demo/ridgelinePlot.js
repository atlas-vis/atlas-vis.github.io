let scene = atlas.scene();
let csv = await atlas.csv("csv/probability.csv");
let data = csv.transform("kde", ["Probability"], {min: -10, interval: 2.5, max: 150, bandwidth: 7});

let rect = scene.mark("rect", {top:30, left: 200, width: 400, height: 100, strokeColor: "#222", strokeWidth: 1, fillColor: "#84BC66"});
let Levels = scene.repeat(rect, data, {field: "Category"});
Levels.sortChildrenByData("Category", false, ["Almost Certainly", "Highly Likely", "Very Good Chance", "Probable", "Likely", "Probably", "We Believe", "Better Than Even", "About Even", "We Doubt", "Improbable", "Unlikely", "Probably Not", "Little Chance", "Almost No Chance", "Highly Unlikely", "Chances Are Slight"]);
Levels.layout = atlas.layout("grid", {numCols: 1, rowGap: -70});

let anyLevel = scene.densify(Levels.firstChild, data, {orientation: "horizontal", field: "Probability"});
let xEncoding = scene.encode(anyLevel, {channel: "x", field: "Probability"});
let htEncoding = scene.encode(anyLevel, {channel: "height", field: "Probability_density"});
scene.setProperties(anyLevel, {curveMode: "basis"})
scene.axis("x", "Probability", {orientation: "bottom", pathY: 620});
scene.axis("y", "Category", {orientation: "right", tickAnchor: "bottom", pathVisible: false});