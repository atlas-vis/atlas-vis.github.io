---
title: "CirclePath"
description: ""
lead: ""
date: 2020-11-12T15:22:20+01:00
lastmod: 2020-11-12T15:22:20+01:00
draft: false
images: []
menu: 
  docs:
    parent: "marks"
weight: 40
toc: true
---

<span style="font-size:1.2em">extends [Path](../path/)</span><br>

The CirclePath class represents a circle mark. To create a CirclePath object, use the _mark_ method in the [Scene](../../group/scene) class, for example:

    let circle = scene.mark("circle", {cx: 50, cy: 100, radius: 20, fillColor: "green"});

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**cx** | the x coordinate of the center of the circle | Number |  | 
|**cy** | the y coordinate of the center of the circle | Number |  | 
|**radius** | the radius of the rectangle | Number |  | 
{.table-striped}


### Properties inherited from [Path](../path/)
| property |  explanation  | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the path | [Rectangle](../../basic/rectangle/) | |
|**center** <img width="70px" src="../../readonly.png">| the center of the path bounds | [Point](../../basic/point/) | |
|**closed**| whether the path is closed  | Boolean | true |
|**curveMode**| how the segments are drawn  | String | |
|**vertices** <img width="70px" src="../../readonly.png">| the vertices along the path | Array |  | 
|**segments** <img width="70px" src="../../readonly.png"> | the segments on the path | Array | | 
|**firstVertex** <img width="70px" src="../../readonly.png">| returns the first vertex of the path | [Vertex](../../basic/vertex/) |
|**firstSegment** <img width="70px" src="../../readonly.png"> | returns the first segment of the path | [Segment](../../basic/segment/) |
|**fillColor**| the fill color of the path if it is closed | Color | undefined | 
|**strokeColor** | the stroke color of the path | Color | #cccccc | 
|**strokeWidth** | the stroke width of the path in pixels | Number | 1| 
|**opacity** | the opacity value of the path (between 0 and 1) | Number | 1 |
{.table-striped}

### Properties inherited from [Mark](../mark/)
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the path | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the path | String | "circle" | 
|**dataScope**| the [data scope](../../data/datascope/) of the path | [DataScope](../../data/datascope/) | undefined |
{.table-striped}

<!-- ### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **resize**(wd, ht) | change the width and height of the rectangle | void |
{.table-striped} -->

### Methods inherited from [Path](../path/)
| method |  explanation   | return type |
| ---- | --- | --- |
| **getSVGPathData**() | returns a string to be used as the d parameter in an SVG path element | String |
| **translate**(dx, dy) | move the path by the given parameters<br>dx: number of pixels to move in the x direction (type Number)<br> dy: number of pixels to move in the y direction (type Number) | void |
{.table-striped}

### Methods inherited from [Mark](../mark/)
| method |  explanation   | return type |
| --- | --- | --- |
| **getScene**() | returns the scene in which this mark resides | [Scene](../../group/scene) |
| **duplicate**() | returns a copy of this mark | [CirclePath](../circlepath/) | 
{.table-striped}

<!-- ## Problems updating npm packages

Delete the `./node_modules` folder, and run again:

```bash
npm install
```

## Problems with cache

Delete the temporary directories:

```bash
npm run clean
``` -->
