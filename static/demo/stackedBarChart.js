let scn = atlas.scene();
let rect = scn.mark("rectangle", {top:100, left: 100, width: 20, height: 390, fillColor: "#fff"} );
let dt = atlas.csv("csv/olympic-medals.csv");

//first partition then repeat
// let medals = scn.divide(rect, "horizontal", "Medal_Type", dt);
// let htEncoding = scn.bind(rect, "height", "Count", dt);
// let countries = scn.repeat(medals, "Country_Code", dt);
// countries.layout = al.layout("grid", {"numCols": 20, "numRows": 5, "hGap": 15, "vGap": 10});

//first repeat then partition
let countries = scn.repeat(rect, dt, {field: "Country_Code"});
countries.layout = atlas.layout("grid", {numRows: 1, hGap: 15, vGap: 10});
scn.divide(rect, dt, {orientation: "horizontal", field: "Medal_Type"});

let htEncoding = scn.encode(rect, {field: "Count", channel: "height"});
let fillEnc = scn.encode(rect, {field: "Medal_Type", channel: "fillColor", mapping: {"Gold": "#c9b037", "Silver": "#d7d7d7", "Bronze": "#ad8a56"}});

scn.axis("height", "Count", {orientation: "left"});
scn.axis("x", "Country_Code", {orientation: "bottom"});
scn.legend("fillColor", "Medal_Type", {x: 700, y: 200});


let r = atlas.renderer("svg");
r.render(scn, "svgElement", {collectionBounds: false});	