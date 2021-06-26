---
title: "Collection"
description: ""
lead: ""
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "group"
weight: 110
toc: true
---
<span style="font-size:1.2em">extends [Group](../group/)</span><br>

The Collection class represents a group of [marks](../../marks/mark/), [glyphs](../../group/glyph/), or [collections](../collection/) (i.e., nested collection). Children inside a collection have the same "type" property. Collections are created through the [_repeat_, _divide_, and _densify_ methods](../scene/#methods-join-graphics-with-data) in the [Scene](../scene/) class.

### Properties inherited from [Group](../group/)
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the group | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the group | String | "collection" | 
|**dataScope**| the [data scope](../../data/datascope/) of the group | [DataScope](../../data/datascope/) | undefined |
|**layout**| the [layout](../../layout/Layout/) of the group children | [Layout](../../layout/Layout/) | undefined |
|**children** <img width="70px" src="../../readonly.png">| the graphical objects in the group | Array | [] |
|**firstChild** <img width="70px" src="../../readonly.png">| the first child in the group | [Mark](../../marks/mark/) or [Group](../group/) | |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the group | [Rectangle](../../basic/rectangle/) | |
|**center** <img width="70px" src="../../readonly.png">| the center of the group bounds | [Point](../../basic/point/) | |
{.table-striped}

### Methods inherited from [Group](../group/)
| method |  explanation   | return type |
| --- | --- | --- |
| **addChild**(c) | adds an object to the group | void |
| **addChildAt**(c, i) | adds an object to the group at the specified index | void |
| **removeChild**(c) | removes the specified object from the group | void |
| **removeAll**() | removes all the children from the group | void |
| **getScene**() | returns the scene in which this group resides | [Scene](../../group/scene) |
| **translate**(dx, dy) | move the group by the given parameters<br>dx (Number): number of pixels to move in the x direction<br> dy (Number): number of pixels to move in the y direction | void |
| **sortChildren**<br>(channel, reverse) | sort the children by a visual channel<br>channel (String): the channel to sort the children by<br> reverse: (Boolean, optional) setting to true will sort in descending order;<br>default is false. | void |
| **sortChildrenByData**<br>(field, reverse, order) | sort the children by a data field<br>field (String): the data field to sort the children by<br>reverse (Boolean, optional): setting to true will sort in descending order;<br>default is false.<br>order (Array, optional): an array of field values in ascending order | void |
{.table-striped}
