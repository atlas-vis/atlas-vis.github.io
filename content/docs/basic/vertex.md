---
title: "Vertex"
description: ""
lead: ""
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "basic"
weight: 10
toc: true
---

The Vertex class represents a vertex (sometimes called an anchor point) in a [path](../../mark/path/). For example, a triangle has three vertices; a rectangle has four vertices. A vertex can have its own visual styles such as geometric shape, fill color and size. By default, a vertex is invisible (width and height set to 0). 

To create a vertex, use the _addVertex_ method in the [Path](../../mark/path/) class.

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the vertex | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the vertex | String | "vertex" | 
|**x**| the x coordinate of the vertex center | Number | 0 | 
|**y**| the y coordinate of the vertex center | Number | 0 | 
|**center** <img width="70px" src="../../readonly.png">| get the center point of the vertex | [Point](../point/)  |
|**dataScope**| the [data scope](../../data/datascope/) of the vertex | [DataScope](../../data/datascope/) | undefined |
|**parent** <img width="70px" src="../../readonly.png">| the parent mark of the vertex | [Path](../../mark/path/) | |
|**shape** | the shape of the vertex, currently supporting "**rect**" and "**circle**" | String | undefined |
|**width** | the width of the vertex shape | Number | 0 |
|**height** | the height of the vertex shape | Number | 0 |
|**radius** | the radius of the vertex if the shape is "circle" | Number | 0 |
|**fillColor** | the fill color of the vertex shape | Color | undefined |
|**opacity** | the opacity of the vertex shape | Number | undefined |
|**strokeWidth** | the stroke width of the vertex shape | Number | 0 |
|**strokeColor** | the stroke color of the vertex shape | Color | "#aaa" |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **translate**(dx, dy) | move the vertex by dx (type Number) along x and dy (type Number) along y | void |
<!-- | **clone**() | returns a copy of this vertex | [Vertex](../vertex/) | -->

