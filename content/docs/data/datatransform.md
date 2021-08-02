---
title: "Data Transformations"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "data"
weight: 80
toc: true
---

### Binning

The binning transformation divides the value range of a field into intervals, and counts the number of values within each interval. To apply the transformation, here is an example: 

```js
    let t = datatable.transform("bin", ["col1"]);
```
The returned result `t` is a [DataTable](../../data/datatable/). Each tuple (i.e., row) represents a bin or an interval. There are three fields (i.e., columns): "x0" (lower bound of the bin, inclusive), "x1" (upper bound of the bin, exclusive except the last bin), and "col1_count" (the number of values in the bin).


| parameter |  required? | explanation   | default value |
| --- | --- | --- | --- |
| binWidth | optional | width of bin | computed using [Sturge's formula](https://en.wikipedia.org/wiki/Histogram#Number_of_bins_and_width) |
| min | optional | minimum bin value | minimum field value |
| max | optional | maximum bin value | minimum field value |
{.table-striped}

### Filtering
The filtering transformation removes tuples in a data table that do not satisfy user defined criteria. The filtering criteria are defined as an array of [predicates](../../global/predicate/). To apply the transformation, here is an example: 

```js
    let t = datatable.transform("filter", [{field: "col1", value: "value1"}]);
```
The returned result `t` is a [DataTable](../../data/datatable/), where the rows are a subset of the rows in the original data table. 

### Kernel Density Estimation
The KDE transformation estimates the probability density of a field using an Epanechnikov kernel:

```js
    let t = datatable.transform("kde", ["col1"]);
```
The returned result `t` is a [DataTable](../../data/datatable/). Each tuple (i.e., row) has two fields (i.e., columns): "col1" (value samples from the input field), and "col1_density" (the estimated probability density for the value sample).

| parameter | required? |  explanation   | default value |
| --- | --- | --- | --- |
| min | optional | minimum value  | minimum field value|
| max | optional | maximum value  | maximum field value |
| bandwidth | required | smoothing parameter | |
| interval | required | width of bin | |
{.table-striped}

### Sorting
The sorting transformation orders tuples in a data table by the values of the specified fields in the defined order. By default, sorting is in ascending order. For example, the following code sorts the table rows first by `"col1"` then by `"col2"`.

```js
    datatable.transform("sort", ["col1", "col2"]);
```

The original data table is transformed and the return type is void. 