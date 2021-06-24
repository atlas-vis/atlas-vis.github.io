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

    let rect = scene.mark("rect", {top: 50, left: 100, width: 200, height: 80, fillColor: "blue"});

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**left** | the x coordinate of the left hand side of the rectangle | Number |  | 
|**top** | the y coordinate of the top of the rectangle | Number |  | 
|**right** <img width="70px" src="../../readonly.png"> | the x coordinate of the right hand side of the rectangle | Number |  | 
|**bottom** <img width="70px" src="../../readonly.png"> | the y coordinate of the bottom of the rectangle | Number |  | 
|**width** | the width of the rectangle | Number |  | 
|**height** | the height of the rectangle | Number |  | 
|**topSegment** <img width="70px" src="../../readonly.png"> | the top segment of the rectangle | [Segment](../../basic/segment/) |  | 
|**rightSegment** <img width="70px" src="../../readonly.png"> | the right segment of the rectangle | [Segment](../../basic/segment/) |  | 
|**bottomSegment** <img width="70px" src="../../readonly.png"> | the bottom segment of the rectangle | [Segment](../../basic/segment/) |  | 
|**leftSegment** <img width="70px" src="../../readonly.png"> | the left segment of the rectangle | [Segment](../../basic/segment/) |  | 
{.table-striped}


### Properties inherited from [Path](../path/)
| property |  explanation  | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the path | [Rectangle](../../basic/rectangle/) | |
|**center** <img width="70px" src="../../readonly.png">| the center of the path bounds | [Point](../../basic/point/) | |
|**closed**| whether the path is closed  | Boolean | false |
|**curveMode**| how the segments are drawn  | String | "linear" |
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
|**type** <img width="70px" src="../../readonly.png"> | the type of the path | String | "rectangle" | 
|**dataScope**| the [data scope](../../data/datascope/) of the path | [DataScope](../../data/datascope/) | undefined |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **resize**(wd, ht) | change the width and height of the rectangle | void |
{.table-striped}

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
| **duplicate**() | returns a copy of this mark | [RectPath](../rectpath/) | 
{.table-striped}

<!-- ## Check for outdated packages

The [`npm outdated`](https://docs.npmjs.com/cli/v7/commands/npm-outdated) command will check the registry to see if any (or, specific) installed packages are currently outdated:

```bash
npm outdated [[<@scope>/]<pkg> ...]
```

## Update packages

The [`npm update`](https://docs.npmjs.com/cli/v7/commands/npm-update) command will update all the packages listed to the latest version (specified by the tag config), respecting semver:

```bash
npm update [<pkg>...]
``` -->
<!-- {{< alert icon="💡" text="Learn more about <a href=\"https://docs.npmjs.com/about-semantic-versioning\">semantic versioning</a> and <a href=\"https://docs.npmjs.com/cli/v6/using-npm/semver#advanced-range-syntax\">advanced range syntax</a>." >}} -->