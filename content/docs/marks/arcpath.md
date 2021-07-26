---
title: "ArcPath"
description: ""
lead: ""
date: 2020-11-12T15:22:20+01:00
lastmod: 2020-11-12T15:22:20+01:00
draft: false
images: []
menu: 
  docs:
    parent: "marks"
weight: 48
toc: true
---

<span style="font-size:1.2em">extends [Path](../path/)</span><br>

The ArcPath class represents a sector mark that is used in a Doughnut Chart and a Sunburst Chart. You cannot create an ArcPath object directly, instead, you need to use the [_divide_ method](../../group/scene/#methods-join-graphics-with-data) in the [Scene](../../group/scene) class to transform a [RingPath](../ringpath/) to a collection of ArcPath objects. [Here is an explanation](../../../tutorials/join/#divide) of the divide operation. 


### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**cx** | the x coordinate of the center of the ring | Number | 0 | 
|**cy** | the y coordinate of the center of the ring | Number | 0 | 
|**innerRadius** | the inner radius of the ring | Number | 100 | 
|**outerRadius** | the outer radius of the ring | Number | 200 | 
|**startAngle** | the start angle of the ring in degrees | Number | 0 | 
|**endAngle** | the end angle of the ring in degrees | Number | 90 | 
{.table-striped}

Angles in Atlas are specified using the polar coordinate system, where 0 is at the positive x axis, and the angle increases in the counterclockwise direction. The figure below illustrates various values of startAngle and endAngle.

{{< figure src="../arc.png" width="800px" alt="start angle and end angle for an arc" caption="" class="border-0 mx-auto text-center">}}



### Properties inherited from [Path](../path/)
| property |  explanation  | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the path | [Rectangle](../../basic/rectangle/) | |
|**center** <img width="70px" src="../../readonly.png">| the center of the path bounds | [Point](../../basic/point/) | |
|**closed**| whether the path is closed  | Boolean | true |
|**vertices** <img width="70px" src="../../readonly.png">| the vertices along the path | Array |  | 
|**segments** <img width="70px" src="../../readonly.png"> | the segments on the path | Array | | 
|**firstVertex** <img width="70px" src="../../readonly.png">| returns the first vertex of the path | [Vertex](../../basic/vertex/) |
|**firstSegment** <img width="70px" src="../../readonly.png"> | returns the first segment of the path | [Segment](../../basic/segment/) |
|**fillColor**| the fill color of the path if it is closed | Color | undefined | 
|**strokeColor** | the stroke color of the path | Color | "#ccc" | 
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

### Properties inherited from [Mark](../mark/)
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the path | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the path | String | "circle" | 
|**dataScope**| the [data scope](../../data/datascope/) of the path | [DataScope](../../data/datascope/) | undefined |
{.table-striped}

### Methods inherited from [Path](../path/)
| method |  explanation   | return type |
| ---- | --- | --- |
| **getSVGPathData**() | returns a string to be used as the d parameter in an SVG path element | String |
{.table-striped}

### Methods inherited from [Mark](../mark/)
| method |  explanation   | return type |
| --- | --- | --- |
| **getScene**() | returns the scene in which this mark resides | [Scene](../../group/scene) |
| **duplicate**() | returns a copy of this mark | [CirclePath](../circlepath/) | 
| **translate**(dx, dy) | move the path by the given parameters<br>dx (Number): number of pixels to move in the x direction<br> dy (Number): number of pixels to move in the y direction | void |
{.table-striped}