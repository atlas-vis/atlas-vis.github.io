---
title: "Text"
description: ""
lead: ""
date: 2021-06-20T20:25:40-04:00
lastmod: 2021-06-20T20:25:40-04:00
draft: false
images: []
menu: 
  docs:
    parent: "marks"
weight: 50
toc: true
---
<span style="font-size:1.2em">extends [Mark](../mark/)</span><br>


The Text class represents a text element. To create a Text object, use the _mark_ method in the [Scene](../../group/scene) class, for example:
```js
    let txt = scene.mark("text", {x: 50, y: 100, text: "hello"});
```

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**anchor** | the anchor of this text (Figure 1) | Array | ["center", "middle"] | 
|**x** | the x coordinate of the anchor | Number | 0 | 
|**y** | the y coordinate of the anchor | Number | 0 | 
|**text** | the text content | String | "" | 
|**fontFamily** | the font family of the text | String | "Arial" | 
|**fontSize** | the font size of the text | String | "12px" | 
|**fontWeight** | the font weight of the text | String | "regular" | 
|**fillColor** | the color of the text | Color | "black" | 
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the text | [Rectangle](../../basic/rectangle/) | |
{.table-striped}

{{< figure src="../anchor.png" alt="text anchor" caption="Figure 1: Different anchor properties with the same x and y properties (the orange dot) lead to different text positions." class="border-0 mx-auto text-center">}}

### Properties inherited from Mark
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the text | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the text | String | "pointText" | 
|**dataScope**| the [data scope](../../data/datascope/) of the text | [DataScope](../../data/datascope/) | undefined |
|**opacity** | the opacity value of the text (between 0 and 1) | Number | 1 |
|**visibility**| whether the text is visible ("visible" or "hidden") | String | "visible" |
{.table-striped}


<!-- ### Methods
| method |  explanation   | return type |
| ---- | --- | --- |

{.table-striped} -->


### Methods inherited from Mark
| method |  explanation   | return type |
| --- | --- | --- |
| **contains**(x, y) | whether this text contains a point<br>x (Number): x coordinate of the point<br>y (Number): y coordinate of the point | Boolean |
| **getScene**() | returns the scene in which this mark resides | [Scene](../../group/scene) |
| **duplicate**() | returns a copy of this mark | [Text](../pointtext/) | 
{.table-striped}