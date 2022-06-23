---
title: "Top-level Functions"
description: ""
lead: ""
date: 2020-10-06T08:49:15+00:00
lastmod: 2020-10-06T08:49:15+00:00
draft: false
images: []
menu: 
  docs:
    parent: "global"
weight: 2
toc: true
---

Top-level functions are defined in the atlas namespace. 

### Create Objects
| function |  explanation  |  return type |
| --- | --- | --- |
| **atlas.scene**(params) | create a [scene](../../group/scene/)<br>params (Object, optional): contains the following parameter<ul><li>fillColor: background color of the scene</li></ul> | [Scene](../../group/scene/) |
| async **atlas.csv**(url) | import a CSV file as a [data table](../../data/datatable/)<br>url (String): path to the file | Promise |
| async **atlas.csvFromString**(data, name) | import CSV data in a string as a [data table](../../data/datatable/)<br>data (String): CSV data in a string<br>name (String): name of the data | Promise |
| **atlas.layout**(type, params)| create a [layout](../../layout/layout/)<br>type: [layout type](../../global/constants/#layout-type)<br>params (Object): contains layout properties  | [Layout](../../layout/layout/) |
| **atlas.linearGradient**(params)| create a [linear gradient](../../basic/lineargradient/)<br>params (Object): contains x1, y1, x2 and y2 properties  | [LinearGradient](../../basic/lineargradient/) |
| **atlas.renderer**(type, domId) | create a renderer<br>type (String): type of renderer,<BR>possible values: "svg", "webgl"<br>domId (String): ID of the SVG or Canvas element | [Renderer](../../rendering/renderer/) |
{.table-striped}

<!-- | async **atlas.treejson**(url) | import a tree dataset in the JSON format as a [tree](../../data/tree/)<br>url (String): path to the file | Promise |
| async **atlas.graphjson**(url) | import a network dataset in the JSON format as a [Network](../../data/network/)<br>url (String): path to the file | Promise | -->

### Helper Functions
| function |  explanation  |  return type |
| --- | --- | --- |
| **atlas.cartesianToPolar**(x, y, cx, cy) | converts a point in Cartesian space to polar coordinates<br>x (Number): x coordinate in Cartesian space<br>y (Number): y coordinate in Cartesian space<br>cx (Number): x coordinate of the polar center<br>cy (Number): y coordinate of the polar center | [angele (in degrees),<br>distance from center] |
| **atlas.polarToCartesian**(cx, cy, r, deg) | converts a point in polar space to Cartesian coordinates<br>cx (Number): x coordinate of the polar center<br>cy (Number): y coordinate of the polar center<br>r (Number): distance from the polar center<br>deg (Number): angle in degrees in the polar space | [x, y] |
{.table-striped}