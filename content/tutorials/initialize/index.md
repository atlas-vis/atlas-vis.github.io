---
title: "2. Initialize Scene and Import Data"
description: ""
lead: ""
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  tutorials:
    parent: "tutorials"
weight: 20
---

To creata a visualization, we need to [create a scene](../../docs/global/func/) first:

    let scene = atlas.scene();

The returned object is an instance of the [Scene](../../docs/group/scene/) class, which is one of the most important class in Atlas. Mark/glyph creation, data binding, visual encoding and graphical constraints are all accomplished as methods in this class. 

Currently Atlas supports importing data formatted as Comma Separated Values (CSV) files, with the assumption that the first row contains the column names, and the data is in a **long form**. For an explanation of the differences between long and wide forms of data, see [this Wikipedia article](https://en.wikipedia.org/wiki/Wide_and_narrow_data). Section 3 of [Tiday Data by Hadley Wickham](http://vita.had.co.nz/papers/tidy-data.pdf) contains a more technical discussion. To import a CSV file, use the [_csv_ function](../../docs/global/func/):

    let table = await atlas.csv("path/to/file");

The [_csv_ function](../../docs/global/func/) is an asynchronous function that returns a promise, hence the await keyword. When the promise is fulfilled, a [DataTable](../../docs/data/datatable/) object is returned. You need to put the above line of code and any other code that handles the `table` object in an asychronous function, or use the [Promise.then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) method to handle the `table` object. To read more about promise and asynchrous function, here are some tutorials: [link 1](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises), [link 2](https://javascript.plainenglish.io/javascript-async-await-and-promises-explained-like-youre-five-years-old-61733751e9a5). 

When importing a csv file, Atlas automatically infers the [data type](../../docs/global/constants/#data-type) for each column, and parses the values accordingly. An imported data table can be used in one or more scenes.







