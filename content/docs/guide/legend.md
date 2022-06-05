---
title: "Legend"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "guide"
weight: 730
toc: true
---

The Legend class represents a legend for a color encoding. To create a Legend object, use the [_legend_ method](../../group/scene/#methods-create-guides) in the [Scene](../../group/scene/) class, for example:

    let legend = scene.legend("fillColor", "names", {x: 100, y: 300});

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the legend | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the legend | String | "legend" | 
|**channel** <img width="70px" src="../../readonly.png">| the visual channel of the legend<br>possible values: "fillColor", "strokeColor" | String | | 
|**field** <img width="70px" src="../../readonly.png">| the data field of the legend | String | | 
|**fieldType** <img width="70px" src="../../readonly.png">| the type of the data field of the legend | String | | 
|**x**| the x coordinate of the left side of the legend | Number | 0 | 
|**y**| the y coordinate of the top of the legend | Number | 0 | 
|**orientation**| the orientation of the legend ("horizontal" or "vertical") | String | "vertical" |
|**textColor**| the text color of the legend | Color | "#555" | 
|**strokeColor**| the stroke color of the ticks in the legend | Color | "#555" | 
{.table-striped}