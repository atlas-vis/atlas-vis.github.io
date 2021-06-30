---
title: "Axis"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "guide"
weight: 700
toc: true
---

The Axis class represents an axis. To create an Axis object, use the [_axis_ method](../../group/scene/#methods-create-guides) in the [Scene](../../group/scene/) class, for example:

    let axis = scene.axis("x", "metric", {y: 300, tickValues: [0, 30, 60]});

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the axis | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the axis | String | "axis" | 
|**channel** <img width="70px" src="../../readonly.png">| the visual channel of the axis<br>possible values: "x", "y", "width", "height", or "radialDistance" | String | | 
|**field** <img width="70px" src="../../readonly.png">| the data field of the axis | String | | 
|**orientation**| the orientation of the axis if its channel is "x" or "y"<br>possible values: "top", "bottom", "left", or "right" | String | | 
|**x**| the x coordinate of the axis path if channel is "y" or "height",<br>undefined otherwise | Number | | 
|**y**| the y coordinate of the axis path if channel is "x" or "width",<br>undefined otherwise| Number | | 
|**strokeColor** | the stroke color of the axis path and ticks | Color | #555555 | 
|**textColor**| the text color of the axis labels | Color | #555555 | 
|**tickOffset**| the distance between the ticks and the path (Figure 1) | Number | 0 | 
|**tickSize**| the size of the axis ticks| Number | 5 | 
|**tickValues** | the values of the ticks on the axis<br>if not provided, Atlas will auto-generate values | Array | | 
|**tickAnchor** | the [anchor](../../global/constants/#anchor) of the ticks on the axis if the items are in a grid layout<br>refer to the ridgeline plot for an example usage of this property | String | | 
|**tickVisible**| whether to show the ticks | Boolean | true |
|**pathVisible**| whether to show the axis path | Boolean | true |
|**labelOffset**| the distance between the labels and the path (Figure 1) | Number | 15 | 
|**labelFormat**| the formatter of the axis labels | String |  | 
|**labelRotation**| the degrees to rotate the axis labels | Number | 0 | 
|**rotation**| the degrees to rotate the entire axis if channel is "radialDistance" | Number | 0 | 
{.table-striped}

{{< figure src="../axis.png" alt="axis components" caption="Figure 1: the components in an axis" class="border-0 mx-auto text-center">}}