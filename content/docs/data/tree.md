---
title: "Tree"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: true
images: []
menu:
  docs:
    parent: "data"
weight: 72
toc: true
---

The Tree class represents a hierarchical dataset. Tree objects are created by importing [JSON files in a specific format](../../../tutorials/initialize/#import-treehierarchical-data) using the [_treejson_ function](../../global/func/):

    let tree = await atlas.treejson("data.json");

A tree is represented using two [data tables](../../data/datatable/), one for the nodes and one for the parent-child relationships (Figure 1). A unique id is assigned to each node in the node table. Atlas automatically infers the [data type](../../global/constants/#data-type) for each node attribute, and parses the values accordingly. 

{{< figure src="../tree_import.png" alt="tree import" width="750px" caption="Figure 1: a tree dataset is parsed as two data tables" class="border-0 mx-auto text-center">}}

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**nodeTable** <img width="70px" src="../../readonly.png">| the nodes in the tree | [DataTable](../../data/datatable/) | | 
|**linkTable** <img width="70px" src="../../readonly.png">| the links in the tree | [DataTable](../../data/datatable/) | | 
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **getRoot**() | returns the root of the tree | Object |
| **getChildren**(node) | returns the children of a node object | Array | 
| **getParent**(node) | returns the parent of a node object | Object | 
| **getMaxDepth**() | returns the maximum depth in the tree | Number | 
{.table-striped}