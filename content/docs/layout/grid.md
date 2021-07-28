---
title: "GridLayout"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "layout"
weight: 610
toc: true
---
<span style="font-size:1.2em">extends [Layout](../layout/)</span><br>

The GridLayout class represents a layout that positions objects in a grid. To create a GridLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/):

    let gl = atlas.layout("grid", {numCols: 2, hGap: 10});
    collection.layout = gl;

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**type** <img width="70px" src="../../readonly.png"> | the type of the layout | String | "grid" | 
|**group** <img width="70px" src="../../readonly.png">| the group that uses this layout | [Group](../../group/group/) |  |
|**numRows**| the number of rows in the grid | Number | undefined |
|**numCols**| the number of columns in the grid | Number | undefined |
|**hGap**| the horizontal gap between adjacent rows in the grid | Number | undefined |
|**vGap**| the vertical gap between adjacent columns in the grid | Number | undefined |
|**cellBounds** <img width="70px" src="../../readonly.png">| the bounds of the grid cells | Array of [Rectangle](../../basic/rectangle/) | [] |
{.table-striped}

### Methods inherited from [Layout](../layout/)
| method |  explanation   | return type |
| --- | --- | --- |
| **clone**() <img width="70px" src="../../overrides.png"> | returns a copy of this layout | void |
| **run**() <img width="70px" src="../../overrides.png"> | apply this layout | void |
{.table-striped}