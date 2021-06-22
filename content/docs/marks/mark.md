---
title: "Mark"
description: ""
lead: ""
date: 2021-06-20T20:24:35-04:00
lastmod: 2021-06-20T20:24:35-04:00
draft: false
images: []
menu: 
  docs:
    parent: "marks"
weight: 22
toc: true
---

<span style="font-size:1.2em">Subclasses: [Path](../path/), [Text](../pointtext/), Image (coming soon)</span>


The Mark class represents a primitive building block of a visualization. There are different types of marks, implemented as the child classes of Mark: [Path](../path/), [Text](../pointtext/), and Image (coming soon). 

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the mark | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the mark | String | | 
|**dataScope**| the [data scope](../../data/datascope/) of the mark | [DataScope](../../data/datascope/) | undefined |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **getScene**() | returns the scene in which this mark resides | [Scene](../../group/scene) |
| **duplicate**() | returns a copy of this mark | [Mark](../mark/) |
{.table-striped}