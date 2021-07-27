let scn = atlas.scene();
let dt = await atlas.csv("csv/oecd_population_2018.csv");
let rect = scn.mark("rect", {top: 60, left: 50, width: 600, height: 800, strokeWidth: 1});

let continents = scn.divide(rect, dt, {field: "Continent", orientation: "vertical"});
let countries = scn.divide(continents.firstChild, dt, {field: "Country", orientation: "horizontal"});
scn.encode(countries.firstChild, {field: "Population", channel: "area"});
continents.layout = atlas.layout("treemap", {width: 800, height: 500});
scn.encode(rect, {field: "Continent", channel: "fillColor"});
scn.legend("fillColor", "Continent", {x: 900, y:100});