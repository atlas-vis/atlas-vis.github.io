---
title: "Segment"
description: ""
lead: ""
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "basic"
weight: 20
toc: true
---

The Segment class represents a line or a curve that connects two [vertices](../vertex/) in a [path](../../mark/path/). Segments are automatically created when vertices are added to a path. 

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the segment | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the segment | String | "segment" | 
|**vertex1** <img width="70px" src="../../readonly.png">| the first vertex this segment goes through | [Vertex](../vertex/) |  | 
|**vertex2** <img width="70px" src="../../readonly.png"> | the second vertex this segment goes through | [Vertex](../vertex/) | | 
|**center** <img width="70px" src="../../readonly.png">| get the center point of the segment | [Point](../point/)  |

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **translate**(dx, dy) | move the segment by dx (type Number) along x and dy (type Number) along y | void |
