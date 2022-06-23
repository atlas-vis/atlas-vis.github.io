---
title: "Network"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: true
images: []
menu:
  docs:
    parent: "data"
weight: 73
toc: true
---

The Network class represents a graph with nodes and links. Network objects are created by importing [JSON files in a specific format](../../../tutorials/initialize/#import-graphnetwork-data) using the [_graphjson_ function](../../global/func/):

    let network = await atlas.graphjson("data.json");

A network is represented using two [data tables](../../data/datatable/), one for the nodes and one for the links (Figure 1). Atlas automatically infers the [data type](../../global/constants/#data-type) for each node attribute and link attribute, and parses the values accordingly. 

{{< figure src="../network_import.png" alt="network import" width="750px" caption="Figure 1: a network dataset is parsed as two data tables" class="border-0 mx-auto text-center">}}

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**nodeTable** <img width="70px" src="../../readonly.png">| the node table in the network | [DataTable](../../data/datatable/) | | 
|**linkTable** <img width="70px" src="../../readonly.png">| the link table in the network | [DataTable](../../data/datatable/) | | 
| **nodes** <img width="70px" src="../../readonly.png">| the nodes in the network | Array of Objects |
| **links** <img width="70px" src="../../readonly.png">| the links in the network | Array of Objects |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **getNode**(id) | returns the node with the id | Object | 
{.table-striped}