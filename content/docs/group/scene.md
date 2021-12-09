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

The Scene class represents the top-level container in a visualization. This is where graphical objects (i.e., [mark](../../marks/mark/) or [group](../../group/group/)) are created, transformed and joined with data. To create a scene object, use the [_scene_ function](../../global/func/): 

    let scene = atlas.scene();

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**fillColor**| the background color of the scene | Color | "white" | 
{.table-striped}

### Properties inherited from Group
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the group | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the group | String | "scene" | 
|**children** <img width="70px" src="../../readonly.png">| the graphical objects in the group | Array | [] |
|**firstChild** <img width="70px" src="../../readonly.png">| the first child in the group | [Mark](../../marks/mark/) or [Group](../group/group/) | |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the group | [Rectangle](../../basic/rectangle/) | |
|**center** <img width="70px" src="../../readonly.png">| the center of the group bounds | [Point](../../basic/point/) | |
{.table-striped}

### Methods: Create Mark or Group
| method |  explanation   | return type |
| --- | --- | --- |
| **mark**(type, props)| create a new mark with the specified type and properties<br>type (String): [mark type](../../global/constants/#mark-type)<br>props (Object): property names and values | [Mark](../../marks/mark/) |
| **group**(children)| create a new group with the specified children<br>children (Array, optional): objects to be added in the group | [Group](../../group/group/) |
| **glyph**(...marks)| create a new glpyh with the specified marks as children<br>marks ([Marks](../../marks/mark/)): primitive marks as part of the glyph | [Glyph](../../group/glyph/) |
{.table-striped}

### Methods: Join Graphics with Data
| method |  explanation   | return type |
| --- | --- | --- |
| **repeat**(item, table, params)| [repeat](/tutorials/join/#repeat) a graphical object by a field<br>item ([Mark](../../marks/mark/) or [Group](../../group/group)): graphical object to be repeated<br>table ([DataTable](../../data/datatable/)): data table<br>params (Object, optional): containing one or more of the following: <br><ul><li>field (String): the field to repeat by, defaults to tuple ID</li><li>layout ([Layout](../../layout/layout)): the layout to arrange the repeated items</li></ul> | [Collection](../../group/collection/) |
| **divide**(item, table, params)| [divide](/tutorials/join/#divide) a graphical object by a field<br>item ([Mark](../../marks/mark/) or [Group](../../group/group)): graphical object to be repeated<br>table ([DataTable](../../data/datatable/)): data table<br>params (Object, optional): containing one or more of the following: <br><ul><li>field (String): the field to divide by, defaults to tuple ID</li><li>orientation (String): the orientation to divde the item</li><li>layout ([Layout](../../layout/layout)): the layout to arrange the divided items</li></ul> | [Collection](../../group/collection/) |
| **densify**(item, table, params)| [densify](/tutorials/join/#densify) a graphical object by a field<br>item ([Mark](../../marks/mark/) or [Group](../../group/group)): graphical object to be repeated<br>table ([DataTable](../../data/datatable/)): data table<br>params (Object, optional): containing one or more of the following: <br><ul><li>field (String): the field to densify by, defaults to tuple ID</li><li>orientation (String): the orientation to densify the item</li></ul> | [Path](../../marks/path/) |
| **attach**(item, table)| attach the entire table to a single graphical object,  <br>item ([Mark](../../marks/mark/) or [Group](../../group/group)): graphical object<br>table ([DataTable](../../data/datatable/)): data table<br> | void |
{.table-striped}

### Methods: Encode
<span style="color:red">angle </span>
| method |  explanation   | return type |
| --- | --- | --- |
| **encode**(item, params)| encode a field using a visual channel <br>item ([Mark](../../marks/mark/) or [Group](../../group/group)): an example item to be encoded <br>params (Object): contains the following [properties](../../encode/encoding/#properties) <ul><li>channel (String, required): [visual channel](../../global/constants/#channel)</li><li>field (String, required): data field</li><li>aggregator (String, optional): [aggregator](../../global/constants/#aggregator), defaults to "sum"</li><li>scale ([Scale](../../encode/scale/), optional): [scale](../../encode/scale/)</li><li>scaleType (String, optional): type of scale</li><li>flipScale (Boolean, optional): whether the scale is flipped,<br>defaults to false</li><li>includeZero (Boolean, optional): whether the scale domain includes 0, defaults to false</li><li>rangeExtent (Number, optional): range extent</li><li>mapping (Object, optional): user defined mapping</li><li>scheme (String, optional): color scheme</li><li>startAngle (Number): the start angle in degrees when binding to "angle", default to 90</li><li>angleDirection (String): the direction to encode angles,<br> default to "clockwise"</li></ul> | [Encoding](../../encode/encoding/) |
| **encodeWithinCollection**<br>(item, params)| encode a field using a visual channel <br>item ([Mark](../../marks/mark/) or [Group](../../group/group)): an example item to be encoded <br>params (Object): contains the following contains the following [properties](../../encode/encoding/#properties) <ul><li>channel (String, required): [visual channel](../../global/constants/#channel)</li><li>field (String, required): data field</li><li>aggregator (String, optional): [aggregator](../../global/constants/#aggregator), defaults to "sum"</li><li>scale ([Scale](../../encode/scale/), optional): [scale](../../encode/scale/)</li><li>scaleType (String, optional): type of scale</li><li>invertScale (Boolean, optional): whether the scale is inverted,<br>defaults to false</li><li>includeZero (Boolean, optional): whether the scale domain includes 0, defaults to false</li><li>rangeExtent (Number, optional): range extent</li><li>mapping (Object, optional): user defined mapping</li><li>scheme (String, optional): color scheme</li><li>startAngle (Number): the start angle in degrees when binding to "angle", default to 90</li><li>angleDirection (String): the direction to encode angles,<br> default to "clockwise"</li></ul> | Array of [Encodings](../../encode/encoding/) |
{.table-striped}

### Methods: Create Guides
| method |  explanation   | return type |
| --- | --- | --- |
| **axis**(channel, field, params)| create an [axis](../../guide/axis/) <br>channel (String): the visual channel<br>field (String): the data field<br>params (Object, optional): contains one or more of the [axis properties](../../guide/axis/#properties) | [Axis](../../guide/axis/) |
| **legend**(channel, field, params)| create a [legend](../../guide/legend/) <br>channel (String): the visual channel<br>field (String): the data field<br>params (Object, optional): contains one or more of the [legend properties](../../guide/legend/#properties) | [Legend](../../guide/legend/) |
| **gridlines**(channel, field, params)| create a set of [gridlines](../../guide/gridlines/)<br>channel (String): the visual channel<br>field (String): the data field<br>params (Object, optional): contains one or more of the [gridline properties](../../guide/gridlines/#properties) | [Gridlines](../../guide/gridlines/) |
{.table-striped}

### Methods: Manage and Manipulate Items
| method |  explanation   | return type |
| --- | --- | --- |
| **classify**(items, field, parent)| group items by the specified field, items with the same field value <br>are put in the same collection <br>items (Array): an array of items <br>field (String): field to group by <br>parent ([Scene](../scene/) or [Collection](../../group/collection/)): parent of the resulting collections | Array of [Collections](../../group/collection/) |
| **find**(predicates)| returns graphical objects in the scene that match the specified criteria<br>predicates (Array): an array of [predicates](../../global/predicate/) | Array |
|**setProperties**(item, params)| set the properties for all the peers of the specified item, return an object indicating setting each property is successful. <br>item ([Mark](../../marks/mark/) or [Group](../../group/group) or [Layout](../../layout/layout)): example item<br>params (Object): property names as object keys and property values as object values | {property: Boolean} |
|**propagate**(item, method, ...params)| call the specified method for all the peers of the specified item<br>item ([Mark](../../marks/mark/) or [Group](../../group/group)): example item<br>method (String): name of the item's method<br>params: parameters of the item's method<br>e.g., `scene.propagate(path, "sortVertices", "x")` | void |
| **translate**(item, dx, dy) | move the item by the given distance, returns an object indicating if translating along x or y is successful.<br>item ([Mark](../../marks/mark/) or [Group](../../group/group)): item to move<br>dx (Number): number of pixels to move in the x direction<br> dy (Number): number of pixels to move in the y direction | {x: Boolean, y: Boolean} |
{.table-striped}

### Methods: Specify Constraints
| method |  explanation   | return type |
| --- | --- | --- |
| **align**(items, anchor)| align the items so that they have the same position for the specified anchor<br>items (Array): objects to be aligned<br>anchor (String): [anchor](../../global/constants/#anchor) to align | void |
| **affix**(item, baseItem, channel, params)| affix items to the specified base items in x or y direction<br>item ([Mark](../../marks/mark/)): an example item<br>baseItem ([Mark](../../marks/mark/)): an example base item<br>channel (String): "x", "y", "angle", or "radialDistance"<br>params (Object, optional): additional parameters:<ul><li>itemAnchor (String): [anchor](../../global/constants/#anchor) of item,<br>defaults to "center" for "x" and "angle" channels<br>defaults to "middle" for "y" and "radialDistance" channels</li><li>baseAnchor (String): [anchor](../../global/constants/#anchor) of base item,<br>defaults to "center" for "x" and "angle" channels<br>defaults to "middle" for "y" and "radialDistance" channels</li><li>offset (Number): distance between item anchor and base item anchor, defaults to 0</li></ul> | void |
{.table-striped}

### Methods inherited from Group
| method |  explanation   | return type |
| --- | --- | --- |
| **addChild**(c) | adds an object to the group | void |
| **addChildAt**(c, i) | adds an object to the group at the specified index | void |
| **removeChild**(c) | removes the specified object from the group | void |
| **removeAll**() | removes all the children from the group | void |
| **getScene**() | returns the scene in which this group resides | [Scene](../../group/scene) |
| **sortChildren**<br>(channel, reverse) | sort the children by a visual channel<br>channel (String): the channel to sort the children by<br> reverse: (Boolean, optional) setting to true will sort in descending order;<br>default is false. | void |
| **sortChildrenByData**<br>(field, reverse, order) | sort the children by a data field<br>field (String): the data field to sort the children by<br>reverse (Boolean, optional): setting to true will sort in descending order;<br>default is false.<br>order (Array, optional): an array of field values in ascending order | void |
{.table-striped}