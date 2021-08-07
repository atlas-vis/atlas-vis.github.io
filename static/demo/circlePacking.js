let scn = atlas.scene();
let dt = await atlas.csv("csv/oecd_population_2018.csv");
let circle = scn.mark("circle", {radius: 80, x: 100, y: 50, fillColor: "orange", strokeWidth: 0});

let collection = scn.repeat(circle, dt, {field: "Country"});
scn.encode(circle, {field: "Population", channel: "area"});
collection.layout = atlas.layout("packing", {x: 300, y: 300});

let text = scn.mark("text", {fillColor: "white"});
scn.repeat(text, dt);
scn.encode(text, {field: "Country", channel: "text"});
let enc = scn.encode(text, {field: "Population", channel: "fontSize"});
enc.scale.range = [5, 20];
scn.affix(text, circle, "x");
scn.affix(text, circle, "y");

scn.encode(circle, {field: "Continent", channel: "fillColor"});
scn.legend("fillColor", "Continent", {x: 550, y: 250});