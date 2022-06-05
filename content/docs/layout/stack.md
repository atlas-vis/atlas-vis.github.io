---
title: "StackLayout"
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

The StackLayout class represents a layout that positions objects by stacking them. To create a StackLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/):

    let sl = atlas.layout("stack", {orientation: "vertical"});
    collection.layout = sl;

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**type** <img width="70px" src="../../readonly.png"> | the type of the layout | String | "stack" | 
|**group** <img width="70px" src="../../readonly.png">| the group that uses this layout | [Group](../../group/group/) |  |
|**baseline**| the baseline of stacking | String |  |
|**orientation**| the orientation of stacking | String | undefined |
|**horzCellAlignment**| the horizontal [alignment](../../global/constants/#anchor) of item in each cell | String | "left" |
|**vertCellAlignment**| the vertical [alignment](../../global/constants/#anchor) of item in each cell | String | "bottom" |
{.table-striped}

### Methods inherited from Layout
| method |  explanation   | return type |
| --- | --- | --- |
| **clone**() <img width="70px" src="../../overrides.png"> | returns a copy of this layout | void |
| **run**() <img width="70px" src="../../overrides.png"> | apply this layout | void |
{.table-striped}