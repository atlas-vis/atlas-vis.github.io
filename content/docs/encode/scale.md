---
title: "Scale"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "encode"
weight: 210
toc: true
---

The Scale class represents a function that maps the values of a data field (domain) to the properties of a visual channel (range). It is recommended that you do not create a scale object directly; instead, use the [_encode_ method](../../group/scene/#methods-encode) in the [Scene](../../group/scene/) class to get an [Encoding](../../encode/encoding/) object, which contains a Scale object as one of [its properties](../../encode/encoding/#properties). For example,

    let enc = scene.encode(rect.leftSegment, {field: "value", channel: "x"});
    let xScale = enc.scale;

A Scale object can be used in multiple encodings. For example, the scale above for encoding rectangle height can be used as an argument for another encoding:
    
    let enc2 = scene.encode(line, {field: "amount", channel: "x", scale: xScale});

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- | 
|**domain** | the domain of the scale | Array | |
|**range** | the range of the scale<br>**Note: for position encodings**:<br>the range is not expressed in screen coordinates,<br>instead, it is in the form of `[0, r]` where r is the range extent<br>to get the range in actual screen coordinates, use [`encoding.getScaleRange`](../../encode/encoding/#methods);<br>to change the scale range for position encodings, do not directly set this property, set `rangeExtent` instead<br> | Array | |
|**rangeExtent** | the extent of the scale range | Number | |
|**isFlipped** | whether the scale is flipped | Boolean | | 
|**type**| the [type of scale](../../global/constants/#scale-type) | String | |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **map**(d) | convert a domain value into a value in this scale's range<br>d (Number): a domain value |  |
| **invert**(d) | convert a value in this scale's range into a domain value<br>d (Number): a range value |  |
| **getEncodedChannels**() | returns an array of [channels](../../global/constants/#channel) this scale encodes | Array |
{.table-striped}