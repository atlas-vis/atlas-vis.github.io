---
title: "Image"
description: ""
lead: ""
date: 2020-10-06T08:49:31+00:00
lastmod: 2020-10-06T08:49:31+00:00
draft: false
images: []
menu:
  docs:
    parent: "marks"
weight: 51
toc: true
--- 
<span style="font-size:1.2em">extends [Mark](../mark/)</span><br>

The Image class represents an image mark. To create an Image object, use the _mark_ method in the [Scene](../../group/scene) class, for example:
```js
    let img = scene.mark("image", {x: 50, y: 100, width: 20, height: 20 src: "icon.png"});
```

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**x** | the x coordinate of the left border of the image | Number | 0 | 
|**y** | the y coordinate of the top border of the image | Number | 0 | 
|**src** | the url of the image content | String | "" | 
|**width** | the width of the image | Number | 100 | 
|**height** | the height of the image | Number | 100 | 
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the image | [Rectangle](../../basic/rectangle/) | |
{.table-striped}

### Properties inherited from Mark
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the image | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the image | String | "image" | 
|**dataScope**| the [data scope](../../data/datascope/) of the image | [DataScope](../../data/datascope/) | undefined |
|**opacity** | the opacity value of the image (between 0 and 1) | Number | 1 |
|**visibility**| whether the image is visible ("visible" or "hidden") | String | "visible" |
{.table-striped}

### Methods inherited from Mark
| method |  explanation   | return type |
| --- | --- | --- |
| **contains**(x, y) | whether this mark contains a point<br>x (Number): x coordinate of the point<br>y (Number): y coordinate of the point | Boolean |
| **getScene**() | returns the scene in which this mark resides | [Scene](../../group/scene) |
| **duplicate**() | returns a copy of this mark | [Text](../pointtext/) | 
{.table-striped}