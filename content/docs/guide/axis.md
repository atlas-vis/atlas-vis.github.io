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

The Axis class represents an axis. To create an Axis object, use the [_axis_ method](../../group/scene/#methods-create-guides) in the [Scene](../../group/scene/) class:

    let axis = scene.axis("x", "metric");

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the axis | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the axis | String | "axis" | 
|**channel**| the visual channel of the axis<br>possible values: "x", "y", "width", "height", or "radialDistance" | String | | 
|**orientation**| the orientation of the axis if its channel is "x" or "y"<br>possible values: "top", "bottom", "left", or "right" | String | | 
|**x**| the x coordinate of the axis path if its channel is "y" | Number | | 
|**y**| the y coordinate of the axis path if its channel is "x" | Number | | 
|**strokeColor** | the stroke color of the axis path and ticks | Color | #555555 | 
|**textColor**| the text color of the axis labels | Color | #555555 | 
|**tickOffset**| the distance between the ticks and the path | Number | 0 | 
|**tickSize**| the size of the axis ticks| Number | 5 | 
|**tickValues** | the values of the ticks on the axis | Array | | 
|**tickAnchor** | the [anchor](../../global/constants/#anchor) of the ticks on the axis if the items are in a grid layout<br>refer to the ridgeline plot for an example usage of this property | String | | 
|**tickVisible**| whether to show the ticks | Boolean | true |
|**pathVisible**| whether to show the axis path | Boolean | true |
|**labelOffset**| the distance between the labels and the path | Number | 15 | 
|**labelFormat**| the formatter of the axis labels | String |  | 
|**labelRotation**| the degrees to rotate the axis labels | Number | 0 | 
|**rotation**| the degrees to rotate the entire axis | Number | 0 | 
