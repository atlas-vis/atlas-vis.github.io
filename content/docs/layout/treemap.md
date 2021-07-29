---
title: "TreemapLayout"
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

The TreemapLayout class represents a layout that positions objects using the treemap algorithm. To create a TreemapLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/):

    let tl = atlas.layout("treemap", {width: 800, height: 500});
    collection.layout = tl;

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**type** <img width="70px" src="../../readonly.png"> | the type of the layout | String | "treemap" | 
|**group** <img width="70px" src="../../readonly.png">| the group that uses this layout | [Group](../../group/group/) |  |
|**width**| the width of the top level container | Number |  |
|**height**| the height of the top level container | Number |  |
|**top**| the y coordinate of the top level container | Number |  |
|**left**| the x coordinate of the top level container | Number |  |
{.table-striped}

### Methods inherited from Layout
| method |  explanation   | return type |
| --- | --- | --- |
| **clone**() <img width="70px" src="../../overrides.png"> | returns a copy of this layout | void |
| **run**() <img width="70px" src="../../overrides.png"> | apply this layout | void |
{.table-striped}