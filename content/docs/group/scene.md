---
title: "Scene"
description: ""
lead: ""
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "group"
weight: 105
toc: true
---
<span style="font-size:1.2em">extends [Group](../group/)</span><br>

The Scene class represents the top-level container in a visualization. This is where graphical objects (i.e., [mark](../../marks/mark/) or [group](../../group/group/)) are created, transformed and joined with data. To create a scene object, use the [_scene_ function](): 

    let scene = atlas.scene();

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**fillColor**| the background color of the scene | Color | "white" | 


{.table-striped}

### Properties inherited from [Group](../group/)
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the group | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the group | String | "group" | 
|**children** <img width="70px" src="../../readonly.png">| the graphical objects in the group | Array | [] |
|**firstChild** <img width="70px" src="../../readonly.png">| the first child in the group | [Mark](../../marks/mark/) or [Group](../group/group/) | |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the group | [Rectangle](../../basic/rectangle/) | |
|**center** <img width="70px" src="../../readonly.png">| the center of the group bounds | [Point](../../basic/point/) | |
{.table-striped}

### Methods: Create Mark or Group
| method |  explanation   | return type |
| --- | --- | --- |
| **mark**(type, props)| create a new mark with the specified type and properties<br>type: [mark type](../../global/constants/#mark-type)<br>props: properties of the mark | [Mark](../../marks/mark/) |
| **group**(children)| create a new group with the specified children<br>children: (optional) objects to be added in the group | [Group](../../group/group/) |
| **glyph**(...marks)| create a new glpyh with the specified marks as children<br>marks: primitive marks as part of the glyph | [Glyph](../../group/glyph/) |
{.table-striped}

### Methods: Join Graphics with Data
| method |  explanation   | return type |
| --- | --- | --- |
| **repeat**(item, table, params)| [repeat](/tutorials/join/#repeat) a graphical object by a field<br>item: graphical object to be repeated<br>table: data table<br>params (optional): an object containing one or more of the following: <br><ul><li>field (type String): the field to repeat by, defaults to tuple ID</li><li>layout (type Layout): the layout to arrange the repeated items</li></ul> | [Collection](../../group/collection/) |
| **divide**(item, table, params)| [divide](/tutorials/join/#divide) a graphical object by a field<br>item: graphical object to be divided<br>table: data table<br>params (optional): an object containing one or more of the following: <br><ul><li>field (type String): the field to divide by, defaults to tuple ID</li><li>orientation (type String): the orientation to divde the item</li><li>layout (type Layout): the layout to arrange the divided items</li></ul> | [Collection](../../group/collection/) |
| **densify**(item, table, params)| [densify](/tutorials/join/#densify) a graphical object by a field<br>item: graphical object to be densified<br>table: data table<br>params (optional): an object containing one or more of the following: <br><ul><li>field (type String): the field to densify by, defaults to tuple ID</li><li>orientation (type String): the orientation to densify the item</li><li>startAngle (type Number): the start angle in degrees to densify a<br>circle path, default to 90</li><li>direction (type String): the direction to add vertices when densifying<br>a circle path, default to "clockwise"</li></ul> | [Path](../../marks/path/) |
{.table-striped}

### Methods: Encode
| method |  explanation   | return type |
| --- | --- | --- |
| **encode**(item, params)| encode a field using a visual channel <br>item: an example item to be encoded <br>params: an object containing the following parameters <ul><li>channel (type String, required): [visual channel](../../global/constants/#channel)</li><li>field (type String, required): data field</li><li>aggregator (type String, optional): [aggregator](../../global/constants/#aggregator), defaults to "sum"</li><li>scale (type [Scale](../../encode/scale/), optional): [scale](../../encode/scale/)</li><li>scaleType (type String, optional): type of scale</li><li>invertScale (type Boolean, optional): whether the scale is inverted, defaults to false</li><li>includeZero (type Boolean, optional): whether the scale domain includes 0, defaults to false</li><li>rangeExtent (type Number, optional): range extent</li><li>mapping (type Object, optional): user defined mapping</li><li>scheme (type String, optional): color scheme</li></ul> | [Encoding](../../encode/encoding/) |
| **encodeWithinCollection**<br>(item, params)| encode a field using a visual channel <br>item: an example item to be encoded <br>params: an object containing the following parameters <ul><li>channel (type String, required): [visual channel](../../global/constants/#channel)</li><li>field (type String, required): data field</li><li>aggregator (type String, optional): [aggregator](../../global/constants/#aggregator), defaults to "sum"</li><li>scale (type [Scale](../../encode/scale/), optional): [scale](../../encode/scale/)</li><li>scaleType (type String, optional): type of scale</li><li>invertScale (type Boolean, optional): whether the scale is inverted, defaults to false</li><li>includeZero (type Boolean, optional): whether the scale domain includes 0, defaults to false</li><li>rangeExtent (type Number, optional): range extent</li><li>mapping (type Object, optional): user defined mapping</li><li>scheme (type String, optional): color scheme</li></ul> | Array of [Encodings](../../encode/encoding/) |
{.table-striped}

### Methods: Create Guides
| method |  explanation   | return type |
| --- | --- | --- |
| **axis**(channel, field, params)| create an [axis](../../guide/axis/) <br>channel (type String): the visual channel<br>field (type String): the data field<br>params (optional): an object with one or more of these parameters: <ul><li>ticks (type Array)</li><li>x (type Number)</li><li>y (type Number)</li></ul>| [Axis](../../guide/axis/) |
| **legend**(channel, field, params)| create a [legend](../../guide/legend/) <br>channel (type String): the visual channel<br>field (type String): the data field<br>params (optional): an object with one or more of these parameters: <ul><li>x (type Number)</li><li>y (type Number)</li></ul> | [Legend](../../guide/legend/) |
| **gridlines**(channel, field, params)| create a set of [gridlines](../../guide/gridlines/)<br>channel (type String): the visual channel<br>field (type String): the data field<br>params (optional): an object with one or more of these parameters: <ul><li>values (type Array)</li></ul> | [Gridlines](../../guide/gridlines/) |
{.table-striped}

### Methods: Manage Items
| method |  explanation   | return type |
| --- | --- | --- |
| **classify**(items, field, parent)| group items by the specified field, items with the same field value <br>are put in the same collection <br>items (type Array): an array of items <br>field (type String): field to group by <br>parent (type [Scene](../scene/) or [Collection](../../group/collection/)): parent of the resulting collections | Array of [Collections](../../group/collection/) |
| **find**(predicates)| returns graphical objects in the scene that match the specified criteria<br>predicates (type Array): an array of predicates | Array |
{.table-striped}

### Methods: Specify Constraints
| method |  explanation   | return type |
| --- | --- | --- |
| **align**(items, anchor)| align the items so that they have the same position for the specified anchor<br>items (type Array): objects to be aligned<br>anchor (type String): [anchor](../../global/constants/#anchor) to align | void |
| **affix**(item, baseItem, channel, params)| affix items to the specified base items in x or y direction<br>item (type [Mark](../../marks/mark/)): an example item<br>baseItem (type [Mark](../../marks/mark/)): an example base item<br>channel (type String): "x" or "y"<br>params (type Object, optional): additional parameters:<ul><li>itemAnchor (type String): [anchor](../../global/constants/#anchor) of item, defaults to "center"</li><li>baseItemAnchor (type String): [anchor](../../global/constants/#anchor) of base item, defaults to "middle"</li><li>offset (type Number): distance between item anchor and base item anchor, defaults to 0</li></ul> | void |
{.table-striped}

### Methods inherited from [Group](../group/)
| method |  explanation   | return type |
| --- | --- | --- |
| **addChild**(c) | adds an object to the group | void |
| **addChildAt**(c, i) | adds an object to the group at the specified index | void |
| **removeChild**(c) | removes the specified object from the group | void |
| **removeAll**() | removes all the children from the group | void |
| **translate**(dx, dy) | move the group by the given parameters<br>dx: number of pixels to move in the x direction (type Number)<br> dy: number of pixels to move in the y direction (type Number) | void |
| **sortChildren**<br>(channel, reverse) | sort the children by a visual channel<br>channel: the channel to sort the children by (type String)<br> reverse: (optional) setting to true will sort in descending order; default is false. | void |
| **sortChildrenByData**<br>(field, reverse, order) | sort the children by a data field<br>field: the data field to sort the children by (type String)<br>reverse: (optional) setting to true will sort in descending order; default is false.<br>order: (optional) an array of field values in ascending order | void |
{.table-striped}