---
title: "Usage Instructions"
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

### Using Atlas.js in a web page
Add the following code to the &lt;head&gt; element in your HTML document:
```
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://atlas-vis.github.io/lib/pixi.min.js"></script>
<script src="https://atlas-vis.github.io/dist/atlas-min.js"></script>
```

### Using Atlas.js in an ES6 module
To get the latest version, include "atlas-vis" as a dependency in your package.json file, or do:
```
npm install atlas-vis
```

To import Atlas, do:
```
import * as atlas from "atlas-vis"
```