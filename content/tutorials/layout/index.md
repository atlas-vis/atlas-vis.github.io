---
title: "5. Lay out Objects"
description: ""
lead: ""
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  tutorials:
    parent: "tutorials"
weight: 40
---

We get a collection of graphical objects after applying repeat, divide or densify operations. These objects can be positioned using [layouts](../../docs/layout/layout/). Atlas currently provides the following types of layout: [grid](../../docs/layout/grid/), [stack](../../docs/layout/stack/), [packing](../../docs/layout/packing/) and [Treemap](../../docs/layout/treemap/). 

To create a layout, use the _layout_ function, for example,

```js
let tl = atlas.layout("treemap", {width: 800, height: 500});
```

A layout can only be applied to a collection:

    collection.layout = tl;

You can also pass a layout as an argument when performing [repeat](../../docs/group/scene/#methods-join-graphics-with-data) or [divide](../../docs/group/scene/#methods-join-graphics-with-data) operations:

```js
scene.divide(rect, table, {field: "col", layout: tl});
```

