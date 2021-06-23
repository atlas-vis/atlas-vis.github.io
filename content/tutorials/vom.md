---
title: "Visualization Object Model"
description: ""
lead: ""
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  tutorials:
    parent: "tutorials"
weight: 1
---
Every visualization created using Atlas can be described using the following object model: 

{{< figure src="vom.png" alt="Visualization Object Model" caption="" class="border-0">}}

At the top level, we have a [scene](../group/scene/), acting as a container for all the visualization objects. In a scene, we typically have [axes](../guide/axis/), [legends](../guide/legend/), [gridlines](../guide/gridlines/), and [collections](../group/collection/) of items. In the chart below, we have an x axis and a y axis, a legend explaining the color mapping, a set of gridlines, and a collection of [rectangle marks](../mark/rectpath/). A collection can be nested, e.g., each column of stacked bars is a collection, and together they form a larger collection, which is the main content of the chart. In this example, a collection consists of multiple rectangle marks. In examples such as a [box plot](), a collection consists of multiple [glyphs](../group/glyph/); where each glyph is essentially a group of marks. Finally, a mark is typically represented as a set of [vertices](../basic/vertex/), connected by line or curve [segments](../basic/segment). For example, a rectangle mark is composed of four vertices connected by four line segments. 

{{< figure src="StackedBarChart.png" alt="Visualization Object Model" caption="" class="border-0">}}
