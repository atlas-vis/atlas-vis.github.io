---
title: "Gridlines"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "guide"
weight: 750
toc: true
---

The Gridlines class represents a set of grid lines for a visual encoding. To create a Gridlines object, use the [_gridlines_ method](../../group/scene/#methods-create-guides) in the [Scene](../../group/scene/) class, for example:

    let gridlines = scene.gridlines("x", "metric");

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the legend | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the legend | String | "legend" | 
|**channel** <img width="70px" src="../../readonly.png">| the visual channel of the legend<br>possible values: "fillColor", "strokeColor" | String | | 
|**field** <img width="70px" src="../../readonly.png">| the data field of the legend | String | | 
|**x**| the x coordinate of vertical gridlines | Number | | 
|**y**| the y coordinate of horizontal gridlines | Number | | 
|**textColor**| the text color of gridlines | Color | "#555" | 
|**strokeColor**| the stroke color of gridlines | Color | "#ddd" | 
|**strokeWidth**| the stroke width of gridlines | Number | 1 | 
|**values** | the data values represented by the grid lines,<br>if not provided, Atlas will auto-generate values | Array | | 
{.table-striped}