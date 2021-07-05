---
title: "6. Specify Visual Encodings"
description: ""
lead: ""
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  tutorials:
    parent: "tutorials"
weight: 50
---

Visual encodings specify how values in a data field is mapped to properties of a visual channel. To specify a visual encoding, we need an example mark/glyph/collection, a data field, and a visual channel: 

```js
scene.encode(rect, {field: "Percentage", channel: "width"});
```

Atlas will automatically create a [scale](../../docs/encode/scale/) based on the provided parameters, the [type](../../docs/global/constants/#data-type) and value distribution of the data field, and the [type](../../docs/global/constants/#channel) and current values of the visual channel. 

### Scale Type

<!-- Explain different types of scale -->

The following describes the heuristics for automatically choosing the scale type based on an encoding specification:

| field type | channel | scale type |
| --- | --- | --- |
| integer or number | "width", "height", "x", "y", "angle", "radialDistance", "radius" | linear |
| date | "width", "height", "x", "y", "radialDistance", "radius"  | time |
| string | "x", "y"  | point |
| integer or number | "fillColor", "strokeColor" | sequentialColor |
| string | "fillColor", "strokeColor" | ordinalColor |
{.table-striped}

For "log" and "power" scale types, you can specify them as the "scaleType" parameter in the [_encode_ method](../../docs/group/scene/#methods-encode).

<!-- encode within collection -->