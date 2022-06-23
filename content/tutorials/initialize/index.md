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

```js
    let scene = atlas.scene();
``` 

The returned object is an instance of the [Scene](../../docs/group/scene/) class, which is one of the most important class in Atlas. Mark/glyph creation, data binding, visual encoding and graphical constraints are all accomplished as methods in this class. 

### Import CSV Data
Atlas assumes that in Comma Separated Values (CSV) files, the first row contains the column names, and the data is in a **long form**. For an explanation of the differences between long and wide forms of data, see [this Wikipedia article](https://en.wikipedia.org/wiki/Wide_and_narrow_data). Section 3 of [Tiday Data by Hadley Wickham](http://vita.had.co.nz/papers/tidy-data.pdf) contains a more technical discussion. To import a CSV file, use the [_csv_ function](../../docs/global/func/):

```js
    let table = await atlas.csv("path/to/file");
```

<span style="color:red;font-weight:bold">IMPORTANT</span>: The [_csv_ function](../../docs/global/func/) is an asynchronous function that returns a promise, hence the await keyword. When the promise is fulfilled, a [DataTable](../../docs/data/datatable/) object is returned. You need to put the above line of code and any other code that handles the `table` object in an asychronous function, or use the [Promise.then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) method to handle the `table` object. To read more about promise and asynchrous function, here are some tutorials: [link 1](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises), [link 2](https://javascript.plainenglish.io/javascript-async-await-and-promises-explained-like-youre-five-years-old-61733751e9a5). 

When importing a csv file, Atlas automatically infers the [data type](../../docs/global/constants/#data-type) for each column, and parses the values accordingly. An imported data table can be used in one or more scenes.


<!-- ### Import Tree/Hierarchical Data
Atlas assumes that tree/hierarchical data is represented using a specific [JSON format](https://en.wikipedia.org/wiki/JSON): the JSON representation must be a single object, representing the tree of the tree. Non-leaf object must have a "children" attribute, where the value is an array of objects representing its children. Leaf objects may not have the "children" attribute. The objects can have other attributes. This structure can be nested to represent multiple levels of hierarchy. Below is an example:

```json
{
    "name": "North America",
    "type": "continent",
    "children": [
        {
            "name": "Canada",
            "type": "country"
        },
        {
            "name": "United States of America",
            "type": "country"
        },
        {
            "name": "Mexico",
            "type": "country"
        }
    ]
}
```
To import a tree dataset, use the [_treejson_ function](../../docs/global/func/):

```js
    let tree = await atlas.treejson("path/to/file");
```

<span style="color:red;font-weight:bold">IMPORTANT</span>: The [_treejson_ function](../../docs/global/func/) is an asynchronous function that returns a promise, hence the await keyword. When the promise is fulfilled, a [Tree](../../docs/data/tree/) object is returned. You need to put the above line of code and any other code that handles the `tree` object in an asychronous function, or use the [Promise.then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) method to handle the `tree` object. 

### Import Graph/Network Data
Atlas assumes that graph/network data is represented using a specific [JSON format](https://en.wikipedia.org/wiki/JSON): the JSON representation must have two attributes: "nodes" and "links", the value of each is an array of objects representing the nodes and links in the network. Each node object must have an "id" attribute, which uniquely identifies the node. The "id" value can be a number or a string. Each link object must have a "source" attribute and a "target" attribute, where the values are the node id values. Below is an example:

```json
{
    "nodes": [
        {
            "id": 1,
            "name": "node a"
        },
        {
            "id": 2,
            "name": "node b"
        },
        {
            "id": 3,
            "name": "node c"
        }
    ],
    "links": [
        {
            "source": 1,
            "target": 2
        },
        {
            "source": 1,
            "target": 3
        },
        {
            "source": 2,
            "target": 3
        }
    ]
}
```
To import a network dataset, use the [_graphjson_ function](../../docs/global/func/):

```js
    let network = await atlas.graphjson("path/to/file");
```

<span style="color:red;font-weight:bold">IMPORTANT</span>: The [_graphjson_ function](../../docs/global/func/) is an asynchronous function that returns a promise, hence the await keyword. When the promise is fulfilled, a [Network](../../docs/data/network/) object is returned. You need to put the above line of code and any other code that handles the `network` object in an asychronous function, or use the [Promise.then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) method to handle the `network` object.  -->

