---
title: "Path"
description: ""
lead: ""
date: 2020-10-06T08:49:31+00:00
lastmod: 2020-10-06T08:49:31+00:00
draft: false
images: []
menu:
  docs:
    parent: "marks"
weight: 30
toc: true
--- 
<span style="font-size:1.2em">extends [Mark](../mark/)</span><br>
<span style="font-size:1.2em">Subclasses: [RectPath](../rectpath/), [CirclePath](../circlepath/), [AreaPath](../areapath/), [PolygonPath](../polygonpath/), [ArcPath](../arcpath/), [PiePath](../piepath/), [RingPath](../ringpath/)</span>

The Path class represents a gemetric path consisting of multiple [vertices](../../basic/vertex/) connected by [segments](../../basic/segment). To create a path object, use the _mark_ method in the [Scene](../../group/scene) class, for example:

```js
    let path = scene.mark("path", {
                  vertices: [
		                [200, 50], [350, 50], [500, 50]
                  ],
                  strokeColor: "#95D0F5"
              });
```

A straight line is also represented as a path object in Atlas. The following code returns a Path object with two vertices.

```js
    let line = scene.mark("line", {x1: 0, y1: 20, x2: 300, y2: 50});
``` 

### Properties
| property |  explanation  | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the path | [Rectangle](../../basic/rectangle/) | |
|**x** <img width="70px" src="../../readonly.png">| the x coordinate of the center of the path bounds | Number | |
|**y** <img width="70px" src="../../readonly.png">| the y coordinate of the center of the path bounds | Number | |
|**curveMode**| how the segments are drawn, [possible values](../../global/constants/#curvemode) | String | "linear" |
|**vertices** <img width="70px" src="../../readonly.png">| the vertices along the path | Array of [Vertex](../../basic/vertex/) |  | 
|**segments** <img width="70px" src="../../readonly.png"> | the segments on the path | Array of [Segment](../../basic/segment/) | 
|**firstVertex** <img width="70px" src="../../readonly.png">| returns the first vertex of the path | [Vertex](../../basic/vertex/) |
|**firstSegment** <img width="70px" src="../../readonly.png">| returns the first segment of the path | [Segment](../../basic/segment/) |
|**fillColor**| the fill color of the path if it is closed | Color | undefined | 
|**strokeColor** | the stroke color of the path | Color | "#ccc" | 
|**strokeDash** | the dashes and gaps for the path stroke | String | "none" | 
|**strokeWidth** | the stroke width of the path in pixels | Number | 1| 
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
|**type** <img width="70px" src="../../readonly.png"> | the type of the path | String | "path" | 
|**dataScope**| the [data scope](../../data/datascope/) of the path | [DataScope](../../data/datascope/) | undefined |
|**opacity** | the opacity value of the path (between 0 and 1) | Number | 1 |
|**visibility**| whether the path is visible ("visible" or "hidden") | String | "visible" |
{.table-striped}

### Methods
| method |  explanation   | return type |
| ---- | --- | --- |
| **addVertex**(x, y, i) | adds a vertex at the specified index with specified coordinates<br> x (Number): x coordinate<br> y (Number): y coordinate<br>i (Number): index to add the vertex | void |
| **getSVGPathData**() | returns a string to be used as the d parameter in an SVG path element | String |
| **sortVertices**<br>(channel, reverse) | sort the vertices by a visual channel<br>channel (String): the channel to sort the vertices by (type String)<br> reverse (Boolean, optional): setting to true will sort in descending order;<br>default is false. | void |
| **sortVerticesByData**<br>(field, reverse, order) | sort the vertices by a data field<br>field (String): the data field to sort the vertices by (type String)<br>reverse (Boolean, optional): setting to true will sort in descending order;<br>default is false.<br>order (Boolean, optional): an array of field values in ascending order | void |
{.table-striped}

### Methods inherited from Mark
| method |  explanation   | return type |
| --- | --- | --- |
| **contains**(x, y) | whether this path contains a point<br>x (Number): x coordinate of the point<br>y (Number): y coordinate of the point | Boolean |
| **getScene**() | returns the scene in which this mark resides | [Scene](../../group/scene) |
| **duplicate**() | returns a copy of this mark | [Path](../path/) | 
{.table-striped}

<!-- ## Hyas?

Doks is a [Hyas theme](https://gethyas.com/themes/) build by the creator of Hyas.

## Footer notice?

Please keep it in place.

## Keyboard shortcuts for search?

- focus: `/`
- select: `↓` and `↑`
- open: `Enter`
- close: `Esc`

## Other documentation?

- [Netlify](https://docs.netlify.com/)
- [Hugo](https://gohugo.io/documentation/)

## Can I get support?

Create a topic:

- [Netlify Community](https://community.netlify.com/)
- [Hugo Forums](https://discourse.gohugo.io/)
- [Doks Discussions](https://github.com/h-enk/doks/discussions)

## Contact the creator?

Send `h-enk` a message:

- [Netlify Community](https://community.netlify.com/)
- [Hugo Forums](https://discourse.gohugo.io/)
- [Doks Discussions](https://github.com/h-enk/doks/discussions) -->
