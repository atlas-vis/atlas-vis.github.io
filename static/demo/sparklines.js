let scn = atlas.scene({fillColor: "#222"});
let dt = await atlas.csv("csv/stocks.csv");
let dt2 = await atlas.csv("csv/stocks-March-2010.csv");
//dt.parseFieldAsDate("date", "%b %Y");
let line = scn.mark("line", {x1: 300, y1: 100, x2: 450, y2: 150, strokeColor: "#ccc"});

let collection = scn.repeat(line, dt, {field: "company"});
collection.layout = atlas.layout("grid", {numCols: 1, rowGap : 25});

let polyLine = scn.densify(line, dt, {field: "date"});

let xEnc = scn.encode(polyLine.firstVertex, {field: "date", channel: "x"});
let yEnc = scn.encode(polyLine.firstVertex, {field: "price", channel: "y", includeZero: true});

let symbol = scn.mark("text", {x: 220, y:100, fontSize: "23px", fillColor: "white", anchor: ["left", "top"]}),
    company = scn.mark("text", {x:220, y:125, fontSize: "15px", fillColor: "#888", anchor: ["left", "top"]});
let glyph = scn.glyph(symbol, company);
let coll = scn.repeat(glyph, dt2, {field: "company"});
scn.encode(symbol, {field: "symbol", channel: "text"});
scn.encode(company, {field: "company", channel: "text"});
scn.affix(glyph, polyLine, {itemAnchor: "bottom", baseAnchor: "bottom"});

let price = scn.mark("text", {x: 470, y:100, fontSize: "20px", fillColor: "white", anchor: ["left", "top"]}),
    changeBg = scn.mark("rect", {left: 470, top: 125, width: 45, height: 20, strokeWidth: 0}),
    change = scn.mark("text", {x:475, y:125, fontSize: "15px", fillColor: "#bbb", anchor: ["left", "top"]});
let glyph2 = scn.glyph(price, changeBg, change);
scn.repeat(glyph2, dt2, {field: "company"});
scn.encode(price, {field: "price", channel: "text"});
scn.encode(change, {field: "change", channel: "text"});
let colorMapping = {"up": "green", "down": "red"};
scn.encode(changeBg, {field: "direction", channel: "fillColor", mapping: colorMapping});
scn.affix(glyph2, polyLine, {itemAnchor: "bottom", baseAnchor: "bottom"});

// let r = atlas.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: false});	