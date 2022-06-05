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

### Methods
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