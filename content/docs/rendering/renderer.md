---
title: "Renderer"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "rendering"
weight: 800
toc: true
---

The Renderer class is in charge of rendering graphical objects to a webpage. To create a renderer, use the [_renderer_ function](../../global/func/#create-objects): 

    let r = atlas.renderer("svg", "domId");

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
| type | renderer type, possible values: "svg", "canvas", or "webgl" | String | |
| domId | DOM ID of the SVG or Canvas element on which this renderer operates on | String | |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **render**(scene, params) | renders the specified scene<br>scene ([Scene](../../group/scene)): a scene to be rendered<br>params (Object, optional): contains one or more of the following parameters:<ul><li>collectionBounds (Boolean): draws the bounds of [collections](../../group/collection/), defaults to false</li></ul> | void |
{.table-striped}