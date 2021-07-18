---
title: "Predicate"
description: ""
lead: ""
date: 2020-10-06T08:49:15+00:00
lastmod: 2020-10-06T08:49:15+00:00
draft: false
images: []
menu: 
  docs:
    parent: "global"
weight: 4
toc: true
---

A predicate is used to define an inclusion or exclusion criterion. The [_find_ method](../../group/scene/#methods-manage-items) in the [Scene](../../group/scene/) class, for example, takes an array of predicates as its parameter. 

### Predicates based on visual properties
A predicate based on a visual property is defined as:

- {channel: _channel_, value: _value_} if the criterion demands an exact match, for example, the following code will return all the objects in the scene whose fill color is red:

```js
    scene.find([{channel: "fillColor", value: "red"}])
```

- {channel: _channel_, range: _[low, high]_} if the criterion demands the visual property is within the specified range, for example, the following code will return all the objects in the scene whose x position is between the range:
  
```js
    scene.find([{channel: "x", range: [0, 200]}])
```

- {channel: _channel_, values: _[values]_} if the criterion demands the visual property matches any value in the specified value array, for example, the following code will return all the objects in the scene whose type is either a rectangle or a circle:

```js
    scene.find([{channel: "type", values: ["rectangle", "circle"]}])
```

### Predicates based on data values
A predicate based on a data field is defined as:

- {field: _field_, value: _value_} if the criterion demands an exact match, for example, the following code will return all the objects in the scene whose [data scope](../../data/datascope/) has the value "male" for the field "gender":

```js
    scene.find([{field: "gender", value: "male"}])
```

- {field: _field_, range: _[low, high]_} if the criterion demands the field value is within the specified range, for example, the following code will return all the objects in the scene whose [data scope](../../data/datascope/) has a value between 20 and 50 for the field "age":

```js
    scene.find([{field: "age", range: [20, 50]}])
```

- {field: _field_, values: _[values]_} if the criterion demands the field value matches any value in the specified array, for example, the following code will return all the objects in the scene whose whose [data scope](../../data/datascope/) has a value related to education for the field "occupation":

```js
    scene.find([{field: "occupation", values: ["teacher", "professor", "lecturer"]}])
```

- {fields: _[field1, field2]_, operator: _operator_} if the criterion demands the values of the two specified fields satisfy the specified operator relation, for example, the following code will return all the objects in the scene whose whose [data scope](../../data/datascope/)'s "income" value is greater than the "spending" value:

```js
    scene.find([{fields: ["income", "spending"], operator: ">"}])
```