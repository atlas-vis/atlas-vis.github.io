let scn = atlas.scene();
let dt = await atlas.csv("csv/gdp-lifeExp.csv");
let circle = scn.mark("circle", {radius: 6, x: 100, y: 80, fillColor: "orange", strokeWidth: 0});

let collection = scn.repeat(circle, dt, {field: "Country"});

//Country,GDP per capita,Life expectancy,Population,Continent
let xEncoding = scn.encode(circle, {field: "GDP per capita", channel: "x"});
let yEncoding = scn.encode(circle, {field: "Life expectancy", channel: "y"});
let fillEncoding = scn.encode(circle, {field: "Continent", channel: "fillColor"});

xEncoding.scale.rangeExtent = 450;
yEncoding.scale.rangeExtent = 450;

scn.setProperties(circle, {opacity: "0.7"});

scn.axis("x", "GDP per capita", {orientation: "bottom", labelFormat: ".2s"});
scn.axis("y", "Life expectancy", {orientation: "left"});
scn.legend("fillColor", "Continent", {x: 600, y: 250});
scn.gridlines("x", "GDP per capita");
scn.gridlines("y", "Life expectancy");


// let r = atlas.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: false});	
