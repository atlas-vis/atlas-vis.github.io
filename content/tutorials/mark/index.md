---
title: "3. Create and Render Glyphs"
description: ""
lead: ""
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  tutorials:
    parent: "tutorials"
weight: 25
---

Marks and glyphs can be created using the [_mark_ method in the Scene class](../../docs/group/scene/#methods-create-mark-or-group). For example, the following code creates a [CirclePath](../../docs/marks/circlepath/): 

    let circle = scene.mark("circle", {cx: 50, cy: 100, radius: 20});

The types of marks that can be created this way are: [Path](../../docs/marks/path/), [CirclePath](../../docs/marks/circlepath/), [RectPath](../../docs/marks/rectpath/), and [Text](../../docs/marks/pointtext/). For each type of mark, check out its API reference for mark properties and their default values. 

The following code creates multiple marks and group them into a box plot [glyph](../../docs/group/glyph/):

    let line = scene.mark("line", {x1: 150, y1: 130, x2: 700, y2: 130, strokeColor: "#555", 
                    vertexShape: "line", vertexWidth: 1, vertexHeight: 30}),
        box = scene.mark("rectangle", {top: 110, left: 200, width: 400, height: 40,
                    fillColor: "#95D0F5", strokeColor: "#111"}),
        medianLine = scene.mark("line", {x1: 300, y1: 110, x2: 300, y2: 150, strokeColor: "#000"});
    
    let glyph = scene.glyph(line, box, medianLine);

When a mark or a glyph is created, it exists as a JavaScript object. You can print it to the web console using `console.log(mark)`, and inspect its properties. To render it on a webpage, we need to create a renderer. 

Atlas offers three types of renderers: **svg**, **canvas**, and **webgl**. Renderers are created using the [_renderer_ function](../../docs/rendering/renderer/). For each renderer, we need to define a corresponding display in the webpage first. For an **svg** renderer, the webpage needs to have an SVG element; for **canvas** and **webgl** renderers, the webpage needs to have an HTML Canvas element. We can then [render a scene](../../docs/rendering/renderer/#methods) to the corresponding display, for example:

    atlas.renderer("webgl").render(scene, "canvasId");