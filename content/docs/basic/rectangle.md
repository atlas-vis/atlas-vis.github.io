---
title: "Rectangle"
description: ""
lead: ""
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "basic"
weight: 7
toc: true
---

The Rectangle class represents an abstract rectangular area. It is different from a [rectangle mark](../../mark/rectpath/).

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**left** | the x coordinate of the left hand side of the rectangle | Number |  | 
|**top** | the y coordinate of the top of the rectangle | Number |  | 
|**right** <img width="70px" src="../../readonly.png"> | the x coordinate of the right hand side of the rectangle | Number |  | 
|**bottom** <img width="70px" src="../../readonly.png"> | the y coordinate of the bottom of the rectangle | Number |  | 
|**center** <img width="70px" src="../../readonly.png"> | the x coordinate of the center of the rectangle | Number |  | 
|**middle** <img width="70px" src="../../readonly.png"> | the y coordinate of the center of the rectangle | Number |  | 
|**x** <img width="70px" src="../../readonly.png"> | the x coordinate of the center of the rectangle<br>same as "center" | Number |  | 
|**y** <img width="70px" src="../../readonly.png"> | the y coordinate of the center of the rectangle<br>same as "middle" | Number |  | 
|**width** | the width of the rectangle | Number |  | 
|**height** | the height of the rectangle | Number |  | 
{.table-striped}

### Methods
| method |  explanation  | return type |
| --- | --- | --- | --- |
|**contains**(x, y) | check if a point with the specified x and y coordinates (type Number)<br>is inside this rectangle | Boolean |  | 
|**union**(rect) | returns the union of this rectangle and the parameter rect (type [Rectangle](../rectangle/)) | [Rectangle](../rectangle/) |  | 
|**clone**() | returns a copy of this rectangle | [Rectangle](../rectangle/) |  | 
{.table-striped}