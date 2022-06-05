---
title: "Encoding"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "encode"
weight: 200
toc: true
---

An Encoding object records information about a visual encoding. When a mark's visual channel is specified to encode a data field through the [_encode_ method](../../group/scene/#methods-encode) in the [Scene](../../group/scene/) class, an Encoding object is created and returned. 

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- | 
|**channel** <img width="70px" src="../../readonly.png">| the [visual channel](../../global/constants/#channel) | String | | 
|**dataTable** <img width="70px" src="../../readonly.png">| the [data table](../../data/datatable) used in this encoding  | String | | 
|**field** <img width="70px" src="../../readonly.png">| the data field | String | | 
|**aggregator**| [aggregator](../../global/constants/#aggregator) for data values | String |  "sum" | 
|**scale**| the scale of the encoding | [Scale](../scale/) | | 
|**scaleType**| the [type of scale](../../global/constants/#scale-type) | String | depends on<br>field and channel | 
|**includeZero**| whether the scale domain includes 0 | Boolean | false |
|**rangeExtent**| the extent of the scale range | Number | |
|**mapping**| user defined mapping between field values and visual properties | Object |  |
|**scheme**| the color scheme  | String | |
|**startAngle**| the start angle in degrees when encoding using the "angle" channel | Number| 90 |
|**angleDirection**| the direction to encode angles | String | "clockwise" |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **getScaleRange**(item) | get the scale range for this encoding for the specified item<br>item ([Mark](../../marks/mark/) or [Group](../../group/group/), optional): an example item with this encoding | Array |
{.table-striped}