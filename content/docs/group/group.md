---
title: "Group"
description: ""
lead: ""
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "group"
weight: 100
toc: true
---
<span style="font-size:1.2em">Subclasses: [Scene](../scene/), [Collection](../collection/), [Glyph](../glyph/)</span>

The Group class represents a group of graphical objects (i.e., [marks](../../marks/mark/) or [groups](../group/)). To create a group, use the _group_ method in the [Scene](../scene/) class, for example:

    let g = scene.group();

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the group | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the group | String | "group" | 
|**dataScope**| the [data scope](../../data/datascope/) of the group | [DataScope](../../data/datascope/) | undefined |
|**layout**| the [layout](../../layout/Layout/) of the group children | [Layout](../../layout/Layout/) | undefined |
|**children** <img width="70px" src="../../readonly.png">| the graphical objects in the group | Array | [] |
|**firstChild** <img width="70px" src="../../readonly.png">| the first child in the group | [Mark](../../marks/mark/) or [Group](../group/) | |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the group | [Rectangle](../../basic/rectangle/) | |
|**center** <img width="70px" src="../../readonly.png">| the center of the group bounds | [Point](../../basic/point/) | |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **addChild**(c) | adds an object to the group | void |
| **addChildAt**(c, i) | adds an object to the group at the specified index | void |
| **removeChild**(c) | removes the specified object from the group | void |
| **removeAll**() | removes all the children from the group | void |
| **getScene**() | returns the scene in which this group resides | [Scene](../../group/scene) |
| **translate**(dx, dy) | move the group by the given parameters<br>dx (Number): number of pixels to move in the x direction<br> dy (Number): number of pixels to move in the y direction | void |
| **sortChildren**<br>(channel, reverse) | sort the children by a visual channel<br>channel (String): the channel to sort the children by<br> reverse: (Boolean, optional) setting to true will sort in descending order; default is false. | void |
| **sortChildrenByData**<br>(field, reverse, order) | sort the children by a data field<br>field (String): the data field to sort the children by<br>reverse (Boolean, optional): setting to true will sort in descending order; default is false.<br>order (Array, optional): an array of field values in ascending order | void |
{.table-striped}