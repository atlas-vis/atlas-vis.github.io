---
title: "4. Join Graphics with Data"
description: ""
lead: ""
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  tutorials:
    parent: "tutorials"
weight: 30
---

Atlas offers three primary operations to generate marks or glyphs by data: repeat, divide, and densify. To explain how these operations work, let's use the dataset in the [diverging bar chart example](../../tutorials/example/). The data table consists of three columns: Age Group, Response, and Percentage (percentage of people with a particular response within an age group):

{{< figure src="data.png" width="350px" alt="Survey Response Dataset" caption="" class="border-0 mx-auto text-center" >}}

### repeat

The repeat operation applies to any mark or glyph, and replaces it with a [collection](../../docs/group/collection/) of marks/glyphs, each mark/glyph in the collection represents a unique value in the optional field parameter. In the figure below, we repeat a mark by the field "Age Group". There are four unique values in the field "Age Group", so we get a collection of four marks. If the field parameter is unspecified, a glyph is created for every tuple (row) in the data table. The generated marks are **peers** of each other. They have the same visual properties, including position and size, so these marks will overlap. The figure below is meant to show clearly the number of marks generated, and does not accurately reflect the positions of the generated marks. 

All the tuples having the same field value are joined with each corresponding mark as its **data scope**. For example, the data scope of the first mark in the generated collection is the first four rows with "Age Group" equal to "Below 30". 

{{< figure src="repeat.png" width="700px" alt="Repeat" caption="" class="border-0 mx-auto text-center" >}}


### divide

The divide operation applies to a line, a circle or a rectangle only. It splits a mark into a [collection](../../docs/group/collection/) of smaller marks. These generated smaller marks are **peers** of each other.  The output depends on the mark type and the orientation parameter, as shown in the figure below.  For example, applying divide on a circle along the angular orientation produces a collection of pies, and along the radial orientation produces a collection of rings. The graphics-data joining mechanism is similar to that of the repeat operation: tuples sharing the same field value are assigned as the **data scope** of each corresponding mark in the output collection.

{{< figure src="divide.png" width="680px" alt="Divide" caption="" class="border-0 mx-auto text-center" >}}

### densify

The densify operation adds vertices along the border of a mark, and replaces curve segments with line segments.  A line, for example, is replaced by a [polyline](../../docs/marks/path/); a rectangle is replaced by an [area mark](../../docs/marks/areapath), and a circle is replaced by a standard [polygon](../../docs/marks/polygonpath/). The generated vertices are **peers** of each other.  The graphics-data joining mechanism is similar to that of the repeat and divide operations. Each vertex has a **data scope** that represents a unique value in the field parameter. The number of vertices in the output polyline and polygon marks is equal to the number of unique field values; the number of vertices in the output area mark is twice the number of unique field values, as both of the parallel segments of a rectangle are densified.

{{< figure src="densify.png" width="700px" alt="Divide" caption="" class="border-0 mx-auto text-center" >}}

All three operations are defined as methods in the scene class. [The API reference](../../docs/group/scene/#methods-join-graphics-with-data) contains details about the parameters. 

### concatenate operations
These three operations can be applied one after another to create more complex structures. In the [diverging bar chart example](../../tutorials/example/), we applied repeat first, then divide, which gave us a stacked bar chart. When we apply repeat + densify to a line, we can create visualizations such as sparklines or multi-line graphs. We can also apply repeat multiple times and get nested collections, which are common in small multiples. It is recommended that you apply repeat first before applying divide or densify. 