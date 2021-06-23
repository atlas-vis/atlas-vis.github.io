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
<span style="font-size:1.2em">Subclasses: [RectPath](../rectpath/), [CirclePath](../circlepath/)</span>

The Path class represents a gemetric path consisting of multiple [vertices](../../basic/vertex/) connected by [segments](../../basic/segment). To create a path object, use the _mark_ method in the [Scene](../../group/scene) class, for example:

    let path = scene.mark("path", {
                  vertices: [
		                [200, 50], [350, 50], [500, 50]
                  ],
                  strokeColor: "#95D0F5"
              });

### Properties
| property |  explanation  | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the path | [Rectangle](../../basic/rectangle/) | |
|**center** <img width="70px" src="../../readonly.png">| the center of the path bounds | [Point](../../basic/point/) | |
|**closed**| whether the path is closed  | Boolean | false |
|**curveMode**| how the segments are drawn <span style="color:red;">possible values</span> | String | "linear" |
|**vertices** <img width="70px" src="../../readonly.png">| the vertices along the path | Array |  | 
|**seg
ments** <img width="70px" src="../../readonly.png"> | the segments on the path | Array | | 
|**firstVertex** <img width="70px" src="../../readonly.png">| returns the first vertex of the path | [Vertex](../../basic/vertex/) |
|**firstSegment** <img width="70px" src="../../readonly.png">| returns the first segment of the path | [Segment](../../basic/segment/) |
|**fillColor**| the fill color of the path if it is closed | Color | undefined | 
|**strokeColor** | the stroke color of the path | Color | #cccccc | 
|**strokeWidth** | the stroke width of the path in pixels | Number | 1| 
|**opacity** | the opacity value of the path (between 0 and 1) | Number | 1 |
{.table-striped}

### Properties inherited from [Mark](../mark/)
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the path | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the path | String | "path" | 
|**dataScope**| the [data scope](../../data/datascope/) of the path | [DataScope](../../data/datascope/) | undefined |
{.table-striped}

### Methods
| method |  explanation   | return type |
| ---- | --- | --- |
| **addVertex**(x, y, i) | adds a vertex at the specified index with specified coordinates<br> x: x coordinate (type Number)<br> y: y coordinate (type Number)<br>i: index to add the vertex (type Number)  | void |
| **getSVGPathData**() | returns a string to be used as the d parameter in an SVG path element | String |
| **sortVertices**(channel, reverse) | sort the vertices by a visual channel<br>channel: the channel to sort the vertices by (type String)<br> reverse: (optional) setting to true will sort in descending order; default is false. | void |
| **sortVerticesByData**(field, reverse, order) | sort the vertices by a data field<br>field: the data field to sort the vertices by (type String)<br>reverse: (optional) setting to true will sort in descending order; default is false.<br>order: (optional) an array of field values in ascending order | void |
| **translate**(dx, dy) | move the path by the given parameters<br>dx: number of pixels to move in the x direction (type Number)<br> dy: number of pixels to move in the y direction (type Number) | void |
{.table-striped}

### Methods inherited from [Mark](../mark/)
| method |  explanation   | return type |
| --- | --- | --- |
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
