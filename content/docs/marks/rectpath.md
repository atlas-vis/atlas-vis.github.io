---
title: "RectPath"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "marks"
weight: 35
toc: true
---

<span style="font-size:1.2em">extends [Path](../path/)</span><br>

The RectPath class represents a rectangular mark. To create a RectPath object, use the _mark_ method in the [Scene](../../group/scene) class, for example:


```js
    let rect = scene.mark("rect", {top: 50, left: 100, width: 200, height: 80, fillColor: "blue"});
```


### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**left** | the x coordinate of the left hand side of the rectangle | Number | 0 | 
|**top** | the y coordinate of the top of the rectangle | Number | 0 | 
|**right** <img width="70px" src="../../readonly.png"> | the x coordinate of the right hand side of the rectangle | Number |  | 
|**bottom** <img width="70px" src="../../readonly.png"> | the y coordinate of the bottom of the rectangle | Number |  | 
|**width** | the width of the rectangle | Number | 100 | 
|**height** | the height of the rectangle | Number |  100 | 
|**area** <img width="70px" src="../../readonly.png">| the area of the rectangle | Number |  | 
|**topSegment** <img width="70px" src="../../readonly.png"> | the top segment of the rectangle | [Segment](../../basic/segment/) |  | 
|**rightSegment** <img width="70px" src="../../readonly.png"> | the right segment of the rectangle | [Segment](../../basic/segment/) |  | 
|**bottomSegment** <img width="70px" src="../../readonly.png"> | the bottom segment of the rectangle | [Segment](../../basic/segment/) |  | 
|**leftSegment** <img width="70px" src="../../readonly.png"> | the left segment of the rectangle | [Segment](../../basic/segment/) |  | 
{.table-striped}


### Properties inherited from Path
| property |  explanation  | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the path | [Rectangle](../../basic/rectangle/) | |
|**x** <img width="70px" src="../../readonly.png">| the x coordinate of the center of the path bounds | Number | |
|**y** <img width="70px" src="../../readonly.png">| the y coordinate of the center of the path bounds | Number | |
|**curveMode**| how the segments are drawn  | String | "linear" |
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
|**type** <img width="70px" src="../../readonly.png"> | the type of the path | String | "rect" | 
|**dataScope**| the [data scope](../../data/datascope/) of the path | [DataScope](../../data/datascope/) | undefined |
|**opacity** | the opacity value of the path (between 0 and 1) | Number | 1 |
|**visibility**| whether the path is visible ("visible" or "hidden") | String | "visible" |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **resize**(wd, ht) | change the width and height of the rectangle | void |
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
| **duplicate**() | returns a copy of this mark | [RectPath](../rectpath/) | 
{.table-striped}
