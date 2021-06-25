---
title: "Data Table"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "data"
weight: 70
toc: true
---

The DataTable class represents a data table consisting of _tuples_ (rows) and _fields_ (columns). DataTable objects are created by importing Comma Separated Values (CSV) files using the [_csv_ function]():

    let table = await atlas.csv("data.csv");

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**name** | the name of the data table, derived from the file name | String | | 
|**fields** <img width="70px" src="../../readonly.png">| the name of fields (columns) in the data table | Array | | 
| **nonNumericFields** <img width="70px" src="../../readonly.png">| the name of non-numeric fields (columns) in the data table | Array | | 
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **getFieldType**(f) | returns the type of the specified field | [Data Type](../../global/constants/#data-type) |
| **getFieldSummary**(f) | returns a summary of the specified field | Object | 
| **getFieldValues**(f) | returns an array of values for the specified field | Array | 
| **getUniqueFieldValues**(f) | returns an array of unique values for the specified field | Array | 
| **hasField**(f) | returns true of the specified field exists in the data table | Boolean |
| **transform**(type, fields, paramas) | returns a new data table as a result of specified transformation<br>type: [type of transformation](../../global/constants/#data-table-transformation)<br>fields: array of fields to be transformed<br>params: [parameters for the transformation](../../data/datatransform/)<br>example: `let table2 = table.transform('kde', ['col1'], {min: 3, interval: 0.1, max: 8, bandwidth: 0.25})` | [DataTable](../data/datatable/) |
{.table-striped}