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

Marks and glyphs can be created using the [_mark_ method in the Scene class](../../docs/group/scene/#methods-create-mark-or-group). For example, the following code creates a circle: 

```js
let circle = scene.mark("circle", {x: 50, y: 100, radius: 20});
```

The [types of marks](../../docs/global/constants/#mark-type) that can be created this way are:  [circle](../../docs/marks/circlepath/), [line](../../docs/marks/path/), [path](../../docs/marks/path/),  [rectangle](../../docs/marks/rectpath/), [ring](../../docs/marks/ringpath/), [text](../../docs/marks/pointtext/), and [image](../../docs/marks/image/). The other types of marks can only be created through the [repeat, divide or densify methods in the scene class](../../docs/group/scene/#methods-join-graphics-with-data), these include: [area](../../docs/marks/areapath/), [arc](../../docs/marks/arcpath/), [pie](../../docs/marks/piepath/), and [polygon](../../docs/marks/polygonpath/).

 For each type of mark, check out its [API reference](../../docs/marks/mark/) for mark properties and their default values. All types of marks except text and image are represented as paths, consisting of vertices and segments, as shown in the [object model](../../tutorials/vom/):

{{< figure src="paths.png" alt="Marks as Paths" caption="" class="border-0 mx-auto text-center">}}

The following code creates multiple marks and group them into a box plot [glyph](../../docs/group/glyph/):

```js
let line = scene.mark("line", {x1: 150, y1: 130, x2: 700, y2: 130, strokeColor: "#555", 
                vertexShape: "line", vertexWidth: 1, vertexHeight: 30}),
    box = scene.mark("rectangle", {top: 110, left: 200, width: 400, height: 40,
                    fillColor: "#95D0F5", strokeColor: "#111"}),
    medianLine = scene.mark("line", {x1: 300, y1: 110, x2: 300, y2: 150, strokeColor: "#000"});
    
let glyph = scene.glyph(line, box, medianLine);
```

When a mark or a glyph is created, it exists as a JavaScript object. You can print it to the web console using `console.log(mark)`, and inspect its properties. To render it on a webpage, we need to create a renderer. 

Atlas offers three types of renderers: **svg**, **canvas**, and **webgl**. Renderers are created using the [_renderer_ function](../../docs/rendering/renderer/). For each renderer, we need to define a corresponding display in the webpage first. For an **svg** renderer, the webpage needs to have an SVG element; for **canvas** and **webgl** renderers, the webpage needs to have an HTML Canvas element. We can then [render a scene](../../docs/rendering/renderer/#methods) to the corresponding display, for example:

    atlas.renderer("webgl", "canvasEle").render(scene);

Remember to call the _render_ method whenever your scene is changed so that the changes are reflected in the display. 