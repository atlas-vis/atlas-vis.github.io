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
|**rowGap**| the horizontal gap between adjacent rows in the grid | Number | 5 |
|**colGap**| the vertical gap between adjacent columns in the grid | Number | 5 |
|**cellBounds** <img width="70px" src="../../readonly.png">| the bounds of the grid cells | Array of [Rectangle](../../basic/rectangle/) | [] |
|**horzCellAlignment**| the horizontal [alignment](../../global/constants/#anchor) of item in each grid cell | String | "left" |
|**vertCellAlignment**| the vertical [alignment](../../global/constants/#anchor) of item in each grid cell | String | "bottom" |
|**dir**| the direction in which the items are added to each grid cell | Array | ["l2r", "t2b"] |

{.table-striped}

The direction of a grid layout consists of two components: horizontal and vertical. For the horizontal component, there are two options: left to right (l2r), and right to left (r2l); for the vertical component, there are also two options: top to bottom (t2b), and bottom to top (b2t). The order of these two components also matters. The figure below illustrates all the possible directions based on these two components.

{{< figure src="../gridDir.png" alt="grid directions" width="700px" caption="Figure 1: possible grid directions" class="border-0 mx-auto text-center">}}

### Methods inherited from Layout
| method |  explanation   | return type |
| --- | --- | --- |
| **clone**() <img width="70px" src="../../overrides.png"> | returns a copy of this layout | void |
| **run**() <img width="70px" src="../../overrides.png"> | apply this layout | void |
{.table-striped}