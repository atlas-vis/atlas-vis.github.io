let scn = atlas.scene();
let dt = await atlas.csv("csv/oecd_population_2018.csv");
dt.transform("sort", ["Continent"]);
let r1 = scn.mark("ring", {cx: 400, cy: 300, innerRadius: 60, outerRadius: 120, fillColor: "orange", strokeColor: "#222", opacity: 0.75}),
    r2 = scn.mark("ring", {cx: 400, cy: 300, innerRadius: 120, outerRadius: 220, fillColor: "orange", strokeColor: "#222", opacity: 0.75});

let continents = scn.divide(r1, dt, {field: "Continent"}),
    countries = scn.divide(r2, dt, {field: "Country"});
scn.encode(continents.firstChild, {field: "Population", channel: "angle"});
scn.encode(countries.firstChild, {field: "Population", channel: "angle"});
let enc = scn.encode(continents.firstChild, {field: "Continent", channel: "fillColor"});
scn.encode(countries.firstChild, {field: "Continent", channel: "fillColor", scale: enc.scale});
scn.legend("fillColor", "Continent", {x: 700, y:100});