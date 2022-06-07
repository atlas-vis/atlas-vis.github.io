---
title: "LinkPath"
description: ""
lead: ""
date: 2020-11-12T15:22:20+01:00
lastmod: 2020-11-12T15:22:20+01:00
draft: false
images: []
menu: 
  docs:
    parent: "marks"
weight: 49
toc: true
---

<span style="font-size:1.2em">extends [Path](../path/)</span><br>

The LinkPath class represents a link in a node-link visualization. To create a LinkPath object, use the _mark_ method in the [Scene](../../group/scene) class, for example:

```js
    let link = scene.mark("link", {strokeColor: "#eee", mode: "curveVertical"});
```

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**mode** | how the link will be drawn, current supports three modes:<br>"linear", "curveHorizontal", and "curveVertical" | String | "linear" | 
|**source** <img width="70px" src="../../readonly.png"> | the mark representing the source node | [Mark](../../marks/mark) | | 
|**target** <img width="70px" src="../../readonly.png"> | the mark representing the target node | [Mark](../../marks/mark) | | 
|**sourceAnchor** | the anchor of the source mark this link is attached to | Array | ["center", "middle"] | 
|**targetAnchor** | the anchor of the target mark this link is attached to | Array | ["center", "middle"] | 
|**sourceOffset** | the offset between this link and the source mark's anchor | Array | [0, 0] | 
|**targetOffset** | the offset between this link and the target mark's anchor | Array | [0, 0] | 
{.table-striped}



### Properties inherited from Path
| property |  explanation  | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the path | [Rectangle](../../basic/rectangle/) | |
|**x** | the x coordinate of the center of the arc | Number | 0 |
|**y** | the y coordinate of the center of the arc | Number | 0 |
|**vertices** <img width="70px" src="../../readonly.png">| the vertices along the path | Array |  | 
|**segments** <img width="70px" src="../../readonly.png"> | the segments on the path | Array | | 
|**firstVertex** <img width="70px" src="../../readonly.png">| returns the first vertex of the path | [Vertex](../../basic/vertex/) |
|**firstSegment** <img width="70px" src="../../readonly.png"> | returns the first segment of the path | [Segment](../../basic/segment/) |
|**fillColor**| the fill color of the path if it is closed | Color | undefined | 
|**strokeColor** | the stroke color of the path | Color | "#ccc" | 
|**strokeDash** | the dashes and gaps for the path stroke | String | "none" | 
|**strokeWidth** | the stroke width of the path in pixels | Number | 1| 
|**opacity** | the opacity value of the path (between 0 and 1) | Number | 1 |
|**vxShape**| the shape of the vertices on this path<br>possible values: "rect", "circle" | String | undefined | 
|**vxWidth**| the width of the vertices on this path | Number | 0 | 
|**vxHeight**| the height of the vertices on this path | Number | 0 |
|**vxRadius**| the radius of the vertices on this path if the shape is "circle" | Number | 0 |  
|**vxFillColor**| the fill color of the vertices on this path | Color | "#555" | 
|**vxStrokeColor** | the stroke color of the vertices on this path | Color | "#aaa" | 
|**vxStrokeWidth** | the stroke width of the vertices on this path in pixels | Number | 0 | 
|**vxOpacity** | the opacity of the vertices on this path | Number | 1 | 
{.table-striped}

### Properties inherited from Mark
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the path | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the path | String | "circle" | 
|**dataScope**| the [data scope](../../data/datascope/) of the path | [DataScope](../../data/datascope/) | undefined |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
|**getPointAt(frac)** | get the coordinates of a point at the specified location on the link<br>frac (Number): between 0 (start of link) and 1 (end of link)  | [Point](../../basic/point) |  | 
{.table-striped}

### Methods inherited from Path
| method |  explanation   | return type |
| ---- | --- | --- |
| **getSVGPathData**() | returns a string to be used as the d parameter in an SVG path element | String |
{.table-striped}

### Methods inherited from Mark
| method |  explanation   | return type |
| --- | --- | --- |
| **contains**(x, y) | whether this mark contains a point<br>x (Number): x coordinate of the point<br>y (Number): y coordinate of the point | Boolean |
| **getScene**() | returns the scene in which this mark resides | [Scene](../../group/scene) |
| **duplicate**() | returns a copy of this mark | [ArcPath](../arcpath/) | 
{.table-striped}