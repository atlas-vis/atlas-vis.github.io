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

### Properties inherited from Group
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the group | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the group | String | "collection" | 
|**dataScope**| the [data scope](../../data/datascope/) of the group | [DataScope](../../data/datascope/) | undefined |
|**layout**| the [layout](../../layout/layout/) of the group children | [Layout](../../layout/layout/) | undefined |
|**children** <img width="70px" src="../../readonly.png">| the graphical objects in the group | Array | [] |
|**firstChild** <img width="70px" src="../../readonly.png">| the first child in the group | [Mark](../../marks/mark/) or [Group](../group/) | |
|**lastChild** <img width="70px" src="../../readonly.png">| the last child in the group | [Mark](../../marks/mark/) or [Group](../group/) | |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the group | [Rectangle](../../basic/rectangle/) | |
|**center** <img width="70px" src="../../readonly.png">| the center of the group bounds | [Point](../../basic/point/) | |
|**x** <img width="70px" src="../../readonly.png">| the x coordinate of the center of the group bounds | Number | |
|**y** <img width="70px" src="../../readonly.png">| the y coordinate of the center of the group bounds | Number | |
|**visibility**| whether the group is visible ("visible" or "hidden") | String | "visible" |
{.table-striped}

### Methods inherited from Group
| method |  explanation   | return type |
| --- | --- | --- |
| **addChild**(c) | adds an object to the group | void |
| **addChildAt**(c, i) | adds an object to the group at the specified index | void |
| **contains**(x, y) | whether this group contains a point<br>x (Number): x coordinate of the point<br>y (Number): y coordinate of the point | Boolean |
| **removeChild**(c) | removes the specified object from the group | void |
| **removeAll**() | removes all the children from the group | void |
| **getScene**() | returns the scene in which this group resides | [Scene](../../group/scene) |
| **sortChildren**<br>(channel, reverse) | sort the children by a visual channel<br>channel (String): the channel to sort the children by<br> reverse: (Boolean, optional) setting to true will sort in descending order;<br>default is false. | void |
| **sortChildrenByData**<br>(field, reverse, order) | sort the children by a data field<br>field (String): the data field to sort the children by<br>reverse (Boolean, optional): setting to true will sort in descending order;<br>default is false.<br>order (Array, optional): an array of field values in ascending order | void |
{.table-striped}
