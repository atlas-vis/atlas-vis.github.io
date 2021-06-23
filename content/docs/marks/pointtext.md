---
title: "Text"
description: ""
lead: ""
date: 2021-06-20T20:25:40-04:00
lastmod: 2021-06-20T20:25:40-04:00
draft: false
images: []
menu: 
  docs:
    parent: "marks"
weight: 50
toc: true
---
<span style="font-size:1.2em">extends [Mark](../mark/)</span><br>


The Text class represents a text element. To create a Text object, use the _mark_ method in the [Scene](../../group/scene) class, for example:

    let txt = scene.mark("text", {x: 50, y: 100, text: "hello"});

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**x** | the x coordinate of the text | Number |  | 
|**y** | the y coordinate of the text | Number |  | 
|**anchor** | the text anchor | Array | ["center", "middle"] | 
{.table-striped}

{{< figure src="../anchor.png" >}}