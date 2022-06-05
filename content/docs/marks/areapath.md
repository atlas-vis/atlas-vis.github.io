---
title: "AreaPath"
description: ""
lead: ""
date: 2020-11-12T15:22:20+01:00
lastmod: 2020-11-12T15:22:20+01:00
draft: false
images: []
menu: 
  docs:
    parent: "marks"
weight: 45
toc: true
---

<span style="font-size:1.2em">extends [Path](../path/)</span><br>

The AreaPath class represents an enclosed area mark that is used in visualizations such as the [area chart](../../../gallery.html#AreaChart) and the [violin plot](../../../gallery.html#ViolinPlot). You cannot create an AreaPath object directly, instead, you need to use the [_densify_ method](../../group/scene/#methods-join-graphics-with-data) in the [Scene](../../group/scene) class to transform a [RectPath](../rectpath/) to an AreaPath. [Here is an explanation](../../../tutorials/join/#densify) of the densify operation. The figure below shows how AreaPath objects are created from a RectPath object through the densify operation.

{{< figure src="../area.png" width="500px" alt="AreaPath" caption="" class="border-0 mx-auto text-center" >}}


### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**width** <img width="70px" src="../../readonly.png">| the width of the area | Number |  | 
|**height** <img width="70px" src="../../readonly.png">| the height of the area | Number |  | 
|**left** <img width="70px" src="../../readonly.png">| the x coordinate of the first vertex | Number |  | 
|**top** <img width="70px" src="../../readonly.png">| the y coordinate of the first vertex | Number |  | 
|**orientation** <img width="70px" src="../../readonly.png">| the orientation of the area | String |  | 
|**baseline** | the [anchor](../../global/constants/#anchor) used to evenly distribute the width or height of the area | String |  | 
|**firstVertexPair** <img width="70px" src="../../readonly.png">| the first pair of the vertices (highlighted in red in the figure above) | Array of [Vertex](../../basic/vertex/) |  | 
{.table-striped}


### Properties inherited from Path
| property |  explanation  | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the path | [Rectangle](../../basic/rectangle/) | |
|**x** <img width="70px" src="../../readonly.png">| the x coordinate of the center of the path bounds | Number | |
|**y** <img width="70px" src="../../readonly.png">| the y coordinate of the center of the path bounds | Number | |
|**curveMode**| how the segments are drawn  | String | |
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
|**type** <img width="70px" src="../../readonly.png"> | the type of the path | String | "area" | 
|**dataScope**| the [data scope](../../data/datascope/) of the path | [DataScope](../../data/datascope/) | undefined |
|**opacity** | the opacity value of the path (between 0 and 1) | Number | 1 |
|**visibility**| whether the path is visible ("visible" or "hidden") | String | "visible" |
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
| **duplicate**() | returns a copy of this mark | [RectPath](../areapath/) |
{.table-striped}

