(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.atlas = {}));
}(this, (function (exports) { 'use strict';

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function bisector(f) {
    let delta = f;
    let compare = f;

    if (f.length === 1) {
      delta = (d, x) => f(d) - x;
      compare = ascendingComparator(f);
    }

    function left(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    }

    function right(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }

    function center(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      const i = left(a, x, lo, hi - 1);
      return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
    }

    return {left, center, right};
  }

  function ascendingComparator(f) {
    return (d, x) => ascending(f(d), x);
  }

  function number(x) {
    return x === null ? NaN : +x;
  }

  function* numbers(values, valueof) {
    if (valueof === undefined) {
      for (let value of values) {
        if (value != null && (value = +value) >= value) {
          yield value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
          yield value;
        }
      }
    }
  }

  const ascendingBisect = bisector(ascending);
  const bisectRight = ascendingBisect.right;
  const bisectCenter = bisector(number).center;

  function count(values, valueof) {
    let count = 0;
    if (valueof === undefined) {
      for (let value of values) {
        if (value != null && (value = +value) >= value) {
          ++count;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
          ++count;
        }
      }
    }
    return count;
  }

  function extent(values, valueof) {
    let min;
    let max;
    if (valueof === undefined) {
      for (const value of values) {
        if (value != null) {
          if (min === undefined) {
            if (value >= value) min = max = value;
          } else {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null) {
          if (min === undefined) {
            if (value >= value) min = max = value;
          } else {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
    return [min, max];
  }

  function identity(x) {
    return x;
  }

  var array = Array.prototype;

  var slice = array.slice;

  function constant(x) {
    return function() {
      return x;
    };
  }

  var e10 = Math.sqrt(50),
      e5 = Math.sqrt(10),
      e2 = Math.sqrt(2);

  function ticks(start, stop, count) {
    var reverse,
        i = -1,
        n,
        ticks,
        step;

    stop = +stop, start = +start, count = +count;
    if (start === stop && count > 0) return [start];
    if (reverse = stop < start) n = start, start = stop, stop = n;
    if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

    if (step > 0) {
      let r0 = Math.round(start / step), r1 = Math.round(stop / step);
      if (r0 * step < start) ++r0;
      if (r1 * step > stop) --r1;
      ticks = new Array(n = r1 - r0 + 1);
      while (++i < n) ticks[i] = (r0 + i) * step;
    } else {
      step = -step;
      let r0 = Math.round(start * step), r1 = Math.round(stop * step);
      if (r0 / step < start) ++r0;
      if (r1 / step > stop) --r1;
      ticks = new Array(n = r1 - r0 + 1);
      while (++i < n) ticks[i] = (r0 + i) / step;
    }

    if (reverse) ticks.reverse();

    return ticks;
  }

  function tickIncrement(start, stop, count) {
    var step = (stop - start) / Math.max(0, count),
        power = Math.floor(Math.log(step) / Math.LN10),
        error = step / Math.pow(10, power);
    return power >= 0
        ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
        : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
  }

  function tickStep(start, stop, count) {
    var step0 = Math.abs(stop - start) / Math.max(0, count),
        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
        error = step0 / step1;
    if (error >= e10) step1 *= 10;
    else if (error >= e5) step1 *= 5;
    else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
  }

  function nice(start, stop, count) {
    let prestep;
    while (true) {
      const step = tickIncrement(start, stop, count);
      if (step === prestep || step === 0 || !isFinite(step)) {
        return [start, stop];
      } else if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
      }
      prestep = step;
    }
  }

  function thresholdSturges(values) {
    return Math.ceil(Math.log(count(values)) / Math.LN2) + 1;
  }

  function bin() {
    var value = identity,
        domain = extent,
        threshold = thresholdSturges;

    function histogram(data) {
      if (!Array.isArray(data)) data = Array.from(data);

      var i,
          n = data.length,
          x,
          values = new Array(n);

      for (i = 0; i < n; ++i) {
        values[i] = value(data[i], i, data);
      }

      var xz = domain(values),
          x0 = xz[0],
          x1 = xz[1],
          tz = threshold(values, x0, x1);

      // Convert number of thresholds into uniform thresholds, and nice the
      // default domain accordingly.
      if (!Array.isArray(tz)) {
        const max = x1, tn = +tz;
        if (domain === extent) [x0, x1] = nice(x0, x1, tn);
        tz = ticks(x0, x1, tn);

        // If the last threshold is coincident with the domain’s upper bound, the
        // last bin will be zero-width. If the default domain is used, and this
        // last threshold is coincident with the maximum input value, we can
        // extend the niced upper bound by one tick to ensure uniform bin widths;
        // otherwise, we simply remove the last threshold. Note that we don’t
        // coerce values or the domain to numbers, and thus must be careful to
        // compare order (>=) rather than strict equality (===)!
        if (tz[tz.length - 1] >= x1) {
          if (max >= x1 && domain === extent) {
            const step = tickIncrement(x0, x1, tn);
            if (isFinite(step)) {
              if (step > 0) {
                x1 = (Math.floor(x1 / step) + 1) * step;
              } else if (step < 0) {
                x1 = (Math.ceil(x1 * -step) + 1) / -step;
              }
            }
          } else {
            tz.pop();
          }
        }
      }

      // Remove any thresholds outside the domain.
      var m = tz.length;
      while (tz[0] <= x0) tz.shift(), --m;
      while (tz[m - 1] > x1) tz.pop(), --m;

      var bins = new Array(m + 1),
          bin;

      // Initialize bins.
      for (i = 0; i <= m; ++i) {
        bin = bins[i] = [];
        bin.x0 = i > 0 ? tz[i - 1] : x0;
        bin.x1 = i < m ? tz[i] : x1;
      }

      // Assign data to bins by value, ignoring any outside the domain.
      for (i = 0; i < n; ++i) {
        x = values[i];
        if (x0 <= x && x <= x1) {
          bins[bisectRight(tz, x, 0, m)].push(data[i]);
        }
      }

      return bins;
    }

    histogram.value = function(_) {
      return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
    };

    histogram.domain = function(_) {
      return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
    };

    histogram.thresholds = function(_) {
      return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
    };

    return histogram;
  }

  function max(values, valueof) {
    let max;
    if (valueof === undefined) {
      for (const value of values) {
        if (value != null
            && (max < value || (max === undefined && value >= value))) {
          max = value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null
            && (max < value || (max === undefined && value >= value))) {
          max = value;
        }
      }
    }
    return max;
  }

  function min(values, valueof) {
    let min;
    if (valueof === undefined) {
      for (const value of values) {
        if (value != null
            && (min > value || (min === undefined && value >= value))) {
          min = value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null
            && (min > value || (min === undefined && value >= value))) {
          min = value;
        }
      }
    }
    return min;
  }

  // Based on https://github.com/mourner/quickselect
  // ISC license, Copyright 2018 Vladimir Agafonkin.
  function quickselect(array, k, left = 0, right = array.length - 1, compare = ascending) {
    while (right > left) {
      if (right - left > 600) {
        const n = right - left + 1;
        const m = k - left + 1;
        const z = Math.log(n);
        const s = 0.5 * Math.exp(2 * z / 3);
        const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
        const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
        const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
        quickselect(array, k, newLeft, newRight, compare);
      }

      const t = array[k];
      let i = left;
      let j = right;

      swap(array, left, k);
      if (compare(array[right], t) > 0) swap(array, left, right);

      while (i < j) {
        swap(array, i, j), ++i, --j;
        while (compare(array[i], t) < 0) ++i;
        while (compare(array[j], t) > 0) --j;
      }

      if (compare(array[left], t) === 0) swap(array, left, j);
      else ++j, swap(array, j, right);

      if (j <= k) left = j + 1;
      if (k <= j) right = j - 1;
    }
    return array;
  }

  function swap(array, i, j) {
    const t = array[i];
    array[i] = array[j];
    array[j] = t;
  }

  function quantile(values, p, valueof) {
    values = Float64Array.from(numbers(values, valueof));
    if (!(n = values.length)) return;
    if ((p = +p) <= 0 || n < 2) return min(values);
    if (p >= 1) return max(values);
    var n,
        i = (n - 1) * p,
        i0 = Math.floor(i),
        value0 = max(quickselect(values, i0).subarray(0, i0 + 1)),
        value1 = min(values.subarray(i0 + 1));
    return value0 + (value1 - value0) * (i - i0);
  }

  function mean(values, valueof) {
    let count = 0;
    let sum = 0;
    if (valueof === undefined) {
      for (let value of values) {
        if (value != null && (value = +value) >= value) {
          ++count, sum += value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
          ++count, sum += value;
        }
      }
    }
    if (count) return sum / count;
  }

  function median(values, valueof) {
    return quantile(values, 0.5, valueof);
  }

  function sequence(start, stop, step) {
    start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

    var i = -1,
        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
        range = new Array(n);

    while (++i < n) {
      range[i] = start + i * step;
    }

    return range;
  }

  function sum(values, valueof) {
    let sum = 0;
    if (valueof === undefined) {
      for (let value of values) {
        if (value = +value) {
          sum += value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if (value = +valueof(value, ++index, values)) {
          sum += value;
        }
      }
    }
    return sum;
  }

  var noop = {value: () => {}};

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
  }

  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }

  function none() {}

  function selector(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function array$1(x) {
    return typeof x === "object" && "length" in x
      ? x // Array, TypedArray, NodeList, array-like
      : Array.from(x); // Map, Set, iterable, string, or anything else
  }

  function empty() {
    return [];
  }

  function selectorAll(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  function arrayAll(select) {
    return function() {
      var group = select.apply(this, arguments);
      return group == null ? [] : array$1(group);
    };
  }

  function selection_selectAll(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection(subgroups, parents);
  }

  function matcher(selector) {
    return function() {
      return this.matches(selector);
    };
  }

  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }

  var find = Array.prototype.find;

  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }

  function childFirst() {
    return this.firstElementChild;
  }

  function selection_selectChild(match) {
    return this.select(match == null ? childFirst
        : childFind(typeof match === "function" ? match : childMatcher(match)));
  }

  var filter = Array.prototype.filter;

  function children() {
    return this.children;
  }

  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }

  function selection_selectChildren(match) {
    return this.selectAll(match == null ? children
        : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }

  function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function sparse(update) {
    return new Array(update.length);
  }

  function selection_enter() {
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };

  function constant$1(x) {
    return function() {
      return x;
    };
  }

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = new Map,
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
        exit[i] = node;
      }
    }
  }

  function datum(node) {
    return node.__data__;
  }

  function selection_data(value, key) {
    if (!arguments.length) return Array.from(this, datum);

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant$1(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = array$1(value.call(parent, parent && parent.__data__, j, parents)),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }

    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  function selection_exit() {
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
    if (onupdate != null) update = onupdate(update);
    if (onexit == null) exit.remove(); else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }

  function selection_merge(selection) {
    if (!(selection instanceof Selection)) throw new Error("invalid merge");

    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection(merges, this._parents);
  }

  function selection_order() {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort(compare) {
    if (!compare) compare = ascending$1;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection(sortgroups, this._parents).order();
  }

  function ascending$1(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes() {
    return Array.from(this);
  }

  function selection_node() {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size() {
    let size = 0;
    for (const node of this) ++size; // eslint-disable-line no-unused-vars
    return size;
  }

  function selection_empty() {
    return !this.node();
  }

  function selection_each(callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr(name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }

    return this.each((value == null
        ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)
        : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
  }

  function defaultView(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }

  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style(name, value, priority) {
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove : typeof value === "function"
              ? styleFunction
              : styleConstant)(name, value, priority == null ? "" : priority))
        : styleValue(this.node(), name);
  }

  function styleValue(node, name) {
    return node.style.getPropertyValue(name)
        || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }

  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }

  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }

  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed(name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }

    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction
            : textConstant)(value))
        : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }

  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise() {
    return this.each(raise);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower() {
    return this.each(lower);
  }

  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove() {
    return this.each(remove);
  }

  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }

  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }

  function parseTypenames$1(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }

  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }

  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }

  function selection_on(typename, value, options) {
    var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }

  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;

    if (typeof event === "function") {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }

  function* selection_iterator() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) yield node;
      }
    }
  }

  var root = [null];

  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection() {
    return new Selection([[document.documentElement]], root);
  }

  function selection_selection() {
    return this;
  }

  Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    selectChild: selection_selectChild,
    selectChildren: selection_selectChildren,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    selection: selection_selection,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch,
    [Symbol.iterator]: selection_iterator
  };

  function select(selector) {
    return typeof selector === "string"
        ? new Selection([[document.querySelector(selector)]], [document.documentElement])
        : new Selection([[selector]], root);
  }

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex = /^#([0-9a-f]{3,8})$/,
      reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
      reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
      reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
      reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
      reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
      reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    copy: function(channels) {
      return Object.assign(new this.constructor, this, channels);
    },
    displayable: function() {
      return this.rgb().displayable();
    },
    hex: color_formatHex, // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });

  function color_formatHex() {
    return this.rgb().formatHex();
  }

  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }

  function color_formatRgb() {
    return this.rgb().formatRgb();
  }

  function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
        : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
        : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
        : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
        : null) // invalid hex
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (-0.5 <= this.r && this.r < 255.5)
          && (-0.5 <= this.g && this.g < 255.5)
          && (-0.5 <= this.b && this.b < 255.5)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex, // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));

  function rgb_formatHex() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  }

  function rgb_formatRgb() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(")
        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
        + (a === 1 ? ")" : ", " + a + ")");
  }

  function hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
  }

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "hsl(" : "hsla(")
          + (this.h || 0) + ", "
          + (this.s || 0) * 100 + "%, "
          + (this.l || 0) * 100 + "%"
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var deg2rad = Math.PI / 180;
  var rad2deg = 180 / Math.PI;

  var A = -0.14861,
      B = +1.78277,
      C = -0.29227,
      D = -0.90649,
      E = +1.97294,
      ED = E * D,
      EB = E * B,
      BC_DA = B * C - D * A;

  function cubehelixConvert(o) {
    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
        bl = b - l,
        k = (E * (g - l) - C * bl) / D,
        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
  }

  function cubehelix(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
  }

  function Cubehelix(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Cubehelix, cubehelix, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb(
        255 * (l + a * (A * cosh + B * sinh)),
        255 * (l + a * (C * cosh + D * sinh)),
        255 * (l + a * (E * cosh)),
        this.opacity
      );
    }
  }));

  function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0
        + (4 - 6 * t2 + 3 * t3) * v1
        + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
        + t3 * v3) / 6;
  }

  function basis$1(values) {
    var n = values.length - 1;
    return function(t) {
      var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
          v1 = values[i],
          v2 = values[i + 1],
          v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
          v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  function constant$2(x) {
    return function() {
      return x;
    };
  }

  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function hue(a, b) {
    var d = b - a;
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$2(isNaN(a) ? b : a);
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant$2(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant$2(isNaN(a) ? b : a);
  }

  var interpolateRgb = (function rgbGamma(y) {
    var color = gamma(y);

    function rgb$1(start, end) {
      var r = color((start = rgb(start)).r, (end = rgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb$1.gamma = rgbGamma;

    return rgb$1;
  })(1);

  function rgbSpline(spline) {
    return function(colors) {
      var n = colors.length,
          r = new Array(n),
          g = new Array(n),
          b = new Array(n),
          i, color;
      for (i = 0; i < n; ++i) {
        color = rgb(colors[i]);
        r[i] = color.r || 0;
        g[i] = color.g || 0;
        b[i] = color.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color.opacity = 1;
      return function(t) {
        color.r = r(t);
        color.g = g(t);
        color.b = b(t);
        return color + "";
      };
    };
  }

  var rgbBasis = rgbSpline(basis$1);

  function numberArray(a, b) {
    if (!b) b = [];
    var n = a ? Math.min(b.length, a.length) : 0,
        c = b.slice(),
        i;
    return function(t) {
      for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
      return c;
    };
  }

  function isNumberArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
  }

  function genericArray(a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(na),
        c = new Array(nb),
        i;

    for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];

    return function(t) {
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    };
  }

  function date(a, b) {
    var d = new Date;
    return a = +a, b = +b, function(t) {
      return d.setTime(a * (1 - t) + b * t), d;
    };
  }

  function interpolateNumber(a, b) {
    return a = +a, b = +b, function(t) {
      return a * (1 - t) + b * t;
    };
  }

  function object(a, b) {
    var i = {},
        c = {},
        k;

    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};

    for (k in b) {
      if (k in a) {
        i[k] = interpolate(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }

    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");

  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function interpolateString(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: interpolateNumber(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  function interpolate(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant$2(b)
        : (t === "number" ? interpolateNumber
        : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
        : b instanceof color ? interpolateRgb
        : b instanceof Date ? date
        : isNumberArray(b) ? numberArray
        : Array.isArray(b) ? genericArray
        : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
        : interpolateNumber)(a, b);
  }

  function interpolateRound(a, b) {
    return a = +a, b = +b, function(t) {
      return Math.round(a * (1 - t) + b * t);
    };
  }

  var degrees = 180 / Math.PI;

  var identity$1 = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };

  function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var cssNode,
      cssRoot,
      cssView,
      svgNode;

  function parseCss(value) {
    if (value === "none") return identity$1;
    if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
    cssNode.style.transform = value;
    value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
    cssRoot.removeChild(cssNode);
    value = value.slice(7, -1).split(",");
    return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
  }

  function parseSvg(value) {
    if (value == null) return identity$1;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  function interpolateTransform(parse, pxComma, pxParen, degParen) {

    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }

    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }

    return function(a, b) {
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }

  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  function cubehelix$1(hue) {
    return (function cubehelixGamma(y) {
      y = +y;

      function cubehelix$1(start, end) {
        var h = hue((start = cubehelix(start)).h, (end = cubehelix(end)).h),
            s = nogamma(start.s, end.s),
            l = nogamma(start.l, end.l),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.h = h(t);
          start.s = s(t);
          start.l = l(Math.pow(t, y));
          start.opacity = opacity(t);
          return start + "";
        };
      }

      cubehelix$1.gamma = cubehelixGamma;

      return cubehelix$1;
    })(1);
  }

  cubehelix$1(hue);
  var cubehelixLong = cubehelix$1(nogamma);

  var frame = 0, // is an animation frame pending?
      timeout = 0, // is a timeout pending?
      interval = 0, // are any timers active?
      pokeDelay = 1000, // how frequently we check for clock skew
      taskHead,
      taskTail,
      clockLast = 0,
      clockNow = 0,
      clockSkew = 0,
      clock = typeof performance === "object" && performance.now ? performance : Date,
      setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }

  function clearNow() {
    clockNow = 0;
  }

  function Timer() {
    this._call =
    this._time =
    this._next = null;
  }

  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };

  function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
  }

  function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
      t = t._next;
    }
    --frame;
  }

  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }

  function poke() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  }

  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }

  function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  function timeout$1(callback, delay, time) {
    var t = new Timer;
    delay = delay == null ? 0 : +delay;
    t.restart(elapsed => {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  var emptyOn = dispatch("start", "end", "cancel", "interrupt");
  var emptyTween = [];

  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;

  function schedule(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    create(node, id, {
      name: name,
      index: index, // For context during callback.
      group: group, // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }

  function init(node, id) {
    var schedule = get$1(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }

  function set$1(node, id) {
    var schedule = get$1(node, id);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
  }

  function get$1(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
  }

  function create(node, id, self) {
    var schedules = node.__transition,
        tween;

    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = timer(schedule, 0, self.time);

    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start, self.delay, self.time);

      // If the elapsed delay is less than our first sleep, start immediately.
      if (self.delay <= elapsed) start(elapsed - self.delay);
    }

    function start(elapsed) {
      var i, j, n, o;

      // If the state is not SCHEDULED, then we previously errored on start.
      if (self.state !== SCHEDULED) return stop();

      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;

        // While this element already has a starting transition during this frame,
        // defer starting an interrupting transition until that transition has a
        // chance to tick (and possibly end); see d3/d3-transition#54!
        if (o.state === STARTED) return timeout$1(start);

        // Interrupt the active transition, if any.
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }

        // Cancel any pre-empted transitions.
        else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
      }

      // Defer the first tick to end of the current frame; see d3/d3#1576.
      // Note the transition may be canceled after start and before the first tick!
      // Note this must be scheduled before the start event; see d3/d3-transition#16!
      // Assuming this is successful, subsequent callbacks go straight to tick.
      timeout$1(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });

      // Dispatch the start event.
      // Note this must be done before the tween are initialized.
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return; // interrupted
      self.state = STARTED;

      // Initialize the tween, deleting null tween.
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }

    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
          i = -1,
          n = tween.length;

      while (++i < n) {
        tween[i].call(node, t);
      }

      // Dispatch the end event.
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }

    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id];
      for (var i in schedules) return; // eslint-disable-line no-unused-vars
      delete node.__transition;
    }
  }

  function interrupt(node, name) {
    var schedules = node.__transition,
        schedule,
        active,
        empty = true,
        i;

    if (!schedules) return;

    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }

    if (empty) delete node.__transition;
  }

  function selection_interrupt(name) {
    return this.each(function() {
      interrupt(this, name);
    });
  }

  function tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
      var schedule = set$1(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }

      schedule.tween = tween1;
    };
  }

  function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
      var schedule = set$1(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }

      schedule.tween = tween1;
    };
  }

  function transition_tween(name, value) {
    var id = this._id;

    name += "";

    if (arguments.length < 2) {
      var tween = get$1(this.node(), id).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }

    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
  }

  function tweenValue(transition, name, value) {
    var id = transition._id;

    transition.each(function() {
      var schedule = set$1(this, id);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });

    return function(node) {
      return get$1(node, id).value[name];
    };
  }

  function interpolate$1(a, b) {
    var c;
    return (typeof b === "number" ? interpolateNumber
        : b instanceof color ? interpolateRgb
        : (c = color(b)) ? (b = c, interpolateRgb)
        : interpolateString)(a, b);
  }

  function attrRemove$1(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS$1(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant$1(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrConstantNS$1(fullname, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrFunction$1(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function attrFunctionNS$1(fullname, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function transition_attr(name, value) {
    var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate$1;
    return this.attrTween(name, typeof value === "function"
        ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
        : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
        : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
  }

  function attrInterpolate(name, i) {
    return function(t) {
      this.setAttribute(name, i.call(this, t));
    };
  }

  function attrInterpolateNS(fullname, i) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
  }

  function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function attrTween(name, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_attrTween(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  function delayFunction(id, value) {
    return function() {
      init(this, id).delay = +value.apply(this, arguments);
    };
  }

  function delayConstant(id, value) {
    return value = +value, function() {
      init(this, id).delay = value;
    };
  }

  function transition_delay(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? delayFunction
            : delayConstant)(id, value))
        : get$1(this.node(), id).delay;
  }

  function durationFunction(id, value) {
    return function() {
      set$1(this, id).duration = +value.apply(this, arguments);
    };
  }

  function durationConstant(id, value) {
    return value = +value, function() {
      set$1(this, id).duration = value;
    };
  }

  function transition_duration(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? durationFunction
            : durationConstant)(id, value))
        : get$1(this.node(), id).duration;
  }

  function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
      set$1(this, id).ease = value;
    };
  }

  function transition_ease(value) {
    var id = this._id;

    return arguments.length
        ? this.each(easeConstant(id, value))
        : get$1(this.node(), id).ease;
  }

  function easeVarying(id, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (typeof v !== "function") throw new Error;
      set$1(this, id).ease = v;
    };
  }

  function transition_easeVarying(value) {
    if (typeof value !== "function") throw new Error;
    return this.each(easeVarying(this._id, value));
  }

  function transition_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  function transition_merge(transition) {
    if (transition._id !== this._id) throw new Error;

    for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Transition(merges, this._parents, this._name, this._id);
  }

  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }

  function onFunction(id, name, listener) {
    var on0, on1, sit = start(name) ? init : set$1;
    return function() {
      var schedule = sit(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

      schedule.on = on1;
    };
  }

  function transition_on(name, listener) {
    var id = this._id;

    return arguments.length < 2
        ? get$1(this.node(), id).on.on(name)
        : this.each(onFunction(id, name, listener));
  }

  function removeFunction(id) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id) return;
      if (parent) parent.removeChild(this);
    };
  }

  function transition_remove() {
    return this.on("end.remove", removeFunction(this._id));
  }

  function transition_select(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
        }
      }
    }

    return new Transition(subgroups, this._parents, name, id);
  }

  function transition_selectAll(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children = select.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
            if (child = children[k]) {
              schedule(child, name, id, k, children, inherit);
            }
          }
          subgroups.push(children);
          parents.push(node);
        }
      }
    }

    return new Transition(subgroups, parents, name, id);
  }

  var Selection$1 = selection.prototype.constructor;

  function transition_selection() {
    return new Selection$1(this._groups, this._parents);
  }

  function styleNull(name, interpolate) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          string1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }

  function styleRemove$1(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant$1(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = styleValue(this, name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function styleFunction$1(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          value1 = value(this),
          string1 = value1 + "";
      if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function styleMaybeRemove(id, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
      var schedule = set$1(this, id),
          on = schedule.on,
          listener = schedule.value[key] == null ? remove || (remove = styleRemove$1(name)) : undefined;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

      schedule.on = on1;
    };
  }

  function transition_style(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate$1;
    return value == null ? this
        .styleTween(name, styleNull(name, i))
        .on("end.style." + name, styleRemove$1(name))
      : typeof value === "function" ? this
        .styleTween(name, styleFunction$1(name, i, tweenValue(this, "style." + name, value)))
        .each(styleMaybeRemove(this._id, name))
      : this
        .styleTween(name, styleConstant$1(name, i, value), priority)
        .on("end.style." + name, null);
  }

  function styleInterpolate(name, i, priority) {
    return function(t) {
      this.style.setProperty(name, i.call(this, t), priority);
    };
  }

  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }

  function transition_styleTween(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  function textConstant$1(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction$1(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }

  function transition_text(value) {
    return this.tween("text", typeof value === "function"
        ? textFunction$1(tweenValue(this, "text", value))
        : textConstant$1(value == null ? "" : value + ""));
  }

  function textInterpolate(i) {
    return function(t) {
      this.textContent = i.call(this, t);
    };
  }

  function textTween(value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_textTween(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, textTween(value));
  }

  function transition_transition() {
    var name = this._name,
        id0 = this._id,
        id1 = newId();

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit = get$1(node, id0);
          schedule(node, name, id1, i, group, {
            time: inherit.time + inherit.delay + inherit.duration,
            delay: 0,
            duration: inherit.duration,
            ease: inherit.ease
          });
        }
      }
    }

    return new Transition(groups, this._parents, name, id1);
  }

  function transition_end() {
    var on0, on1, that = this, id = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
      var cancel = {value: reject},
          end = {value: function() { if (--size === 0) resolve(); }};

      that.each(function() {
        var schedule = set$1(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }

        schedule.on = on1;
      });

      // The selection was empty, resolve end immediately
      if (size === 0) resolve();
    });
  }

  var id = 0;

  function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
  }

  function transition(name) {
    return selection().transition(name);
  }

  function newId() {
    return ++id;
  }

  var selection_prototype = selection.prototype;

  Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    textTween: transition_textTween,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease,
    easeVarying: transition_easeVarying,
    end: transition_end,
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
  };

  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  var defaultTiming = {
    time: null, // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  };

  function inherit(node, id) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id])) {
      if (!(node = node.parentNode)) {
        throw new Error(`transition ${id} not found`);
      }
    }
    return timing;
  }

  function selection_transition(name) {
    var id,
        timing;

    if (name instanceof Transition) {
      id = name._id, name = name._name;
    } else {
      id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule(node, name, id, i, group, timing || inherit(node, id));
        }
      }
    }

    return new Transition(groups, this._parents, name, id);
  }

  selection.prototype.interrupt = selection_interrupt;
  selection.prototype.transition = selection_transition;

  const pi = Math.PI,
      tau = 2 * pi,
      epsilon = 1e-6,
      tauEpsilon = tau - epsilon;

  function Path() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = "";
  }

  function path() {
    return new Path;
  }

  Path.prototype = path.prototype = {
    constructor: Path,
    moveTo: function(x, y) {
      this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
    },
    closePath: function() {
      if (this._x1 !== null) {
        this._x1 = this._x0, this._y1 = this._y0;
        this._ += "Z";
      }
    },
    lineTo: function(x, y) {
      this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    quadraticCurveTo: function(x1, y1, x, y) {
      this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    bezierCurveTo: function(x1, y1, x2, y2, x, y) {
      this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    arcTo: function(x1, y1, x2, y2, r) {
      x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
      var x0 = this._x1,
          y0 = this._y1,
          x21 = x2 - x1,
          y21 = y2 - y1,
          x01 = x0 - x1,
          y01 = y0 - y1,
          l01_2 = x01 * x01 + y01 * y01;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x1,y1).
      if (this._x1 === null) {
        this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
      }

      // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
      else if (!(l01_2 > epsilon));

      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
        this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
      }

      // Otherwise, draw an arc!
      else {
        var x20 = x2 - x0,
            y20 = y2 - y0,
            l21_2 = x21 * x21 + y21 * y21,
            l20_2 = x20 * x20 + y20 * y20,
            l21 = Math.sqrt(l21_2),
            l01 = Math.sqrt(l01_2),
            l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
            t01 = l / l01,
            t21 = l / l21;

        // If the start tangent is not coincident with (x0,y0), line to.
        if (Math.abs(t01 - 1) > epsilon) {
          this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
        }

        this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
      }
    },
    arc: function(x, y, r, a0, a1, ccw) {
      x = +x, y = +y, r = +r, ccw = !!ccw;
      var dx = r * Math.cos(a0),
          dy = r * Math.sin(a0),
          x0 = x + dx,
          y0 = y + dy,
          cw = 1 ^ ccw,
          da = ccw ? a0 - a1 : a1 - a0;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x0,y0).
      if (this._x1 === null) {
        this._ += "M" + x0 + "," + y0;
      }

      // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
      else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
        this._ += "L" + x0 + "," + y0;
      }

      // Is this arc empty? We’re done.
      if (!r) return;

      // Does the angle go the wrong way? Flip the direction.
      if (da < 0) da = da % tau + tau;

      // Is this a complete circle? Draw two arcs to complete the circle.
      if (da > tauEpsilon) {
        this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
      }

      // Is this arc non-empty? Draw an arc!
      else if (da > epsilon) {
        this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
      }
    },
    rect: function(x, y, w, h) {
      this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
    },
    toString: function() {
      return this._;
    }
  };

  var EOL = {},
      EOF = {},
      QUOTE = 34,
      NEWLINE = 10,
      RETURN = 13;

  function objectConverter(columns) {
    return new Function("d", "return {" + columns.map(function(name, i) {
      return JSON.stringify(name) + ": d[" + i + "] || \"\"";
    }).join(",") + "}");
  }

  function customConverter(columns, f) {
    var object = objectConverter(columns);
    return function(row, i) {
      return f(object(row), i, columns);
    };
  }

  // Compute unique columns in order of discovery.
  function inferColumns(rows) {
    var columnSet = Object.create(null),
        columns = [];

    rows.forEach(function(row) {
      for (var column in row) {
        if (!(column in columnSet)) {
          columns.push(columnSet[column] = column);
        }
      }
    });

    return columns;
  }

  function pad(value, width) {
    var s = value + "", length = s.length;
    return length < width ? new Array(width - length + 1).join(0) + s : s;
  }

  function formatYear(year) {
    return year < 0 ? "-" + pad(-year, 6)
      : year > 9999 ? "+" + pad(year, 6)
      : pad(year, 4);
  }

  function formatDate(date) {
    var hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds(),
        milliseconds = date.getUTCMilliseconds();
    return isNaN(date) ? "Invalid Date"
        : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
        + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
        : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
        : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
        : "");
  }

  function dsvFormat(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
        DELIMITER = delimiter.charCodeAt(0);

    function parse(text, f) {
      var convert, columns, rows = parseRows(text, function(row, i) {
        if (convert) return convert(row, i - 1);
        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
      });
      rows.columns = columns || [];
      return rows;
    }

    function parseRows(text, f) {
      var rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // current line number
          t, // current token
          eof = N <= 0, // current token followed by EOF?
          eol = false; // current token followed by EOL?

      // Strip the trailing newline.
      if (text.charCodeAt(N - 1) === NEWLINE) --N;
      if (text.charCodeAt(N - 1) === RETURN) --N;

      function token() {
        if (eof) return EOF;
        if (eol) return eol = false, EOL;

        // Unescape quotes.
        var i, j = I, c;
        if (text.charCodeAt(j) === QUOTE) {
          while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
          if ((i = I) >= N) eof = true;
          else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          return text.slice(j + 1, i - 1).replace(/""/g, "\"");
        }

        // Find next delimiter or newline.
        while (I < N) {
          if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          else if (c !== DELIMITER) continue;
          return text.slice(j, i);
        }

        // Return last token before EOF.
        return eof = true, text.slice(j, N);
      }

      while ((t = token()) !== EOF) {
        var row = [];
        while (t !== EOL && t !== EOF) row.push(t), t = token();
        if (f && (row = f(row, n++)) == null) continue;
        rows.push(row);
      }

      return rows;
    }

    function preformatBody(rows, columns) {
      return rows.map(function(row) {
        return columns.map(function(column) {
          return formatValue(row[column]);
        }).join(delimiter);
      });
    }

    function format(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
    }

    function formatBody(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return preformatBody(rows, columns).join("\n");
    }

    function formatRows(rows) {
      return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(value) {
      return value == null ? ""
          : value instanceof Date ? formatDate(value)
          : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
          : value;
    }

    return {
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatBody: formatBody,
      formatRows: formatRows,
      formatRow: formatRow,
      formatValue: formatValue
    };
  }

  var csv = dsvFormat(",");

  var csvParse = csv.parse;

  function autoType(object) {
    for (var key in object) {
      var value = object[key].trim(), number, m;
      if (!value) value = null;
      else if (value === "true") value = true;
      else if (value === "false") value = false;
      else if (value === "NaN") value = NaN;
      else if (!isNaN(number = +value)) value = number;
      else if (m = value.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/)) {
        if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, "/").replace(/T/, " ");
        value = new Date(value);
      }
      else continue;
      object[key] = value;
    }
    return object;
  }

  // https://github.com/d3/d3-dsv/issues/45
  const fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();

  function formatDecimal(x) {
    return Math.abs(x = Math.round(x)) >= 1e21
        ? x.toLocaleString("en").replace(/,/g, "")
        : x.toString(10);
  }

  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimalParts(1.23) returns ["123", 0].
  function formatDecimalParts(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  function exponent(x) {
    return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
  }

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  function formatNumerals(numerals) {
    return function(value) {
      return value.replace(/[0-9]/g, function(i) {
        return numerals[+i];
      });
    };
  }

  // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
  var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
    var match;
    return new FormatSpecifier({
      fill: match[1],
      align: match[2],
      sign: match[3],
      symbol: match[4],
      zero: match[5],
      width: match[6],
      comma: match[7],
      precision: match[8] && match[8].slice(1),
      trim: match[9],
      type: match[10]
    });
  }

  formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

  function FormatSpecifier(specifier) {
    this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
    this.align = specifier.align === undefined ? ">" : specifier.align + "";
    this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
    this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
    this.zero = !!specifier.zero;
    this.width = specifier.width === undefined ? undefined : +specifier.width;
    this.comma = !!specifier.comma;
    this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
    this.trim = !!specifier.trim;
    this.type = specifier.type === undefined ? "" : specifier.type + "";
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width === undefined ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
        + (this.trim ? "~" : "")
        + this.type;
  };

  // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
  function formatTrim(s) {
    out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (s[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
      }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
  }

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
  }

  function formatRounded(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  var formatTypes = {
    "%": (x, p) => (x * 100).toFixed(p),
    "b": (x) => Math.round(x).toString(2),
    "c": (x) => x + "",
    "d": formatDecimal,
    "e": (x, p) => x.toExponential(p),
    "f": (x, p) => x.toFixed(p),
    "g": (x, p) => x.toPrecision(p),
    "o": (x) => Math.round(x).toString(8),
    "p": (x, p) => formatRounded(x * 100, p),
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": (x) => Math.round(x).toString(16).toUpperCase(),
    "x": (x) => Math.round(x).toString(16)
  };

  function identity$2(x) {
    return x;
  }

  var map = Array.prototype.map,
      prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

  function formatLocale(locale) {
    var group = locale.grouping === undefined || locale.thousands === undefined ? identity$2 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
        currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
        currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
        decimal = locale.decimal === undefined ? "." : locale.decimal + "",
        numerals = locale.numerals === undefined ? identity$2 : formatNumerals(map.call(locale.numerals, String)),
        percent = locale.percent === undefined ? "%" : locale.percent + "",
        minus = locale.minus === undefined ? "−" : locale.minus + "",
        nan = locale.nan === undefined ? "NaN" : locale.nan + "";

    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          trim = specifier.trim,
          type = specifier.type;

      // The "n" type is an alias for ",g".
      if (type === "n") comma = true, type = "g";

      // The "" type, and any invalid type, is an alias for ".12~g".
      else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

      // If zero fill is specified, padding goes after sign and before digits.
      if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision === undefined ? 6
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      function format(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix,
            i, n, c;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Determine the sign. -0 is not less than 0, but 1 / -0 is!
          var valueNegative = value < 0 || 1 / value < 0;

          // Perform the initial formatting.
          value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

          // Trim insignificant zeros.
          if (trim) value = formatTrim(value);

          // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
          if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            i = -1, n = value.length;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": value = valuePrefix + value + valueSuffix + padding; break;
          case "=": value = valuePrefix + padding + value + valueSuffix; break;
          case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
          default: value = padding + valuePrefix + value + valueSuffix; break;
        }

        return numerals(value);
      }

      format.toString = function() {
        return specifier + "";
      };

      return format;
    }

    function formatPrefix(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: newFormat,
      formatPrefix: formatPrefix
    };
  }

  var locale;
  var format;
  var formatPrefix;

  defaultLocale({
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  function defaultLocale(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
  }

  function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
  }

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  }

  function precisionRound(step, max) {
    step = Math.abs(step), max = Math.abs(max) - step;
    return Math.max(0, exponent(max) - exponent(step)) + 1;
  }

  function count$1(node) {
    var sum = 0,
        children = node.children,
        i = children && children.length;
    if (!i) sum = 1;
    else while (--i >= 0) sum += children[i].value;
    node.value = sum;
  }

  function node_count() {
    return this.eachAfter(count$1);
  }

  function node_each(callback, that) {
    let index = -1;
    for (const node of this) {
      callback.call(that, node, ++index, this);
    }
    return this;
  }

  function node_eachBefore(callback, that) {
    var node = this, nodes = [node], children, i, index = -1;
    while (node = nodes.pop()) {
      callback.call(that, node, ++index, this);
      if (children = node.children) {
        for (i = children.length - 1; i >= 0; --i) {
          nodes.push(children[i]);
        }
      }
    }
    return this;
  }

  function node_eachAfter(callback, that) {
    var node = this, nodes = [node], next = [], children, i, n, index = -1;
    while (node = nodes.pop()) {
      next.push(node);
      if (children = node.children) {
        for (i = 0, n = children.length; i < n; ++i) {
          nodes.push(children[i]);
        }
      }
    }
    while (node = next.pop()) {
      callback.call(that, node, ++index, this);
    }
    return this;
  }

  function node_find(callback, that) {
    let index = -1;
    for (const node of this) {
      if (callback.call(that, node, ++index, this)) {
        return node;
      }
    }
  }

  function node_sum(value) {
    return this.eachAfter(function(node) {
      var sum = +value(node.data) || 0,
          children = node.children,
          i = children && children.length;
      while (--i >= 0) sum += children[i].value;
      node.value = sum;
    });
  }

  function node_sort(compare) {
    return this.eachBefore(function(node) {
      if (node.children) {
        node.children.sort(compare);
      }
    });
  }

  function node_path(end) {
    var start = this,
        ancestor = leastCommonAncestor(start, end),
        nodes = [start];
    while (start !== ancestor) {
      start = start.parent;
      nodes.push(start);
    }
    var k = nodes.length;
    while (end !== ancestor) {
      nodes.splice(k, 0, end);
      end = end.parent;
    }
    return nodes;
  }

  function leastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = a.ancestors(),
        bNodes = b.ancestors(),
        c = null;
    a = aNodes.pop();
    b = bNodes.pop();
    while (a === b) {
      c = a;
      a = aNodes.pop();
      b = bNodes.pop();
    }
    return c;
  }

  function node_ancestors() {
    var node = this, nodes = [node];
    while (node = node.parent) {
      nodes.push(node);
    }
    return nodes;
  }

  function node_descendants() {
    return Array.from(this);
  }

  function node_leaves() {
    var leaves = [];
    this.eachBefore(function(node) {
      if (!node.children) {
        leaves.push(node);
      }
    });
    return leaves;
  }

  function node_links() {
    var root = this, links = [];
    root.each(function(node) {
      if (node !== root) { // Don’t include the root’s parent, if any.
        links.push({source: node.parent, target: node});
      }
    });
    return links;
  }

  function* node_iterator() {
    var node = this, current, next = [node], children, i, n;
    do {
      current = next.reverse(), next = [];
      while (node = current.pop()) {
        yield node;
        if (children = node.children) {
          for (i = 0, n = children.length; i < n; ++i) {
            next.push(children[i]);
          }
        }
      }
    } while (next.length);
  }

  function hierarchy(data, children) {
    if (data instanceof Map) {
      data = [undefined, data];
      if (children === undefined) children = mapChildren;
    } else if (children === undefined) {
      children = objectChildren;
    }

    var root = new Node(data),
        node,
        nodes = [root],
        child,
        childs,
        i,
        n;

    while (node = nodes.pop()) {
      if ((childs = children(node.data)) && (n = (childs = Array.from(childs)).length)) {
        node.children = childs;
        for (i = n - 1; i >= 0; --i) {
          nodes.push(child = childs[i] = new Node(childs[i]));
          child.parent = node;
          child.depth = node.depth + 1;
        }
      }
    }

    return root.eachBefore(computeHeight);
  }

  function node_copy() {
    return hierarchy(this).eachBefore(copyData);
  }

  function objectChildren(d) {
    return d.children;
  }

  function mapChildren(d) {
    return Array.isArray(d) ? d[1] : null;
  }

  function copyData(node) {
    if (node.data.value !== undefined) node.value = node.data.value;
    node.data = node.data.data;
  }

  function computeHeight(node) {
    var height = 0;
    do node.height = height;
    while ((node = node.parent) && (node.height < ++height));
  }

  function Node(data) {
    this.data = data;
    this.depth =
    this.height = 0;
    this.parent = null;
  }

  Node.prototype = hierarchy.prototype = {
    constructor: Node,
    count: node_count,
    each: node_each,
    eachAfter: node_eachAfter,
    eachBefore: node_eachBefore,
    find: node_find,
    sum: node_sum,
    sort: node_sort,
    path: node_path,
    ancestors: node_ancestors,
    descendants: node_descendants,
    leaves: node_leaves,
    links: node_links,
    copy: node_copy,
    [Symbol.iterator]: node_iterator
  };

  function array$2(x) {
    return typeof x === "object" && "length" in x
      ? x // Array, TypedArray, NodeList, array-like
      : Array.from(x); // Map, Set, iterable, string, or anything else
  }

  function shuffle(array) {
    var m = array.length,
        t,
        i;

    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  function enclose(circles) {
    var i = 0, n = (circles = shuffle(Array.from(circles))).length, B = [], p, e;

    while (i < n) {
      p = circles[i];
      if (e && enclosesWeak(e, p)) ++i;
      else e = encloseBasis(B = extendBasis(B, p)), i = 0;
    }

    return e;
  }

  function extendBasis(B, p) {
    var i, j;

    if (enclosesWeakAll(p, B)) return [p];

    // If we get here then B must have at least one element.
    for (i = 0; i < B.length; ++i) {
      if (enclosesNot(p, B[i])
          && enclosesWeakAll(encloseBasis2(B[i], p), B)) {
        return [B[i], p];
      }
    }

    // If we get here then B must have at least two elements.
    for (i = 0; i < B.length - 1; ++i) {
      for (j = i + 1; j < B.length; ++j) {
        if (enclosesNot(encloseBasis2(B[i], B[j]), p)
            && enclosesNot(encloseBasis2(B[i], p), B[j])
            && enclosesNot(encloseBasis2(B[j], p), B[i])
            && enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)) {
          return [B[i], B[j], p];
        }
      }
    }

    // If we get here then something is very wrong.
    throw new Error;
  }

  function enclosesNot(a, b) {
    var dr = a.r - b.r, dx = b.x - a.x, dy = b.y - a.y;
    return dr < 0 || dr * dr < dx * dx + dy * dy;
  }

  function enclosesWeak(a, b) {
    var dr = a.r - b.r + Math.max(a.r, b.r, 1) * 1e-9, dx = b.x - a.x, dy = b.y - a.y;
    return dr > 0 && dr * dr > dx * dx + dy * dy;
  }

  function enclosesWeakAll(a, B) {
    for (var i = 0; i < B.length; ++i) {
      if (!enclosesWeak(a, B[i])) {
        return false;
      }
    }
    return true;
  }

  function encloseBasis(B) {
    switch (B.length) {
      case 1: return encloseBasis1(B[0]);
      case 2: return encloseBasis2(B[0], B[1]);
      case 3: return encloseBasis3(B[0], B[1], B[2]);
    }
  }

  function encloseBasis1(a) {
    return {
      x: a.x,
      y: a.y,
      r: a.r
    };
  }

  function encloseBasis2(a, b) {
    var x1 = a.x, y1 = a.y, r1 = a.r,
        x2 = b.x, y2 = b.y, r2 = b.r,
        x21 = x2 - x1, y21 = y2 - y1, r21 = r2 - r1,
        l = Math.sqrt(x21 * x21 + y21 * y21);
    return {
      x: (x1 + x2 + x21 / l * r21) / 2,
      y: (y1 + y2 + y21 / l * r21) / 2,
      r: (l + r1 + r2) / 2
    };
  }

  function encloseBasis3(a, b, c) {
    var x1 = a.x, y1 = a.y, r1 = a.r,
        x2 = b.x, y2 = b.y, r2 = b.r,
        x3 = c.x, y3 = c.y, r3 = c.r,
        a2 = x1 - x2,
        a3 = x1 - x3,
        b2 = y1 - y2,
        b3 = y1 - y3,
        c2 = r2 - r1,
        c3 = r3 - r1,
        d1 = x1 * x1 + y1 * y1 - r1 * r1,
        d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2,
        d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3,
        ab = a3 * b2 - a2 * b3,
        xa = (b2 * d3 - b3 * d2) / (ab * 2) - x1,
        xb = (b3 * c2 - b2 * c3) / ab,
        ya = (a3 * d2 - a2 * d3) / (ab * 2) - y1,
        yb = (a2 * c3 - a3 * c2) / ab,
        A = xb * xb + yb * yb - 1,
        B = 2 * (r1 + xa * xb + ya * yb),
        C = xa * xa + ya * ya - r1 * r1,
        r = -(A ? (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A) : C / B);
    return {
      x: x1 + xa + xb * r,
      y: y1 + ya + yb * r,
      r: r
    };
  }

  function place(b, a, c) {
    var dx = b.x - a.x, x, a2,
        dy = b.y - a.y, y, b2,
        d2 = dx * dx + dy * dy;
    if (d2) {
      a2 = a.r + c.r, a2 *= a2;
      b2 = b.r + c.r, b2 *= b2;
      if (a2 > b2) {
        x = (d2 + b2 - a2) / (2 * d2);
        y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
        c.x = b.x - x * dx - y * dy;
        c.y = b.y - x * dy + y * dx;
      } else {
        x = (d2 + a2 - b2) / (2 * d2);
        y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
        c.x = a.x + x * dx - y * dy;
        c.y = a.y + x * dy + y * dx;
      }
    } else {
      c.x = a.x + c.r;
      c.y = a.y;
    }
  }

  function intersects(a, b) {
    var dr = a.r + b.r - 1e-6, dx = b.x - a.x, dy = b.y - a.y;
    return dr > 0 && dr * dr > dx * dx + dy * dy;
  }

  function score(node) {
    var a = node._,
        b = node.next._,
        ab = a.r + b.r,
        dx = (a.x * b.r + b.x * a.r) / ab,
        dy = (a.y * b.r + b.y * a.r) / ab;
    return dx * dx + dy * dy;
  }

  function Node$1(circle) {
    this._ = circle;
    this.next = null;
    this.previous = null;
  }

  function packEnclose(circles) {
    if (!(n = (circles = array$2(circles)).length)) return 0;

    var a, b, c, n, aa, ca, i, j, k, sj, sk;

    // Place the first circle.
    a = circles[0], a.x = 0, a.y = 0;
    if (!(n > 1)) return a.r;

    // Place the second circle.
    b = circles[1], a.x = -b.r, b.x = a.r, b.y = 0;
    if (!(n > 2)) return a.r + b.r;

    // Place the third circle.
    place(b, a, c = circles[2]);

    // Initialize the front-chain using the first three circles a, b and c.
    a = new Node$1(a), b = new Node$1(b), c = new Node$1(c);
    a.next = c.previous = b;
    b.next = a.previous = c;
    c.next = b.previous = a;

    // Attempt to place each remaining circle…
    pack: for (i = 3; i < n; ++i) {
      place(a._, b._, c = circles[i]), c = new Node$1(c);

      // Find the closest intersecting circle on the front-chain, if any.
      // “Closeness” is determined by linear distance along the front-chain.
      // “Ahead” or “behind” is likewise determined by linear distance.
      j = b.next, k = a.previous, sj = b._.r, sk = a._.r;
      do {
        if (sj <= sk) {
          if (intersects(j._, c._)) {
            b = j, a.next = b, b.previous = a, --i;
            continue pack;
          }
          sj += j._.r, j = j.next;
        } else {
          if (intersects(k._, c._)) {
            a = k, a.next = b, b.previous = a, --i;
            continue pack;
          }
          sk += k._.r, k = k.previous;
        }
      } while (j !== k.next);

      // Success! Insert the new circle c between a and b.
      c.previous = a, c.next = b, a.next = b.previous = b = c;

      // Compute the new closest circle pair to the centroid.
      aa = score(a);
      while ((c = c.next) !== b) {
        if ((ca = score(c)) < aa) {
          a = c, aa = ca;
        }
      }
      b = a.next;
    }

    // Compute the enclosing circle of the front chain.
    a = [b._], c = b; while ((c = c.next) !== b) a.push(c._); c = enclose(a);

    // Translate the circles to put the enclosing circle around the origin.
    for (i = 0; i < n; ++i) a = circles[i], a.x -= c.x, a.y -= c.y;

    return c.r;
  }

  function optional(f) {
    return f == null ? null : required(f);
  }

  function required(f) {
    if (typeof f !== "function") throw new Error;
    return f;
  }

  function constantZero() {
    return 0;
  }

  function constant$3(x) {
    return function() {
      return x;
    };
  }

  function defaultRadius(d) {
    return Math.sqrt(d.value);
  }

  function index() {
    var radius = null,
        dx = 1,
        dy = 1,
        padding = constantZero;

    function pack(root) {
      root.x = dx / 2, root.y = dy / 2;
      if (radius) {
        root.eachBefore(radiusLeaf(radius))
            .eachAfter(packChildren(padding, 0.5))
            .eachBefore(translateChild(1));
      } else {
        root.eachBefore(radiusLeaf(defaultRadius))
            .eachAfter(packChildren(constantZero, 1))
            .eachAfter(packChildren(padding, root.r / Math.min(dx, dy)))
            .eachBefore(translateChild(Math.min(dx, dy) / (2 * root.r)));
      }
      return root;
    }

    pack.radius = function(x) {
      return arguments.length ? (radius = optional(x), pack) : radius;
    };

    pack.size = function(x) {
      return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [dx, dy];
    };

    pack.padding = function(x) {
      return arguments.length ? (padding = typeof x === "function" ? x : constant$3(+x), pack) : padding;
    };

    return pack;
  }

  function radiusLeaf(radius) {
    return function(node) {
      if (!node.children) {
        node.r = Math.max(0, +radius(node) || 0);
      }
    };
  }

  function packChildren(padding, k) {
    return function(node) {
      if (children = node.children) {
        var children,
            i,
            n = children.length,
            r = padding(node) * k || 0,
            e;

        if (r) for (i = 0; i < n; ++i) children[i].r += r;
        e = packEnclose(children);
        if (r) for (i = 0; i < n; ++i) children[i].r -= r;
        node.r = e + r;
      }
    };
  }

  function translateChild(k) {
    return function(node) {
      var parent = node.parent;
      node.r *= k;
      if (parent) {
        node.x = parent.x + k * node.x;
        node.y = parent.y + k * node.y;
      }
    };
  }

  function roundNode(node) {
    node.x0 = Math.round(node.x0);
    node.y0 = Math.round(node.y0);
    node.x1 = Math.round(node.x1);
    node.y1 = Math.round(node.y1);
  }

  function treemapDice(parent, x0, y0, x1, y1) {
    var nodes = parent.children,
        node,
        i = -1,
        n = nodes.length,
        k = parent.value && (x1 - x0) / parent.value;

    while (++i < n) {
      node = nodes[i], node.y0 = y0, node.y1 = y1;
      node.x0 = x0, node.x1 = x0 += node.value * k;
    }
  }

  function treemapSlice(parent, x0, y0, x1, y1) {
    var nodes = parent.children,
        node,
        i = -1,
        n = nodes.length,
        k = parent.value && (y1 - y0) / parent.value;

    while (++i < n) {
      node = nodes[i], node.x0 = x0, node.x1 = x1;
      node.y0 = y0, node.y1 = y0 += node.value * k;
    }
  }

  var phi = (1 + Math.sqrt(5)) / 2;

  function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
    var rows = [],
        nodes = parent.children,
        row,
        nodeValue,
        i0 = 0,
        i1 = 0,
        n = nodes.length,
        dx, dy,
        value = parent.value,
        sumValue,
        minValue,
        maxValue,
        newRatio,
        minRatio,
        alpha,
        beta;

    while (i0 < n) {
      dx = x1 - x0, dy = y1 - y0;

      // Find the next non-empty node.
      do sumValue = nodes[i1++].value; while (!sumValue && i1 < n);
      minValue = maxValue = sumValue;
      alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
      beta = sumValue * sumValue * alpha;
      minRatio = Math.max(maxValue / beta, beta / minValue);

      // Keep adding nodes while the aspect ratio maintains or improves.
      for (; i1 < n; ++i1) {
        sumValue += nodeValue = nodes[i1].value;
        if (nodeValue < minValue) minValue = nodeValue;
        if (nodeValue > maxValue) maxValue = nodeValue;
        beta = sumValue * sumValue * alpha;
        newRatio = Math.max(maxValue / beta, beta / minValue);
        if (newRatio > minRatio) { sumValue -= nodeValue; break; }
        minRatio = newRatio;
      }

      // Position and record the row orientation.
      rows.push(row = {value: sumValue, dice: dx < dy, children: nodes.slice(i0, i1)});
      if (row.dice) treemapDice(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);
      else treemapSlice(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
      value -= sumValue, i0 = i1;
    }

    return rows;
  }

  var squarify = (function custom(ratio) {

    function squarify(parent, x0, y0, x1, y1) {
      squarifyRatio(ratio, parent, x0, y0, x1, y1);
    }

    squarify.ratio = function(x) {
      return custom((x = +x) > 1 ? x : 1);
    };

    return squarify;
  })(phi);

  function index$1() {
    var tile = squarify,
        round = false,
        dx = 1,
        dy = 1,
        paddingStack = [0],
        paddingInner = constantZero,
        paddingTop = constantZero,
        paddingRight = constantZero,
        paddingBottom = constantZero,
        paddingLeft = constantZero;

    function treemap(root) {
      root.x0 =
      root.y0 = 0;
      root.x1 = dx;
      root.y1 = dy;
      root.eachBefore(positionNode);
      paddingStack = [0];
      if (round) root.eachBefore(roundNode);
      return root;
    }

    function positionNode(node) {
      var p = paddingStack[node.depth],
          x0 = node.x0 + p,
          y0 = node.y0 + p,
          x1 = node.x1 - p,
          y1 = node.y1 - p;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      node.x0 = x0;
      node.y0 = y0;
      node.x1 = x1;
      node.y1 = y1;
      if (node.children) {
        p = paddingStack[node.depth + 1] = paddingInner(node) / 2;
        x0 += paddingLeft(node) - p;
        y0 += paddingTop(node) - p;
        x1 -= paddingRight(node) - p;
        y1 -= paddingBottom(node) - p;
        if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
        if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
        tile(node, x0, y0, x1, y1);
      }
    }

    treemap.round = function(x) {
      return arguments.length ? (round = !!x, treemap) : round;
    };

    treemap.size = function(x) {
      return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
    };

    treemap.tile = function(x) {
      return arguments.length ? (tile = required(x), treemap) : tile;
    };

    treemap.padding = function(x) {
      return arguments.length ? treemap.paddingInner(x).paddingOuter(x) : treemap.paddingInner();
    };

    treemap.paddingInner = function(x) {
      return arguments.length ? (paddingInner = typeof x === "function" ? x : constant$3(+x), treemap) : paddingInner;
    };

    treemap.paddingOuter = function(x) {
      return arguments.length ? treemap.paddingTop(x).paddingRight(x).paddingBottom(x).paddingLeft(x) : treemap.paddingTop();
    };

    treemap.paddingTop = function(x) {
      return arguments.length ? (paddingTop = typeof x === "function" ? x : constant$3(+x), treemap) : paddingTop;
    };

    treemap.paddingRight = function(x) {
      return arguments.length ? (paddingRight = typeof x === "function" ? x : constant$3(+x), treemap) : paddingRight;
    };

    treemap.paddingBottom = function(x) {
      return arguments.length ? (paddingBottom = typeof x === "function" ? x : constant$3(+x), treemap) : paddingBottom;
    };

    treemap.paddingLeft = function(x) {
      return arguments.length ? (paddingLeft = typeof x === "function" ? x : constant$3(+x), treemap) : paddingLeft;
    };

    return treemap;
  }

  function initRange(domain, range) {
    switch (arguments.length) {
      case 0: break;
      case 1: this.range(domain); break;
      default: this.range(range).domain(domain); break;
    }
    return this;
  }

  function initInterpolator(domain, interpolator) {
    switch (arguments.length) {
      case 0: break;
      case 1: {
        if (typeof domain === "function") this.interpolator(domain);
        else this.range(domain);
        break;
      }
      default: {
        this.domain(domain);
        if (typeof interpolator === "function") this.interpolator(interpolator);
        else this.range(interpolator);
        break;
      }
    }
    return this;
  }

  const implicit = Symbol("implicit");

  function ordinal() {
    var index = new Map(),
        domain = [],
        range = [],
        unknown = implicit;

    function scale(d) {
      var key = d + "", i = index.get(key);
      if (!i) {
        if (unknown !== implicit) return unknown;
        index.set(key, i = domain.push(d));
      }
      return range[(i - 1) % range.length];
    }

    scale.domain = function(_) {
      if (!arguments.length) return domain.slice();
      domain = [], index = new Map();
      for (const value of _) {
        const key = value + "";
        if (index.has(key)) continue;
        index.set(key, domain.push(value));
      }
      return scale;
    };

    scale.range = function(_) {
      return arguments.length ? (range = Array.from(_), scale) : range.slice();
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    scale.copy = function() {
      return ordinal(domain, range).unknown(unknown);
    };

    initRange.apply(scale, arguments);

    return scale;
  }

  function band() {
    var scale = ordinal().unknown(undefined),
        domain = scale.domain,
        ordinalRange = scale.range,
        r0 = 0,
        r1 = 1,
        step,
        bandwidth,
        round = false,
        paddingInner = 0,
        paddingOuter = 0,
        align = 0.5;

    delete scale.unknown;

    function rescale() {
      var n = domain().length,
          reverse = r1 < r0,
          start = reverse ? r1 : r0,
          stop = reverse ? r0 : r1;
      step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
      if (round) step = Math.floor(step);
      start += (stop - start - step * (n - paddingInner)) * align;
      bandwidth = step * (1 - paddingInner);
      if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
      var values = sequence(n).map(function(i) { return start + step * i; });
      return ordinalRange(reverse ? values.reverse() : values);
    }

    scale.domain = function(_) {
      return arguments.length ? (domain(_), rescale()) : domain();
    };

    scale.range = function(_) {
      return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
    };

    scale.rangeRound = function(_) {
      return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
    };

    scale.bandwidth = function() {
      return bandwidth;
    };

    scale.step = function() {
      return step;
    };

    scale.round = function(_) {
      return arguments.length ? (round = !!_, rescale()) : round;
    };

    scale.padding = function(_) {
      return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
    };

    scale.paddingInner = function(_) {
      return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
    };

    scale.paddingOuter = function(_) {
      return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
    };

    scale.align = function(_) {
      return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
    };

    scale.copy = function() {
      return band(domain(), [r0, r1])
          .round(round)
          .paddingInner(paddingInner)
          .paddingOuter(paddingOuter)
          .align(align);
    };

    return initRange.apply(rescale(), arguments);
  }

  function pointish(scale) {
    var copy = scale.copy;

    scale.padding = scale.paddingOuter;
    delete scale.paddingInner;
    delete scale.paddingOuter;

    scale.copy = function() {
      return pointish(copy());
    };

    return scale;
  }

  function point() {
    return pointish(band.apply(null, arguments).paddingInner(1));
  }

  function constants(x) {
    return function() {
      return x;
    };
  }

  function number$1(x) {
    return +x;
  }

  var unit = [0, 1];

  function identity$3(x) {
    return x;
  }

  function normalize(a, b) {
    return (b -= (a = +a))
        ? function(x) { return (x - a) / b; }
        : constants(isNaN(b) ? NaN : 0.5);
  }

  function clamper(a, b) {
    var t;
    if (a > b) t = a, a = b, b = t;
    return function(x) { return Math.max(a, Math.min(b, x)); };
  }

  // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
  // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
  function bimap(domain, range, interpolate) {
    var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
    if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
    else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
    return function(x) { return r0(d0(x)); };
  }

  function polymap(domain, range, interpolate) {
    var j = Math.min(domain.length, range.length) - 1,
        d = new Array(j),
        r = new Array(j),
        i = -1;

    // Reverse descending domains.
    if (domain[j] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }

    while (++i < j) {
      d[i] = normalize(domain[i], domain[i + 1]);
      r[i] = interpolate(range[i], range[i + 1]);
    }

    return function(x) {
      var i = bisectRight(domain, x, 1, j) - 1;
      return r[i](d[i](x));
    };
  }

  function copy(source, target) {
    return target
        .domain(source.domain())
        .range(source.range())
        .interpolate(source.interpolate())
        .clamp(source.clamp())
        .unknown(source.unknown());
  }

  function transformer() {
    var domain = unit,
        range = unit,
        interpolate$1 = interpolate,
        transform,
        untransform,
        unknown,
        clamp = identity$3,
        piecewise,
        output,
        input;

    function rescale() {
      var n = Math.min(domain.length, range.length);
      if (clamp !== identity$3) clamp = clamper(domain[0], domain[n - 1]);
      piecewise = n > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    }

    function scale(x) {
      return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
    }

    scale.invert = function(y) {
      return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
    };

    scale.domain = function(_) {
      return arguments.length ? (domain = Array.from(_, number$1), rescale()) : domain.slice();
    };

    scale.range = function(_) {
      return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
    };

    scale.rangeRound = function(_) {
      return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
    };

    scale.clamp = function(_) {
      return arguments.length ? (clamp = _ ? true : identity$3, rescale()) : clamp !== identity$3;
    };

    scale.interpolate = function(_) {
      return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    return function(t, u) {
      transform = t, untransform = u;
      return rescale();
    };
  }

  function continuous() {
    return transformer()(identity$3, identity$3);
  }

  function tickFormat(start, stop, count, specifier) {
    var step = tickStep(start, stop, count),
        precision;
    specifier = formatSpecifier(specifier == null ? ",f" : specifier);
    switch (specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
        return formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
    }
    return format(specifier);
  }

  function linearish(scale) {
    var domain = scale.domain;

    scale.ticks = function(count) {
      var d = domain();
      return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
    };

    scale.tickFormat = function(count, specifier) {
      var d = domain();
      return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
    };

    scale.nice = function(count) {
      if (count == null) count = 10;

      var d = domain();
      var i0 = 0;
      var i1 = d.length - 1;
      var start = d[i0];
      var stop = d[i1];
      var prestep;
      var step;
      var maxIter = 10;

      if (stop < start) {
        step = start, start = stop, stop = step;
        step = i0, i0 = i1, i1 = step;
      }
      
      while (maxIter-- > 0) {
        step = tickIncrement(start, stop, count);
        if (step === prestep) {
          d[i0] = start;
          d[i1] = stop;
          return domain(d);
        } else if (step > 0) {
          start = Math.floor(start / step) * step;
          stop = Math.ceil(stop / step) * step;
        } else if (step < 0) {
          start = Math.ceil(start * step) / step;
          stop = Math.floor(stop * step) / step;
        } else {
          break;
        }
        prestep = step;
      }

      return scale;
    };

    return scale;
  }

  function linear$1() {
    var scale = continuous();

    scale.copy = function() {
      return copy(scale, linear$1());
    };

    initRange.apply(scale, arguments);

    return linearish(scale);
  }

  function nice$1(domain, interval) {
    domain = domain.slice();

    var i0 = 0,
        i1 = domain.length - 1,
        x0 = domain[i0],
        x1 = domain[i1],
        t;

    if (x1 < x0) {
      t = i0, i0 = i1, i1 = t;
      t = x0, x0 = x1, x1 = t;
    }

    domain[i0] = interval.floor(x0);
    domain[i1] = interval.ceil(x1);
    return domain;
  }

  var t0 = new Date,
      t1 = new Date;

  function newInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
    }

    interval.floor = function(date) {
      return floori(date = new Date(+date)), date;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    };

    interval.round = function(date) {
      var d0 = interval(date),
          d1 = interval.ceil(date);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [], previous;
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
      while (previous < start && start < stop);
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        if (date >= date) {
          if (step < 0) while (++step <= 0) {
            while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
          } else while (--step >= 0) {
            while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
          }
        }
      });
    };

    if (count) {
      interval.count = function(start, end) {
        t0.setTime(+start), t1.setTime(+end);
        floori(t0), floori(t1);
        return Math.floor(count(t0, t1));
      };

      interval.every = function(step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) { return field(d) % step === 0; }
                : function(d) { return interval.count(0, d) % step === 0; });
      };
    }

    return interval;
  }

  var millisecond = newInterval(function() {
    // noop
  }, function(date, step) {
    date.setTime(+date + step);
  }, function(start, end) {
    return end - start;
  });

  // An optimized implementation for this simple case.
  millisecond.every = function(k) {
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond;
    return newInterval(function(date) {
      date.setTime(Math.floor(date / k) * k);
    }, function(date, step) {
      date.setTime(+date + step * k);
    }, function(start, end) {
      return (end - start) / k;
    });
  };

  const durationSecond = 1000;
  const durationMinute = durationSecond * 60;
  const durationHour = durationMinute * 60;
  const durationDay = durationHour * 24;
  const durationWeek = durationDay * 7;

  var second = newInterval(function(date) {
    date.setTime(date - date.getMilliseconds());
  }, function(date, step) {
    date.setTime(+date + step * durationSecond);
  }, function(start, end) {
    return (end - start) / durationSecond;
  }, function(date) {
    return date.getUTCSeconds();
  });
  var seconds = second.range;

  var minute = newInterval(function(date) {
    date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
  }, function(date, step) {
    date.setTime(+date + step * durationMinute);
  }, function(start, end) {
    return (end - start) / durationMinute;
  }, function(date) {
    return date.getMinutes();
  });
  var minutes = minute.range;

  var hour = newInterval(function(date) {
    date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
  }, function(date, step) {
    date.setTime(+date + step * durationHour);
  }, function(start, end) {
    return (end - start) / durationHour;
  }, function(date) {
    return date.getHours();
  });
  var hours = hour.range;

  var day = newInterval(
    date => date.setHours(0, 0, 0, 0),
    (date, step) => date.setDate(date.getDate() + step),
    (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay,
    date => date.getDate() - 1
  );
  var days = day.range;

  function weekday(i) {
    return newInterval(function(date) {
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  var month = newInterval(function(date) {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  }, function(date) {
    return date.getMonth();
  });
  var months = month.range;

  var year = newInterval(function(date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function(date) {
    return date.getFullYear();
  });

  // An optimized implementation for this simple case.
  year.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step * k);
    });
  };
  var years = year.range;

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / durationDay;
  }, function(date) {
    return date.getUTCDate() - 1;
  });

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / durationWeek;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  var utcYear = newInterval(function(date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function(date) {
    return date.getUTCFullYear();
  });

  // An optimized implementation for this simple case.
  utcYear.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step * k);
    });
  };

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newDate(y, m, d) {
    return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
  }

  function formatLocale$1(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodRe = formatRe(locale_periods),
        periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "f": formatMicroseconds,
      "g": formatYearISO,
      "G": formatFullYearISO,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "q": formatQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatSeconds,
      "u": formatWeekdayNumberMonday,
      "U": formatWeekNumberSunday,
      "V": formatWeekNumberISO,
      "w": formatWeekdayNumberSunday,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear$1,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "f": formatUTCMicroseconds,
      "g": formatUTCYearISO,
      "G": formatUTCFullYearISO,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "q": formatUTCQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatUTCSeconds,
      "u": formatUTCWeekdayNumberMonday,
      "U": formatUTCWeekNumberSunday,
      "V": formatUTCWeekNumberISO,
      "w": formatUTCWeekdayNumberSunday,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "f": parseMicroseconds,
      "g": parseYear,
      "G": parseFullYear,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "q": parseQuarter,
      "Q": parseUnixTimestamp,
      "s": parseUnixTimestampSeconds,
      "S": parseSeconds,
      "u": parseWeekdayNumberMonday,
      "U": parseWeekNumberSunday,
      "V": parseWeekNumberISO,
      "w": parseWeekdayNumberSunday,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        if (!(date instanceof Date)) date = new Date(+date);

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, Z) {
      return function(string) {
        var d = newDate(1900, undefined, 1),
            i = parseSpecifier(d, specifier, string += "", 0),
            week, day$1;
        if (i != string.length) return null;

        // If a UNIX timestamp is specified, return it.
        if ("Q" in d) return new Date(d.Q);
        if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

        // If this is utcParse, never use the local timezone.
        if (Z && !("Z" in d)) d.Z = 0;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // If the month was not specified, inherit from the quarter.
        if (d.m === undefined) d.m = "q" in d ? d.q : 0;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("V" in d) {
          if (d.V < 1 || d.V > 53) return null;
          if (!("w" in d)) d.w = 1;
          if ("Z" in d) {
            week = utcDate(newDate(d.y, 0, 1)), day$1 = week.getUTCDay();
            week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
            week = utcDay.offset(week, (d.V - 1) * 7);
            d.y = week.getUTCFullYear();
            d.m = week.getUTCMonth();
            d.d = week.getUTCDate() + (d.w + 6) % 7;
          } else {
            week = localDate(newDate(d.y, 0, 1)), day$1 = week.getDay();
            week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
            week = day.offset(week, (d.V - 1) * 7);
            d.y = week.getFullYear();
            d.m = week.getMonth();
            d.d = week.getDate() + (d.w + 6) % 7;
          }
        } else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
          day$1 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
        }

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        return localDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parsePeriod(d, string, i) {
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatQuarter(d) {
      return 1 + ~~(d.getMonth() / 3);
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    function formatUTCQuarter(d) {
      return 1 + ~~(d.getUTCMonth() / 3);
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.toString = function() { return specifier; };
        return f;
      },
      parse: function(specifier) {
        var p = newParse(specifier += "", false);
        p.toString = function() { return specifier; };
        return p;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function() { return specifier; };
        return f;
      },
      utcParse: function(specifier) {
        var p = newParse(specifier += "", true);
        p.toString = function() { return specifier; };
        return p;
      }
    };
  }

  var pads = {"-": "", "_": " ", "0": "0"},
      numberRe = /^\s*\d+/, // note: ignores next directive
      percentRe = /^%/,
      requoteRe = /[\\^$*+?|[\]().{}]/g;

  function pad$1(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function formatLookup(names) {
    return new Map(names.map((name, i) => [name.toLowerCase(), i]));
  }

  function parseWeekdayNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekdayNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.u = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberISO(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.V = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }

  function parseQuarter(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseMicroseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 6));
    return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function parseUnixTimestamp(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.Q = +n[0], i + n[0].length) : -1;
  }

  function parseUnixTimestampSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.s = +n[0], i + n[0].length) : -1;
  }

  function formatDayOfMonth(d, p) {
    return pad$1(d.getDate(), p, 2);
  }

  function formatHour24(d, p) {
    return pad$1(d.getHours(), p, 2);
  }

  function formatHour12(d, p) {
    return pad$1(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear(d, p) {
    return pad$1(1 + day.count(year(d), d), p, 3);
  }

  function formatMilliseconds(d, p) {
    return pad$1(d.getMilliseconds(), p, 3);
  }

  function formatMicroseconds(d, p) {
    return formatMilliseconds(d, p) + "000";
  }

  function formatMonthNumber(d, p) {
    return pad$1(d.getMonth() + 1, p, 2);
  }

  function formatMinutes(d, p) {
    return pad$1(d.getMinutes(), p, 2);
  }

  function formatSeconds(d, p) {
    return pad$1(d.getSeconds(), p, 2);
  }

  function formatWeekdayNumberMonday(d) {
    var day = d.getDay();
    return day === 0 ? 7 : day;
  }

  function formatWeekNumberSunday(d, p) {
    return pad$1(sunday.count(year(d) - 1, d), p, 2);
  }

  function dISO(d) {
    var day = d.getDay();
    return (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
  }

  function formatWeekNumberISO(d, p) {
    d = dISO(d);
    return pad$1(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
  }

  function formatWeekdayNumberSunday(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday(d, p) {
    return pad$1(monday.count(year(d) - 1, d), p, 2);
  }

  function formatYear$1(d, p) {
    return pad$1(d.getFullYear() % 100, p, 2);
  }

  function formatYearISO(d, p) {
    d = dISO(d);
    return pad$1(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear(d, p) {
    return pad$1(d.getFullYear() % 10000, p, 4);
  }

  function formatFullYearISO(d, p) {
    var day = d.getDay();
    d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
    return pad$1(d.getFullYear() % 10000, p, 4);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad$1(z / 60 | 0, "0", 2)
        + pad$1(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad$1(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad$1(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12(d, p) {
    return pad$1(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear(d, p) {
    return pad$1(1 + utcDay.count(utcYear(d), d), p, 3);
  }

  function formatUTCMilliseconds(d, p) {
    return pad$1(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMicroseconds(d, p) {
    return formatUTCMilliseconds(d, p) + "000";
  }

  function formatUTCMonthNumber(d, p) {
    return pad$1(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad$1(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad$1(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekdayNumberMonday(d) {
    var dow = d.getUTCDay();
    return dow === 0 ? 7 : dow;
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad$1(utcSunday.count(utcYear(d) - 1, d), p, 2);
  }

  function UTCdISO(d) {
    var day = d.getUTCDay();
    return (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
  }

  function formatUTCWeekNumberISO(d, p) {
    d = UTCdISO(d);
    return pad$1(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
  }

  function formatUTCWeekdayNumberSunday(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday(d, p) {
    return pad$1(utcMonday.count(utcYear(d) - 1, d), p, 2);
  }

  function formatUTCYear(d, p) {
    return pad$1(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCYearISO(d, p) {
    d = UTCdISO(d);
    return pad$1(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear(d, p) {
    return pad$1(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCFullYearISO(d, p) {
    var day = d.getUTCDay();
    d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
    return pad$1(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone() {
    return "+0000";
  }

  function formatLiteralPercent() {
    return "%";
  }

  function formatUnixTimestamp(d) {
    return +d;
  }

  function formatUnixTimestampSeconds(d) {
    return Math.floor(+d / 1000);
  }

  var locale$1;
  var timeFormat;
  var timeParse;
  var utcFormat;
  var utcParse;

  defaultLocale$1({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  function defaultLocale$1(definition) {
    locale$1 = formatLocale$1(definition);
    timeFormat = locale$1.format;
    timeParse = locale$1.parse;
    utcFormat = locale$1.utcFormat;
    utcParse = locale$1.utcParse;
    return locale$1;
  }

  var durationSecond$1 = 1000,
      durationMinute$1 = durationSecond$1 * 60,
      durationHour$1 = durationMinute$1 * 60,
      durationDay$1 = durationHour$1 * 24,
      durationWeek$1 = durationDay$1 * 7,
      durationMonth = durationDay$1 * 30,
      durationYear = durationDay$1 * 365;

  function date$1(t) {
    return new Date(t);
  }

  function number$2(t) {
    return t instanceof Date ? +t : +new Date(+t);
  }

  function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
    var scale = continuous(),
        invert = scale.invert,
        domain = scale.domain;

    var formatMillisecond = format(".%L"),
        formatSecond = format(":%S"),
        formatMinute = format("%I:%M"),
        formatHour = format("%I %p"),
        formatDay = format("%a %d"),
        formatWeek = format("%b %d"),
        formatMonth = format("%B"),
        formatYear = format("%Y");

    var tickIntervals = [
      [second,  1,      durationSecond$1],
      [second,  5,  5 * durationSecond$1],
      [second, 15, 15 * durationSecond$1],
      [second, 30, 30 * durationSecond$1],
      [minute,  1,      durationMinute$1],
      [minute,  5,  5 * durationMinute$1],
      [minute, 15, 15 * durationMinute$1],
      [minute, 30, 30 * durationMinute$1],
      [  hour,  1,      durationHour$1  ],
      [  hour,  3,  3 * durationHour$1  ],
      [  hour,  6,  6 * durationHour$1  ],
      [  hour, 12, 12 * durationHour$1  ],
      [   day,  1,      durationDay$1   ],
      [   day,  2,  2 * durationDay$1   ],
      [  week,  1,      durationWeek$1  ],
      [ month,  1,      durationMonth ],
      [ month,  3,  3 * durationMonth ],
      [  year,  1,      durationYear  ]
    ];

    function tickFormat(date) {
      return (second(date) < date ? formatMillisecond
          : minute(date) < date ? formatSecond
          : hour(date) < date ? formatMinute
          : day(date) < date ? formatHour
          : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
          : year(date) < date ? formatMonth
          : formatYear)(date);
    }

    function tickInterval(interval, start, stop) {
      if (interval == null) interval = 10;

      // If a desired tick count is specified, pick a reasonable tick interval
      // based on the extent of the domain and a rough estimate of tick size.
      // Otherwise, assume interval is already a time interval and use it.
      if (typeof interval === "number") {
        var target = Math.abs(stop - start) / interval,
            i = bisector(function(i) { return i[2]; }).right(tickIntervals, target),
            step;
        if (i === tickIntervals.length) {
          step = tickStep(start / durationYear, stop / durationYear, interval);
          interval = year;
        } else if (i) {
          i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
          step = i[1];
          interval = i[0];
        } else {
          step = Math.max(tickStep(start, stop, interval), 1);
          interval = millisecond;
        }
        return interval.every(step);
      }

      return interval;
    }

    scale.invert = function(y) {
      return new Date(invert(y));
    };

    scale.domain = function(_) {
      return arguments.length ? domain(Array.from(_, number$2)) : domain().map(date$1);
    };

    scale.ticks = function(interval) {
      var d = domain(),
          t0 = d[0],
          t1 = d[d.length - 1],
          r = t1 < t0,
          t;
      if (r) t = t0, t0 = t1, t1 = t;
      t = tickInterval(interval, t0, t1);
      t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
      return r ? t.reverse() : t;
    };

    scale.tickFormat = function(count, specifier) {
      return specifier == null ? tickFormat : format(specifier);
    };

    scale.nice = function(interval) {
      var d = domain();
      return (interval = tickInterval(interval, d[0], d[d.length - 1]))
          ? domain(nice$1(d, interval))
          : scale;
    };

    scale.copy = function() {
      return copy(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
    };

    return scale;
  }

  function time() {
    return initRange.apply(calendar(year, month, sunday, day, hour, minute, second, millisecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]), arguments);
  }

  function transformer$1() {
    var x0 = 0,
        x1 = 1,
        t0,
        t1,
        k10,
        transform,
        interpolator = identity$3,
        clamp = false,
        unknown;

    function scale(x) {
      return x == null || isNaN(x = +x) ? unknown : interpolator(k10 === 0 ? 0.5 : (x = (transform(x) - t0) * k10, clamp ? Math.max(0, Math.min(1, x)) : x));
    }

    scale.domain = function(_) {
      return arguments.length ? ([x0, x1] = _, t0 = transform(x0 = +x0), t1 = transform(x1 = +x1), k10 = t0 === t1 ? 0 : 1 / (t1 - t0), scale) : [x0, x1];
    };

    scale.clamp = function(_) {
      return arguments.length ? (clamp = !!_, scale) : clamp;
    };

    scale.interpolator = function(_) {
      return arguments.length ? (interpolator = _, scale) : interpolator;
    };

    function range(interpolate) {
      return function(_) {
        var r0, r1;
        return arguments.length ? ([r0, r1] = _, interpolator = interpolate(r0, r1), scale) : [interpolator(0), interpolator(1)];
      };
    }

    scale.range = range(interpolate);

    scale.rangeRound = range(interpolateRound);

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    return function(t) {
      transform = t, t0 = t(x0), t1 = t(x1), k10 = t0 === t1 ? 0 : 1 / (t1 - t0);
      return scale;
    };
  }

  function copy$1(source, target) {
    return target
        .domain(source.domain())
        .interpolator(source.interpolator())
        .clamp(source.clamp())
        .unknown(source.unknown());
  }

  function sequential() {
    var scale = linearish(transformer$1()(identity$3));

    scale.copy = function() {
      return copy$1(scale, sequential());
    };

    return initInterpolator.apply(scale, arguments);
  }

  function colors(specifier) {
    var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
    while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
  }

  var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

  var epsilon$1 = 1e-12;

  function Linear(context) {
    this._context = context;
  }

  Linear.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; // proceed
        default: this._context.lineTo(x, y); break;
      }
    }
  };

  function curveLinear(context) {
    return new Linear(context);
  }

  function point$1(that, x, y) {
    that._context.bezierCurveTo(
      (2 * that._x0 + that._x1) / 3,
      (2 * that._y0 + that._y1) / 3,
      (that._x0 + 2 * that._x1) / 3,
      (that._y0 + 2 * that._y1) / 3,
      (that._x0 + 4 * that._x1 + x) / 6,
      (that._y0 + 4 * that._y1 + y) / 6
    );
  }

  function Basis(context) {
    this._context = context;
  }

  Basis.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 =
      this._y0 = this._y1 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 3: point$1(this, this._x1, this._y1); // proceed
        case 2: this._context.lineTo(this._x1, this._y1); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
        default: point$1(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
    }
  };

  function basis$2(context) {
    return new Basis(context);
  }

  class Bump {
    constructor(context, x) {
      this._context = context;
      this._x = x;
    }
    areaStart() {
      this._line = 0;
    }
    areaEnd() {
      this._line = NaN;
    }
    lineStart() {
      this._point = 0;
    }
    lineEnd() {
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    }
    point(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: {
          this._point = 1;
          if (this._line) this._context.lineTo(x, y);
          else this._context.moveTo(x, y);
          break;
        }
        case 1: this._point = 2; // proceed
        default: {
          if (this._x) this._context.bezierCurveTo(this._x0 = (this._x0 + x) / 2, this._y0, this._x0, y, x, y);
          else this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + y) / 2, x, this._y0, x, y);
          break;
        }
      }
      this._x0 = x, this._y0 = y;
    }
  }

  function bumpX(context) {
    return new Bump(context, true);
  }

  function bumpY(context) {
    return new Bump(context, false);
  }

  function point$2(that, x, y) {
    that._context.bezierCurveTo(
      that._x1 + that._k * (that._x2 - that._x0),
      that._y1 + that._k * (that._y2 - that._y0),
      that._x2 + that._k * (that._x1 - x),
      that._y2 + that._k * (that._y1 - y),
      that._x2,
      that._y2
    );
  }

  function Cardinal(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
  }

  Cardinal.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 2: this._context.lineTo(this._x2, this._y2); break;
        case 3: point$2(this, this._x1, this._y1); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; this._x1 = x, this._y1 = y; break;
        case 2: this._point = 3; // proceed
        default: point$2(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var cardinal = (function custom(tension) {

    function cardinal(context) {
      return new Cardinal(context, tension);
    }

    cardinal.tension = function(tension) {
      return custom(+tension);
    };

    return cardinal;
  })(0);

  function point$3(that, x, y) {
    var x1 = that._x1,
        y1 = that._y1,
        x2 = that._x2,
        y2 = that._y2;

    if (that._l01_a > epsilon$1) {
      var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
          n = 3 * that._l01_a * (that._l01_a + that._l12_a);
      x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
      y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
    }

    if (that._l23_a > epsilon$1) {
      var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
          m = 3 * that._l23_a * (that._l23_a + that._l12_a);
      x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
      y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
    }

    that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
  }

  function CatmullRom(context, alpha) {
    this._context = context;
    this._alpha = alpha;
  }

  CatmullRom.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._l01_a = this._l12_a = this._l23_a =
      this._l01_2a = this._l12_2a = this._l23_2a =
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 2: this._context.lineTo(this._x2, this._y2); break;
        case 3: this.point(this._x2, this._y2); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;

      if (this._point) {
        var x23 = this._x2 - x,
            y23 = this._y2 - y;
        this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
      }

      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; // proceed
        default: point$3(this, x, y); break;
      }

      this._l01_a = this._l12_a, this._l12_a = this._l23_a;
      this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var catmullRom = (function custom(alpha) {

    function catmullRom(context) {
      return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
    }

    catmullRom.alpha = function(alpha) {
      return custom(+alpha);
    };

    return catmullRom;
  })(0.5);

  function Natural(context) {
    this._context = context;
  }

  Natural.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x = [];
      this._y = [];
    },
    lineEnd: function() {
      var x = this._x,
          y = this._y,
          n = x.length;

      if (n) {
        this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
        if (n === 2) {
          this._context.lineTo(x[1], y[1]);
        } else {
          var px = controlPoints(x),
              py = controlPoints(y);
          for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) {
            this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
          }
        }
      }

      if (this._line || (this._line !== 0 && n === 1)) this._context.closePath();
      this._line = 1 - this._line;
      this._x = this._y = null;
    },
    point: function(x, y) {
      this._x.push(+x);
      this._y.push(+y);
    }
  };

  // See https://www.particleincell.com/2012/bezier-splines/ for derivation.
  function controlPoints(x) {
    var i,
        n = x.length - 1,
        m,
        a = new Array(n),
        b = new Array(n),
        r = new Array(n);
    a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
    for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
    a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
    for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
    a[n - 1] = r[n - 1] / b[n - 1];
    for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
    b[n - 1] = (x[n] + a[n - 1]) / 2;
    for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];
    return [a, b];
  }

  function natural(context) {
    return new Natural(context);
  }

  function Step(context, t) {
    this._context = context;
    this._t = t;
  }

  Step.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x = this._y = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; // proceed
        default: {
          if (this._t <= 0) {
            this._context.lineTo(this._x, y);
            this._context.lineTo(x, y);
          } else {
            var x1 = this._x * (1 - this._t) + x * this._t;
            this._context.lineTo(x1, this._y);
            this._context.lineTo(x1, y);
          }
          break;
        }
      }
      this._x = x, this._y = y;
    }
  };

  function step(context) {
    return new Step(context, 0.5);
  }

  class Rectangle {

  	constructor(left, top, width, height) {
  		this.left = left;
  		this.top = top;
  		this.width = width;
  		this.height = height;
  		this.right = left + width;
  		this.bottom = top + height;
  		//this.center = {x: (this.left + this.right)/2, y: (this.top + this.bottom)/2}
  	}

  	union(rect) {
  		let left = Math.min(this.left, rect.left),
  			top = Math.min(this.top, rect.top),
  			right = Math.max(this.right, rect.right),
  			btm = Math.max(this.bottom, rect.bottom);
  		return new Rectangle(left, top, right - left, btm - top);
  	}

  	clone() {
  		return new Rectangle(this.left, this.top, this.width, this.height);
  	}

  	get center() {
  		return {x: (this.left + this.right)/2, y: (this.top + this.bottom)/2};
  	}

  	get cx() {
  		return (this.left + this.right)/2;
  	}

  	get cy() {
  		return (this.top + this.bottom)/2;
  	}

  	contains(point) {
  		return this.left <= point.x && this.right >= point.x && this.top <= point.y && this.bottom >= point.y;
  	}

  }

  const ScaleType = ["linear", "power", "log", "sqrt", "symlog", "identity", "time", "ordinal", "band", "point", "ordinalColor", "sequentialColor"]; 

  const CurveMode = {
  	Natural: "natural",
  	Basis: "basis",
  	BumpX: "bumpX",
  	BumpY: "bumpY",
  	Linear: "linear",
  	Step: "step",
  	CatmullRom: "CatmullRom",
  	Cardinal: "cardinal"
  };

  const Layout = {
  	Grid: "grid",
  	Circular: "circular",
  	Stack: "stack",
  	Treemap: "treemap",
  	Packing: "packing"
  };

  const Orientation = {
  	Vertical: "vertical",
  	Horizontal: "horizontal"
  };

  const Alignment = {
  	Top: "top",
  	Left: "left",
  	Bottom: "bottom",
  	Right: "right",
  	Center: "center",
  	Middle: "middle"
  };

  const ItemType = {
  	Area: "area",
  	Rectangle: "rectangle",
  	Rect: "rect",
  	Ellipse: "ellipse",
  	Circle: "circle",
  	Pie: "pie",
  	Line: "line",
  	Path: "path",
  	Image: "image",
  	PointText: "pointText",
  	Collection: "collection",
  	Group: "group",
  	Scene: "scene",
  	Axis: "axis",
  	Glyph: "glyph",
  	Legend: "legend",
  	Polygon: "polygon",
  	Gridlines: "gridlines",
  	LinearGradient: "linearGradient"
  };

  const DataType = {
  	Boolean: "boolean", 
  	Integer: "integer",
  	Number: "number",
  	Date: "date",
  	String: "string"
  };

  const Aggregator = {
  	Max: "max",
  	Min: "min",
  	Avg: "avg",
  	Median: "median",
  	Sum: "sum",
  	Count: "count",
  	Mean: "mean",
  	Percentile25: "percentile 25",
  	Percentile75: "percentile 75"
  };


  const Style2SVG = {
  	"fillColor": "fill",
  	"strokeColor": "stroke",
  	"strokeWidth": "stroke-width",
  	"fillOpacity": "fill-opacity",
  	"strokeOpacity": "stroke-opacity",
  	"opacity": "opacity",
  	"fontSize": "font-size",
  	"fontFamily": "font-family",
  	"visibility": "visibility"
  };

  const Attr2SVG = {
  	"width": "width",
  	"height": "height",
  	"id": "id",
  	"top": "y",
  	"left": "x",
  	"x1": "x1",
  	"x2": "x2",
  	"y1": "y1",
  	"y2": "y2"
  };

  const Errors$1 = {
  	FIELD_NONEXISTENT : "Data field does not exist in the data table",
  	INCOMPLETE_REPEAT_INFO : "Incomplete information to do repeat. You must specify an item, a categorical data field and a data table",
  	REPEAT_BY_NONCAT: "Repeat only works on a string or date field",
  	PARTITION_BY_NONCAT: "Partition only works on a string or date field",
  	COMPNT_NON_REPEATABLE: "Item not repeatable",
  	INCOMPLETE_PARTITION_INFO : "Incomplete information to do partition. You must specify an item, a categorical data field and a data table",
  	COMPNT_NON_PARTITIONABLE: "Item cannot be partitioned",
  	BIND_WITHOUT_DATASCOPE: "Item must be repeated or partitioned by data first before applyng binding",
  	UNKNOWN_ALIGNMENT: "Unkown alignment",
  	UNKOWNN_SCALE_TYPE: "Unknown scale type",
  	INCOMPLETE_BINDING_INFO: "Incomplete binding information. You must specify an item, a data field and a visual channel",
  	MULTIPLE_VALUES_PER_FIELD: "Multiple distinct field values exist",
  	DIFFERENT_SCALE_TYPE: "Cannot merge different types of scale",
  	INCORRECT_AXIS_INFO: "Cannot find relevant information to create an axis for ",
  	INCORRECT_LEGEND_INFO: "Cannot find relevant information to create a legend for ",
  	INSUFFICIENT_DATA_SCOPES: "Insufficient data to divide or densify a mark",
  	INCORRECT_CONSTRAINT_INFO: "Constrain information is incorreclty passed"
  };

  // Based on util.Numerical.js, as part of Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
  // http://paperjs.org/
  // Copyright (c) 2011 - 2019, Juerg Lehni & Jonathan Puckey
  // http://scratchdisk.com/ & https://puckey.studio/
  //
  // Distributed under the MIT license. See LICENSE file for detail
  //
  // All rights reserved.

  /**
  * A very small absolute value used to check if a value is very close to
  * zero. The value should be large enough to offset any floating point
  * noise, but small enough to be meaningful in computation in a nominal
  * range (see MACHINE_EPSILON).
  *
  * http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
  * http://www.cs.berkeley.edu/~wkahan/Math128/Cubic.pdf
  */
  const EPSILON = 1e-12;

  /**
  * The epsilon to be used when performing "trigonometric" checks, such
  * as examining cross products to check for collinearity.
  */
  const TRIGONOMETRIC_EPSILON = 1e-8;

  /**
  * Checks if the value is 0, within a tolerance defined by
  * Numerical.EPSILON.
  */
  function isZero(val) {
  	return val >= -EPSILON && val <= EPSILON;
  }

  // Based on basic.Point.js, as part of Paper.js - The Swiss Army Knife of Vector Graphics Scripting.

  class Point$1 {
  	
  	constructor(x, y) {
  		this.x = x;
  		this.y = y;
  	}

  	transform(matrix) {
          return matrix ? matrix._transformPoint(this) : this;
  	}

  	negate() {
          return new Point$1(-this.x, -this.y);
      }

  	subtract(point) {
  		return new Point$1(this.x - point.x, this.y - point.y);
  	}

      isZero() {
      	return isZero(this.x) && isZero(this.y)
      }

  	/**
  	* Checks if the vector represented by this point is collinear (parallel) to
  	* another vector.
  	*
  	* @param {Point} point the vector to check against
  	* @return {Boolean} {@true it is collinear}
  	*/
       isCollinear(point) {
       	let x1 = this.x,
       		y1 = this.y,
       		x2 = point.x,
       		y2 = point.y;
       	return Math.abs(x1 * y2 - y1 * x2) <= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)) 
       		* /*#=*/TRIGONOMETRIC_EPSILON;
      }

  }

  // Based on item.Item.js, as part of Paper.js - The Swiss Army Knife of Vector Graphics Scripting.

  class Mark {

  	constructor(args) {
  		// this._matrix = new Matrix();
  		// this._applyMatrix = false;
  		this._dataScope = undefined;

  		this.attrs = {};
  		this.styles = {};

  		if (args !== undefined) {
  			for (let s in Attr2SVG) {
  				if (args.hasOwnProperty(s)) {
  					this.attrs[s] = args[s];
  				}
  			}

  			for (let s in Style2SVG) {
  				if (args.hasOwnProperty(s)) {
  					this.styles[s] = args[s];
  				}
  			}
  		}
  	}

  	getScene() {
  		let p = this;
  		while (p) {
  			if (p.type == ItemType.Scene)
  				return p;
  			else
  				p = p.parent;
  		}
  	}

  	/**
  	* x, y represents the center of the mark's bounds
  	**/
  	// setPosition(x, y) {
  	// 	let center = this.bounds.center;
  	// 	this.translate(x - center.x, y - center.y);
  	// }

  	// get matrix() {
  	// 	return this._matrix;
  	// }

  	set dataScope(ds) {
  		this._dataScope = ds;
  	}

  	get dataScope() {
  		return this._dataScope;
  	}

  	duplicate() {
  		let scene = this.getScene();
  		let m = scene.mark(this.type);
  		this.copyPropertiesTo(m);
  		m.classId = this.classId;
  		//m._matrix = this._matrix.clone();
  		if (this._dataScope) {
  			m._dataScope = this._dataScope.clone();
  		}
  		return m;
  	}

  	// transform2(matrix, _applyMatrix, _applyRecursively, _setApplyMatrix) {
  	// 	var _matrix = this._matrix,
  	// 		// If no matrix is provided, or the matrix is the identity, we might
  	// 		// still have some work to do in case _applyMatrix is true
  	// 		transformMatrix = matrix && !matrix.isIdentity(),
  	// 		applyMatrix = (_applyMatrix || this._applyMatrix)
  	// 		// Don't apply _matrix if the result of concatenating with
  	// 		// matrix would be identity.
  	// 			&& ((!_matrix.isIdentity() || transformMatrix)
  	// 				// Even if it's an identity matrix, we still need to
  	// 				// recursively apply the matrix to children.
  	// 				|| _applyMatrix && _applyRecursively && this.children);

  	// 	// Bail out if there is nothing to do.
  	// 	if (!transformMatrix && !applyMatrix)
  	// 		return this;

  	// 	// Simply prepend the internal matrix with the passed one:
  	// 	if (transformMatrix) {
  	// 		// Keep a backup of the last valid state before the matrix becomes
  	// 		// non-invertible. This is then used again in setBounds to restore.
  	// 		if (!matrix.isInvertible() && _matrix.isInvertible()) {
  	// 			_matrix._backup = _matrix.getValues();
  	// 		}
  	// 		_matrix.prepend(matrix);

  	// 		// omitted code to transform gradient color points.
  	// 		// See Item.js in paper.js for details
  	// 	}

  	// 	// Call #_transformContent() now, if we need to directly apply the
  	// 	// internal _matrix transformations to the item's content.
  	// 	// Application is not possible on Raster, PointText, SymbolItem, since
  	// 	// the matrix is where the actual transformation state is stored.
  	// 	if (applyMatrix && (applyMatrix = this._transformContent(_matrix,
  	// 		_applyRecursively, _setApplyMatrix))) {
  	// 		// Pivot is provided in the parent's coordinate system, so transform
  	// 		// it along too.
  	// 		var pivot = this._pivot;
  	// 		if (pivot)
  	// 			_matrix._transformPoint(pivot, pivot, true);

  	// 		// Reset the internal matrix to the identity transformation if
  	// 		// it was possible to apply it, but do not notify owner of change.
  	// 		_matrix.reset();

  	// 		// Set the internal _applyMatrix flag to true if we're told to do so
  	// 		if (_setApplyMatrix && this._canApplyMatrix)
  	// 			this._applyMatrix = true;
  	// 	}
  	// 	// Calling _changed will clear _bounds and _position, but depending
  	// 	// on matrix we can calculate and set them again, so preserve them.
  	// 	var bounds = this.bounds,
  	// 		position = this.position;
  	// 	// if (transformMatrix || applyMatrix) {
  	// 	//     this._changed(/*#=*/Change.MATRIX);
  	// 	// }
  	// 	// Detect matrices that contain only translations and scaling
  	// 	// and transform the cached _bounds and _position without having to
  	// 	// fully recalculate each time.
  	// 	var decomp = transformMatrix && bounds && matrix.decompose();
  	// 	if (decomp && decomp.skewing.isZero() && decomp.rotation % 90 === 0) {
  	// 		// Transform the old bound by looping through all the cached
  	// 		// bounds in _bounds and transform each.
  	// 		for (var key in bounds) {
  	// 			var cache = bounds[key];
  	// 			// If any item involved in the determination of these bounds has
  	// 			// non-scaling strokes, delete the cache now as it can't be
  	// 			// preserved through the transformation.
  	// 			if (cache.nonscaling) {
  	// 				delete bounds[key];
  	// 			} else if (applyMatrix || !cache.internal) {
  	// 				// If these are internal bounds, only transform them if this
  	// 				// item applied its matrix.
  	// 				var rect = cache.rect;
  	// 				matrix._transformBounds(rect, rect);
  	// 			}
  	// 		}
  	// 		this.bounds = bounds;
  	// 		// If we have cached bounds, try to determine _position as its
  	// 		// center. Use _boundsOptions do get the cached default bounds.
  	// 		var cached = bounds[this._getBoundsCacheKey(
  	// 			this._boundsOptions || {})];
  	// 		if (cached) {
  	// 			// use this method to handle pivot case (see #1503)
  	// 			this._position = this._getPositionFromBounds(cached.rect);
  	// 		}
  	// 	} else if (transformMatrix && position && this._pivot) {
  	// 		// If the item has a pivot defined, it means that the default
  	// 		// position defined as the center of the bounds won't shift with
  	// 		// arbitrary transformations and we can therefore update _position:
  	// 		this._position = matrix._transformPoint(position, position);
  	// 	}
  	// 	// Allow chaining here, since transform() is related to Matrix functions
  	// 	return this;
  	// }

  	// _transformContent(matrix, applyRecursively, setApplyMatrix) {
  	// 	var children = this.children;
  	// 	if (children) {
  	// 		for (var i = 0, l = children.length; i < l; i++)
  	// 			children[i].transform(matrix, true, applyRecursively,
  	// 					setApplyMatrix);
  	// 		return true;
  	// 	}
  	// }
  }

  // Based on path.Segment.js, as part of Paper.js - The Swiss Army Knife of Vector Graphics Scripting.

  class Vertex {

  	//handles are relative to the point
  	constructor(point, parentMark, id) {
  		this.type = "vertex";
  		this.id = "v"+id;
  		this.x = point.x;
  		this.y = point.y;
  		this.dataScope = undefined;
  		this.parent = parentMark; 

  		this.shape = undefined;
  		this.width = 0;
  		this.height = 0;
  		this.radius = 0;
  		this.fillColor = undefined;
  		this.opacity = undefined;
  		this.strokeWidth = 0;
  		this.strokeColor = "#aaa";
  	}

  	get center() {
  		return new Point$1(this.x, this.y);
  	}

  	translate(dx, dy) {
  		this.x += dx;
  		this.y += dy;
  	}

  	clone(parent) {
  		let v = new Vertex(new Point$1(this.x, this.y));
  		v.id = this.id;
  		v.parent = parent;
  		if (this.dataScope) {
  			v.dataScope = this.dataScope.clone();
  		}
  		v.shape = this.shape;
  		v.width = this.width;
  		v.height = this.height;
  		v.radius = this.radius;
  		v.fillColor = this.fillColor;
  		v.opacity = this.opacity;
  		v.strokeWidth = this.strokeWidth;
  		v.strokeColor = this.strokeColor;
  		return v;
  	}
  }

  class Segment {
  	
  	constructor(v1, v2, parentMark, id) {
  		this.type = "segment";
  		this.id = "s" + id;
  		this.vertex1 = v1;
  		this.vertex2 = v2;

  		this.dataScope = undefined;
  		this.parent = parentMark;
  	}

  	translate(dx, dy) {
  		this.vertex1.translate(dx, dy);
  		this.vertex2.translate(dx, dy);
  	}

      get center() {
  		let x = (this.vertex1.x + this.vertex2.x)/2,
  			y = (this.vertex1.y + this.vertex2.y)/2;
  		return new Point$1(x,y);
  	}
  }

  class Path$1 extends Mark {
  	
  	constructor(args) {
  		super(args);
  		this.type = ItemType.Path;

  		this.attrs = {};
  		if (!this.styles.hasOwnProperty("strokeColor"))
  			this.styles["strokeColor"] = "#ccc";
  		if (!this.styles.hasOwnProperty("strokeWidth"))
  			this.styles["strokeWidth"] = 1;

  		this.vertices = [];
  		this.vertexCounter = 0; //for assigning vertex ids
  		this.segmentCounter = 0;
  		this.segments = [];

  		this.anchor = undefined;

  		this.closed = false;

  		this.curveMode = "linear";

  		if (args !== undefined) {
  			// for (let s in Attr2SVG) {
  			// 	if (args.hasOwnProperty(s)) {
  			// 		this.attrs[s] = args[s];
  			// 	}
  			// }

  			// for (let s in Style2SVG) {
  			// 	if (args.hasOwnProperty(s)) {
  			// 		this.styles[s] = args[s];
  			// 	}
  			// }
  			
  			if (args.hasOwnProperty("vertices")) {
  				this._setVertices(args["vertices"]);
  			}		}
  	}

  	_setVertices(vertices) {
  		let vertex, point;
  		for (let i = 0; i < vertices.length; i++) {
  			point = new Point$1(vertices[i][0], vertices[i][1]);

  			vertex = new Vertex(point, this, this.vertexCounter++);
  			this.vertices.push(vertex);
  			if (i > 0)
  				this.segments.push(new Segment(this.vertices[i-1], this.vertices[i], this, this.segmentCounter++));
  		}
  		// if (vertices.length == 2 && vertices[0].handleOut.isZero() && vertices[0].handleIn.isZero())
  		// 	this.type = ItemType.Line;
  	}

  	copyPropertiesTo(target) {
  		target.attrs = Object.assign({}, this.attrs);
  		target.styles = Object.assign({}, this.styles);
  		if (this._dataScope)
  			target._dataScope = this._dataScope.clone();
  		target.closed = this.closed;
  		for (let v of this.vertices) {
  			target.vertices.push(v.clone(target));
  		}
  		target.segmentCounter = 0;
  		for (let i = 1; i < target.vertices.length; i++) {
  			target.segments.push(new Segment(target.vertices[i-1], target.vertices[i], target, target.segmentCounter++));
  		}
  		if (target.closed)
  			target.segments.push(new Segment(target.vertices[target.vertices.length-1], target.vertices[0], target, target.segmentCounter++));
  	}

  	/*
  	* returns the bounds without incorporating transformations involving rotation
  	*/
  	get bounds() {
  		if (!this._bounds)
  			this._updateBounds();
  		return this._bounds;
  	}

  	get bbox() {
  		if (!this._bounds)
  			this._updateBounds();
  		let mx = this._matrix;
  		if (!mx.isIdentity())
  			return mx._transformBounds(this._bounds);
  		else
  			return this._bounds;
  	}

  	get center() {
  		let b = this.bounds;
  		return new Point$1(b.left + b.width/2, b.top + b.height/2);
  	}

  	// get untransformedBounds() {
  	// 	if (!this._bounds)
  	// 		this._computeBounds();
  	// 	return this._bounds;
  	// }

  	translate(dx, dy) {
  		for (let v of this.vertices) {
  			v.translate(dx, dy);
  		}
  		this._updateBounds();
  	}

  	//by default, with respect to the center of bounds
  	resize(wd, ht) {
  		let bounds = this.bounds;
  		for (let v of this.vertices) {
  			v.x = bounds.center + (wd/bounds.width) * (v.x - bounds.center);
  			v.y = bounds.middle + (ht/bounds.height) * (v.y - bounds.middle);
  		}
  		this._updateBounds();
  	}

  	_updateBounds() {		
  		let vx = this.vertices.map(d => d.x),
  			vy = this.vertices.map(d => d.y);

  		let left = Math.min(...vx), top = Math.min(...vy), right = Math.max(...vx), btm = Math.max(...vy);
  		this._bounds = new Rectangle(left, top, right - left, btm - top);
  	}

  	addVertex(x, y, i) {
  		let vertex = new Vertex(new Point$1(x, y), this, this.vertexCounter++);
  		this.vertices.splice(i, 0, vertex);
  		// if (i > 0)
  		// 	this.segments.push(new Segment(this.vertices[i-1], this.vertices[i], this, this.segmentCounter++))
  		//TODO: handle segments
  	}

  	sortVertices(args) {
  		if (args.channel && (args.channel == "x" || args.channel == "y")) {
  			this.vertices.sort((a,b) => a[args.channel] - b[args.channel]);
  			for (let i = 0; i < this.segments.length; i++) {
  				let segment = this.segments[i];
  				segment.vertex1 = this.vertices[i];
  				segment.vertex2 = this.vertices[(i+1)%this.vertices.length];
  			}
  		}
  	}

  	getSVGPathData() {
  		let p = path();
  		let curve = this._getD3CurveFunction(this.curveMode)(p);
  		curve.lineStart();
  		for (let vertex of this.vertices) {
  			curve.point(vertex.x, vertex.y);
  		}
  		if (this.closed)
  			curve.point(this.vertices[0].x, this.vertices[0].y);
  		curve.lineEnd();

  		return p._;
  	}
   
  	toSVG() {

  	}

  	fromSVG() {

  	}

  	get anyVertex() {
  		return this.vertices[0];
  	}

  	_getD3CurveFunction(v){
  		switch(v) {
  			case CurveMode.Natural:
  				return natural;
  			case CurveMode.Basis:
  				return basis$2;
  			case CurveMode.BumpX:
  				return bumpX;
  			case CurveMode.BumpY:
  				return bumpY;
  			case CurveMode.Linear:
  				return curveLinear;
  			case CurveMode.Step:
  				return step;
  			case CurveMode.CatmullRom:
  				return catmullRom;
  			case CurveMode.Cardinal:
  				return cardinal;
  			default:
  				return curveLinear;
  		}
  	}
  }

  class RectPath extends Path$1 {
  	
  	constructor(args) {
  		super(args);
  		
  		this.type = ItemType.Rectangle;
  		this.closed = true;

  		//add last segment to close the path
  		if (args && args.hasOwnProperty("vertices"))
  			this.segments.push(new Segment(this.vertices[3], this.vertices[0], this, this.segmentCounter++));
  	}

  	get width() {
  		return this.vertices[1].x - this.vertices[0].x;
  	}

  	get height() {
  		return this.vertices[2].y - this.vertices[1].y;
  	}

  	set height(ht) {
  		this.resize(this.width, ht);
  	}

  	set width(wd) {
  		this.resize(wd, this.height);
  	}

  	get left() {
  		return this.vertices[0].x;
  	}

  	get top() {
  		return this.vertices[0].y;
  	}

  	get center() {
  		return new Point$1(this.left + this.width/2, this.top + this.height/2);
  	}

  	//override path's resize method, by default, keep the left and bottom segments intact
  	resize(wd, ht) {
  		this.vertices[1].x = this.vertices[0].x + wd;
  		this.vertices[2].x = this.vertices[1].x;
  		this.vertices[0].y = this.vertices[3].y - ht;
  		this.vertices[1].y = this.vertices[0].y;
  		this._updateBounds();
  	}

  	get leftSegment() {
  		return this.segments[3];
  	}

  	get rightSegment() {
  		return this.segments[1];
  	}

  	get topSegment() {
  		return this.segments[0];
  	}

  	get bottomSegment() {
  		return this.segments[2];
  	}
  }

  function findItems(container, criteria) {
  	let result = [];
  	_findItemsRecursive(container, criteria, result);
  	return result;
  }

  function getPeers(item, scene) {
  	if (item.type == "vertex") {
  		return _getPeerVertices(item, scene);
  	} else if (item.type == "segment") {
  		return _getPeerSegments(item, scene);
  	} else {
  		return findItems(scene, d => d.classId == item.classId);
  	}
  }

  //returns an array of peer arrays, peers within each array have the same parent
  function getPeersGroupedByParent(item, scene) {
  	let result = {}, peers = getPeers(item, scene);
  	for (let p of peers) {
  		let parent = p.parent.id;
  		if (!result.hasOwnProperty(parent))
  			result[parent] = [];
  		result[parent].push(p);
  	}
  	return Object.keys(result).map(d => result[d]);
  }

  function _getPeerSegments(segment, container) {
  	if (segment.dataScope) {
  		let parent = segment.parent;
  		if (!parent)	throw new Error("segment has no parent mark");
  		let parentPeers = findItems(container, d => d.classId == parent.classId);
  		let results = [];
  		for (let p of parentPeers) {
  			results = results.concat(p.segments);
  		}
  		return results;
  	} else {
  		let parent = segment.parent;
  		if (!parent)	throw new Error("segment has no parent mark");
  		let index = parent.segments.indexOf(segment);
  		let parentPeers = findItems(container, d => d.classId == parent.classId);
  		let results = [];
  		for (let p of parentPeers) {
  			results.push(p.segments[index]);
  		}
  		return results;
  	}
  }

  function _getPeerVertices(vertex, container) {
  	if (vertex.classId) ; else if (vertex.dataScope) {
  		let parent = vertex.parent;
  		if (!parent)	throw new Error("vertex has no parent mark");
  		let parentPeers = findItems(container, d => d.classId == parent.classId);
  		let results = [];
  		for (let p of parentPeers) {
  			results = results.concat(p.vertices);
  		}
  		return results;
  	} else {
  		let parent = vertex.parent;
  		if (!parent)	throw new Error("vertex has no parent mark");
  		let index = parent.vertices.indexOf(vertex);
  		let parentPeers = findItems(container, d => d.classId == parent.classId);
  		let results = [];
  		for (let p of parentPeers) {
  			results.push(p.vertices[index]);
  		}
  		return results;
  	}
  }

  function _findItemsRecursive(itm, criteria, result) {
  	if (!itm) return;
  	if (itm.type == "axis" || itm.type == "legend" || itm.type == "gridlines")	return;

  	if (_matchCriteria(itm, criteria)) {
  		result.push(itm);
  	}
  	
  	if (itm.vertices){
  		for (let i of itm.vertices.concat(itm.segments)) {
  			if (_matchCriteria(i, criteria))
  				result.push(i);
  		}
  	} else if (itm.children && itm.children.length > 0) {
  		for (let c of itm.children)
  			_findItemsRecursive(c, criteria, result);
  	}
  }

  //criteria is a function
  function _matchCriteria(cpnt, criteria) {
  	return criteria(cpnt);
  	// for (let k in criteria) {
  	// 	if (cpnt[k] != criteria[k])
  	// 		return false;
  	// }
  	// return true;
  }

  function getClosestLayout(item) {
  	let parent = item.parent;
  	while (parent && parent.type != ItemType.Scene) {
  		if (parent.layout)
  			return parent.layout;
  		parent = parent.parent;
  	}
  	return undefined;
  }

  function getAllLayouts(items) { // get all layouts in a bottom-up manner
  	let parents = getParents(items), allLayouts = [];
  	while (parents && parents[0].type != ItemType.Scene) {
  		for (let parent of parents) {
  			if (parent.layout) {
  				allLayouts.push(parent.layout);
  			}
  		}
  		parents = getParents(parents);
  	}
  	return allLayouts;
  }

  function getCellBoundsInLayout(item) {
  	let itm = item, parent = item.parent;
  	while (parent && parent.type != ItemType.Scene) {
  		if (parent.layout){
  			let idx = parent.children.findIndex(d => d == itm);
  			return parent.layout.cellBounds[idx];
  		}
  		itm = itm.parent;
  		parent = itm.parent;
  	}
  	return undefined;
  }

  function getEncodingKey(item) {
  	if (item.classId) {
  		return item.classId;
  	} else if (item.type == "vertex" && item.dataScope) { //vertex created from partitioning
  		return item.parent.classId + "_v";
  	} else if (item.type == "vertex") { //vertex with index
  		return item.parent.classId + "_v_" + item.parent.vertices.indexOf(item);
  	} else if (item.type == "segment" && item.dataScope) { //segment created from partitioning
  		return item.parent.classId + "_s";
  	} else if (item.type == "segment") { //segment with index
  		return item.parent.classId + "_s_" + item.parent.segments.indexOf(item);
  	} else {
  		return null;
  	}
  }

  function getParents(items) {
  	let result = [];
  	for (let p of items) {
  		if (p.parent && result.indexOf(p.parent) < 0)
  			result.push(p.parent);
  	}
  	return result;
  }


  function isMark(cmpnt) {
  	return cmpnt.type == ItemType.PointText || cmpnt.type == ItemType.Path || cmpnt.type == ItemType.Rectangle || cmpnt.type == ItemType.Line || cmpnt.type == ItemType.Circle || cmpnt.type == ItemType.Area;
  }

  const ItemCounter = {
  	"area" : 0,
  	"rectangle" : 0,
  	"circle": 0,
  	"pie": 0,
  	"line": 0,
  	"path" : 0,
  	"image": 0,
  	"pointText": 0,
  	"collection": 0,
  	"group": 0,
  	"scene": 0,
  	"axis": 0,
  	"glyph": 0,
  	"legend": 0,
  	"polygon": 0,
  	"gridlines": 0,
  	"LinearGradient": 0
  };

  function canAlign(items, direction, scene){
  	if (direction == Alignment.Top || direction == Alignment.Bottom || direction == Alignment.Middle) {
  		for (let item of items) {
  			if (!canMoveVertically(item, scene))
  				return false;
  		}
  		return true;
  	}

  	if (direction == Alignment.Left || direction == Alignment.Right || direction == Alignment.Center) {
  		for (let item of items) {
  			if (!canMoveHorizontally(item, scene))
  				return false;
  		}
  		return true;
  	}
  }

  function canMoveHorizontally(item, scene) {
  	if (scene.getEncodingByItem(item, "x"))
  		return false;
  	if (item.parent && item.parent.layout) {
  		let layout = item.parent.layout;
  		if (layout.type == Layout.Grid && layout.numCols > 1) {
  			return false;
  		}
  	}
  	if (item.parent && item.parent.type != ItemType.Scene){
  		return canMoveHorizontally(item.parent, scene);
  	}
  	return true;
  }

  function canMoveVertically(item, scene) {
  	if (scene.getEncodingByItem(item, "y"))
  		return false;
  	if (item.parent && item.parent.layout) {
  		let layout = item.parent.layout;
  		if (layout.type == Layout.Grid && layout.numRows > 1) {
  			return false;
  		}
  	}
  	if (item.parent && item.parent.type != ItemType.Scene){
  		return canMoveVertically(item.parent, scene);
  	}
  	return true;
  }

  function getTextWidth(text, font) {
  	let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  	let context = canvas.getContext("2d");
  	context.font = font;
  	let metrics = context.measureText(text);
  	return metrics.width;
  }

  function getTopLevelGroup(item) {
  	let parent = item.parent;
  	if (parent.type == ItemType.Scene)
  		return item;
  	else
  		return getTopLevelGroup(parent);
  }

  function polar2Cartesian(cx, cy, r, deg){
  	let x = r * Math.cos(degree2radian(deg)),
  		y = r * Math.sin(degree2radian(deg));
  	return [x + cx, cy - y];
  }

  function cartesian2Polar(x, y, cx, cy){
  	let d = radian2degree(Math.atan2(cy - y, x - cx));
      d = Math.round( d * 10 + Number.EPSILON ) / 10;
      if (d < 0) d += 360;
      let r = Math.sqrt(Math.pow(x-cx, 2) + Math.pow(y-cy, 2));
      r = Math.round( r * 10 + Number.EPSILON ) / 10;
      return [d, r];
  }

  function degree2radian(d){
  	return d * Math.PI/180;
  }

  function radian2degree(r){
  	return r * 180 / Math.PI;
  }

  function CheckAreaOrien(area){
  	let VNum = area.vertices.length;
  	for (let i = 0; i < area.vertices.length / 2; i++) {
  		let Vid1 = i, Vid2 = VNum - i - 1;
  		let peer1 = area.vertices[Vid1], peer2 = area.vertices[Vid2];
  		if (peer1.x == peer2.x && peer1.y == peer2.y) {
  			continue;
  		} else {
  			if (peer1.x == peer2.x) {
  				return "horizontal";
  			} else {
  				return "vertical";
  			}
  		}
  	}
  }

  class GridLayout {

  	constructor(args) {
  		this.type = "grid";
  		this._numCols = args["numCols"];
  		this._numRows = args["numRows"];
  		this.baseline = args["baseline"];
  		this._horzDir = args.hasOwnProperty("hDir") ? args["hDir"] : GridLayout.direction.Left2Right;
  		this._vert2Dir = args.hasOwnProperty("vDir") ? args["vDir"] : GridLayout.direction.Top2Bottom;
  		this._hGap = args.hasOwnProperty("hGap") ? args["hGap"] : 5;
  		this._vGap = args.hasOwnProperty("vGap") ? args["vGap"] : 5;
  		this._cellHorzAlignment = Alignment.Left;
  		this._cellVertAlignment = Alignment.Bottom;
  	}

  	clone() {
  		return new GridLayout({
  			numCols: this._numCols,
  			numRows: this._numRows,
  			hDir: this._horzDir,
  			vDir: this._vert2Dir,
  			hGap: this._hGap,
  			vGap: this._vGap
  		});
  	}

  	get cellBounds() {
  		if (this._numRows) {
  			this._numCols = Math.ceil(this.collection.children.length/this._numRows);
  		} else if (this._numCols) {
  			this._numRows = Math.ceil(this.collection.children.length/this._numCols);
  		}
  		let collection = this.collection, numCol = this._numCols, numRow = this._numRows,
  			hGap = this._hGap, vGap = this._vGap;

  		let bounds = collection.children.map(d => d.bounds);

  		if (this._left === undefined) {
  			let lefts = bounds.map(d => d.left),
  				tops = bounds.map(d => d.top);
  			this._left = Math.min(...lefts);
  			this._top = Math.min(...tops);
  		}

  		let wds = bounds.map(d => d.width),
  			hts = bounds.map(d => d.height),
  			cellWidth = Math.max(...wds), 
  			cellHeight = Math.max(...hts);

  		//TODO: cell size should be determined by the scale range extent if bound to data
  		//analyze the collection's children to see if 
  		
  		//console.log("cell size based on item bounds", cellWidth, cellHeight);

  		let xEncs = this.collection.getInternalEncodings("x"),
  			yEncs = this.collection.getInternalEncodings("y"),
  			wdEncs = this.collection.getInternalEncodings("width"),
  			htEncs = this.collection.getInternalEncodings("height");

  		let leftOffset = 0;
  		if (xEncs.length > 0) {
  			cellWidth = xEncs[xEncs.length -1].scale.rangeExtent;
  			leftOffset = xEncs[xEncs.length -1].scale.range[0];
  		} else if (wdEncs.length > 0 && wdEncs[wdEncs.length -1]._rectNegativeValues) { //width encoding with negative values
  			cellWidth = wdEncs[wdEncs.length -1].scale.rangeExtent;
  			leftOffset = wdEncs[wdEncs.length -1].scale.range[0];
  		}
  		if (yEncs.length > 0) {
  			cellHeight = yEncs[yEncs.length -1].scale.rangeExtent;
  		} else if (htEncs.length > 0 &&  htEncs[htEncs.length -1]._rectNegativeValues) { //width encoding with negative values
  			cellHeight = htEncs[htEncs.length -1].scale.rangeExtent;
  		}
  			
  		//console.log("cell size based on scale", cellWidth, cellHeight);

  		return collection.children.map((d, i) => new Rectangle(this._left + (cellWidth + hGap) * (i%numCol) + leftOffset, 
  			this._top + (cellHeight + vGap) * Math.floor(i/numCol), cellWidth, cellHeight));
  	}

  	run() {
  		if (this.collection == undefined)
  			return;

  		let cellBounds = this.cellBounds;

  		let xEncs = this.collection.getInternalEncodings("x"),
  			yEncs = this.collection.getInternalEncodings("y"),
  			wdEncs = this.collection.getInternalEncodings("width"),
  			htEncs = this.collection.getInternalEncodings("height");
  		
  		let scene = this.collection.getScene();

  		for (let i = 0; i < this.collection.children.length; i++) {
  			let c = this.collection.children[i]; 
  			let gridBound = cellBounds[i];

  			let dx = gridBound.center.x - c.bounds.center.x,
  				dy = gridBound.center.y - c.bounds.center.y;
  			c.translate(dx, dy);

  			//alignment in cell if c's position is not bound to data
  			let cdx = 0, cdy = 0;
  			if (xEncs.length == 0) {
  				switch(this._cellHorzAlignment) {
  					case Alignment.Left:
  						cdx = gridBound.left - c.bounds.left;
  						break;
  					case Alignment.Center:
  						cdx = gridBound.center.x - c.bounds.center.x;
  						break;
  					case Alignment.Right:
  						cdx = gridBound.right - c.bounds.right;
  						break;
  				} 
  			}
  			
  			if (yEncs.length == 0) {
  				switch(this._cellVertAlignment) {
  					case Alignment.Top:
  						cdy = gridBound.top - c.bounds.top;
  						break;
  					case Alignment.Middle:
  						cdy = gridBound.center.y - c.bounds.center.y;
  						break;
  					case Alignment.Bottom:
  						cdy = gridBound.bottom - c.bounds.bottom;
  						break;
  				}
  			}
  			
  			c.translate(cdx, cdy);
  		}

  		if (xEncs.length > 0) {
  			//if childrens' position bound to data, compute position using the scale
  			//TODO: need to deal with cases where xEncs.length > 1
  			//xEncs[xEncs.length-1]._map();
  			let enc = xEncs[xEncs.length-1];
  			enc._apply();
  		} else if (wdEncs.length > 0) {
  			let enc = wdEncs[wdEncs.length-1];
  			if (enc._rectNegativeValues){
  				enc._apply();
  			}
  		}

  		if (yEncs.length > 0) {
  			//yEncs[yEncs.length-1]._map();
  			yEncs[yEncs.length-1]._apply();
  		} else if (htEncs.length > 0) {
  			let enc = htEncs[htEncs.length-1];
  			if (enc._rectNegativeValues){
  				enc._apply();
  			}
  		}

  		this.collection._updateBounds();
  	}

  	//TODO: add a corresponding scene level operation, automatically relayout
  	set hGap(g) {
  		this._hGap = g;
  		this.run();
  		this.collection.getScene()._relayoutAncestors(this.collection);
  	}

  	get hGap() {
  		return this._hGap;
  	}

  	set vGap(g) {
  		this._vGap = g;
  		this.run();
  		this.collection.getScene()._relayoutAncestors(this.collection);
  	}

  	get vGap() {
  		return this._vGap;
  	}

  	set numCols(c) {
  		this._numCols = c;
  		this._numRows = Math.ceil(this.collection.children.length/c);
  		this.run();
  		this.collection.getScene()._relayoutAncestors(this.collection);
  	}

  	get numCols() {
  		return this._numCols;
  	}

  	get numRows() {
  		return this._numRows;
  	}

  	set vertCellAlignment(v) {
  		if (v != Alignment.Top && v != Alignment.Bottom && v != Alignment.Middle) {
  			throw Errors.UNKOWN_ALIGNMENT;
  		}
  		this._cellVertAlignment = v;
  		this.run();
  	}

  	get vertCellAlignment() {
  		return this._cellVertAlignment;
  	}

  	set horzCellAlignment(h) {
  		if (h != Alignment.Left && h != Alignment.Center && h != Alignment.Right) {
  			throw Errors.UNKOWN_ALIGNMENT;
  		}
  		this._cellHorzAlignment = h;
  		this.run();
  	}

  	get horzCellAlignment() {
  		return this._cellHorzAlignment;
  	}
  }

  GridLayout.direction = {
  	Left2Right: "l2r",
  	Right2Left: "r2l",
  	Top2Bottom: "t2b",
  	Bottom2Top: "b2t"
  };

  /**
  * Same as group in graphical design tools 
  **/

  class Group {
  	
  	constructor() {
  		//this._matrix = new Matrix();
  		this.children = [];
  		this._dataScope = undefined;
  		this._layout = undefined;
  		this.type = ItemType.Group;
  		this.id = this.type + ItemCounter[this.type]++;
  	}

  	addChild(c) {
  		if (c.parent)
  			c.parent.removeChild(c);
  		this.children.push(c);
  		c.parent = this;
  	}

  	addChildAt(c,index){
  		if (c.parent)
  			c.parent.removeChild(c);
  		this.children.splice(index, 0, c);
  		c.parent = this;
  	}

  	removeChild(c) {
  		let idx = this.children.indexOf(c);
  		if (idx >= 0) {
  			this.children.splice(idx, 1);
  		}
  		c.parent = null;
  	}

  	removeAll() {
  		for (let c of this.children)
  			c.parent = null;
  		this.children = [];
  	}

  	getScene() {
  		let p = this;
  		while (p) {
  			if (p.type == ItemType.Scene)
  				return p;
  			else
  				p = p.parent;
  		}
  	}

  	get dataScope() {
  		return this._dataScope;
  	}

  	set dataScope(ds) {
  		this._dataScope = ds;
  		for (let c of this.children) {
  			if (c.dataScope)
  				c.dataScope = c.dataScope.merge(ds);
  			else
  				c.dataScope = ds;
  		}
  	}

  	translate(dx, dy) {
  		for (let child of this.children) {
  			child.translate(dx, dy);
  		}
  		this._updateBounds();
  		if (this._layout) {
  			this._layout._left += dx;
  			this._layout._top += dy;
  			this._layout.run();
  		}
  		this._updateBounds();
  	}

  	getInternalEncodings(channel) {
  		if (this.children.length == 0)
  			return [];
  		let item = this.children[0], scene = this.getScene();
  		let encodingKeys = Object.keys(scene.encodings);
  		let classIds = [];
  		while(item) {
  			if (item.classId && classIds.indexOf(item.classId) < 0)
  				classIds.push(item.classId);
  			if (item.children)
  				item = item.children[0];
  			else
  				break;
  		}
  		let result = [];
  		for (let k of encodingKeys) {
  			let tokens = k.split("_");
  			for (let classId of classIds) {
  				if (tokens[0] == classId) {
  					if (scene.encodings[k][channel])
  						result.push(scene.encodings[k][channel]);
  				}
  			}
  		}
  		return result;
  	}

  	get firstChild() {
  		return this.children[0];
  	}

  	set layout(l) {
  		//TODO: reset matrix if needed, e.g. when switching from polar to grid
  		this._layout = l;
  		l.collection = this;
  		this._layout.run();
  	}

  	get layout() {
  		return this._layout;
  	}

  	get bounds() {
  		if (!this._bounds) {
  			this._updateBounds();
  		}
  		return this._bounds;
  	}

  	get center() {
  		return this.bounds.center;
  	}

  	_updateBounds() {
  		if (this._layout && this._layout.type == "grid") {
  			let cellBounds = this._layout.cellBounds;
  			this._bounds = cellBounds[0].clone();
  			for (let i = 1; i < cellBounds.length; i++) {
  				this._bounds = this._bounds.union(cellBounds[i]);
  			}
  		} else if (this.children.length > 0){
  			this._bounds = this.children[0].bounds.clone();
  			for (let i = 0; i < this.children.length; i++) {
  				this._bounds = this._bounds.union(this.children[i].bounds);
  			}
  		} else {
  			this._bounds = new Rectangle(0, 0, 0, 0);
  		}
  	}

  	sortChildrenByData(field, direction, order) {
  		let type = this.children[0].dataScope.getFieldType(field);
  		let f; 
  		switch (type) {
  			case DataType.Date:
  				break;
  			case DataType.Number:
  			case DataType.Integer:
  				f = direction == "ascending" ? (a, b) =>  a.dataScope.aggregateNumericalField(field) - b.aggregateNumericalField(field) : 
  													(a, b) => b.dataScope.aggregateNumericalField(field) - a.aggregateNumericalField(field);
  				break;
  			case DataType.String:
  				if (order)
  					f = direction == "ascending" ? (a, b) => order.indexOf(a.dataScope.getFieldValue(field)) - order.indexOf(b.dataScope.getFieldValue(field))  :
  											(a, b) => order.indexOf(b.dataScope.getFieldValue(field)) - order.indexOf(a.dataScope.getFieldValue(field));
  				else
  					f = direction == "ascending" ? (a, b) =>  (a.dataScope.getFieldValue(field) < b.dataScope.getFieldValue(field) ? -1 : 1 ) : 
  													(a, b) => ( a.dataScope.getFieldValue(field) < b.dataScope.getFieldValue(field) ? 1 : -1 );
  				break;
  		}
  		this.children.sort(f);
  	}
  }

  function validateField(field, datatable) {
  	if (!datatable.hasField(field))
  		throw new Error(Errors$1.FIELD_NONEXISTENT + ", field: " + field  + ", data table: " + datatable.name);
  }

  class DataScope {

  	constructor(datatable) {
  		this._field2value = {}; 
  		this._dt = datatable;
  		this._tuples = this._dt.data;
  	}

  	isEmpty() {
  		return this._tuples.length == 0;
  	}

  	merge(ds) {
  		let r = new DataScope(this._dt);
  		for (let field in ds._field2value) {
  			r = r.cross(field, ds._field2value[field]);
  		}
  		for (let field in this._field2value) {
  			r = r.cross(field, this._field2value[field]);
  		}
  		return r;
  	}

  	cross(field, value) {
  		let ds = this.clone();
  		ds._field2value[field] = value;
  		ds._updateTuples(field, value);
  		return ds;
  	}

  	clone() {
  		let ds = new DataScope(this._dt);
  		ds._field2value = Object.assign({}, this._field2value);
  		ds._tuples = this._tuples.map(d => d);
  		return ds;
  	}

  	// mapToDateField(field) {
  	// 	let values = this._tuples.map(d => d[field]);
  	// 	values = [...new Set(values)];
  	// 	if (values.length > 1)
  	// 		throw new Error(Errors.MULTIPLE_VALUES_PER_FIELD);
  	// 	else
  	// 		return values[0];
  	// }

  	// mapToStringField(field) {
  	// 	let values = this._tuples.map(d => d[field]);
  	// 	values = [...new Set(values)];
  	// 	if (values.length > 1)
  	// 		throw new Error(Errors.MULTIPLE_VALUES_PER_FIELD);
  	// 	else
  	// 		return values[0];
  	// }

  	getFieldValue(field) {
  		let values = this._tuples.map(d => d[field]);
  		values = [...new Set(values)];
  		if (values.length > 1); 
  		return values[0];
  	}

  	hasField(field) {
  		return this._field2value.hasOwnProperty(field);
  	}

  	getFieldType(field) {
  		return this._dt.getFieldType(field);
  	}

  	aggregateNumericalField(field, aggregator) {
  		let values = this._tuples.map(d => d[field]);
  		switch (aggregator) {
  			case Aggregator.Max:
  				return Math.max(...values);
  			case Aggregator.Min:
  				return Math.min(...values);
  			case Aggregator.Avg:
  			case Aggregator.Mean:
  				return mean(values);
  			case Aggregator.Median:
  				return median(values);
  			case Aggregator.Count:
  				return values.length;
  			case Aggregator.Percentile25:
  				return quantile(values, 0.25);
  			case Aggregator.Percentile75:
  				return quantile(values, 0.75);
  			case Aggregator.Sum:
  			default:
  				return sum(values);
  		}
  	}

  	_updateTuples(field, value) {
  		this._tuples = this._tuples.filter(d => d[field] == value);
  	}
  }

  class Collection extends Group{

  	constructor() {
  		super();
  		this.type = ItemType.Collection;
  		this.id = this.type + ItemCounter[this.type]++;
  		this.classId = this.id;
  	}

  	
  	get bbox() {
  		// let mx = this._matrix;
  		// if (!mx.isIdentity())
  		// 	return mx._transformBounds(this.bounds);
  		// else
  		// 	return this.bounds;
  		return this.bounds;
  	}


  	duplicate() {
  		let coll = new Collection();
  		for (let i = 0; i < this.children.length; i++) {
  			let c = this.children[i];
  			coll.addChild(c.duplicate());
  		}
  		coll.classId = this.classId;
  		//coll._matrix = this._matrix.clone();
  		coll.parent = this.parent;
  		let layout = this._layout ? this._layout.clone() : undefined;
  		coll.layout = layout;
  		//layout.collection = coll;
  		// coll._updateBounds();
  		return coll;
  	}
  	
  }

  function repeatItem(scene, compnt, field, datatable, callback) {
  	// if (!datatable.hasField(field))
  	// 	throw new Error(Errors.FIELD_NONEXISTENT + ", field: " + field  + ", data table: " + datatable.name);

  	var f = callback ? datatable.transformField(field, callback) : field;
  	var type = datatable.getFieldType(f);

  	if (type != DataType.String && type != DataType.Date) {
  		throw new Error(Errors$1.REPEAT_BY_NONCAT + ": " + f + " is " + type);
  	}

  	if (!_canRepeat(compnt)) {
  		throw new Error(Errors$1.COMPNT_NON_REPEATABLE);
  	}

  	return _doRepeat(scene, compnt, f, datatable);
  }

  function _canRepeat(compnt, field, datatable) {
  	if ((isMark(compnt) || compnt.type == ItemType.Glyph) && !compnt.dataScope) {
  		return true;
  	} else if (compnt.type == ItemType.Collection) {
  		//TODO: check if repeatable
  		return true;
  	} 
  	return false;
  }

  function _doRepeat(scene, compnt, field, datatable) {
  	let ds = datatable.getFieldSummary(field).unique.map(d => new DataScope(datatable).cross(field, d));
  	let coll = new Collection();
  	scene.addChild(coll);
  	
  	//do not initialize classId here, initialize in scene.mark/glyph/new Collection()
  	// compnt.classId = compnt.id;
  	coll.addChild(compnt);

  	for (let i = 1; i < ds.length; i++) {
  		let c = compnt.duplicate();
  		coll.addChild(c);
  		//console.info("Duplicate: ", c);
  	}

  	coll.children.forEach((d, i) => d.dataScope = ds[i]);
  	//TODO: turn the folllwing into getter and setter
  	// if (!scene.cellAlign.hasOwnProperty(compnt.classId)) {
  	// 	scene.cellAlign[compnt.classId] = {x: Alignment.Left, y: Alignment.Bottom};
  	// }
  	scene._reapplySizeBindings(compnt);
  	return coll;
  }

  class StackLayout {

  	constructor(o, left, top, baseline) {
  		this.type = "stack";
  		this._orientation = o;
  		this._left = left;
  		this._top = top;
  		this.baseline = baseline;
  		this._horzCellAlignment = Alignment.Left;
  		this._vertCellAlignment = Alignment.Bottom;
  	}

  	clone() {
  		let s = new StackLayout(this._orientation, this._left, this._top);
  		s._horzCellAlignment = this._horzCellAlignment;
  		s._vertCellAlignment = this._vertCellAlignment;
  		return s;
  	}

  	_stackAreas() {
  		let baseChild = this.collection.children[0];
  		let recordNum = baseChild.vertices.length / 2;
  		let shift = new Array(recordNum).fill(0);
  		let orientation = CheckAreaOrien(baseChild);
  		// think about how to reduce the number of For loops
  		for (let area of this.collection.children) {
  			for (let i=0; i<recordNum; i++) {
  				let c1 = area.vertices[i];
  				let c2 = area.vertices[recordNum*2-i-1];
  				let offdistance;
  				switch (orientation) {
  					case Orientation.Horizontal:
  						offdistance = this._vertCellAlignment == "bottom" ? this.collection.bounds.bottom - c2.y : this.collection.bounds.top - c2.y;
  						c1.translate(0, offdistance);
  						c2.translate(0, offdistance);
  						break;
  					case Orientation.Vertical:
  						offdistance = this._horzCellAlignment == "left" ? this.collection.bounds.left - c2.x : this.collection.bounds.right - c2.x;
  						c1.translate(offdistance, 0);
  						c2.translate(offdistance, 0);
  						break;
  				}
  			}
  			area._updateBounds();
  		}
  		for (let area of this.collection.children) {
  			for (let i=0; i<recordNum; i++) {
  				let c1 = area.vertices[i];
  				let c2 = area.vertices[recordNum*2-i-1];
  				switch (orientation) {
  					case Orientation.Horizontal:
  						c1.translate(0, shift[i]);
  						c2.translate(0, shift[i]);
  						shift[i] = shift[i] + c1.y - c2.y;
  						break;
  					case Orientation.Vertical:
  						c1.translate(shift[i], 0);
  						c2.translate(shift[i], 0);
  						shift[i] = shift[i] + c1.x - c2.x;
  						break;
  				}
  			}
  			area._updateBounds();
  		}
  		this.collection._updateBounds();
  		let height = this.collection._bounds.height, width = this.collection._bounds.width;
  		if (this.baseline == "center") {
  			for (let area of this.collection.children) {
  				for (let i=0; i<recordNum; i++) {
  					let c1 = area.vertices[i];
  					let c2 = area.vertices[recordNum*2-i-1];
  					let offdistance;
  					switch (orientation) {
  						case Orientation.Horizontal:
  							offdistance = -(shift[i] + height) / 2;
  							c1.translate(0, offdistance);
  							c2.translate(0, offdistance);
  							break;
  						case Orientation.Vertical:
  							offdistance = (width - shift[i]) / 2;
  							c1.translate(offdistance, 0);
  							c2.translate(offdistance, 0);
  							break;
  					}
  				}
  				area._updateBounds();
  			}
  		}
  		this.collection._updateBounds();
  	}	

  	_stackRects() {
  		let scene = this.collection.getScene();
  		let collection = this.collection, o = this._orientation;
  		let bounds = collection.children.map(d => d.bounds);
  		let lefts = bounds.map(d => d.left),
  			tops = bounds.map(d => d.top),
  			wds = bounds.map(d => d.width),
  			hts = bounds.map(d => d.height);
  		let left = this._left == undefined ? Math.min(...lefts) : this._left,
  			top = this._top == undefined ? Math.min(...tops) : this._top;

  		let maxWd = Math.max(...wds), maxHt = Math.max(...hts);
  		if (o == Orientation.Vertical) {
  			let centerX = left + maxWd/2;
  			for (let i = 0; i < collection.children.length; i++) {
  				let c = collection.children[i]; 
  				let dx = centerX - c.bounds.center.x,
  					dy = top + c.bounds.height/2 - c.bounds.center.y;
  				top += c.bounds.height;
  				c.translate(dx, dy);
  				//alignment
  				let cdx, cdy = 0;
  				let xEnc = scene.getEncodingByItem(c, "x");
  				if (!xEnc) {
  					switch (this._horzCellAlignment) {
  						case Alignment.Left:
  							cdx = left - c.bounds.left;
  							break;
  						case Alignment.Center:
  							cdx = left + maxWd/2 - c.bounds.center.x;
  							break;
  						case Alignment.Right:
  							cdx = left + maxWd - c.bounds.right;
  							break;
  					}
  				}
  				
  				c.translate(cdx, cdy);
  			}
  		} else {
  			let centerY = top + maxHt/2;
  			for (let i = 0; i < collection.children.length; i++) {
  				let c = collection.children[i]; 
  				let dx = left + c.bounds.width/2 - c.bounds.center.x,
  					dy = centerY - c.bounds.center.y;
  				left += c.bounds.width;
  				c.translate(dx, dy);

  				//TODO: alignment
  				let cdx = 0, cdy;
  				let yEnc = scene.getEncodingByItem(c, "y");
  				if (!yEnc) {
  					switch (this._vertCellAlignment) {
  						case Alignment.Top:
  							cdy = top - c.bounds.top;
  							break;
  						case Alignment.Middle:
  							cdy = top + maxHt/2 - c.bounds.center.y;
  							break;
  						case Alignment.Bottom:
  							cdy = top + maxHt - c.bounds.bottom;
  							break;
  					}
  				}
  				c.translate(cdx, cdy);
  			}
  		}	
  	}

  	run() {
  		if (this.collection == undefined)
  			return;
  		if (this.collection.children[0].type == "area") {
  			this._stackAreas();
  		} else {
  			this._stackRects();	
  		}
  	}

  	set vertCellAlignment(v) {
  		if (v != Alignment.Top && v != Alignment.Bottom && v != Alignment.Middle) {
  			throw Errors.UNKOWN_ALIGNMENT;
  		}
  		this._vertCellAlignment = v;
  		this.run();
  	}

  	get vertCellAlignment() {
  		return this._vertCellAlignment;
  	}

  	set horzCellAlignment(h) {
  		if (h != Alignment.Left && h != Alignment.Center && h != Alignment.Right) {
  			throw Errors.UNKOWN_ALIGNMENT;
  		}
  		this._horzCellAlignment = h;
  		this.run();
  	}

  	get horzCellAlignment() {
  		return this._horzCellAlignment;
  	}

  	get cellBounds() {
  		return this.collection.children.map(d => d.bounds);
  	}
  }

  function divideItem(scene, compnt, orientation, field, datatable, callback) {
  	// if (!datatable.hasField(field))
  	// 	throw new Error(Errors.FIELD_NONEXISTENT + ", field: " + field  + ", data table: " + datatable.name);

  	var f = callback ? datatable.transformField(field, callback) : field;
  	var type = datatable.getFieldType(f);

  	if (type != DataType.String && type != DataType.Date) {
  		throw new Error(Errors$1.PARTITION_BY_NONCAT + ": " + f + " is " + type);
  	}

  	if (!_canDivide(compnt, f, scene)) {
  		throw new Error(Errors$1.COMPNT_NON_PARTITIONABLE);
  	}

  	switch (compnt.type) {
  		case ItemType.Line:
  			return _doLineDivide();
  		case ItemType.Circle:
  			return _doCircleDivide(scene, compnt, f, datatable);
  		case ItemType.Rectangle:
  			return _doRectDivide(scene, compnt, orientation, f, datatable);
  		case ItemType.Area:
  			return _doAreaDivide(scene, compnt, orientation, f, datatable);
  	}
  	
  }

  function densifyItem(scene, compnt, orientation, field, datatable, callback, startAngle, direction) {
  	// if (!datatable.hasField(field))
  	// 	throw new Error(Errors.FIELD_NONEXISTENT + ", field: " + field  + ", data table: " + datatable.name);
  	var f = callback ? datatable.transformField(field, callback) : field;
  	var type = datatable.getFieldType(f);

  	if (type != DataType.String && type != DataType.Date && type != DataType.Number) {
  		throw new Error(Errors$1.PARTITION_BY_NONCAT + ": " + f + " is " + type);
  	}

  	if (!_canDivide(compnt, f, scene)) {
  		throw new Error(Errors$1.COMPNT_NON_PARTITIONABLE);
  	}

  	switch (compnt.type) {
  		case ItemType.Line:
  			return _doLineDensify(scene, compnt, f, datatable);
  		case ItemType.Circle:
  			return _doCircleDensify(scene, compnt, f, datatable, startAngle, direction);
  		case ItemType.Rectangle:
  		case ItemType.Area:
  			return _doAreaDensify(scene, compnt, orientation, f, datatable);
  	}
  	
  }

  function _canDivide(compnt, field, scene) {
  	if (!isMark(compnt)) {
  		return false;
  	} 
  	if (!compnt.dataScope) {
  		return true;
  	}
  	else {
  		let peers = getPeers(compnt, scene); // findItems(scene, {"classId": compnt.classId});
  		for (let p of peers) {
  			if (p.dataScope._tuples.length > 1)
  				return true;
  		}
  		return false;
  	}
  }

  function _doLineDivide(scene, compnt, field, datatable) {
  	//TODO: implement
  }

  function _doLineDensify(scene, compnt, field, datatable) {
  	let peers = getPeers(compnt, scene); // findItems(scene, {"classId": compnt.classId});

  	let toReturn;
  	for (let p of peers) {
  		let lineDS = p.dataScope ? p.dataScope : new DataScope(datatable);
  		let ds = datatable.getFieldSummary(field).unique.map(d => lineDS.cross(field, d));
  		ds = ds.filter(d => !d.isEmpty());

  		let args = Object.assign({}, p.styles);
  		//args = Object.assign(args, compnt.attrs);
  		//compute vertices
  		let x1 = p.vertices[0].x,
  			y1 = p.vertices[0].y,
  			x2 = p.vertices[1].x,
  			y2 = p.vertices[1].y;

  		let vertices = [], wd = x2 - x1, ht = y2 - y1;
  		for (let i = 0; i < ds.length; i++){
  			vertices.push([x1 + i * wd / (ds.length - 1), y1 + i * ht /(ds.length - 1)]);
  		}
  		args.vertices = vertices;
  		let polyLine = scene.mark("path", args);
  		polyLine.classId = compnt.id;
  		polyLine.dataScope = lineDS;

  		let parent = p.parent;
  		parent.addChild(polyLine);
  		parent.removeChild(p);

  		for (let [i, v] of polyLine.vertices.entries()){
  			if (v.dataScope)
  				v.dataScope = v.dataScope.merge(ds[i]);
  			else
  				v.dataScope = ds[i];
  		}

  		if (p == compnt)
  			toReturn = polyLine;
  	}
  	return toReturn;
  }

  function _doRectDivide(scene, compnt, orientation, field, datatable) {

  	let peers = getPeers(compnt, scene); // findItems(scene, {"classId": compnt.classId});
  	let toReturn;
  	let ds = datatable.getFieldSummary(field).unique.map(d => new DataScope(datatable).cross(field, d));

  	//datascopes
  	let rect2Scopes = {}, max = 0;
  	for (let p of peers) {
  		let scopes = ds;
  		if (p.dataScope) {
  			scopes = ds.map(d => d.merge(p.dataScope));
  			scopes = scopes.filter(d => !d.isEmpty());
  		}
  		if (scopes.length > max)
  			max = scopes.length;
  		rect2Scopes[p.id] = scopes;
  	}

  	let collClassId;
  	for (let p of peers) {
  		let coll = new Collection();
  		if (collClassId == undefined)
  			collClassId = coll.id;
  		coll.classId = collClassId;
  		coll.dataScope = p.dataScope;

  		let parent = p.parent;
  		let index = parent.children.indexOf(p) - 1;
  		parent.addChild(coll);

  		let scopes = rect2Scopes[p.id];
  		
  		// if (p.dataScope) {
  		// 	scopes = ds.map(d => d.merge(p.dataScope));
  		// 	scopes = scopes.filter(d => !d.isEmpty());
  		// }

  		let bounds = p.bounds, left = bounds.left, top = bounds.top;

  		let wd = orientation == Orientation.Vertical ? bounds.width/max : bounds.width,
  			ht = orientation == Orientation.Vertical ? bounds.height : bounds.height/max;
  		//console.log(wd, ht);
  		p.classId = compnt.id;
  		p.resize(wd, ht);
  		p.dataScope = scopes[0];
  		coll.addChild(p);
  		//children.push(p);

  		for (let i = 1; i < scopes.length; i++) {
  			let c = p.duplicate();
  			c.resize(wd, ht);
  			c.dataScope = scopes[i];
  			//children.push(c);
  			coll.addChild(c);
  		}

  		// for (let i = 0; i < collchildren.length; i++) {
  		// 	let child = children[i];
  		// 	if (child.dataScope)
  		// 		child.dataScope = child.dataScope.merge(ds[i]);
  		// 	else
  		// 		child.dataScope = ds[i];
  		// 	if (!child.dataScope.isEmpty())
  		// 		coll.addChild(child);
  		// 	else if (child.parent)
  		// 		child.parent.removeChild(child);
  		// }
  		// for (let i = 0; i < coll.children.length; i++) {
  		// 	let child = coll.children[i];
  		// 	if (child.dataScope) {
  		// 		child.dataScope = child.dataScope.merge(ds[i]);
  		// 	} else {
  		// 		child.dataScope = ds[i];
  		// 	}
  		// }

  		// if (!scene.cellAlign.hasOwnProperty(p.classId)) {
  		// 	scene.cellAlign[p.classId] = {x: Alignment.Left, y: Alignment.Bottom};
  		// }

  		// if (!scene.cellAlign.hasOwnProperty(coll.classId)) {
  		// 	scene.cellAlign[coll.classId] = {x: Alignment.Left, y: Alignment.Bottom};
  		// }

  		let stackO = orientation == Orientation.Vertical ? Orientation.Horizontal: Orientation.Vertical;
  		coll.layout = new StackLayout(stackO, left, top);

  		if (p == compnt)
  			toReturn = coll;
  	}

  	scene._reapplySizeBindings(toReturn);
  	return toReturn;
  }

  // function _doAreadivide(scene, compnt, partitionType, orientation, field, datatable) {
  // 	switch (partitionType) {
  // 		case 'divide':
  // 			return _Area_divide(scene, compnt, orientation, field, datatable);
  // 		case 'BoundaryPartition':
  // 			return _Area_Boundarydivide(scene, compnt, orientation, field, datatable);

  // 	}
  // }

  function _doAreaDensify(scene, compnt, orientation, field, datatable) {
  	let peers = getPeers(compnt, scene);
  	let toReturn;
  	// let targetArea;
  	// let indicator = compnt.parent == scene ? false : true;
  	for (let p of peers) {
  		// How to handle missing elements across different partitions in area mark?
  		let ft = datatable.getFieldType(field);
  		let areaDS = p.dataScope ? p.dataScope : new DataScope(datatable);
  		let ds = datatable.getFieldSummary(field).unique.map(d => areaDS.cross(field, d));
  		ds = ft == DataType.Number? ds : ds.filter(d => !d.isEmpty());
  		
  		if (ft == DataType.Number || ft == DataType.Date) {
  			// sorting ds
  			ds.sort((a, b) => (a._field2value[field] > b._field2value[field]) ? 1 : -1);
  		}
  		let args = Object.assign({}, p.styles);
  		//compute vertices
  		let x1 = p.vertices[0].x,
  			y1 = p.vertices[0].y,
  			x2 = p.vertices[p.vertices.length - 2].x,
  			y2 = p.vertices[p.vertices.length - 2].y;

  		let vertices = [], wd = x2 - x1, ht = y2 - y1;
  		for(let j = 0; j < ds.length; j++) {
  			vertices.push(orientation == Orientation.Vertical ? [x2, y1 + (ds.length-1-j) * ht /(ds.length - 1)] : [x1 + j * wd / (ds.length - 1), y1]);
  		}
  		for(let j = 0; j < ds.length; j++) {
  			vertices.push(orientation == Orientation.Vertical ? [x1, y1 + j * ht /(ds.length - 1)] : [x1 + (ds.length-1-j) * wd / (ds.length - 1), y2]);
  		}
  		args.vertices = vertices;
  		let NewArea = scene.mark("area", args);
  		// Very Important: keep new areas' classID consistent
  		NewArea.classId = p.type == "area"? p.classId : "area" + p.classId.substring(9);
  		NewArea.dataScope = areaDS;

  		let parent = p.parent;
  		parent.addChild(NewArea);
  		parent.removeChild(p);

  		for (let [i, v] of NewArea.vertices.entries()){
  			// two boundary lines are encoded the same; possible to modify later according to the data encoding
  			if (i>=ds.length) {
  				v.dataScope = areaDS.merge(ds[ds.length*2-1-i]);
  			}
  			else {
  				v.dataScope = areaDS.merge(ds[i]);
  			}
  		}
  		if (p == compnt) {
  			toReturn = NewArea;
  			// targetArea = NewArea;
  		}
  	}
  	return toReturn;
  	// // this part is to make sure the returned is a collection (like what is returned for rect marks); this is important if we consider combining the repeat operator
  	// if (indicator) {
  	// 	return targetArea.parent;
  	// } else {
  	// 	let coll = new Collection();
  	// 	let collClassId;
  	// 	if (collClassId == undefined)
  	// 		collClassId = coll.id;
  	// 	coll.classId = collClassId;
  	// 	coll.dataScope = targetArea.dataScope;
  	// 	scene.addChild(coll);
  	// 	coll.addChild(targetArea);
  	// 	// // adding a layout of this collection
  	// 	// let stackO = orientation == Orientation.Vertical ? Orientation.Horizontal: Orientation.Vertical;
  	// 	// coll.layout = new StackLayout(stackO, coll.firstChild.left, coll.firstChild.top);
  	// 	return coll;
  	// }
  }

  function _doAreaDivide(scene, compnt, orientation, field, datatable) {
  	let peers = getPeers(compnt, scene);
  	// make sure the orientation is correct; in case that the boundary partitioning has already been performed if we initial an area mark other than a rect
  	let p1 = peers[0];
  	if ((p1.vertices.length == 4) && (orientation == Orientation.Vertical) && (p1.vertices[0].x !== p1.vertices[1].x)) {
  		for (let p of peers) {
  			let temp = p.vertices[1];
  			p.vertices[1] = p.vertices[3];
  			p.vertices[3] = temp;
  		}
  	}
  	let toReturn;
  	let ds = datatable.getFieldSummary(field).unique.map(d => new DataScope(datatable).cross(field, d));
  	let collClassId;
  	for (let p of peers) {
  		let coll = new Collection();
  		if (collClassId == undefined)
  			collClassId = coll.id;
  		coll.classId = collClassId;
  		coll.dataScope = p.dataScope;

  		let parent = p.parent;
  		parent.addChild(coll);

  		let left = p.left, top = p.top;

  		let wd = orientation == Orientation.Vertical ? p.width/ds.length : p.width,
  		ht = orientation == Orientation.Vertical ? p.height : p.height/ds.length;
  		
  		p.classId = compnt.id;
  		p.resizeArea(wd, ht);
  		coll.addChild(p);

  		for (let i = 1; i < ds.length; i++) {
  			let c = p.duplicate();
  			c.resizeArea(wd, ht);
  			coll.addChild(c);
  		}

  		for (let i = 0; i < coll.children.length; i++) {
  			let child = coll.children[i];
  			if (child.dataScope) {
  				child.dataScope = child.dataScope.merge(ds[i]);
  			} else {
  				child.dataScope = ds[i];
  			}
  			// assigning datascope for boundary vertices
  			for (let [i, v] of child.vertices.entries()){
  				if (v.dataScope) {
  					v.dataScope = child.dataScope.merge(v.dataScope);
  				}
  				else {
  					v.dataScope = child.dataScope;
  				}
  			}
  		}

  		let stackO = orientation == Orientation.Vertical ? Orientation.Horizontal: Orientation.Vertical;
  		coll.layout = new StackLayout(stackO, left, top);

  		if (p == compnt)
  			toReturn = coll;
  	}
  	scene._reapplySizeBindings(toReturn);
  	return toReturn;
  }

  function _doCircleDensify(scene, compnt, field, datatable, startAngle, direction) {
  	let toReturn;
  	let peers = getPeers(compnt, scene);
  	peers.forEach(p => {
  		let circDS = p.dataScope ? p.dataScope : new DataScope(datatable);
  		let ds = datatable.getFieldSummary(field).unique.map(d => circDS.cross(field, d));
  		ds = ds.filter(d => !d.isEmpty()); 
  		let numVertices = ds.length;
  		if (numVertices < 3)
  			throw Error(Errors$1.INSUFFICIENT_DATA_SCOPES);
  		let k = 360/numVertices, vertices = [], angle = [];
  		let dirSign = direction == "clockwise" ? -1 : 1;
  		for (let i = 0; i < ds.length; i++){
  			let a = startAngle + dirSign * i * k;
  			// if (a > 360)	a = a - 360;
  			// if (a < 0)		a = a + 360;
  			angle[i] = a;
  			let coords = polar2Cartesian(p.cx, p.cy, p.radius, angle[i]);
  			vertices.push(coords);
  		}
  		let polygon = scene.mark("polygon", {cx: p.cx, cy: p.cy, radius: p.radius, vertices:vertices});
  		polygon.dataScope = circDS;
  		polygon.styles = Object.assign({}, p.styles);

  		let parent = p.parent;
  		parent.addChild(polygon);
  		parent.removeChild(p);

  		for (let [i, v] of polygon.vertices.entries()){
  			v.polarAngle = angle[i];
  			if (v.dataScope)
  				v.dataScope = v.dataScope.merge(ds[i]);
  			else
  				v.dataScope = ds[i];
  		}

  		if (p == compnt)
  			toReturn = polygon;
  	});
  	return toReturn;
  }

  function _doCircleDivide(scene, compnt, field, datatable) {
  	let toReturn;

  	// Perform on all repitions of cmpnt on canvas
  	let peers = getPeers(compnt, scene);
  	let collClassId;
  	peers.forEach(p => {
  		let circDS = p.dataScope ? p.dataScope : new DataScope(datatable);
  		//console.info("Peer DS: ", circDS);
  		let ds = datatable.getFieldSummary(field).unique.map(d => circDS.cross(field, d));
  		ds = ds.filter(d => !d.isEmpty()); 
  		let numPies = ds.length;

  		// Define new collection and save parent
  		let coll = new Collection();
  		coll.dataScope = circDS;
  		if (collClassId == undefined)
  			collClassId = coll.id;
  		coll.classId = collClassId;
  		let parent = p.parent;

  		// Calculate angle of each pie
  		let pieAng = 360 / numPies;

  		// Create each pie
  		for (let i = 0; i < numPies; i++){
  			let pie = scene.mark("pie", {
  				radius: p.radius,
  				cx: p.cx,
  				cy: p.cy,
  				startAng: pieAng * i,
  				endAng: pieAng + pieAng * i,
  				strokeColor: "#444444",
  				fillColor: p.styles.fillColor 
  			});

  			// Add the datascope
  			pie.dataScope = ds[i];
  			pie.classId = compnt.id;

  			// Add to collection
  			coll.addChild(pie);
  		}

  		// Replace original circle w/ coll of pies
  		parent.removeChild(p);
  		parent.addChild(coll);

  		// Return collection
  		if (p == compnt)
  			toReturn = coll;
  	});

  	return toReturn;
  }

  class CirclePath extends Path$1 {
  	
  	constructor(args) {
  		super(args);
  		
  		this.type = ItemType.Circle;
  		this.closed = true;
  		this._cx = args.hasOwnProperty("cx") ? args.cx : 0;
  		this._cy = args.hasOwnProperty("cy") ? args.cy : 0;
  		this._radius = args.hasOwnProperty("radius") ? args.radius : 0;
  	}

  	get radius() {
  		return this._radius;
  	}

  	get cx() {
  		return this._cx;
  	}

  	get cy() {
  		return this._cy;
  	}

  	get center() {
  		return new Point$1(this._cx, this._cy);
  	}

  	set cx(v) {
  		this._cx = v;
  		this._updateBounds();
  	}

  	set cy(v) {
  		this._cy = v;
  		this._updateBounds();
  	}

  	set radius(r) {
  		this._radius = r;
  		this._updateBounds();
  	}

  	set width(w) {
  		this._radius = w/2;
  		this._updateBounds();
  	}

  	set height(h) {
  		this._radius = h/2;
  		this._updateBounds();
  	}

  	resize(w, h) {
  		this._radius = w/2;
  		this._updateBounds();
  	}

  	translate(dx, dy) {
  		this._cx += dx;
  		this._cy += dy;
  		this._updateBounds();
  	}

  	_updateBounds() {		
  		this._bounds = new Rectangle(this._cx - this._radius, this._cy - this._radius, this._radius * 2, this._radius * 2);
  	}

  	copyPropertiesTo(target) {
  		super.copyPropertiesTo(target);
  		target._cx = this._cx;
  		target._cy = this._cy;
  		target._radius = this._radius;
  	}

  }

  function bindToSize(encoding){

  	encoding._query = function() {
  		this.data = [];		
  		let field = this.field, items = this.items, aggregator = this.aggregator;
  		switch (this.datatable.getFieldType(field)) {
  			case DataType.Boolean:
  				break;

  			case DataType.Date:
  				this.data = items.map(d => d.dataScope.getFieldValue(field));
  				break;

  			case DataType.String:
  				break;

  			default: //integer or number
  				this.data = items.map(d => d.dataScope.aggregateNumericalField(field, aggregator));	
  				break;
  		}
  	};

  	encoding._map = function() {
  		let items = this.items, data = this.data, channel = this.channel, scale;

  		scale = createScale("linear");

  		if (this.data.find(d => d < 0) != undefined && (channel == "width" || channel == "height") && items[0].type.indexOf("rect") == 0) {
  			this._rectNegativeValues = true;
  			scale.domain = [Math.min(...data), Math.max(...data)];
  			if (channel == "width") {
  				let left = Math.min(...(items.map(d => d.bounds.left))),
  					right = Math.max(...(items.map(d => d.bounds.right)));
  				scale._setRange([0, right - left]);
  			} else {
  				let top = Math.min(...(items.map(d => d.bounds.top))),
  					bottom = Math.max(...(items.map(d => d.bounds.bottom)));
  				scale._setRange([0, bottom - top]);
  			}
  		} else {
  			scale.domain = [0, Math.max(...data)];
  			let min, max;
  			if (channel == "radius") {
  				min = 0;
  				max = Math.max(...(items.map(d => d.radius)));
  				if (max < 20)	max = 20;
  			} else if (channel == "area") {
  				min = 0;
  				max = Math.max(...(items.map(d => Math.pow(d.bounds.width, 2))));
  				if (max < 400)	max = 400;
  			} else if (channel == "fontSize") {
  				min = 2;
  				max = Math.max(...(items.map(d => parseFloat(d.styles.fontSize))));
  			} else {
  				min = 0;
  				max = Math.max(...(items.map(d => d.bounds[channel])));
  			}
  			scale._setRange([min, max]);
  		}

  		if (this.scale); else {
  			this.scale = scale;
  		}

  		this.scale._addEncoding(this);
  	};

  	encoding._apply = function() {
  		if (this.channel == "radius") {
  			for (let i = 0; i < this.items.length; i++) {
  				let peer = this.items[i];
  				peer.radius = this.scale.map(this.data[i]);
  			}
  			this.scene._relayoutAncestors(this.anyItem, this.items);
  		} else if (this._rectNegativeValues){
  			if (this.channel == "width") {
  				let offset = Math.min(...this.items.map(d => d.bounds.left));
  				for (let i = 0; i < this.items.length; i++) {
  					let peer = this.items[i], left = peer.bounds.left, right = peer.bounds.right;
  					peer.rightSegment.translate(offset + this.scale.map(this.data[i]) - right, 0);
  					peer.leftSegment.translate(offset + this.scale.map(0) - left, 0);
  					peer._updateBounds();
  				}
  			} else if (this.channel == "height") {
  				let offset = Math.min(...this.items.map(d => d.bounds.top)) + this.scale.rangeExtent;
  				for (let i = 0; i < this.items.length; i++) {
  					let peer = this.items[i], top = peer.bounds.top, btm = peer.bounds.bottom;
  					peer.topSegment.translate(0, offset - this.scale.map(this.data[i]) - top);
  					peer.bottomSegment.translate(0, offset - this.scale.map(0) - btm);
  					peer._updateBounds();
  				}
  			}
  		} else if (this.channel == "area") {
  			for (let i = 0; i < this.items.length; i++) {
  				let peer = this.items[i], s = Math.sqrt(this.scale.map(this.data[i]));
  				peer.resize(s, s);
  			}
  			this.scene._relayoutAncestors(this.anyItem, this.items);
  		} else if (this.channel == "fontSize") {
  			for (let i = 0; i < this.items.length; i++) {
  				let peer = this.items[i], s = this.scale.map(this.data[i]);
  				peer.styles.fontSize = s+ "px";
  			}
  			this.scene._relayoutAncestors(this.anyItem, this.items);
  		} else {
  			for (let i = 0; i < this.items.length; i++) {
  				let peer = this.items[i], s = this.scale.map(this.data[i]);
  				let wd = this.channel == "width" ? s : peer.bounds.width,
  					ht = this.channel == "height" ? s : peer.bounds.height;
  				peer.resize(wd, ht);
  			}
  			this.scene._relayoutAncestors(this.anyItem, this.items);
  		}
  	};

  	encoding.run();
  	return encoding;
  }

  function colors$1(specifier) {
    var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
    while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
  }

  var category10$1 = colors$1("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

  var Accent = colors$1("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

  var Dark2 = colors$1("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

  var Paired = colors$1("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

  var Pastel1 = colors$1("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

  var Pastel2 = colors$1("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

  var Set1 = colors$1("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

  var Set2 = colors$1("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

  var Set3 = colors$1("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

  var Tableau10 = colors$1("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");

  function ramp(scheme) {
    return rgbBasis(scheme[scheme.length - 1]);
  }

  var scheme = new Array(3).concat(
    "d8b365f5f5f55ab4ac",
    "a6611adfc27d80cdc1018571",
    "a6611adfc27df5f5f580cdc1018571",
    "8c510ad8b365f6e8c3c7eae55ab4ac01665e",
    "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e",
    "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e",
    "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e",
    "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30",
    "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30"
  ).map(colors$1);

  var BrBG = ramp(scheme);

  var scheme$1 = new Array(3).concat(
    "af8dc3f7f7f77fbf7b",
    "7b3294c2a5cfa6dba0008837",
    "7b3294c2a5cff7f7f7a6dba0008837",
    "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837",
    "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837",
    "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837",
    "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837",
    "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b",
    "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b"
  ).map(colors$1);

  var PRGn = ramp(scheme$1);

  var scheme$2 = new Array(3).concat(
    "e9a3c9f7f7f7a1d76a",
    "d01c8bf1b6dab8e1864dac26",
    "d01c8bf1b6daf7f7f7b8e1864dac26",
    "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221",
    "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221",
    "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221",
    "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221",
    "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419",
    "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419"
  ).map(colors$1);

  var PiYG = ramp(scheme$2);

  var scheme$3 = new Array(3).concat(
    "998ec3f7f7f7f1a340",
    "5e3c99b2abd2fdb863e66101",
    "5e3c99b2abd2f7f7f7fdb863e66101",
    "542788998ec3d8daebfee0b6f1a340b35806",
    "542788998ec3d8daebf7f7f7fee0b6f1a340b35806",
    "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806",
    "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806",
    "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08",
    "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08"
  ).map(colors$1);

  var PuOr = ramp(scheme$3);

  var scheme$4 = new Array(3).concat(
    "ef8a62f7f7f767a9cf",
    "ca0020f4a58292c5de0571b0",
    "ca0020f4a582f7f7f792c5de0571b0",
    "b2182bef8a62fddbc7d1e5f067a9cf2166ac",
    "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac",
    "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac",
    "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac",
    "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061",
    "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061"
  ).map(colors$1);

  var RdBu = ramp(scheme$4);

  var scheme$5 = new Array(3).concat(
    "ef8a62ffffff999999",
    "ca0020f4a582bababa404040",
    "ca0020f4a582ffffffbababa404040",
    "b2182bef8a62fddbc7e0e0e09999994d4d4d",
    "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d",
    "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d",
    "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d",
    "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a",
    "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a"
  ).map(colors$1);

  var RdGy = ramp(scheme$5);

  var scheme$6 = new Array(3).concat(
    "fc8d59ffffbf91bfdb",
    "d7191cfdae61abd9e92c7bb6",
    "d7191cfdae61ffffbfabd9e92c7bb6",
    "d73027fc8d59fee090e0f3f891bfdb4575b4",
    "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4",
    "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4",
    "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4",
    "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695",
    "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695"
  ).map(colors$1);

  var RdYlBu = ramp(scheme$6);

  var scheme$7 = new Array(3).concat(
    "fc8d59ffffbf91cf60",
    "d7191cfdae61a6d96a1a9641",
    "d7191cfdae61ffffbfa6d96a1a9641",
    "d73027fc8d59fee08bd9ef8b91cf601a9850",
    "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850",
    "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850",
    "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850",
    "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837",
    "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837"
  ).map(colors$1);

  var RdYlGn = ramp(scheme$7);

  var scheme$8 = new Array(3).concat(
    "fc8d59ffffbf99d594",
    "d7191cfdae61abdda42b83ba",
    "d7191cfdae61ffffbfabdda42b83ba",
    "d53e4ffc8d59fee08be6f59899d5943288bd",
    "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd",
    "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd",
    "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd",
    "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2",
    "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2"
  ).map(colors$1);

  var Spectral = ramp(scheme$8);

  var scheme$9 = new Array(3).concat(
    "e5f5f999d8c92ca25f",
    "edf8fbb2e2e266c2a4238b45",
    "edf8fbb2e2e266c2a42ca25f006d2c",
    "edf8fbccece699d8c966c2a42ca25f006d2c",
    "edf8fbccece699d8c966c2a441ae76238b45005824",
    "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824",
    "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b"
  ).map(colors$1);

  var BuGn = ramp(scheme$9);

  var scheme$a = new Array(3).concat(
    "e0ecf49ebcda8856a7",
    "edf8fbb3cde38c96c688419d",
    "edf8fbb3cde38c96c68856a7810f7c",
    "edf8fbbfd3e69ebcda8c96c68856a7810f7c",
    "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b",
    "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b",
    "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b"
  ).map(colors$1);

  var BuPu = ramp(scheme$a);

  var scheme$b = new Array(3).concat(
    "e0f3dba8ddb543a2ca",
    "f0f9e8bae4bc7bccc42b8cbe",
    "f0f9e8bae4bc7bccc443a2ca0868ac",
    "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac",
    "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e",
    "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e",
    "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081"
  ).map(colors$1);

  var GnBu = ramp(scheme$b);

  var scheme$c = new Array(3).concat(
    "fee8c8fdbb84e34a33",
    "fef0d9fdcc8afc8d59d7301f",
    "fef0d9fdcc8afc8d59e34a33b30000",
    "fef0d9fdd49efdbb84fc8d59e34a33b30000",
    "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000",
    "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000",
    "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000"
  ).map(colors$1);

  var OrRd = ramp(scheme$c);

  var scheme$d = new Array(3).concat(
    "ece2f0a6bddb1c9099",
    "f6eff7bdc9e167a9cf02818a",
    "f6eff7bdc9e167a9cf1c9099016c59",
    "f6eff7d0d1e6a6bddb67a9cf1c9099016c59",
    "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450",
    "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450",
    "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636"
  ).map(colors$1);

  var PuBuGn = ramp(scheme$d);

  var scheme$e = new Array(3).concat(
    "ece7f2a6bddb2b8cbe",
    "f1eef6bdc9e174a9cf0570b0",
    "f1eef6bdc9e174a9cf2b8cbe045a8d",
    "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d",
    "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b",
    "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b",
    "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858"
  ).map(colors$1);

  var PuBu = ramp(scheme$e);

  var scheme$f = new Array(3).concat(
    "e7e1efc994c7dd1c77",
    "f1eef6d7b5d8df65b0ce1256",
    "f1eef6d7b5d8df65b0dd1c77980043",
    "f1eef6d4b9dac994c7df65b0dd1c77980043",
    "f1eef6d4b9dac994c7df65b0e7298ace125691003f",
    "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f",
    "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f"
  ).map(colors$1);

  var PuRd = ramp(scheme$f);

  var scheme$g = new Array(3).concat(
    "fde0ddfa9fb5c51b8a",
    "feebe2fbb4b9f768a1ae017e",
    "feebe2fbb4b9f768a1c51b8a7a0177",
    "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177",
    "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177",
    "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177",
    "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a"
  ).map(colors$1);

  var RdPu = ramp(scheme$g);

  var scheme$h = new Array(3).concat(
    "edf8b17fcdbb2c7fb8",
    "ffffcca1dab441b6c4225ea8",
    "ffffcca1dab441b6c42c7fb8253494",
    "ffffccc7e9b47fcdbb41b6c42c7fb8253494",
    "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84",
    "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84",
    "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58"
  ).map(colors$1);

  var YlGnBu = ramp(scheme$h);

  var scheme$i = new Array(3).concat(
    "f7fcb9addd8e31a354",
    "ffffccc2e69978c679238443",
    "ffffccc2e69978c67931a354006837",
    "ffffccd9f0a3addd8e78c67931a354006837",
    "ffffccd9f0a3addd8e78c67941ab5d238443005a32",
    "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32",
    "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529"
  ).map(colors$1);

  var YlGn = ramp(scheme$i);

  var scheme$j = new Array(3).concat(
    "fff7bcfec44fd95f0e",
    "ffffd4fed98efe9929cc4c02",
    "ffffd4fed98efe9929d95f0e993404",
    "ffffd4fee391fec44ffe9929d95f0e993404",
    "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04",
    "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04",
    "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506"
  ).map(colors$1);

  var YlOrBr = ramp(scheme$j);

  var scheme$k = new Array(3).concat(
    "ffeda0feb24cf03b20",
    "ffffb2fecc5cfd8d3ce31a1c",
    "ffffb2fecc5cfd8d3cf03b20bd0026",
    "ffffb2fed976feb24cfd8d3cf03b20bd0026",
    "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026",
    "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026",
    "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026"
  ).map(colors$1);

  var YlOrRd = ramp(scheme$k);

  var scheme$l = new Array(3).concat(
    "deebf79ecae13182bd",
    "eff3ffbdd7e76baed62171b5",
    "eff3ffbdd7e76baed63182bd08519c",
    "eff3ffc6dbef9ecae16baed63182bd08519c",
    "eff3ffc6dbef9ecae16baed64292c62171b5084594",
    "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
    "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"
  ).map(colors$1);

  var Blues = ramp(scheme$l);

  var scheme$m = new Array(3).concat(
    "e5f5e0a1d99b31a354",
    "edf8e9bae4b374c476238b45",
    "edf8e9bae4b374c47631a354006d2c",
    "edf8e9c7e9c0a1d99b74c47631a354006d2c",
    "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32",
    "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32",
    "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b"
  ).map(colors$1);

  var Greens = ramp(scheme$m);

  var scheme$n = new Array(3).concat(
    "f0f0f0bdbdbd636363",
    "f7f7f7cccccc969696525252",
    "f7f7f7cccccc969696636363252525",
    "f7f7f7d9d9d9bdbdbd969696636363252525",
    "f7f7f7d9d9d9bdbdbd969696737373525252252525",
    "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525",
    "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000"
  ).map(colors$1);

  var Greys = ramp(scheme$n);

  var scheme$o = new Array(3).concat(
    "efedf5bcbddc756bb1",
    "f2f0f7cbc9e29e9ac86a51a3",
    "f2f0f7cbc9e29e9ac8756bb154278f",
    "f2f0f7dadaebbcbddc9e9ac8756bb154278f",
    "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486",
    "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486",
    "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d"
  ).map(colors$1);

  var Purples = ramp(scheme$o);

  var scheme$p = new Array(3).concat(
    "fee0d2fc9272de2d26",
    "fee5d9fcae91fb6a4acb181d",
    "fee5d9fcae91fb6a4ade2d26a50f15",
    "fee5d9fcbba1fc9272fb6a4ade2d26a50f15",
    "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d",
    "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d",
    "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d"
  ).map(colors$1);

  var Reds = ramp(scheme$p);

  var scheme$q = new Array(3).concat(
    "fee6cefdae6be6550d",
    "feeddefdbe85fd8d3cd94701",
    "feeddefdbe85fd8d3ce6550da63603",
    "feeddefdd0a2fdae6bfd8d3ce6550da63603",
    "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04",
    "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04",
    "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704"
  ).map(colors$1);

  var Oranges = ramp(scheme$q);

  function cividis(t) {
    t = Math.max(0, Math.min(1, t));
    return "rgb("
        + Math.max(0, Math.min(255, Math.round(-4.54 - t * (35.34 - t * (2381.73 - t * (6402.7 - t * (7024.72 - t * 2710.57))))))) + ", "
        + Math.max(0, Math.min(255, Math.round(32.49 + t * (170.73 + t * (52.82 - t * (131.46 - t * (176.58 - t * 67.37))))))) + ", "
        + Math.max(0, Math.min(255, Math.round(81.24 + t * (442.36 - t * (2482.43 - t * (6167.24 - t * (6614.94 - t * 2475.67)))))))
        + ")";
  }

  var cubehelix$2 = cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

  var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

  var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

  var c = cubehelix();

  function rainbow(t) {
    if (t < 0 || t > 1) t -= Math.floor(t);
    var ts = Math.abs(t - 0.5);
    c.h = 360 * t - 100;
    c.s = 1.5 - 1.5 * ts;
    c.l = 0.8 - 0.9 * ts;
    return c + "";
  }

  var c$1 = rgb(),
      pi_1_3 = Math.PI / 3,
      pi_2_3 = Math.PI * 2 / 3;

  function sinebow(t) {
    var x;
    t = (0.5 - t) * Math.PI;
    c$1.r = 255 * (x = Math.sin(t)) * x;
    c$1.g = 255 * (x = Math.sin(t + pi_1_3)) * x;
    c$1.b = 255 * (x = Math.sin(t + pi_2_3)) * x;
    return c$1 + "";
  }

  function turbo(t) {
    t = Math.max(0, Math.min(1, t));
    return "rgb("
        + Math.max(0, Math.min(255, Math.round(34.61 + t * (1172.33 - t * (10793.56 - t * (33300.12 - t * (38394.49 - t * 14825.05))))))) + ", "
        + Math.max(0, Math.min(255, Math.round(23.31 + t * (557.33 + t * (1225.33 - t * (3574.96 - t * (1073.77 + t * 707.56))))))) + ", "
        + Math.max(0, Math.min(255, Math.round(27.2 + t * (3211.1 - t * (15327.97 - t * (27814 - t * (22569.18 - t * 6838.66)))))))
        + ")";
  }

  function ramp$1(range) {
    var n = range.length;
    return function(t) {
      return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
    };
  }

  var viridis = ramp$1(colors$1("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

  var magma = ramp$1(colors$1("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

  var inferno = ramp$1(colors$1("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

  var plasma = ramp$1(colors$1("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));



  var d3Chromatic = /*#__PURE__*/Object.freeze({
    __proto__: null,
    schemeCategory10: category10$1,
    schemeAccent: Accent,
    schemeDark2: Dark2,
    schemePaired: Paired,
    schemePastel1: Pastel1,
    schemePastel2: Pastel2,
    schemeSet1: Set1,
    schemeSet2: Set2,
    schemeSet3: Set3,
    schemeTableau10: Tableau10,
    interpolateBrBG: BrBG,
    schemeBrBG: scheme,
    interpolatePRGn: PRGn,
    schemePRGn: scheme$1,
    interpolatePiYG: PiYG,
    schemePiYG: scheme$2,
    interpolatePuOr: PuOr,
    schemePuOr: scheme$3,
    interpolateRdBu: RdBu,
    schemeRdBu: scheme$4,
    interpolateRdGy: RdGy,
    schemeRdGy: scheme$5,
    interpolateRdYlBu: RdYlBu,
    schemeRdYlBu: scheme$6,
    interpolateRdYlGn: RdYlGn,
    schemeRdYlGn: scheme$7,
    interpolateSpectral: Spectral,
    schemeSpectral: scheme$8,
    interpolateBuGn: BuGn,
    schemeBuGn: scheme$9,
    interpolateBuPu: BuPu,
    schemeBuPu: scheme$a,
    interpolateGnBu: GnBu,
    schemeGnBu: scheme$b,
    interpolateOrRd: OrRd,
    schemeOrRd: scheme$c,
    interpolatePuBuGn: PuBuGn,
    schemePuBuGn: scheme$d,
    interpolatePuBu: PuBu,
    schemePuBu: scheme$e,
    interpolatePuRd: PuRd,
    schemePuRd: scheme$f,
    interpolateRdPu: RdPu,
    schemeRdPu: scheme$g,
    interpolateYlGnBu: YlGnBu,
    schemeYlGnBu: scheme$h,
    interpolateYlGn: YlGn,
    schemeYlGn: scheme$i,
    interpolateYlOrBr: YlOrBr,
    schemeYlOrBr: scheme$j,
    interpolateYlOrRd: YlOrRd,
    schemeYlOrRd: scheme$k,
    interpolateBlues: Blues,
    schemeBlues: scheme$l,
    interpolateGreens: Greens,
    schemeGreens: scheme$m,
    interpolateGreys: Greys,
    schemeGreys: scheme$n,
    interpolatePurples: Purples,
    schemePurples: scheme$o,
    interpolateReds: Reds,
    schemeReds: scheme$p,
    interpolateOranges: Oranges,
    schemeOranges: scheme$q,
    interpolateCividis: cividis,
    interpolateCubehelixDefault: cubehelix$2,
    interpolateRainbow: rainbow,
    interpolateWarm: warm,
    interpolateCool: cool,
    interpolateSinebow: sinebow,
    interpolateTurbo: turbo,
    interpolateViridis: viridis,
    interpolateMagma: magma,
    interpolateInferno: inferno,
    interpolatePlasma: plasma
  });

  class Scale {

  	constructor(type, args) {
  		this.type = type;
  		//offset in terms of absolute coordinates on screen, this property is useful for reusing scales on items that are not in a layout
  		this.offset = undefined;
  		//this.id = this.type + ItemCounter[this.type]++;
  		switch (type) {
  			case "linear":
  				this._scale = linear$1();
  				break;
  			case "point":
  				this._scale = point();
  				break;
  			case "ordinal":
  				this._scale = ordinal();
  				break;
  			case "ordinalColor":
  				this._scale = ordinal(category10);
  				break;
  			case "power":
  			case "log":
  			case "identity":
  			case "time":
  				this._scale = time();
  				break;
  			case "sequentialColor":
  				if (typeof(args) == "string")
  					this._scale = sequential(d3Chromatic[args]);
  				else { //mapping
  					let domain = Object.keys(args).map(d => parseFloat(d)).sort((a,b) => a - b),
  						range = domain.map(d => args[d]);
  					this._scale = linear$1(domain, range);
  					this._scale.clamp(true);
  				}
  				break;
  		}
  		this.encodings = [];
  	}

  	static mergeDomain(d1, d2){
  		return [Math.min(d1[0], d2[0]), Math.max(d1[1], d2[1])];
  	}

  	//the argument s will be discarded, this scale will kept being used
  	//only internally used in encoding._map
  	_merge(s) {
  		//console.log("merging scales");
  		if (this.type != s.type) {
  			throw Errors.DIFFERENT_SCALE_TYPE;
  		}
  		//let scale;
  		let newDomain, newRange;
  		switch (this.type) {
  			case "linear":
  			case "time":
  				newDomain = [Math.min(this.domain[0], s.domain[0]), Math.max(this.domain[1], s.domain[1])];
  				newRange = [0, this.map(newDomain[1]) - this.map(newDomain[0])];
  				break;
  			case "point":
  			case "ordinalColor":
  				newDomain = [...new Set(this.domain.concat(s.domain))];
  				//TODO: need to compute new range
  				newRange = [];
  				//scale = createScale("point");
  				//scale.domain = [...new Set(this.domain.concat(s.domain))];
  				break;
  			default:
  				console.log("TODO: merge scale type", this.type);
  				break;
  		}
  		this._scale.domain(newDomain);
  		this._scale.range(newRange);
  		//scale._scale.range(this.range);

  		// for (let enc of this.encodings) {
  		// 	scale._addEncoding(enc);
  		// }

  		// for (let enc of s.encodings) {
  		// 	this._addEncoding(enc);
  		// }

  		// for (let enc of this.encodings) {
  		// 	enc.scale = this;
  		// 	enc._apply();
  		// }

  		// for (let enc of this.encodings) {
  		// 	enc.scene._updateAncestorBounds(enc.item, enc.items);
  		// }
  	}

  	get domain() {
  		return this._scale.domain();
  	}

  	set domain(d) {
  		this._scale.domain(d);
  		for (let enc of this.encodings) {
  			//enc._map();
  			enc._apply();
  		}
  	}

  	get range() {
  		return this._scale.range();
  	}

  	//disable setting range directly because scale ranges are internally represented as [0, extent], 
  	//to support this, the argument should be in real screen coordinates and need to do internal conversion
  	set range(r) {
  		//TODO: check r is a two-element array
  		this._scale.range(r);
  		for (let enc of this.encodings) {
  			//enc._map();
  			enc._apply();
  		}

  		for (let enc of this.encodings) {
  			enc.scene._updateAncestorBounds(enc.item, enc.items);
  		}
  	}

  	_setRange(r) {
  		//TODO: check r is a two-element array
  		this._scale.range(r);
  		for (let enc of this.encodings) {
  			//enc._map();
  			enc._apply();
  		}
  		for (let enc of this.encodings) {
  			enc.scene._updateAncestorBounds(enc.item, enc.items);
  		}
  	}

  	set rangeExtent(e) {
  		//TODO: check e is a valid number
  		let r = this._scale.range();
  		//this._setRange([r[0], r[0] + e]);
  		if (r[0] < r[1])
  			this._setRange([r[0], r[0] + e]);
  		else
  			this._setRange([r[1] + e, r[1]]);
  	}

  	get rangeExtent() {
  		let r = this._scale.range();
  		return Math.abs(r[1] - r[0]);
  	}

  	_addEncoding(b) {
  		if (this.encodings.indexOf(b) < 0)
  			this.encodings.push(b);
  	}

  	map(d) {
  		return this._scale(d);
  	}

  	invert(r) {
  		return this._scale.invert(r);
  	}

  }

  function bindToPosition(encoding){

  	encoding._query = function() {
  		this.data = [];
  		
  		let field = this.field, items = this.items;
  		let dataScopes = ((this.anyItem.type == "vertex" || this.anyItem.type == "segment") && !this.anyItem.dataScope) ? 
  							items.map(d => d.parent.dataScope) : items.map(d => d.dataScope);

  		switch (this.datatable.getFieldType(field)) {
  			case DataType.Boolean:
  				break;

  			case DataType.Date:
  				this.data = dataScopes.map(d => d.getFieldValue(field));
  				break;

  			case DataType.String:
  				try {
  					this.data = dataScopes.map(d => d.getFieldValue(field));
  				} catch (error) {
  					throw new Error("Cannot bind " + this.channel + " to " + field + " : " + error);
  				}
  				break;

  			default: //integer or number
  				this.data = dataScopes.map(d => d.aggregateNumericalField(field, this.aggregator));
  				break;
  		}
  	};

  	encoding._map = function() {
  		let channel = this.channel, fieldType = this.datatable.getFieldType(this.field);

  		//to be used for determining the range of scale 
  		//TODO: need to update cellBounds dynamically for _map() and _apply()
  		let extent;
  		let layout = getClosestLayout(this.anyItem);
  		if (layout) {
  			let cellBounds = layout.cellBounds;
  			extent = channel == "x" ? cellBounds[0].width : cellBounds[0].height;
  		} else {
  			let pos = this.items.map(d => d.center[channel]);
  			extent = Math.max(...pos) - Math.min(...pos);
  			if (extent < 100) extent = 100;
  			else if (extent > 500) extent = 500;
  		}
  		if (this.rangeExtent)
  			extent = this.rangeExtent;

  		let min, max, domain, range;
  		switch (fieldType) {
  			case DataType.Boolean:
  				break;

  			case DataType.Date:
  				//scale = createScale("time");
  				min = Math.min(...this.data); 
  				max = Math.max(...this.data);
  				domain = [min, max];
  				if (this.scale) {
  					domain = Scale.mergeDomain(domain, this.scale.domain);
  					extent = Math.abs(this.scale.map(domain[0]) - this.scale.map(domain[1]));
  				} else {
  					this.scale = createScale("time");
  				}
  				range = [0, extent];
  				//scale.domain = [min, max]; //[new Date(min), new Date(max)];
  				break;

  			case DataType.String:
  				//scale = createScale("point");
  				//scale.domain = this.data;
  				domain = this.data;
  				range = [0, extent];
  				if (this.scale) ; else {
  					this.scale = createScale("point");
  				}
  				break;

  			default: //integer or number
  				//scale = createScale("linear");
  				min = Math.min(...this.data); 
  				max = Math.max(...this.data);
  				//scale.domain = (this.startFromZero || min < 0)? [0, max] : [min, max];
  				domain = this.startFromZero ? [0, max] : [min, max];
  				if (this.scale) {
  					domain = Scale.mergeDomain(domain, this.scale.domain);
  					extent = Math.abs(this.scale.map(domain[0]) - this.scale.map(domain[1]));
  				} else {
  					this.scale = createScale("linear");
  				}
  				if (domain[0] == domain[1])
  					domain[1] = domain[0] * 1.1;
  				range = this.invertScale ? [extent, 0] : [0, extent];
  				break;
  		}

  		this.scale.domain = domain;
  		this.scale._setRange(range);
  		

  		//TODO: need to adjust according to scale type
  		
  		this.scale._addEncoding(this);
  	};

  	encoding._apply = function() {
  		let items = [], channel = this.channel;
  		//if the scale is shared across multiple encodings, need to find the offset based on all items using this scale
  		//use case: box plot, where lines, rect segments and line vertices share the same scale
  		for (let enc of this.scale.encodings)
  			items = items.concat(enc.items);
  		if (channel == "x") {
  			let layout = getClosestLayout(this.anyItem);
  			if (layout){
  				//do not use scale.offset, use cell bounds
  				for (let i = 0; i < this.items.length; i++) {
  					let itm = this.items[i], itmCb = getCellBoundsInLayout(itm);
  					let dx = itmCb.left + this.scale.map(this.data[i]) - itm.center[channel],
  						dy = 0;
  					itm.translate(dx, dy);
  				}
  			} else if (this.anyItem.type == "vertex" || this.anyItem.type == "segment") {
  				//TODO: right now using the leftmost mark peer as the baseline, which will not work for cases like bullet chart
  				//need to check if marks are part of a glyph, and use the leftmose glyph peer.
  				let marks = getParents(this.items);
  				if (this.scale.offset === undefined)
  					this.scale.offset = Math.min(...marks.map(d => d.bounds.left));
  				for (let i = 0; i < this.items.length; i++) {
  					let peer = this.items[i];
  					let dx = this.scale.offset + this.scale.map(this.data[i]) - peer.center[channel],
  						dy = 0;
  					peer.translate(dx, dy);
  				}
  			} else {
  				if (this.scale.offset === undefined)
  					this.scale.offset = Math.min(...items.map(d => d.center[channel]));
  				for (let i = 0; i < this.items.length; i++) {
  					let peer = this.items[i];
  					let dx = this.scale.offset + this.scale.map(this.data[i]) - peer.center[channel],
  						dy = 0;
  					peer.translate(dx, dy);
  				}
  			}
  			
  		} else {//channel y
  			let layout = getClosestLayout(this.anyItem);
  			if (layout){
  				let cellBounds = this.items.map(d => getCellBoundsInLayout(d));
  				for (let i = 0; i < this.items.length; i++) {
  					let itm = this.items[i];
  					let dx = 0,
  						dy = cellBounds[i].bottom - this.scale.map(this.data[i]) - itm.center[channel];
  					itm.translate(dx, dy);
  				}
  			} else if (this.anyItem.type == "vertex" || this.anyItem.type == "segment") {
  				let marks = getParents(this.items);
  				if (this.scale.offset === undefined)
  					this.scale.offset = Math.min(...marks.map(d => d.bounds.top));
  				for (let i = 0; i < this.items.length; i++) {
  					let peer = this.items[i];
  					let dx = 0,
  						dy = this.scale.offset + this.scale.rangeExtent - this.scale.map(this.data[i]) - peer.center[channel];
  					peer.translate(dx, dy);
  				}
  			} else {
  				// let offset = Math.min(...items.map(d => d.center[channel])) + this.scale.range[1];
  				if (this.scale.offset === undefined)
  					this.scale.offset = Math.max(...items.map(d => d.bounds.top));
  				//let offset = Math.max(...items.map(d => d.bounds.top)) + this.scale.rangeExtent;
  				for (let i = 0; i < this.items.length; i++) {
  					let peer = this.items[i];
  					let dx = 0,
  						dy = this.scale.offset + this.scale.rangeExtent - this.scale.map(this.data[i]) - peer.center[channel];
  					peer.translate(dx, dy);
  				}
  			}
  		}
  	};

  	encoding.run();
  	return encoding;
  }

  function bindToRadialDistance(encoding){

      encoding._query = function() {
          this.data = [];
  		
  		let field = this.field, items = this.items;
  		let dataScopes = ((this.anyItem.type == "vertex" || this.anyItem.type == "segment") && !this.anyItem.dataScope) ? 
  							items.map(d => d.parent.dataScope) : items.map(d => d.dataScope);

  		switch (this.datatable.getFieldType(field)) {
  			case DataType.Boolean:
  				break;

  			case DataType.Date:
  				this.data = dataScopes.map(d => d.getFieldValue(field));
  				break;

  			case DataType.String:
  				try {
  					this.data = dataScopes.map(d => d.getFieldValue(field));
  				} catch (error) {
  					throw new Error("Cannot bind " + this.channel + " to " + field + " : " + error);
  				}
  				break;

  			default: //integer or number
  				this.data = dataScopes.map(d => d.aggregateNumericalField(field, this.aggregator));
  				break;
  		}
      };


      encoding._map = function() {
  		let items = this.items, data = this.data, channel = this.channel;
  		if (this.scale); else {
  			this.scale = createScale("linear");
  			this.scale.domain = [0, Math.max(...data)];
  			this.scale._setRange([0, this.radius]);
  			this.scale._addEncoding(this);
  		}
  	};

      encoding._apply = function() {
  		for (let i = 0; i < this.items.length; i++) {
  			let peer = this.items[i], rd = this.scale.map(this.data[i]);
              let coords = polar2Cartesian(this.cx, this.cy, rd, peer.polarAngle);
              peer.x = coords[0];
              peer.y = coords[1];
  		}

  		//relayout if needed
  		this.scene._relayoutAncestors(this.anyItem, this.items);
  	};

      encoding.run();
  	return encoding;
  }

  function bindToColor(encoding){

  	encoding._query = function() {
  		this.data = [];
  		
  		let field = this.field, items = this.items;
  		let dataScopes = ((this.anyItem.type == "vertex" || this.anyItem.type == "segment") && !this.anyItem.dataScope) ? 
  							items.map(d => d.parent.dataScope) : items.map(d => d.dataScope);

  		switch (this.datatable.getFieldType(field)) {
  			case DataType.Boolean:
  				break;

  			case DataType.Date:
  				this.data = dataScopes.map(d => d.getFieldValue(field));
  				break;

  			case DataType.String:
  				try {
  					this.data = dataScopes.map(d => d.getFieldValue(field));
  				} catch (error) {
  					throw new Error("Cannot bind " + this.channel + " to " + field + " : " + error);
  				}
  				break;

  			default: //integer or number
  				this.data = dataScopes.map(d => d.aggregateNumericalField(field, this.aggregator));
  				break;
  		}
  	};

  	encoding._map = function() {
  		let channel = this.channel;
  		if (this.scale) ; else {
  			switch (this.datatable.getFieldType(this.field)) {
  				case DataType.Boolean:
  					break;

  				case DataType.Date:
  					break;

  				case DataType.String:
  					this.scale = createScale("ordinalColor");
  					this.scale.domain = this.data;
  					let userDefinedMapping = this.mapping;
  					if (userDefinedMapping) {
  						let range = this.scale.domain.map(d => userDefinedMapping.hasOwnProperty(d) ? userDefinedMapping[d] : "black");
  						this.scale._scale.range(range);
  					}
  					break;

  				default: //integer or number
  					this.scale = createScale("sequentialColor", this.mapping ? this.mapping : this.scheme ? this.scheme: "interpolateTurbo");
  					if (!this.mapping)
  						this.scale.domain = [Math.min(...this.data), Math.max(...this.data)];
  					break;
  			}
  		}
  	};

  	encoding._apply = function() {
  		for (let i = 0; i < this.items.length; i++) {
  			let peer = this.items[i], value = this.scale.map(this.data[i]);
  			if (peer.type == "vertex" || peer.type == "segment")
  				peer[this.channel] = value;
  			else
  				peer.styles[this.channel] = value;
  			if (peer.vertices && this.channel == "strokeColor") {
  				peer.vertices.forEach(d => d.fillColor = value);
  			}
  		}
  	};

  	encoding.run();
  	return encoding;
  }

  function bindToAngle(encoding){

  	encoding._query = function() {
  		this.data = [];

  		let field = this.field, items = this.items;

  		switch (this.datatable.getFieldType(field)) {
  			case DataType.Boolean:
  				break;

  			case DataType.Date:
  				this.data = items.map(d => d.dataScope.getFieldValue(field));
  				break;

  			case DataType.String:
  				break;

  			default: //integer or number
  				this.data = items.map(d => d.dataScope.aggregateNumericalField(field, this.aggregator));
  				break;
  		}
  	};

  	encoding._map = function() {
  		let channel = this.channel;
  		if (this.scale) ; else {
  			this.scale = createScale("linear");
  			this.scale.domain = [0, this.data.reduce((a, d) => a + d, 0)];
  			this.scale._setRange([0, 360]);
  			this.scale._addEncoding(this);
  		}
  	};

  	encoding._apply = function() {
  		// Iterate through peers
  		let peer, prevEnd = 0;
        for (let i = 0; i < this.items.length; i++) {
  			peer = this.items[i];

           // The encoded pie will start at the end of the previous adjusted pie
  			let startAngle = prevEnd;
  			let angle = this.scale.map(this.data[i]);

  			// Pie function will update the end angle to be used in next iteration and return it
  			prevEnd = peer.adjustAngle(startAngle, angle);
        }
  	};

  	encoding.run();
  	return encoding;
  }

  function bindToArea(encoding){

  	encoding._query = function() {
  		this.data = [];
          // store area peers
          this.areas = getPeers(this.items[0], this.scene);
          let areaNum = this.areas.length;
  		this.areaNum = areaNum;
          // replace this.items with all vertices
  		this.items = [];
  		this.indicator = [];
  		for (let area of this.areas) {
  			for (let i=0; i<area.vertices.length; i++) {
  				this.items.push(area.vertices[i]);
  				if (i < area.vertices.length / 2) {
  					this.indicator.push(1);
  				} else {
  					this.indicator.push(0);
  				}
  			}
  		}
  		let field = this.field, items = this.items;
  		let dataScopes = ((this.anyItem.type == "vertex" || this.anyItem.type == "segment") && !this.anyItem.dataScope) ? 
  							items.map(d => d.parent.dataScope) : items.map(d => d.dataScope);
  		switch (this.datatable.getFieldType(field)) {
  			case DataType.Boolean:
  				break;

  			case DataType.Date:
  				this.data = dataScopes.map(d => d.getFieldValue(field));
  				break;

  			case DataType.String:
  				// try {
  				// 	this.data = dataScopes.map(d => d.getFieldValue(field));
  				// } catch (error) {
  				// 	throw new Error("Cannot bind " + this.channel + " to " + field + " : " + error);
  				// }
  				// For now we just count the tuples to handle the string case
  				// this.aggregator = Aggregator.Count;
  				this.data = dataScopes.map(d => this.indicator[dataScopes.indexOf(d)] == 0 ? 0 :  d.aggregateNumericalField(field, this.aggregator));
  				break;

  			default: //integer or number
  				if (this.channel == "x" || this.channel == "y") {
  					this.data = dataScopes.map(d => d._field2value[field]);
  				} else {
  					this.data = dataScopes.map(d => this.indicator[dataScopes.indexOf(d)] == 0 ? 0 :  d.aggregateNumericalField(field, this.aggregator));
  				}
  				break;
  		}
  	};

  	encoding._map = function() {
  		let channel = this.channel, fieldType = this.datatable.getFieldType(this.field);

  		let scale, min, max;
  		switch (fieldType) {
  			case DataType.Boolean:
  				break;

  			case DataType.Date:
  				scale = createScale("time");
  				min = Math.min(...this.data); 
  				max = Math.max(...this.data);
  				scale.domain = [min, max]; //[new Date(min), new Date(max)];
  				break;

  			case DataType.String:
  				// scale = createScale("point");
  				// scale.domain = this.data;
  				scale = createScale("linear");
  				min = Math.min(...this.data); 
  				max = Math.max(...this.data);
  				scale.domain = (this.startFromZero || min < 0)? [0, max] : [min, max];	
  				break;

  			default: //integer or number
  				scale = createScale("linear");
  				min = Math.min(...this.data); 
  				max = Math.max(...this.data);
  				scale.domain = (this.startFromZero || min < 0)? [0, max] : [min, max];
  				break;
  		}

  		//to be used for determining the range of scale 
  		//TODO: need to update cellBounds dynamically for _map() and _apply()
          // let orientation = this.areas[0].vertices[0].center["x"] == this.areas[0].vertices[this.areas[0].vertices.length-1].center["x"] ? Orientation.Horizontal : Orientation.Vertical;
  		let orientation = CheckAreaOrien(this.areas[0]);
  		let extent;
  		let layout = getClosestLayout(this.anyItem);
  		if (layout) {
  			let cellBounds = layout.cellBounds;
  			if (this.channel == "width" || this.channel == "height") {
  				extent = orientation == Orientation.Vertical ? cellBounds[0].width : cellBounds[0].height;
  			} else {
  				extent = orientation == Orientation.Vertical ? cellBounds[0].height : cellBounds[0].width;
  			}
  		} else {
  			let pos = this.items.map(d => d.center[orientation == Orientation.Vertical ? "x" : "y"]);
  			extent = Math.max(...pos) - Math.min(...pos);
  		}

  		if (extent < 100) extent = 100;
  		else if (extent > 500) extent = 500;
  		if (min < 0) {
  			scale._scale.domain([min, max]);
  			//TODO: need to adjust according to scale type
  			scale._setRange([0, extent]);
  		} else {
  			scale._setRange([0, extent]);
  		}
  		//scale._setRange([0, extent]);

  		if (this.scale) {
  			this.scale._merge(scale);
  		} else {
  			this.scale = scale;
  		}
  		//console.log(this.data, this.scale.domain, this.scale.range);
  		
  		this.scale._addEncoding(this);
  	};

  	encoding._apply = function() {
  		let items = [], channel = this.channel;
  		//if the scale is shared across multiple encodings, need to find the offset based on all items using this scale
  		//use case: box plot, where lines, rect segments and line vertices share the same scale
  		for (let enc of this.scale.encodings)
  			items = items.concat(enc.items);

          //let orientation = this.areas[0].vertices[0].center["x"] == this.areas[0].vertices[this.areas[0].vertices.length-1].center["x"] ? Orientation.Horizontal : Orientation.Vertical;		
  		let orientation = CheckAreaOrien(this.areas[0]);
  		if (channel == "width" || channel == "height") {
  			let DomainToBaseline = this.scale.domain[0] < this.scale.domain[1] ? "default" : "opposite";
  			// let layout = getClosestLayout(this.anyItem);
  			let layouts = getAllLayouts(this.items);
  			if (layouts[0]) { 
  				let baseline = layouts[layouts.length - 1].baseline == "center";
  				for (let layout of layouts) {
  					if (orientation == Orientation.Vertical) {
  						switch (layout.type) {
  							case Layout.Grid:
  								if (baseline) {
  									layout._cellHorzAlignment = "center";
  								break;
  								} else {
  									layout._cellHorzAlignment =  layout.baseline ? layout.baseline : layout._cellHorzAlignment;							
  									break;
  								}
  							case Layout.Stack:
  								if (baseline) {
  									layout.baseline = baseline == true ? "center" : undefined;
  									break;
  								} else {
  									layout._horzCellAlignment =  layout.baseline ? layout.baseline : DomainToBaseline == "default" ? "left" : "right";
  									break;
  								}
  						}
  					} else {
  						switch (layout.type) {
  							case Layout.Grid:
  								if (baseline) {
  									layout._cellVertAlignment = "center";
  								break;
  								} else {
  									layout._cellVertAlignment =  layout.baseline ? layout.baseline : layout._cellVertAlignment;							
  									break;
  								}								
  							case Layout.Stack:
  								if (baseline) {
  									layout.baseline = baseline == true ? "center" : undefined;
  									break;
  								} else {
  									layout._vertCellAlignment =  layout.baseline ? layout.baseline : DomainToBaseline == "default" ? "bottom" : "top";
  									break;
  								}
  								
  						}
  					}
  				}
  				for (let i = 0; i < this.items.length; i++) {
  					let peer = this.items[i], perrCb = getCellBoundsInLayout(peer);
  					let dx =  orientation == Orientation.Vertical ? perrCb.left + this.scale.map(this.data[i]) - peer.center["x"] : 0,
  						dy =  orientation == Orientation.Vertical ? 0 : perrCb.bottom - this.scale.map(this.data[i]) - peer.center["y"];
  					peer.translate(dx, dy);
  				}
  				if (layouts[layouts.length - 1].type == "grid" && baseline) { // handle cases where no stacking layout exists
  					let VNum = this.items.length / this.areaNum;
  					for (let j = 0; j < this.areaNum; j++) {
  						for (let i = 0; i < VNum / 2; i++) {
  							let Vid1 = j * VNum + i, Vid2 = (j + 1) * VNum - i - 1;
  							let peer1 = this.items[Vid1], peer2 = this.items[Vid2], perrCb = getCellBoundsInLayout(peer1);
  							let height = orientation == Orientation.Vertical ? peer1.center["x"]-peer2.center["x"] : peer2.center["y"]-peer1.center["y"];
  							let dx1 =  orientation == Orientation.Vertical ? perrCb.center.x + height / 2 - peer1.center["x"] : 0,
  								dy1 =  orientation == Orientation.Vertical ? 0 : perrCb.center.y + height / 2 - peer1.center["y"];
  							let dx2 =  orientation == Orientation.Vertical ? perrCb.center.x - height / 2 - peer2.center["x"] : 0,
  								dy2 =  orientation == Orientation.Vertical ? 0 : perrCb.center.y - height / 2 - peer2.center["y"];
  							peer1.translate(dx1, dy1);
  							peer2.translate(dx2, dy2);
  						}
  					}
  				}
  			} else {
  				let baseline = this.areas[0].baseline == "center";
  				let marks = getParents(this.items);
  				let offset = orientation == Orientation.Vertical ? Math.min(...marks.map(d => d.bounds.left)) : Math.max(...marks.map(d => d.bounds.bottom));
  				for (let i = 0; i < this.items.length; i++) {
  					let peer = this.items[i];
  					let dx = orientation == Orientation.Vertical ? offset + this.scale.map(this.data[i]) - peer.center["x"] : 0,
  						dy = orientation == Orientation.Vertical ? 0 : offset - this.scale.map(this.data[i]) - peer.center["y"];
  					peer.translate(dx, dy);
  				}
  				if (baseline == true) {
  					let VNum = this.items.length / this.areaNum;
  					let marks = getParents(this.items);
  					let offset = orientation == Orientation.Vertical ? Math.min(...marks.map(d => d.bounds.center.x)) : Math.max(...marks.map(d => d.bounds.center.y));
  					for (let j = 0; j < this.areaNum; j++) {
  						for (let i = 0; i < VNum / 2; i++) {
  							let Vid1 = j * VNum + i, Vid2 = (j + 1) * VNum - i - 1;
  							let peer1 = this.items[Vid1], peer2 = this.items[Vid2];
  							let height = orientation == Orientation.Vertical ? peer1.center["x"]-peer2.center["x"] : peer2.center["y"]-peer1.center["y"];
  							let dx1 =  orientation == Orientation.Vertical ? offset + height / 2 - peer1.center["x"] : 0,
  								dy1 =  orientation == Orientation.Vertical ? 0 : offset + height / 2 - peer1.center["y"];
  							let dx2 =  orientation == Orientation.Vertical ? offset - height / 2 - peer2.center["x"] : 0,
  								dy2 =  orientation == Orientation.Vertical ? 0 : offset - height / 2 - peer2.center["y"];
  							peer1.translate(dx1, dy1);
  							peer2.translate(dx2, dy2);
  						}
  					}
  				}
  			}
  		} else {//channel timeline
  			let layout = getClosestLayout(this.anyItem);
  			if (layout) {
  				let marks = getParents(this.items);
  				if (this.scale.offset === undefined)
  					this.scale.offset = orientation == Orientation.Horizontal ? Math.min(...marks.map(d => d.bounds.left)) : Math.max(...marks.map(d => d.bounds.top));
  				for (let i = 0; i < this.items.length; i++) {
  					let peer = this.items[i], perrCb = getCellBoundsInLayout(peer);
  					let dx =  orientation == Orientation.Vertical ? 0 : perrCb.left + this.scale.map(this.data[i]) - peer.center["x"],
  						dy =  orientation == Orientation.Vertical ? perrCb.bottom - this.scale.map(this.data[i]) - peer.center["y"] : 0;
  					peer.translate(dx, dy);
  				}
  			} else {
  				let marks = getParents(this.items);
  				if (this.scale.offset === undefined)
  					this.scale.offset = orientation == Orientation.Horizontal ? Math.min(...marks.map(d => d.bounds.left)) : Math.max(...marks.map(d => d.bounds.top));
  				for (let i = 0; i < this.items.length; i++) {
  					let peer = this.items[i];
  					let dx = orientation == Orientation.Horizontal ? this.scale.offset + this.scale.map(this.data[i]) - peer.center["x"] : 0,
  						dy = orientation == Orientation.Horizontal ? 0 : this.scale.offset + this.scale.rangeExtent - this.scale.map(this.data[i]) - peer.center["y"];
  					peer.translate(dx, dy);
  		    	}	
  			}
  	    }
          for (let area of this.areas) {
              area._updateBounds();
          }
  		if (channel == "width" || channel == "height") {
  			this.scene._relayoutAncestors(this.areas[0], this.areas);
  		}
      };

  	encoding.run();
  	return encoding;
  }

  function bindToText(encoding){

  	encoding._query = function() {
  		this.data = [];
  		
  		let field = this.field, items = this.items;
  		switch (this.datatable.getFieldType(field)) {
  			case DataType.Boolean:
  				break;

  			case DataType.Date:
  				this.data = items.map(d => d.dataScope.getFieldValue(field));
  				break;

  			case DataType.String:
  				try {
  					this.data = items.map(d => d.dataScope.getFieldValue(field));
  				} catch (error) {
  					throw new Error("Cannot bind " + this.channel + " to " + field + " : " + error);
  				}
  				break;

  			default: //integer or number
  				this.data = items.map(d => d.dataScope.aggregateNumericalField(field, this.aggregator));
  				break;
  		}
  	};

  	encoding._map = function() {
  		let channel = this.channel;
  		if (this.scale) ; else {
  			switch (this.datatable.getFieldType(this.field)) {
  				case DataType.Boolean:
  					break;

  				case DataType.Date:
  					break;

  				case DataType.String:
  				default: //integer or number
  					this.scale = createScale("ordinal");
  					this.scale.domain = [...new Set(this.data)];
                      this.scale._scale.range(this.scale.domain.map(d => d + ""));
  					break;
  			}
  		}
  	};

  	encoding._apply = function() {
  		for (let i = 0; i < this.items.length; i++) {
  			let peer = this.items[i], value = this.scale.map(this.data[i]);
  			peer.text = value;
  		}
  	};

  	encoding.run();
  	return encoding;
  }

  class Encoding {

  	constructor(items, scene, channel, field, args) {
  		this.items = items;
  		this.anyItem = this.items[0];
  		this.scene = scene;
  		this.channel = channel;
  		this.field = field;
  		this.aggregator = args.aggregator;
  		this.datatable = args.datatable;
  		this.scale = args.scale;
  		this.callback = args.callback;
  		this.startFromZero = args.startFromZero;
  		this.invertScale = args.invertScale;
  		this.mapping = args.mapping;
  		this.rangeExtent = args.rangeExtent;
  		this.scheme = args.scheme;

  		//get the data needed for the mapping
  		this._query = undefined;

  		//construct/modify scales
  		this._map = undefined;

  		//apply mapping
  		this._apply = undefined;
  	}

  	run() {
  		this._query();
  		this._map();
  		this._apply();
  	}

  	//optional itm specifies which scale range to get in the case of small multiples
  	getScaleRange(itm) {
  		let item = itm ? itm : this.anyItem;
  		if (item.type == ItemType.Area) {
  			//else if (this.channel == "distance" || this.channel == "timeline") { // for area marks; layout not considered
  			let AreaOrientation = CheckAreaOrien(item);
  			let DomainToBaseline = this.scale.domain[1] > this.scale.domain[0] ? "default" : "opposite"; // controlling the alignment for the axis and the chart
  			switch (AreaOrientation) {
  				case Orientation.Horizontal:
  					switch (this.channel) {
  						case "height":
  						case "width": {
  							let vertices = getPeers(item.anyVertex, this.scene);
  							let offset = DomainToBaseline == "default" ? Math.max(...vertices.map(d => d.center["y"])) : Math.min(...vertices.map(d => d.center["y"]));
  							return DomainToBaseline == "default" ? [offset, offset - this.scale.rangeExtent] : [offset + this.scale.rangeExtent, offset];
  						}
  						case "x":
  						case "y": {
  							let vertices = getPeers(item.anyVertex, this.scene);
  							let offset = Math.min(...vertices.map(d => d.center["x"]));
  							return [offset, offset + this.scale.rangeExtent];
  						}
  					}
  				case Orientation.Vertical:
  					switch (this.channel) {	
  						case "x":
  						case "y": {
  							let vertices = getPeers(item.anyVertex, this.scene);
  							let offset = Math.max(...vertices.map(d => d.center["y"]));
  							return [offset, offset - this.scale.rangeExtent];
  						}
  						case "height":
  						case "width": {
  							let vertices = getPeers(item.anyVertex, this.scene);
  							let offset = DomainToBaseline == "default" ? Math.min(...vertices.map(d => d.center["x"])) : Math.max(...vertices.map(d => d.center["x"]));
  							return DomainToBaseline == "default" ? [offset, offset + this.scale.rangeExtent] : [offset - this.scale.rangeExtent, offset];
  						}
  					}
  			}
  		} else if (this.channel == "x") {
  			//if ((item.type == "vertex" || item.type == "segment") && item.parentMarkInLayout()) {
  			let layout = getClosestLayout(this.anyItem);
  			if (layout){
  				let cellBounds = layout.cellBounds;
  				let parentPeers = item.parent.parent.children; //, parent = item.parent;
  				let idx = parentPeers.findIndex(d => item.parent == d || item.parent.parent == d ); //parentPeers.indexOf(parent);
  				return [cellBounds[idx].left, cellBounds[idx].left + this.scale.rangeExtent];
  			} else if (item.type == "vertex" || item.type == "segment") {
  				// let items = getPeers(item, this.scene);
  				// let marks = getParents(items);
  				let offset = this.scale.offset; //Math.min(...marks.map(d => d.bounds.left));
  				return [offset, offset + this.scale.rangeExtent];
  			} else {
  				//let items = getPeers(item, this.scene);
  				let offset = this.scale.offset; // Math.min(...items.map(d => d.center["x"]));
  				return [offset, offset + this.scale.rangeExtent];
  			}
  			
  		} else if (this.channel == "y") {
  			let layout = getClosestLayout(this.anyItem);
  			if (layout){
  			//if ((item.type == "vertex" || item.type == "segment") && item.parentMarkInLayout()) {
  				let cellBounds = layout.cellBounds;
  				let parentPeers = item.parent.parent.children; //, parent = item.parent;
  				let idx = parentPeers.findIndex(d => item.parent == d || item.parent.parent == d ); //parentPeers.indexOf(parent);
  				return [cellBounds[idx].bottom, cellBounds[idx].bottom - this.scale.rangeExtent];
  			} else if (item.type == "vertex" || item.type == "segment") {
  				// let items = getPeers(item, this.scene);
  				// let marks = getParents(items);
  				let offset = this.scale.offset; //Math.max(...marks.map(d => d.bounds.bottom));
  				return [offset+ this.scale.rangeExtent, offset];
  			} else {
  				// let items = getPeers(item, this.scene);
  				let offset = this.scale.offset;  //= Math.max(...items.map(d => d.center["y"]));
  				//return [offset, offset - this.scale.rangeExtent];
  				return [offset+ this.scale.rangeExtent, offset];
  			}

  		} else if (this.channel == "width") {
  			let items = getPeers(item, this.scene);
  			let offset = Math.min(...items.map(d => d.bounds.left));
  			return [offset, offset + this.scale.rangeExtent];
  		} else if (this.channel == "height") {
  			let items = getPeers(item, this.scene);
  			//TODO: handle cases where items are aligned top
  			let offset = Math.max(...items.map(d => d.bounds.bottom));
  			return [offset, offset - this.scale.rangeExtent];
  		} else if (this.channel == "radialDistance") {
  			let polygon = item.parent;
  			return [polygon.cx, polygon.cx + this.scale.rangeExtent];
  		} else {
  			return this.scale.range;
  		}
  	}

  }

  function bin$1(table, fields, args) {
  	//right now only handles one field
      let f = fields[0];
      //TODO: check that can perform kde on f
      let gf = table.getNonNumericFields();

      //construct groups
      let g = {};
      for (let row of table.data){
          let k = gf.map(d => String(row[d])).join("_");
          if (!g.hasOwnProperty(k)){
              g[k] = gf.map(d => row[d]);
              g[k].push([]);
          }  
          g[k][g[k].length -1].push(row[f]);
      }

      let newData = [];
      for (let k in g) {
          let data = g[k].pop(), 
              bin$1 = bin()(data);
          for (let b of bin$1) {
              let o = {};
              g[k].forEach((d, i) => o[gf[i]] = d);
              o["x0"] = b.x0;
              o["x1"] = b.x1;
              o[f+"_count"] = b.length;
              newData.push(o);
          }
      }

      let fTypes = {};
      gf.forEach(d => fTypes[d] = table.getFieldType(d));
      fTypes["x0"] = DataType.Number;
      fTypes["x1"] = DataType.Number;
      fTypes[f+"_count"] = DataType.Number;

      return new DataTable(newData, table.name+"_bin_"+f, fTypes);
  }

  function kde(table, fields, args) {
  	//right now only handles one field
      let f = fields[0];
      //TODO: check that can perform kde on f
      let gf = table.getNonNumericFields();

      //construct groups
      let g = {};
      for (let row of table.data){
          let k = gf.map(d => String(row[d])).join("_");
          if (!g.hasOwnProperty(k)){
              g[k] = gf.map(d => row[d]);
              g[k].push([]);
          }  
          g[k][g[k].length -1].push(row[f]);
      }
      
      let min = args.hasOwnProperty("min") ? args.min : table.getFieldSummary(f).min,
          max = args.hasOwnProperty("max") ? args.max : table.getFieldSummary(f).max;
      let v = min, thresholds = [];
      while(v < max) {
          thresholds.push(v);
          v += args["interval"];
      }
      thresholds.push(v);

      let newData = [];
      for (let k in g) {
          let data = g[k].pop(), 
              density = _kde(_epanechnikov(args.bandwidth), thresholds, data);
          for (let t of density) {
              let o = {};
              g[k].forEach((d, i) => o[gf[i]] = d);
              o[f] = t[0];
              o[f+"_density"] = t[1];
              newData.push(o);
          }
      }

      let fTypes = {};
      gf.forEach(d => fTypes[d] = table.getFieldType(d));
      fTypes[f] = DataType.Number;
      fTypes[f+"_density"] = DataType.Number;

      return new DataTable(newData, table.name+"_kde_"+f, fTypes);
  }

  function _kde(kernel, thresholds, data) {
      return thresholds.map(t => [t, mean(data, d => kernel(t - d))]);
  }

  function _epanechnikov(bandwidth) {
      return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
  }

  // import {uniqueDates, uniqueStrings} from "../util/DataUtil";

  class DataTable {

  	constructor(data, name, fTypes) {
  		this.name = name;
  		this.data = data;
  		this._fields = Object.keys(this.data[0]);
  	
  		this._newField = 0;
  		if (fTypes) {
  			this._fieldTypes = fTypes;
  		} else {
  			this._fieldTypes = {};
  			for (let f of this._fields) {
  				this._fieldTypes[f] = _inferType(this.data.map(d => d[f]));
  				if (f.toLowerCase() == "year" && this._fieldTypes[f] == DataType.Integer)
  					this._fieldTypes[f] = DataType.Date;
  			}
  			//fix null values, cast type and summarize
  			_validate(this.data, this._fieldTypes);
  		}

  		this._fieldSummaries = {};
  		for (let f of this._fields) {
  			this._fieldSummaries[f] = _summarize(this.data.map(d => d[f]), this._fieldTypes[f]);
  		}

  		//add row id
  		this._addField("atlas_rowId", DataType.String, this.data.map((d, i) => "r" + i));
  	}

  	// constructor(url, text) {
  	// 	//TODO: add row id
  	// 	this.name = _getCurrentFileName(url);
  	// 	this.data = d3.csvParse(text.trim(), d3.autoType);
  	// 	this._fields = Object.keys(this.data[0]);
  	// 	this._fieldTypes = {};
  	// 	this._newField = 0;
  	// 	for (let f of this._fields) {
  	// 		this._fieldTypes[f] = _inferType(this.data.map(d => d[f]));
  	// 		if (f.toLowerCase() == "year" && this._fieldTypes[f] == DataType.Integer)
  	// 			this._fieldTypes[f] = DataType.Date;
  	// 	}

  	// 	//fix null values, cast type and summarize
  	// 	_validate(this.data, this._fieldTypes);

  	// 	this._fieldSummaries = {};
  	// 	for (let f of this._fields) {
  	// 		this._fieldSummaries[f] = _summarize(this.data.map(d => d[f]), this._fieldTypes[f]);
  	// 	}

  	// 	//add row id
  	// 	this._addField("atlas_rowId", DataType.String, this.data.map((d, i) => "r" + i));
  	// }

  	transformField(f, callback, newf) {
  		let values = this.data.map(d => callback(d[f]));
  		let type = _inferType(values);
  		let name = newf ? newf : Date.now() + "_field" + this._newField++;
  		this._addField(name, type, values);
  		return name;
  	}

  	setValueOrder(field, values) {
  		this._fieldSummaries[field].unique = values;
  	}

  	_addField(name, type, values) {
  		this.data.forEach( (d, i) => d[name] = values[i]);
  		this._fieldTypes[name] = type;
  		this._fields.push(name);
  		this._fieldSummaries[name] = _summarize(values, type);
  	}

  	getFieldType(f) {
  		return this._fieldTypes[f];
  	}

  	get fields() {
  		return this._fields;
  	}

  	getFieldSummary(f) {
  		return this._fieldSummaries[f];
  	}

  	getFieldValues(f) {
  		return this.data.map(d => d[f]);
  	}

  	getUniqueFieldValues(f) {
  		return this._fieldSummaries[f].unique;
  	}

  	getRowCount() {
  		return this.data.length;
  	}

  	hasField(f) {
  		return this._fields.indexOf(f) >= 0;
  	}

  	//date values are parsed and stored as number of milliseconds
  	parseFieldAsDate(field, format) {
  		//TODO: validate field and format
  		let parse = timeParse(format);
  		for (let row of this.data) {
  			if (row[field] == null || row[field] == undefined) {
  				row[field] = (new Date(1899, 11, 31)).getTime();
  				//row[field] = new Date(1899, 11, 31);
  			} else {
  				//console.log(row[field], parse(row[field]));
  				row[field] = parse(row[field]).getTime();
  				//row[field] = parse(row[field]);
  			}
  		}
  		this._fieldTypes[field] = DataType.Date;
  		this._fieldSummaries[field] = _summarize(this.data.map(d => d[field]), DataType.Date);
  	}

  	static get RowID() {
  		return "atlas_rowId";
  	}

  	getNonNumericFields() {
  		let r = [];
  		for (let f in this._fieldTypes) {
  			if (this._fieldTypes[f] != DataType.Number && this._fieldTypes[f] != DataType.Integer && f != DataTable.RowID) {
  				r.push(f);
  			}
  		}
  		return r;
  	}

  	transform(type, fields, params) {
  		let args = params ? params : {};
  		switch (type) {
  			case "kde":
  				return kde(this, fields, args);
  			case "bin":
  				return bin$1(this, fields);
  		}
  	}
  }

  function _summarize(values, type) {
  	var s = {};
  	switch (type) {
  		case DataType.Boolean:
  			s.trueCount = values.filter(d => d).length;
  			s.falseCount = values.filter(d => !d).length;
  			break;
  		case DataType.Date:
  			s.min = min(values);
  			s.max = max(values);
  			s.extent = [s.min, s.max];
  			s.unique = [...new Set(values)]; // [...new Set(values.map(d => d.getTime()))].map(d => new Date(d));
  			break;
  		case DataType.String:
  			s.unique = [...new Set(values)];
  			break;
  		default:
  			s.min = min(values);
  			s.max = max(values);
  			s.extent = [s.min, s.max];
  			s.mean = mean(values);
  			s.median = median(values);
  			s.unique = [...new Set(values)];
  			break;
  	}
  	return s;
  }

  function _validate(data, fieldTypes) {
  	//date values are parsed and stored as number of milliseconds
  	for (let row of data) {
  		for (let f in fieldTypes) {
  			let type = fieldTypes[f], v = row[f], realv = undefined;
  			if (row[f] == null || row[f] == undefined) {
  				switch (type) {
  					case DataType.Boolean:
  						realv = false;
  						break;
  					case DataType.Date:
  						realv = (new Date(1899, 11, 31)).getTime();
  						break;
  					case DataType.String:
  						realv = "";
  						break;
  					default:
  						realv = 0;
  						break;
  				}
  			} else {
  				switch (type) {
  					case DataType.Boolean:
  						realv = v;
  						break;
  					case DataType.Date:
  						if (Number.isInteger(v)){//year
  							realv = (new Date(v, 0)).getTime();
  						} else {
  							realv = (new Date(v+"")).getTime(); //Date.parse(v);
  						}
  						break;
  					case DataType.String:
  						realv = v.toString();
  						break;
  					default:
  						realv = v;
  						break;
  				}
  			}
  			row[f] = realv;
  		}
  	}
  }

  var isValidType = {
  	boolean: function(x) { return x==='true' || x==='false' || x === true || x === false || toString.call(x) == '[object Boolean]'; },
  	integer: function(x) { return isValidType.number(x) && (x=+x) === ~~x; },
  	number: function(x) { return !isNaN(+x) && toString.call(x) != '[object Date]'; },
  	date: function(x) { return !isNaN(Date.parse(x)); },
  	string: function(x) {return true}
  };

  function _inferType(values) {
  	var types = Object.values(DataType);
  	for (let i = 0; i < values.length; i++) {
  		let v = values[i];
  		if (v == null)	continue;
  		for (let j = 0; j < types.length; j++) {
  			if (!isValidType[types[j]](v)) {
  				types.splice(j, 1);
  				j -= 1;
  			}
  		}
  		if (types.length == 1)
  			return types[0];
  	}
  	return types[0];
  }

  class PointText extends Mark {

      constructor(args) {
  		super(args);
          this.type = ItemType.PointText;
          this.x = 0;
          this.y = 0;
          if (!this.styles.hasOwnProperty("fontSize"))
              this.styles["fontSize"] = "12px";
          if (!this.styles.hasOwnProperty("fontFamily"))
              this.styles["fontFamily"] = "arial";
          if (!this.styles.hasOwnProperty("fontWeight"))
              this.styles["fontWeight"] = "regular";
          if (!this.styles.hasOwnProperty("fillColor"))
              this.styles["fillColor"] = "black";

          if (args !== undefined) {
              if (args.hasOwnProperty("position")){
                  this.x = args["position"][0];
                  this.y = args["position"][1];
              }
      
              if (args.hasOwnProperty("text")){
                  this._text = args["text"];
              } else {
                  this._text = "";
              }

              if (args.hasOwnProperty("anchor")){
                  this.anchor = args["anchor"];
              } else {
                  this.anchor = ["center", "middle"];
              }
          }
      }

      copyPropertiesTo(target) {
  		target.styles = Object.assign({}, this.styles);
  		if (this._dataScope)
  			target._dataScope = this._dataScope.clone();
  		target.x = this.x;
          target.y = this.y;
  		target.text = this.text;
  		target.anchor = [this.anchor[0], this.anchor[1]];
  	}

      //bounds of point text is not accurate
      get bounds() {
  		if (!this._bounds)
  			this._updateBounds();
  		return this._bounds;
  	}

      set text(text) {
          this._text = text;
          this._updateBounds();
      }

      get text() {
          return this._text;
      }

      translate(dx, dy) {
  		this.x += dx;
          this.y += dy;
  		this._updateBounds();
  	}

  	_updateBounds() {
  		this._bounds = new Rectangle(this.x, this.y, getTextWidth(this._text, [this.fontWeight, this.fontSize, this.fontFamily].join(" ")), 12);
  	}

      static getTextAnchor(direction) {
          switch(direction) {
              case "top":
                  return "text-before-edge";
              
          }
      }
  }

  class EncodingAxis extends Group {
      
      //glyph is optional
  	constructor(encoding, item, args) {
          super();
          this.type = ItemType.Axis;
          this.id = this.type + ItemCounter[this.type]++;

          this.encoding = encoding;
          this.channel = this.encoding.channel;
          this._item = item;

          this._strokeColor = args.hasOwnProperty("strokeColor") ? args["strokeColor"] : "#555";
          this._tickVisible = args.hasOwnProperty("tickVisible") &&  !args["tickVisible"] ? "hidden" : "visible";
          this._ruleVisible = args.hasOwnProperty("ruleVisible") && !args["ruleVisible"] ? "hidden" : "visible";
          this._labelFormat = args.hasOwnProperty("labelFormat") ? args["labelFormat"] : "";

          //flip is useful when items are top aligned for example, and the axis needs to start from the top
          //this is different from invert scale
          this._flip = args.hasOwnProperty("flip") ? args["flip"] : false;

          this._ticks = new Group();
          this._ticks.id = this.id + "ticks";
          this.addChild(this._ticks);
          
          
          //this._ticks = [];
          this._labels = new Group();
          this._labels.id = this.id + "labels";
          this.addChild(this._labels);

          this._path = new Path$1({"strokeColor": this._strokeColor, "visibility": this._ruleVisible});
          this._path.type = ItemType.Line;
          this._path.id = this.id + "path";
          this.addChild(this._path);

          this._orientation = args["orientation"];
          this._position = this.channel == "x" || this.channel == "width" || ((this.channel == "distance" || this.channel == "timeline") && (this._orientation == "top" || this._orientation == "bottom"))? args["y"] : args["x"]; 
          
          if (this.channel == "radialDistance"){
              this._position = this._item.parent.cy;
              if(args.hasOwnProperty("rotation")){
                  this._rotate = [-args["rotation"], this.encoding.cx, this.encoding.cy];
              }
          }

          if (args.hasOwnProperty("labelRotation"))
              this._labelRotation = args.labelRotation;

          this._tickSize = 7;
      }
      
      get ticks() {
          return this._ticks;
      }

      get labels() {
          return this._labels;
      }

      get path() {
          return this._path;
      }

      set tickValues(values){
          this._tickValues = values;
          this._updateTicks();
          this._updateTickPositions();
      }

      get tickValues() {
          return this._tickValues;
      }

      set labelValues(values){
          this._labelValues = values;
          this._updateLabels();
          this._updateLabelPositions();
      }

      get labelValues(){
          return this._labelValues;
      }

      _computePosition() {
          let c = getTopLevelGroup(this._item);
          if (this.channel == "x" || this.channel == "width") {
              this._position = this._orientation == "top"  ? c.bounds.top - this._tickSize : c.bounds.bottom + this._tickSize;
          } else if (this.channel == "y" || this.channel == "height") {
              this._position = this._orientation == "left"  ? c.bounds.left - this._tickSize : c.bounds.right + this._tickSize;
          }
      }

      _updateLabelPositions() {
          this._range = this.encoding.getScaleRange(this._item);
          if (this._position === undefined)
              this._computePosition();
          if (this.channel == "x" || this.channel == "radialDistance" || this.channel == "width" || ((this.channel == "distance" || this.channel == "timeline") && (this._orientation == "top" || this._orientation == "bottom"))) {
              let offset = this._orientation == "bottom" ? this._tickSize : - this._tickSize ;
              let anchor = this._orientation == "bottom" ? ["center", "top"] : ["center", "bottom"];
              if (this._flip) {
                  for (let [i, l] of this._labels.children.entries()) {
                      l.x = this._range[1] - this.encoding.scale.map(this._labelValues[i]);
                      l.y = this._position + offset;
                      l.anchor = anchor;
                      if (this._labelRotation){
                          l._rotate = [this._labelRotation, l.x, l.y];
                          l.anchor = ["right", anchor[1]];
                      }
                  }
              } else if (this.encoding.invertScale) {
                  for (let [i, l] of this._labels.children.entries()) {
                      l.x = this._range[0] + this.encoding.scale.map(this._labelValues[i]);
                      l.y = this._position + offset;
                      l.anchor = anchor;
                      if (this._labelRotation){
                          l._rotate = [this._labelRotation, l.x, l.y];
                          l.anchor = ["right", anchor[1]];
                      }
                  }
              }  else {
                  for (let [i, l] of this._labels.children.entries()) {
                      l.x = this._range[0] + this.encoding.scale.map(this._labelValues[i]) - this.encoding.scale.range[0];
                      l.y = this._position + offset;
                      l.anchor = anchor;
                      if (this._labelRotation){
                          l._rotate = [this._labelRotation, l.x, l.y];
                          l.anchor = ["right", anchor[1]];
                      }
                  }
              }
          } else if (this.channel == "y" || this.channel == "height" || ((this.channel == "distance" || this.channel == "timeline") && (this._orientation == "left" || this._orientation == "right"))) {
              let offset = this._orientation == "left" ? -this._tickSize : this._tickSize;
              let anchor = this._orientation == "left" ? ["right", "middle"] : ["left", "middle"];
              if (this._flip) {
                  for (let [i, l] of this._labels.children.entries()) {
                      l.x = this._position + offset;
                      l.y = this._range[1] + this.encoding.scale.map(this._labelValues[i]);
                      l.anchor = anchor;
                  }
              } else if (this.encoding.invertScale) {
                  for (let [i, l] of this._labels.children.entries()) {
                      l.x = this._position + offset;
                      l.y = this._range[1] - this.encoding.scale.map(this._labelValues[i]) + this.encoding.scale.range[0];
                      l.anchor = anchor;
                  }
              } else {
                  for (let [i, l] of this._labels.children.entries()) {
                      l.x = this._position + offset;
                      l.y = this._range[0] - this.encoding.scale.map(this._labelValues[i]) + this.encoding.scale.range[0];
                      l.anchor = anchor;
                  }
              }
          } 
      }

      _updateTickPositions() {
          if (this._position === undefined)
              this._computePosition();
          this._range = this.encoding.getScaleRange(this._item);

          if (this.channel == "x" || this.channel == "radialDistance" || this.channel == "width" || ((this.channel == "distance" || this.channel == "timeline") && (this._orientation == "top" || this._orientation == "bottom"))) {
              let offset = this._orientation == "bottom" ? this._tickSize : -this._tickSize;
              if (this._flip) {
                  for (let [i, t] of this._ticks.children.entries()) {
                      t._setVertices([
                          [this._range[1] - this.encoding.scale.map(this._tickValues[i]), this._position],
                          [this._range[1] - this.encoding.scale.map(this._tickValues[i]), this._position + offset]
                      ]);
                  }
              } else if (this.encoding.invertScale) {
                  for (let [i, t] of this._ticks.children.entries()) {
                      t._setVertices([
                          [this._range[0] + this.encoding.scale.map(this._tickValues[i]), this._position],
                          [this._range[0] + this.encoding.scale.map(this._tickValues[i]), this._position + offset]
                      ]);
                  }
              } else {
                  for (let [i, t] of this._ticks.children.entries()) {
                      t._setVertices([
                          [this._range[0] + this.encoding.scale.map(this._tickValues[i]) - this.encoding.scale.range[0], this._position],
                          [this._range[0] + this.encoding.scale.map(this._tickValues[i]) - this.encoding.scale.range[0], this._position + offset]
                      ]);
                  }
              }
          } else if (this.channel == "y" || this.channel == "height" || ((this.channel == "distance" || this.channel == "timeline") && (this._orientation == "left" || this._orientation == "right"))) {
              let offset = this._orientation == "left" ? -this._tickSize : this._tickSize;
              if (this._flip) {
                  for (let [i, t] of this._ticks.children.entries()) {
                      t._setVertices([
                          [this._position + offset, this._range[1] + this.encoding.scale.map(this._tickValues[i])],
                          [this._position, this._range[1] + this.encoding.scale.map(this._tickValues[i])]
                      ]);
                  }
              } else if (this.encoding.invertScale) {
                  for (let [i, t] of this._ticks.children.entries()) {
                      let y = this._range[1] - this.encoding.scale.map(this._tickValues[i]) + this.encoding.scale.range[0];
                      //this._range[1] + this.encoding.scale.map(this._tickValues[i])
                      t._setVertices([
                          [this._position + offset, y],
                          [this._position, y]
                      ]);
                  }
              } else {
                  for (let [i, t] of this._ticks.children.entries()) {
                      t._setVertices([
                          [this._position + offset, this._range[0] - this.encoding.scale.map(this._tickValues[i]) + this.encoding.scale.range[0]],
                          [this._position, this._range[0] - this.encoding.scale.map(this._tickValues[i]) + this.encoding.scale.range[0]]
                      ]);
                  }
              }
          }

          let vertices = [];
          if (this.channel == "x" || this.channel == "radialDistance" || this.channel == "width" || ((this.channel == "distance" || this.channel == "timeline") && (this._orientation == "top" || this._orientation == "bottom"))) {
              let tickX = this._ticks.children.map(d => d.vertices[0].x);
              vertices.push([
                  Math.min(...tickX.concat(this._range)),
                  this._position
              ]);
              vertices.push([
                  Math.max(...tickX.concat(this._range)),
                  this._position
              ]);
          } else if (this.channel == "y" || this.channel == "height" || ((this.channel == "distance" || this.channel == "timeline") && (this._orientation == "left" || this._orientation == "right"))) {
              let tickY = this._ticks.children.map(d => d.vertices[0].y);
              vertices.push([
                  this._position,
                  Math.min(...tickY.concat(this._range))
              ]);
              vertices.push([
                  this._position,
                  Math.max(...tickY.concat(this._range))
              ]);
          }
          this._path._setVertices(vertices);
      }

      //TODO: improve efficiency by reusing components
      _updateTicks() {
          this._ticks.removeAll();
          for (let [i, v] of this._tickValues.entries()) {
              let t = new Path$1({"strokeColor": this._strokeColor, "visibility": this._tickVisible});
              t.type = ItemType.Line;
              t.id = this.id + "tick" + i;
              this._ticks.addChild(t);
          }
      }

      //TODO: improve efficiency by reusing components
      _updateLabels() {
          this._labels.removeAll();
          let formatter, fieldType = this.encoding.datatable.getFieldType(this.encoding.field);
          //console.log(this.encoding.field, fieldType);

          switch (fieldType) {
              case DataType.Date:
                  formatter = timeFormat(this._labelFormat);
                  break;
              case DataType.String:
                  formatter = function(d) {return d;};
                  break;
              default:
                  formatter = format(this._labelFormat);
                  break;
          }
          // if (this.encoding.scale.type == "time"){
          //     formatter = d3.timeFormat(this._labelFormat);
          // } else if (this.encoding.scale.type == "linear") {
          //     formatter = d3.format(this._labelFormat);
          // } else {
          //     formatter = 
          // }
          for (let [i, v] of this._labelValues.entries()) {
              let t = new PointText({"text": formatter(v)});
              t.id = this.id + "label" + i;
              this._labels.addChild(t);
          }
      }

  }

  class LayoutAxis extends Group {
      
      constructor(items, layout, channel, field, args) {
          super();
          this.type = ItemType.Axis;
          this.id = this.type + ItemCounter[this.type]++;

          this.channel = channel;
          this._item = items[0];
          this._items = items;
          this._layout = layout;
          this._field = field;
          this._position = this.channel == "x" ? args["y"] : args["x"]; 

          this._strokeColor = args.hasOwnProperty("strokeColor") ? args["strokeColor"] : "#555";
          this._orientation = args["orientation"];
          this._labelFormat = args.hasOwnProperty("labelFormat") ? args["labelFormat"] : "";
          this._tickOffset = args.hasOwnProperty("tickOffset") ? args["tickOffset"] : 0;
          this._tickSize = args.hasOwnProperty("tickSize") ? args["tickSize"] : 5;
          this._labelOffset = args.hasOwnProperty("labelOffset") ? args["labelOffset"] : 15;
          this._tickVisible = args.hasOwnProperty("tickVisible") &&  !args["tickVisible"] ? "hidden" : "visible";
          this._ruleVisible = args.hasOwnProperty("ruleVisible") && !args["ruleVisible"] ? "hidden" : "visible";
          this._tickPosition = args.tickPosition ? args.tickPosition : "middle";
          
          if (args.hasOwnProperty("labelRotation"))
              this._labelRotation = args.labelRotation;

          this._ticks = new Group();
          this._ticks.id = this.id + "ticks";
          this.addChild(this._ticks);

          this._labels = new Group();
          this._labels.id = this.id + "labels";
          this.addChild(this._labels);

          //there can be multiple rules if the layout has multiple rows or columns
          this._rules = new Group();
          this._rules.id = this.id + "paths";
          this.addChild(this._rules);

          this._updateLabels();
          this._updateTicks();
      }

      _updateTicks() {
          let cb = this._layout.cellBounds;

          //update rules
          this._rules.removeAll();
          if (this._layout.type == Layout.Grid) {
              let num = this.channel == "x" ? this._layout.numRows : this._layout.numCols;
              for (let i = 0; i < num; i++) {
                  let t = new Path$1({"strokeColor": this._strokeColor, "visibility": this._ruleVisible});
                  t.type = ItemType.Line;
                  t.id = this.id + "rule" + i;
                  this._rules.addChild(t);
              }

              if (this.channel == "x") {
                  let left = cb[0].left, numCols = this._layout.numCols;
                  for (let r = 0; r < num; r++){
                      this._rules.children[r]._setVertices([
                          [left, this._position ? this._position : cb[r * numCols][this._orientation] ],
                          [left + cb[0].width * numCols + this._layout.hGap * (numCols - 1), this._position ? this._position : cb[r * numCols][this._orientation]]
                      ]);
                  }
              } else {
                  let top = cb[0].top, numRows = this._layout.numRows;
                  for (let c = 0; c < num; c++){
                      this._rules.children[c]._setVertices([
                          [this._position ? this._position : cb[c * numRows][this._orientation], top ],
                          [this._position ? this._position : cb[c * numRows][this._orientation], top + cb[0].height * numRows + this._layout.vGap * (numRows - 1), ]
                      ]);
                  }
              }
          }

          this._ticks.removeAll();
          for (let i = 0; i < cb.length; i++) {
              let t = new Path$1({"strokeColor": this._strokeColor, "visibility": this._tickVisible});
              t.type = ItemType.Line;
              t.id = this.id + "tick" + i;
              this._ticks.addChild(t);
          }

          //compute positions
          if (this.channel == "x") {
              let dir = this._orientation == "bottom" ? 1 : -1;
              for (let [i, t] of this._ticks.children.entries()) {
                  let pos = this._position ? this._position + this._tickOffset * dir : cb[i][this._orientation] + this._tickOffset * dir;
                  t._setVertices([
                      [cb[i].center.x, pos],
                      [cb[i].center.x, pos + dir * this._tickSize]
                  ]);
              }
          } else if (this.channel == "y"){
              let dir = this._orientation == "left" ? -1 : 1;
              //let offset = this._orientation == "left" ? -this._tickOffset : this._tickOffset;
              for (let [i, t] of this._ticks.children.entries()) {
                  let xPos = this._position ? this._position + this._tickOffset * dir : cb[i][this._orientation] + this._tickOffset * dir,
                      yPos = this._tickPosition == "middle" ? cb[i].center.y : cb[i][this._tickPosition];
                  t._setVertices([
                      [xPos, yPos],
                      [xPos + dir * this._tickSize, yPos]
                  ]);
              }
          }
      }

      //TODO: improve efficiency by reusing components
      _updateLabels() {
          this._labels.removeAll();
          let formatter, fieldType = this._item.dataScope.getFieldType(this._field);

          switch (fieldType) {
              case DataType.Date:
                  formatter = timeFormat(this._labelFormat);
                  break;
              case DataType.String:
                  formatter = function(d) {return d;};
                  break;
              default:
                  formatter = format(this._labelFormat);
                  break;
          }
    
          let cb = this._layout.cellBounds;
          for (let i = 0; i < cb.length; i++) {
              let t = new PointText({"text": formatter(this._items[i].dataScope.getFieldValue(this._field))});
              t.id = this.id + "label" + i;
              this._labels.addChild(t);
          }

          //compute positions
          if (this.channel == "x") {
              let anchor = this._orientation == "bottom" ? ["center", "top"] : ["center", "bottom"],
                  offset = this._orientation == "bottom" ? this._labelOffset : -this._labelOffset;
              for (let [i, l] of this._labels.children.entries()) {
                  l.x = cb[i].center.x;
                  l.y = this._position ? this._position + offset : cb[i][this._orientation] + offset;
                  l.anchor = anchor;
                  if (this._labelRotation){
                      l._rotate = [this._labelRotation, l.x, l.y];
                      l.anchor = ["right", anchor[1]];
                  }
                      
              }
          } else if (this.channel == "y"){
              let anchor = this._orientation == "left" ? ["right", "middle"] : ["left", "middle"],
                  offset = this._orientation == "left" ? - this._labelOffset : this._labelOffset;
              for (let [i, l] of this._labels.children.entries()) {
                  l.x = this._position ? this._position + offset : cb[i][this._orientation] + offset;
                  l.y = this._tickPosition == "middle" ? cb[i].center.y : cb[i][this._tickPosition];
                  l.anchor = anchor;
                  if (this._labelRotation) {
                      l._rotate = [this._labelRotation, l.x, l.y];
                  }
              }
          }
          
      }
  }

  class Gradient {
  	
  	constructor() {
  		this._stops = [];
          this.type = ItemType.LinearGradient ; //"radial"
          this.id = this.type + ItemCounter[this.type]++;
  	}

      addStop(offset, color, opacity) {
          this._stops.push({offset: offset, color: color, opacity: opacity});
      }

      get stops() {
          return this._stops;
      }

  }

  class Legend extends Group {

      constructor(encoding, args) {
          super();
          this.type = ItemType.Legend;
          this.id = this.type + ItemCounter[this.type]++;
          this.encoding = encoding;
          this._x = args["x"];
          this._y = args["y"];
          this._initialize();
      }

      _initialize() {
          let scene = this.encoding.scene, f = this.encoding.field;
          switch (this.encoding.datatable.getFieldType(f)) {
              case DataType.String:
                  this._createCategoricalColorLegend(scene, f);
                  break;
              case DataType.Number:
              case DataType.Integer:
                  this._createNumericalColorLegend(scene, f);
                  break;
          }
      }

      _createNumericalColorLegend(scene, f) {
          let wd = 15, ht = 300;
          let title = scene.mark("text", {"text": f, "position": [this._x + wd/2, this._y], "anchor": ["center", "middle"]});
          this.addChild(title);
          let rect = scene.mark("rectangle", {"top": this._y + 20, "left": this._x, "width": wd, "height": ht, "strokeWidth": 0});
          let domain = [Math.min(...this.encoding.data), Math.max(...this.encoding.data)], mapping = this.encoding.mapping, scheme = this.encoding.scheme;
          let gradient = new Gradient();
          let texts = [], ticks = [], offset = 5, tickSize = 5;
          if (mapping) {
              let values = Object.keys(mapping).map(d => parseFloat(d)).sort((a,b) => a - b);
              values.forEach(d => {
                  let p = (d - domain[0])/(domain[1] - domain[0]);
                  gradient.addStop(p*100, mapping[d], 1.0);
                  let tk = scene.mark("line", {"x1": this._x - tickSize, "x2": this._x + wd + tickSize, "y1": this._y + 20 + ht - p * ht, "y2": this._y + 20 + ht - p * ht, "strokeColor": "#555"});
                  ticks.push(tk);
                  let t = scene.mark("text", {"text": d, "position": [this._x + wd + offset + tickSize, this._y + 20 + ht - p * ht], "anchor": ["left", "middle"]});
                  texts.push(t);
              });
          } else if (scheme) {
              console.log(this.encoding.scale.domain, this.encoding.scale.range);
          }
          rect.styles.fillColor = gradient;

          this.addChild(rect);
          for (let t of texts)
              this.addChild(t);
          for (let tk of ticks)
              this.addChild(tk);
      }

      _createCategoricalColorLegend(scene, f) {
          this.addChild(new PointText({"text": f, "position": [this._x, this._y], "anchor": ["left", "hanging"]}));        
          let rect = scene.mark("rectangle", {"top": this._y + 25, "left": this._x, "width": 10, "height": 10, "strokeWidth": 0});
          let text = scene.mark("text", {"position": [this._x + 20, this._y + 25], "anchor": ["left", "hanging"]});
          let glyph = scene.glyph(rect, text);
          let coll = scene.repeat(glyph, this.encoding.datatable, {"field": f});
          coll.layout = layout("grid", {"numCols": 1, "vGap": 8});
          scene.encode(text, {"channel": "text", "field": f});
          scene.encode(rect, {"channel": "fillColor", "field": f, "scale": this.encoding.scale});
          this.addChild(coll);
      }

  }

  //a glyph is a composite mark

  class Glyph extends Group {
  	
  	constructor(args) {
  		super();
  		this.type = ItemType.Glyph;
  		this.id = this.type + ItemCounter[this.type]++;
  		if (args){
  			for (let a of args){
  				this.addChild(a);
  			}
  		}
  	}

  	duplicate() {
  		let scene = this.getScene();

  		let g = new Glyph();
  		for (let c of this.children){
  			g.addChild(c.duplicate());
  		}

  		g.classId = this.classId;
  		//g._matrix = this._matrix.clone();
  		if (this._dataScope) {
  			g.dataScope = this._dataScope.clone();
  		}
  		return g;
  	}
  }

  class PiePath extends Path$1 {
  	
  	constructor(args) {
  		super(args);
        
        // Instrinsic values for pie path
        this.radius = args['radius'];
  		this.totalAng = args['totalAng'];
  		this.startAngleDeg = (args['startAngleDeg'] + 90) % 360;
  		this.startAngleRad = args['startAngleRad'];
  		this.endAngleDeg = (args['endAngleDeg'] + 90) % 360;
  		this.endAngleRad = args['endAngleRad'];

  		// Other values
  		this.type = ItemType.Pie;
  		this.closed = true;
  	}

  	get cx() {
  		return this.vertices[0].x;
  	}

  	get cy() {
  		return this.vertices[0].y;
  	}

  	get center() {
  		return new Point$1(this.cx, this.cy);
  	}

  	// returns an array: [start quadrant, end quadrant]
  	get quadrants(){
  		let quads = [];

  		// Find which quadrant it starts in
  		if (this.startAngleDeg >= 0 && this.startAngleDeg < 90) {
  			// This starts in quadrant 1
  			quads[0] = 1;
  		} else if (this.startAngleDeg >= 90 && this.startAngleDeg < 180){
  			// This starts in quadrant 2
  			quads[0] = 2;
  		} else if (this.startAngleDeg >= 180 && this.startAngleDeg < 270){
  			// This starts in quadrant 3
  			quads[0] = 3;
  		} else if (this.startAngleDeg >= 270 && this.startAngleDeg <= 360){
  			// This starts in quadrant 4
  			quads[0] = 4;
  		}

  		// Find which quadrant it ends in
  		if (this.endAngleDeg >= 0 && this.endAngleDeg < 90) {
  			// This starts in quadrant 1
  			quads[1] = 1;
  		} else if (this.endAngleDeg >= 90 && this.endAngleDeg < 180){
  			// This starts in quadrant 2
  			quads[1] = 2;
  		} else if (this.endAngleDeg >= 180 && this.endAngleDeg < 270){
  			// This starts in quadrant 3
  			quads[1] = 3;
  		} else if (this.endAngleDeg >= 270 && this.endAngleDeg < 360){
  			// This starts in quadrant 4
  			quads[1] = 4;
  		}

  		return quads
  	}

  	// Creates SVG path literal for pies
  	getSVGPathData() {
  		let [[x1, y1], [x2, y2], [x3, y3]] = this.vertices.map((v) => [v.x, v.y]);
  		let r = this.radius;
  		let path = `M ${x1} ${y1} L ${x2} ${y2} A ${r} ${r} 0 ${this.totalAng > 180 ? 1 : 0} 1 ${x3} ${y3} Z`;
  		return path;
  	}

  	// Adjust angle
  	adjustAngle(startAngle, angle) {
  		// Calc vertices to the new start angle
  		let st = (startAngle - 90) % 360;
  		let end = (startAngle + angle - 90) % 360;

  		// Convert to radians for trig
  		let stRad = st * (Math.PI / 180);
  		let endRad = end * (Math.PI / 180);

  		let startVertex = [this.radius * Math.cos(stRad) + this.cx, this.radius * Math.sin(stRad) + this.cy];
  		let endVertex = [this.radius * Math.cos(endRad) + this.cx, this.radius * Math.sin(endRad) + this.cy];

  		// Update object
  		this.vertices[1] = new Point$1(...startVertex);
  		this.vertices[2] = new Point$1(...endVertex);
  		this.totalAng = angle;

  		return startAngle + angle
  	}

  	// Overload this method to correctly calculate bounds for pies
  	_updateBounds() {
  		let vx = this.vertices.map(d => d.x),
  			vy = this.vertices.map(d => d.y);


  		// Algorithm
  		/**
  		 * First determine which quadrants this pie starts and ends
  		 * With this, we can determine which vertices are the bounds
  		 * 
  		 */
  		// console.log(this, this.startAngleDeg, this.endAngleDeg, this.quadrants)
  		const [stQ, endQ] = this.quadrants;
  		const startVertex = this.vertices[1];
  		const endVertex = this.vertices[2];

  		let radiusVertex = this.vertices[0];
  		let currTop = radiusVertex.y;
  		let currRight = radiusVertex.x;
  		let currLeft = radiusVertex.x;
  		let currBtm = radiusVertex.y;

  		// Go through each quadrant
  		if (stQ === 1){
  			if (startVertex.x > currRight){
  				currRight = startVertex.x;
  			}
  			if (startVertex.y < currTop){
  				currTop = startVertex.y;
  			}

  		} else if (stQ === 2){
  			if (startVertex.x > currRight){
  				currRight = startVertex.x;
  			}
  			if (startVertex.y > currBtm){
  				currBtm = startVertex.y;
  			}
  		} else if (stQ === 3) {
  			if (startVertex.x < currLeft){
  				currLeft = startVertex.x;
  			}
  			if (startVertex.y > currBtm){
  				currBtm = startVertex.y;
  			}
  		} else {
  			if (startVertex.x < currLeft){
  				currLeft = startVertex.x;
  			}
  			if (startVertex.y < currTop){
  				currTop = startVertex.y;
  			}
  		}

  		// Go through each quadrant
  		if (endQ === 1){
  			if (endVertex.x > currRight){
  				currRight = endVertex.x;
  			}
  			if (endVertex.y < currTop){
  				currTop = endVertex.y;
  			}
  		} else if (endQ === 2){
  			if (endVertex.x > currRight){
  				currRight = endVertex.x;
  			}
  			if (endVertex.y > currBtm){
  				currBtm = endVertex.y;
  			}
  		} else if (endQ === 3) {
  			if (endVertex.x < currLeft){
  				currLeft = endVertex.x;
  			}
  			if (endVertex.y > currBtm){
  				currBtm = endVertex.y;
  			}
  		} else {
  			if (endVertex.x < currLeft){
  				currLeft = endVertex.x;
  			}
  			if (endVertex.y < currTop){
  				currTop = endVertex.y;
  			}
  		}

  		// Check if the edge of the circle is better
  		if (radiusVertex.y - this.radius < currTop){
  			currTop = radiusVertex.y - this.radius;
  		}
  		
  		if (radiusVertex.y + this.radius > currBtm) {
  			currBtm = radiusVertex.y + this.radius;
  		}

  		if (radiusVertex.x + this.radius > currRight) {
  			currRight = radiusVertex.x + this.radius;
  		}

  		if (radiusVertex.x - this.radius < currLeft){
  			currLeft = radiusVertex.x - this.radius;
  		}

  		// console.log(currTop, currLeft, currBtm, currRight)

  		this._bounds = new Rectangle(currLeft, currTop, currRight - currLeft, currBtm - currTop);
  	}
  }

  class AreaPath extends Path$1 {
  	
  	constructor(args) {
  		super(args);
  		
  		this.type = ItemType.Area;
  		this.closed = true;

  		//add last segment to close the path
  		if (args && args.hasOwnProperty("vertices"))
  			this.segments.push(new Segment(this.vertices[this.vertices.length-1], this.vertices[0], this, this.segmentCounter++));
  	}

  	get width() {
  		return this.vertices[this.vertices.length/2].x - this.vertices[0].x;
  	}

  	get height() {
  		return this.vertices[this.vertices.length/2].y - this.vertices[0].y;
  	}

  	get left() {
  		return this.vertices[0].x;
  	}

  	get top() {
  		return this.vertices[0].y;
  	}

  	resizeArea(wd, ht) {
  		let x1 = this.vertices[this.vertices.length/2].x,
  			y1 = this.vertices[this.vertices.length/2].y,
  			// x2 = this.vertices[this.vertices.length - 1].x,
  			// y2 = this.vertices[this.vertices.length - 1].y,
  			width = this.width,
  			height = this.height;
  		for (let v of this.vertices) {
  			v.x = x1 + (wd/width) * (v.x - x1);
  			v.y = y1 + (ht/height) * (v.y - y1);
  		}
  		this._updateBounds();
  	}

  	getSVGPathData() {
  		return super.getSVGPathData() + " " + 'z';
  	}
  }

  class PolygonPath extends Path$1 {

      constructor(args) {
          super(args);
          this.type = ItemType.Polygon;
          this.closed = true;

          if (args.hasOwnProperty("cx"))
              this._cx = args.cx;
          if (args.hasOwnProperty("cy"))
              this._cy = args.cy;
          if (args.hasOwnProperty("radius"))
              this._radius = args.radius;
      }        

      get radius() {
  		return this._radius;
  	}

  	get cx() {
  		return this._cx;
  	}

  	get cy() {
  		return this._cy;
  	}

  	get center() {
  		return new Point(this._cx, this._cy);
  	}

      set cx(v) {
  		this._cx = v;
  		this._updateBounds();
  	}

  	set cy(v) {
  		this._cy = v;
  		this._updateBounds();
  	}

  	set radius(r) {
  		this._radius = r;
  		this._updateBounds();
  	}

      copyPropertiesTo(target) {
  		super.copyPropertiesTo(target);
  		target._cx = this._cx;
  		target._cy = this._cy;
  		target._radius = this._radius;
  	}

      translate(dx, dy) {
  		this._cx += dx;
  		this._cy += dy;
          super.translate(dx, dy);
  	}


  }

  class AlignConstraint {

      constructor(items, d) {
          //TODO: check if d is a value in the Alignment (refer to const Alignment in Constants.js)
          //if not, throw a new error (add an error type in Errors, also defined in Constants.js)

          this.direction = d;
          this.items = items;
          this.type = "alignment";
          this.id = this.type + "_" + [...new Set(this.items.map(d => d.classId))].join("_");
      }

      apply() {
          let baseline, dir = this.direction; 
          if (this.direction == Alignment.Top || this.direction == Alignment.Left)
              baseline = Math.min(...this.items.map(d => d.bounds[dir]));
          else if ((this.direction == Alignment.Bottom || this.direction == Alignment.Right))
              baseline = Math.max(...this.items.map(d => d.bounds[dir]));
          
          let delta = this.items.map(d => baseline - d.bounds[dir]),
              axis = dir == Alignment.TOP || dir == Alignment.Middle || dir == Alignment.Bottom ? "y" : "x";

          this.items.forEach((d,i) => {
              if (d.parent && d.parent.layout && d.parent.layout.type == Layout.Stack){
                  let dx = axis == "x" ? delta[i] : 0,
                      dy = axis == "y" ? delta[i] : 0;
                  d.parent.translate(dx, dy);
              }
          });
      }
  }

  class AffixConstraint {

      constructor(item, baseItem, scene, channel, itemAnchor, baseAnchor, offset) {
          this.item = item;
          this.baseItem = baseItem;
          this.scene = scene;
          this.channel = channel;
          this.itemAnchor = itemAnchor;
          this.baseAnchor = baseAnchor;
          this.offset = offset;
          this.type = "affixation";
          this.id = this.type + "_" + this.item.classId + "_" + this.baseItem.classId + "_" + channel;
      }

      apply() {
          let items = getPeers(this.item, this.scene), baseItems = getPeers(this.baseItem, this.scene);
          let ia = this.itemAnchor == "center" ? "cx" : this.itemAnchor == "middle" ? "cy" : this.itemAnchor,
              ba = this.baseAnchor == "center" ? "cx" : this.baseAnchor == "middle" ? "cy" : this.baseAnchor;
          let isText = this.item.type == ItemType.PointText ? true : false;
          for (let i = 0; i < items.length; i++) {
              if (isText) {
                  items[i].anchor[this.channel == "x" ? 0 : 1] = this.itemAnchor;
                  let p = baseItems[i].bounds[ba] + this.offset;
                  items[i][this.channel] = p;
              } else {
                  let d = baseItems[i].bounds[ba] + this.offset - items[i].bounds[ia];
                  if (this.channel == "x")
                      items[i].translate(d, 0);
                  else
                      items[i].translate(0, d);
              }
          }
      }
  }

  class Gridlines extends Group {

      constructor(encoding, item, args) {
          super();
          this.type = ItemType.Gridlines;
          this.id = this.type + ItemCounter[this.type]++;

          this.encoding = encoding;
          this.channel = this.encoding.channel;
          this._item = item;

          this._strokeColor = args.hasOwnProperty("strokeColor") ? args["strokeColor"] : "#ddd";

          this._orientation = args["orientation"];
          this._position = this.channel == "x" || this.channel == "width" || ((this.channel == "distance" || this.channel == "timeline") && (this._orientation == "top" || this._orientation == "bottom"))? args["y-coordinate"] : args["x-coordinate"]; 
          
          if (this.channel == "radialDistance"){
              this._position = this._item.parent.cy;
              if(args.hasOwnProperty("angle")){
                  this._rotate = [-args["angle"], this.encoding.cx, this.encoding.cy];
              }
          }
      }

      set values(values) {
          this._values = values;
          this._updateLines();
          this._updateLinePositions();
      }

      _updateLinePositions() {
          if (this.channel == "x") {
              let bounds = getTopLevelGroup(this._item).bounds,
                  range = this.encoding.getScaleRange(this._item);
              for (let [i, l] of this.children.entries()) {
                  let x = range[0] + this.encoding.scale.map(this._values[i]) - this.encoding.scale.range[0];
                  l._setVertices([[x, bounds.top], [x, bounds.bottom]]);
              }
          } else if (this.channel == "y") {
              let bounds = getTopLevelGroup(this._item).bounds,
              range = this.encoding.getScaleRange(this._item);
              if (this.encoding.invertScale) {
                  for (let [i, l] of this.children.entries()) {
                      let y = range[1] - this.encoding.scale.map(this._values[i]) + this.encoding.scale.range[0];
                      //range[1] + this.encoding.scale.map(this._values[i]);
                      l._setVertices([[bounds.left, y], [bounds.right, y]]);
                  }
              } else {
                  for (let [i, l] of this.children.entries()) {
                      let y = range[0] - this.encoding.scale.map(this._values[i]) + this.encoding.scale.range[0];
                      l._setVertices([[bounds.left, y], [bounds.right, y]]);
                  }
              }
          } else if (this.channel == "radialDistance") {
              for (let [i, c] of this.children.entries()) {
                  c.cx = this._item.parent.cx;
                  c.cy = this._item.parent.cy;
                  c.radius = this.encoding.scale.map(this._values[i]);
              }
          }
      }

      _updateLines() {
          this.children = [];
          if (this.channel == "x" || this.channel == "y") {
              for (let [i, v] of this._values.entries()) {
                  let t = new Path$1 ({"strokeColor": this._strokeColor, "fillColor": "none"});
                  t.type = ItemType.Line;
                  t.id = this.id + "line" + i;
                  this.addChild(t);
              }
          } else if (this.channel == "radialDistance") {
              for (let [i, v] of this._values.entries()) {
                  let t = new CirclePath({"strokeColor": this._strokeColor, "fillColor": "none"});
                  t.type = ItemType.Circle;
                  t.id = this.id + "line" + i;
                  this.addChild(t);
              }
          }
      }

  }

  class Scene extends Group{

  	constructor(){
  		super();
  		this.type = ItemType.Scene;
  		this.id = this.type + ItemCounter[this.type]++;
  		//this.cellAlign = {};
  		this.encodings = {};
  		this.constraints = {};
  	}

  	createGroup() {
  		let g = new Group();
  		g.classId = g.id;
  		this.addChild(g);
  		return g;
  	}

  	mark(type, param) {
  		let args = param === undefined ?  {} : param;
  		switch(type) {
  			case ItemType.Rect:
  			case ItemType.Rectangle: {
  				if (args !== undefined && args.hasOwnProperty("top") && args.hasOwnProperty("left")  && 
  						args.hasOwnProperty("width") && args.hasOwnProperty("height")) {
  					let top = args["top"], left = args["left"], width = args["width"], height = args["height"];
  					args.vertices = [[left, top], [left + width, top], [left + width, top + height], [left, top + height]];
  					delete args["top"];
  					delete args["left"];
  					delete args["width"];
  					delete args["height"];
  				}
  				let r = new RectPath(args);
  				r.id = r.type + ItemCounter[r.type]++;
  				r.classId = r.id;
  				this.addChild(r);
  				return r;
  			}
  			case ItemType.Area: {
  				//initial an area with four vertices
  				if (args !== undefined && args.hasOwnProperty("x1") && args.hasOwnProperty("y1")  && args.hasOwnProperty("x2") && args.hasOwnProperty("y2")) {
  					let x1 = args["x1"], y1 = args["y1"], x2 = args["x2"], y2 = args["y2"];
  					// args.vertices contains all the vertices on two boundary lines
  					args.vertices = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
  					// args.boundaries = [[[x1, y1], [x2, y1]], [[x1, y2], [x2, y2]]];
  					//remove x1, y1, x2, y2 and compute these values at rendering time 
  					//so that we don't have to keep track of them when the area is transformed
  					delete args["x1"];
  					delete args["y1"];
  					delete args["x2"];
  					delete args["y2"];
  				}
  				let a = new AreaPath(args);
  				// a.type = ItemType.Area;
  				a.id = a.type + ItemCounter[type]++;
  				a.classId = a.id;
  				this.addChild(a);
  				return a;
  			}
  			case ItemType.Line: {
  				//it is possible to create a skeleton line without x1, y1, x2, y2 args, e.g. when duplicating
  				if (args !== undefined && args.hasOwnProperty("x1") && args.hasOwnProperty("y1")  && args.hasOwnProperty("x2") && args.hasOwnProperty("y2")) {
  					let x1 = args["x1"], y1 = args["y1"], x2 = args["x2"], y2 = args["y2"];
  					args.vertices = [[x1, y1], [x2, y2]];
  					//remove x1, y1, x2, y2 and compute these values at rendering time 
  					//so that we don't have to keep track of them when the line is transformed
  					delete args["x1"];
  					delete args["y1"];
  					delete args["x2"];
  					delete args["y2"];
  				}
  				let l = new Path$1(args);
  				l.type = ItemType.Line;
  				l.id = l.type + ItemCounter[type]++;
  				l.classId = l.id;
  				this.addChild(l);
  				return l;
  			}
  			case ItemType.Path:{ 
  				let p = new Path$1(args);
  				p.id = p.type + ItemCounter[type]++;
  				this.addChild(p);
  				p.classId = p.id;
  				return p;
  			}
  			case ItemType.Circle: {
  				let c = new CirclePath(args);
  				c.id = c.type + ItemCounter[type]++;
  				c.classId = c.id;
  				this.addChild(c);
  				return c;
  			}
  			case ItemType.Polygon:
  				let pg = new PolygonPath(args);
  				pg.id = pg.type + ItemCounter[type]++;
  				pg.classId = pg.id;
  				this.addChild(pg);
  				return pg;
  			case ItemType.Pie: {
  				// Label three vertices used for pie
  				let r = args['radius'];
  				let cx = args['cx'];
  				let cy = args['cy'];
  				let v1 = [cx, cy];

  				// Rotate angles so 0 is vertical (mod to make calc easier)
  				let stDeg = (args['startAng'] - 90) % 360;
  				let endDeg = (args['endAng'] - 90) % 360;
  				args['totalAng'] = endDeg - stDeg;
  				// Add some args
  				args['startAngleDeg'] = stDeg;
  				args['endAngleDeg'] = endDeg;
  				
  				// Convert to radians for the trig functions
  				let stRad = stDeg * (Math.PI / 180);
  				let endRad = endDeg * (Math.PI / 180);
  				args['startAngleRad'] = stRad;
  				args['endAngleRad'] = endDeg;

  				// Calculate vertices
  				let v2 = [r * Math.cos(stRad) + cx, r * Math.sin(stRad) + cy];
  				let v3 = [r * Math.cos(endRad) + cx, r * Math.sin(endRad) + cy];
  				args.vertices = new Array(v1, v2, v3);			

  				// Create Pie Path object
  				let pie = new PiePath(args);
  				pie.id = pie.type + ItemCounter[type]++;
  				pie.classId = pie.id;
  				this.addChild(pie);
  				return pie;
  			}
  			case "text":
  			case ItemType.PointText:
  				if (!args.hasOwnProperty("anchor"))
  					args["anchor"] = ["middle", "central"];
  				let t = new PointText(args);
  				t.id = t.type + ItemCounter[t.type]++;
  				t.classId = t.id;
  				this.addChild(t);
  				return t;
  			default:
  				return null;
  		}

  	}

  	glyph(...args){
  		let g = new Glyph(args);
  		g.classId = g.id;
  		this.addChild(g);
  		return g;
  	}

  	repeat(item, table, param) {

  		if (!item || table === undefined){
  			throw Errors$1.INCOMPLETE_REPEAT_INFO;
  		}

  		let args = param ? param : {},
  			field = args["field"] ? args["field"] : DataTable.RowID,
  			callback = args["callback"];

  		validateField(field, table);

  		let collection = repeatItem(this, item, field, table, callback);
  		return collection;
  	}

  	densify(item, table, param) {
  		if (!item || table === undefined){
  			throw Errors$1.INCOMPLETE_PARTITION_INFO;
  		}

  		let args = param ? param : {}, 
  			orientation = args["orientation"],
  			field = args["field"] ? args["field"] : DataTable.RowID,
  			//following two are for circle densification
  			startAngle = args.hasOwnProperty("startAngle") ? args["startAngle"] : 90,
  			direction = args.hasOwnProperty('direction') ? args["direction"] : "clockwise",
  			callback = args["callback"];

  		validateField(field, table);
  				
  		let collection = densifyItem(this, item, orientation, field, table, callback, startAngle, direction);
  		return collection;
  	}

  	divide(item, table, param) {
  		if (!item || table == undefined){
  			throw Errors$1.INCOMPLETE_PARTITION_INFO;
  		}

  		let args = param ? param : {},
  			orientation = args["orientation"],
  			field = args["field"] ? args["field"] : DataTable.RowID,
  			callback = args["callback"];

  		validateField(field, table);
  				
  		let collection = divideItem(this, item, orientation, field, table, callback);
  		return collection;
  	}

  	_validateEncodeArgs(item, args) {
  		if (!item || !args.hasOwnProperty("channel") || !args.hasOwnProperty("field")) {
  			throw Errors$1.INCOMPLETE_BINDING_INFO;
  		}

  		let channel = args["channel"], 
  			field = args["field"], 
  			options = args["options"];

  		//check if can apply encoding
  		if (item.type == "vertex" || item.type == "segment") {
  			if (!item.parent.dataScope && !item.dataScope) {
  				throw Errors$1.BIND_WITHOUT_DATASCOPE;
  			}
  		} else if (!item.dataScope) {
  			throw Errors$1.BIND_WITHOUT_DATASCOPE;
  		}
  		

  		let datatable = args.table ? args.table : item.dataScope ? item.dataScope._dt : item.parent.dataScope._dt;

  		validateField(field, datatable);
  		//todo: validate channel
  	}

  	_doEncode(items, args) {

  		let item = items[0],
  			channel = args["channel"],
  			field = args["field"];
  		
  		if (!args.hasOwnProperty("datatable"))
  			args.datatable = item.dataScope ? item.dataScope._dt : item.parent.dataScope._dt;
  		if (!args.hasOwnProperty("aggregator"))
  			args.aggregator = "sum";
  		if (!args.hasOwnProperty("invertScale"))
  			args.invertScale = false;
  		if (!args.hasOwnProperty("startFromZero"))
  			args.startFromZero = false;
  			
  			// datatable = args.datatable ? args.datatable : item.dataScope ? item.dataScope._dt : item.parent.dataScope._dt,
  			// aggregator = args.aggregator ? args.aggregator : "sum",
  			// scale = args.scale ? args.scale : undefined,
  			// callback = args.callback ? args.callback : undefined,
  			// invert = args.hasOwnProperty("invertScale") ? args.invertScale : false,
  			// startFromZero = args.hasOwnProperty("startFromZero") ? args.startFromZero : false,
  			// mapping = args.hasOwnProperty("mapping") ? args.mapping : undefined,
  			// rangeExtent = args.hasOwnProperty("rangeExtent") ? args.rangeExtent : undefined;

  		let encoding = new Encoding(items, this, channel, field, args);

  		switch (channel) {
  			case "width":
  			case "height":
  			case "radius":
  			case "area":
  			case "fontSize":
  				if (item.type == ItemType.Area)
  					bindToArea(encoding);
  				else
  					bindToSize(encoding);
  				break;
  			case "x":
  			case "y":
  				if (item.type == ItemType.Area)
  					bindToArea(encoding);
  				else
  					bindToPosition(encoding);
  				break;
  			case "fillColor":
  			case "strokeColor":
  				bindToColor(encoding);
  				break;
  			case "angle":
  				bindToAngle(encoding);
  				break;
  			case "text":
  				bindToText(encoding);
  				break;
  			case "radialDistance":
  				encoding.cx = item.parent.cx;
  				encoding.cy = item.parent.cy;
  				encoding.radius = item.parent.radius;
  				bindToRadialDistance(encoding);
  				break;
  		}

  		this._registerBinding(encoding);

  		if (channel.indexOf("Color") < 0)
  			this._updateAncestorBounds(item, encoding.items);

  		return encoding;
  	}

  	encodeWithinCollection(item, args) {
  		this._validateEncodeArgs(item, args);
  		let peersByGroup = getPeersGroupedByParent(item, this);
  		let encs = [];
  		for (let g of peersByGroup) {
  			let enc = this._doEncode(g, args);
  			encs.push(enc);
  		}
  		return encs;
  	}

  	find(predicates) {
  		let body = [];
  		for (let p of predicates) {
  			if (p.hasOwnProperty("field")) {
  				if (p.hasOwnProperty("value"))
  					body.push("d.dataScope && d.dataScope.getFieldValue('" + p["field"] + "') == '" + p["value"] + "'");
  				else if (p.hasOwnProperty("range"))
  					body.push("d.dataScope && d.dataScope." + p["field"] + " >= " + p["range"][0] + " && " + "d.dataScope." + p["field"] + " <= " + p["range"][1]);
  			} else if (p.hasOwnProperty("channel")) ; else if (p.hasOwnProperty("type")) {
  				body.push("d.type=='" + p["type"] + "'");
  			}
  		}
  		return findItems(this, new Function("d", "return " + body.join(" && ")));
  	}


  	encode(item, args) {
  		this._validateEncodeArgs(item, args);
  		let items = getPeers(item, this);
  		return this._doEncode(items, args);
  	}

  	align(items, direction) {
  		//TODO: check the existing constraints and encodings and see if there's any conflict
  		//if so, do nothing and return false
  		if (!canAlign(items, direction, this)) return false;
  		let c = new AlignConstraint(items, direction);
  		if (this.constraints.hasOwnProperty(c.id)){
  			console.warn('constraint has been added');
  			return false;
  		}
  		this.constraints[c.id] = c;
  		c.apply();
  		this._updateAncestorBounds(items[0]);
  	}

  	alignInCell(item, direction) {
  		//TO replace grid.vertCellAlignment and grid.horzCellAlignment
  	}

  	affix(item, baseItem, channel, param) {
  		let args = param ? param : {},
  			offset = args.hasOwnProperty("offset") ? args.offset : 0,
  			itemAnchor = args.hasOwnProperty("itemAnchor") ? args.itemAnchor : channel == "x" ? "center" : "middle",
  			baseAnchor = args.hasOwnProperty("baseAnchor") ? args.baseAnchor : channel == "x" ? "center" : "middle";
  		let c = new AffixConstraint(item, baseItem, this, channel, itemAnchor, baseAnchor, offset);
  		if (this.constraints.hasOwnProperty(c.id));
  		this.constraints[c.id] = c;
  		c.apply();
  	}

  	//arguments include a channel (x, y, width, height for now)
  	//optional arguments include orientation, x-coordinate, y-coordinate, tickFormat, strokeColor, 
  	axis(channel, field, params) {
  		//need to figure out if item has the corresponding encoding, or if item position is determined by layout
  		let enc = this.getEncodingByField(field, channel), args = params ? params : {};
  		if (enc) {
  			let axis = new EncodingAxis(enc, args.item? args.item : enc.anyItem, args);
  			if (args.hasOwnProperty("ticks")) {
  				axis.tickValues = args["ticks"];
  				axis.labelValues = args["ticks"];
  			} else {
  				axis.tickValues = this._inferTickValues(enc);
  				axis.labelValues = this._inferTickValues(enc);
  			}
  			
  			this.addChildAt(axis, 0);
  			return axis;
  		} 
  		
  		//TODO: find out item from the field
  		let item = findItems(this, d => d.dataScope && d.dataScope.hasField(field))[0];
  		if (item === undefined) {
  			throw Errors$1.INCORRECT_AXIS_INFO + field;
  		}

  		let layout = getClosestLayout(item);
  		if (layout && (channel == "x" || channel == "y")) {
  			let collection = layout.collection,
  				collections = getPeers(collection, this);
  			let axis;
  			for (let c of collections) {
  				let itm = findItems(c, d => d.dataScope && d.dataScope.hasField(field))[0];
  				let items = getPeers(itm, c);
  				axis = new LayoutAxis(items, c.layout, channel, field, args);
  				this.addChildAt(axis, 0);
  			}
  			return axis;
  		} else {
  			throw Errors$1.INCORRECT_AXIS_INFO + field;
  		}

  	}

  	legend(channel, field, args){
  		let enc = this.getEncodingByField(field, channel);
  		if (!enc)
  			throw Errors$1.INCORRECT_LEGEND_INFO + field;
  		// let ft = enc.datatable.getFieldType(field);
  		// if (ft == DataType.Integer || ft == DataType.Number)
  		// 	throw Errors.INCORRECT_LEGEND_INFO + field;
  		if (!args.hasOwnProperty("x"))
  			args["x"] = 100;
  		if (!args.hasOwnProperty("y"))
  			args["y"] = 100;
  		let legend = new Legend(enc, args);
  		this.addChild(legend);
  	}

  	gridlines(channel, field, params){
  		let enc = this.getEncodingByField(field, channel), args = params ? params : {};
  		if (!enc) return false;
  		let gl = new Gridlines(enc, enc.anyItem, args);
  		
  		if (args.hasOwnProperty("values")) {
  			gl.values = args["values"];
  		} else {
  			gl.values = this._inferTickValues(enc);
  		}
  		
  		this.addChildAt(gl, 0);
  		return gl;
  	}

  	_inferTickValues(enc) {
  		let domain = enc.scale.domain, range = enc.scale.range;
  		let minPxInterval;
  		//let minTickIntervalPx = 40, minLabelIntervalPx = 80;
  		switch (enc.scale.type) {
  			case "linear":
  				//handle the case where the marks are stacked
  				let r = Math.abs(range[0] - range[1]);
  				if (enc.channel == "width" || enc.channel == "height") {
  					let layout = getClosestLayout(enc.anyItem);
  					if (layout && layout.type == Layout.Stack) {
  						let c = layout.collection, colls = getPeers(c, enc.scene);
  						r = Math.max(...colls.map(d => d.bounds[enc.channel]));
  						domain[1] = Math.ceil(enc.scale.invert(r));
  					}
  				}
  				minPxInterval = enc.channel == "width" || enc.channel == "x" ? 45 : 30;
  				let n = Math.floor(r/minPxInterval), step = tickStep(domain[0], domain[1], n);
  				//let n = 10;
  				let ticks$1 = ticks(domain[0], domain[1], n);
  				return ticks$1; 
  			case "point":
  				minPxInterval = enc.channel == "width" || enc.channel == "x" ? 80 : 30;
  				let domainValueIntervalPx = Math.floor(enc.scale.rangeExtent/domain.length);
  				let m = Math.ceil(minPxInterval/domainValueIntervalPx);
  				return enc.channel == "x" ? domain.filter((d, i) => i % m == 0) : domain;
  			case "time":
  				minPxInterval = enc.channel == "width" || enc.channel == "x" ? 80 : 30;
  				let numIntervals = Math.floor((range[1] - range[0])/minPxInterval),
  					timeInterval = Math.ceil( (domain[1] - domain[0])/numIntervals )/1000;
  				// let numTickIntervals = Math.floor((range[1] - range[0])/minTickIntervalPx),
  				// 	tickTimeInterval = Math.ceil( (domain[1] - domain[0])/numTickIntervals )/1000;

  				let units = [1, 60, 3600, 86400, 2628003, 31536000],
  					intervals = [seconds, minutes, hours, days, months, years];

  				let tn, tInterval;
  				for (let i = 0; i < units.length - 1; i++) {
  					if (timeInterval >= units[i] && timeInterval < units[i+1]) {
  						tn = Math.floor(timeInterval/units[i]);
  						tInterval = intervals[i];
  						return tInterval(domain[0], domain[1], tn);
  						//axis.tickValues = tInterval(domain[0], domain[1], tn);
  						//break;
  					}
  				} 
  				if (timeInterval > units[units.length-1]) {
  					tn = Math.floor(timeInterval/units[units.length-1]);
  					tInterval = intervals[units.length-1];
  					//axis.tickValues = tInterval(domain[0], domain[1], tn);
  					return tInterval(domain[0], domain[1], tn);
  				}

  				//ln should be multiples of tn
  				// let ln = tn * Math.ceil(minLabelIntervalPx/minTickIntervalPx);
  				// axis.labelValues = tInterval(domain[0], domain[1], ln);
  				// break;
  			default:
  				return [];
  		}
  	}

  	sortVertices(item, args){
  		let peers = getPeers(item, this);
  		for (let p of peers)
  			p.sortVertices(args);
  	}

  	// sort(item, args) {
  	// 	let parent = item.parent;
  	// 	if (!parent) return;
  	// 	let parentPeers = getPeers(parent, this);
  	// 	if (item.type == "vertex") {
  	// 		for (let p of parentPeers) {
  	// 			p.sortVertices(args);
  	// 		}
  	// 	} else {
  	// 		//TODO
  	// 	}
  	// }

  	getEncodingByItem(item, channel) {
  		let enc = this.encodings[getEncodingKey(item)];
  		if (enc && channel) {
  			return enc[channel];
  		} else
  			return null;
  	}

  	getEncodingByField(field, channel) {
  		for (let itmKey in this.encodings) {
  			let enc = this.encodings[itmKey];
  			if (enc[channel] && enc[channel].field == field)
  				return enc[channel];
  		}
  		return null;
  		//let enc = this.encodings[getEncodingKey(item)];
  		// if (enc && channel) {
  		// 	return enc[channel];
  		// } else
  		// 	return null;
  	}

  	positionBound(item, channel) {
  		if (this.getEncodingByItem(item, channel))
  			return true;
  		else if (isMark(item) && this.getEncodingByItem(item.vertices[0], channel))
  			return true;
  		else
  			return false;
  	}

  	setProperties(item, args) {
  		if (Object.values(Layout).indexOf(item.type) > -1) {
  			for (let p in args) {
  				item[p] = args[p];
  			}
  		} else {
  			let peers = getPeers(item, this);
  			if (item.type == "vertex") {
  				//TODO: validate the property names in args
  				for (let vertex of peers) {
  					for (let p in args) {
  						vertex[p] = args[p];
  					}
  				}
  			} else if (item.type == "segment") ; else if (item instanceof Mark) {
  				for (let p in args) {
  					//TODO: validate p is a legit property, check if p is bound by data
  					if (Attr2SVG.hasOwnProperty(p)) {
  						peers.forEach(d => d.attrs[p] = args[p]);
  					} else if (Style2SVG.hasOwnProperty(p)) {
  						peers.forEach(d => d.styles[p] = args[p]);
  					} else {
  						peers.forEach(d => d[p] = args[p]);
  					}
  				}	
  				if (args.hasOwnProperty("width") || args.hasOwnProperty("height")) {
  					this._relayoutAncestors(item, peers);
  				}
  					
  			} else if (item.type == "collection") {
  				for (let p in args) {
  					peers.forEach(d => d[p] = args[p]);
  				}
  			}
  		}

  		//TODO: relayout if needed (typically Layout or setProperty should happen before encoding)
  	}

  	_updateAncestorBounds(cpnt, cpntPeers) {
  		let peers = cpntPeers ? cpntPeers : getPeers(cpnt, this);
  		let parents = getParents(peers); //.filter(d => d.type == ItemType.Collection);
  		
  		while (parents.length > 0) {
  			for (let p of parents) { 
  				if (p.children && p.children.length > 0) {
  					p._updateBounds();
  				} else if (p.vertices) {
  					p._updateBounds();
  				}
  			}
  			parents = getParents(parents); //.filter(d => d.type == ItemType.Collection);
  		}
  	}

  	/**
  	** should only be used in Scene methods
  	**/
  	_relayoutAncestors(cpnt, cpntPeers) {
  		let peers = cpntPeers ? cpntPeers : getPeers(cpnt, this);
  		let parents = getParents(peers); //.filter(d => d.type == ItemType.Collection);
  		while (parents.length > 0) {
  			for (let p of parents) {
  				if (p.layout) {
  					p.layout.run();
  				} 
  				if (p.children && p.children.length > 0) {
  					p._updateBounds();
  				}
  				if (p.vertices) {
  					p._updateBounds();
  				}
  			}
  			parents = getParents(parents); //.filter(d => d.type == ItemType.Collection);
  		}
  	}

  	_reapplySizeBindings(compnt){
  		let sizeChannels = ["width", "height"];
  		for (let classId in this.encodings) {
  			if (compnt.classId != classId)	continue;
  			let encodings = this.encodings[classId];
  			//TODO: re-use bindSpec and adjust scale accordingly
  			let peers = findItems(this, d => d.classId == classId);
  			for (let channel of sizeChannels) {
  				let encoding = encodings[channel];
  				if (!encoding) continue;
  				//update items
  				//encoding.items = getPeers(encoding.anyItem, this);
  				encoding.run();
  				//bindToSize(peers, channel, binding.field, binding.datatable, binding.aggregator, undefined, binding.callback);
  			}
  			this._relayoutAncestors(peers[0], peers);
  		}
  	}

  	_registerBinding(encoding) {
  		let encodings = this.encodings;
  		let classId = getEncodingKey(encoding.anyItem);
  		if (!encodings.hasOwnProperty(classId))
  			encodings[classId] = {};
  		encodings[classId][encoding.channel] = encoding;
  		return true;
  	}
  }

  class SVGRenderer {

  	constructor() {
  		this._compMap = {};
  		this._decoMap = {};
  	}

  	render(scene, svgId, args) {
  		this._svgId = svgId;
  		this._renderItem(scene, args);
  	}

  	//TODO: handle removed items
  	_renderItem(c, args) {
  		let cid = c.id,
  			parent = c.parent,
  			pid = parent ? parent.id : this._svgId;


  		if (!this._compMap.hasOwnProperty(cid)) {
  			//TODO: what if the parent is not rendered? What if the hierarchy has changed?
  			this._compMap[cid] = select("#"+pid).append(this._getSVGElementType(c));
  		}

  		let el = this._compMap[cid];

  		el.attr("id", cid);

  		if (c.type == "vertex") {
  			//TODO: render vertices
  			return;
  		}

  		if (c.type == ItemType.Path || c.type == ItemType.Polygon) {
  			el.attr("d", c.getSVGPathData());
  			if (!c.closed)
  				el.style("fill", "none");
  			if (cid.indexOf("axis") == 0) {
  				el.style("shape-rendering", "crispEdges");
  			}
  		} else if (c.type == ItemType.Line) {
  			el.attr("x1", c.vertices[0].x);
  			el.attr("y1", c.vertices[0].y);
  			el.attr("x2", c.vertices[1].x);
  			el.attr("y2", c.vertices[1].y);
  			if (cid.indexOf("axis") == 0) {
  				el.style("shape-rendering", "crispEdges");
  			}
  		} else if (c.type == ItemType.Circle) {
  			el.attr("cx", c.cx);
  			el.attr("cy", c.cy);
  			el.attr("r", c.radius);
  		} else if (c.type == ItemType.Rectangle) {
  			//do not use c.left, c.top, c.width, c.height as the rectangle may be flipped
  			//use c.bounds
  			let b = c.bounds;
  			el.attr("x", b.left).attr("y", b.top).attr("width", b.width).attr("height", b.height);
  		} else if (c.type == ItemType.PointText) {
  			//if (c.id.indexOf("axis") == 0) {
  				el.attr("text-anchor", this._getTextAnchor(c.anchor[0])).attr("alignment-baseline", this._getTextAnchor(c.anchor[1]))
  					.attr("dominant-baseline", this._getTextAnchor(c.anchor[1])).text(c.text)
  					.attr("x", c.x).attr("y", c.y);
  			//}
  		} else if (c.type == ItemType.Pie) {
  			// Render a sort of triangle before rendering the pie
  			el.attr("d", c.getSVGPathData());

  			if (!c.closed)
  				el.style("fill", "none");
  			if (cid.indexOf("axis") == 0) {
  				el.style("shape-rendering", "crispEdges");
  			}
  		} else if (c.type == ItemType.Area) {
  			el.attr("d", c.getSVGPathData());
  			if (!c.closed)
  				el.style("fill", "none");
  			if (cid.indexOf("axis") == 0) {
  				el.style("shape-rendering", "crispEdges");
  			}
  			//el.attr("x1", c.left).attr("y2", c.top).attr("x2", c.left+c.width).attr("y2", c.top+c.height);
  		}

  		for (let a in c.attrs) {
  			el.attr(Attr2SVG[a], c.attrs[a]);
  		}

  		for (let s in c.styles) {
  			if (s.indexOf("Color") > 0 && c.styles[s].type == ItemType.LinearGradient) {
  				if (select("#"+this._svgId).select("defs").empty())
  					select("#"+this._svgId).append("defs");
  				let defs = select("defs"), gradient = c.styles[s];
  				if (defs.select("#" + gradient.id).empty()) {
  					let grad = defs.append("linearGradient").attr("id", gradient.id).attr("x1", "0%").attr("y2", "0%").attr("x2", "0%").attr("y1", "100%");
  					for (let stop of gradient.stops)
  						grad.append("stop").attr("offset", stop.offset+"%").style("stop-color", stop.color).style("stop-opacity", stop.opacity);
  				}
  				el.style(Style2SVG[s], "url(#" + gradient.id + ")");
  			} else
  				el.style(Style2SVG[s], c.styles[s]);
  		}

  		// if (!c._matrix.isIdentity()) {
  		// 	el.attr("transform", c._matrix.toSVG());
  		// }

  		if (c._rotate)
  			el.attr("transform", "rotate(" + c._rotate.join(" ") + ")");

  		// render vertices if shape is defined
  		if (c.vertices) {
  			let shapes = c.vertices.map(d => d.shape).filter(d => d !== undefined);
  			if (shapes.length > 0) 
  				this._renderVertices(c);
  		}

  		// render scene bound
  		if (c.type == ItemType.Collection && args && args["collectionBounds"]) {
  			let b = c.bbox;
  			if (c.layout && c.layout.type == "grid") {
  				this._renderLayout(c);
  			} else {
  				if (!this._decoMap.hasOwnProperty(c.id)) {
  					this._decoMap[c.id] = select("#"+this._svgId).append("rect").attr("class", "deco");
  				}
  				this._decoMap[c.id].attr("x", b.left).attr("y", b.top)
  					.attr("width", b.width).attr("height", b.height).attr("fill", "none")
  					.attr("stroke", "#1ecb40").attr("stroke-width", "1px")
  					.attr("stroke-dasharray", "5,5");
  			}
  		}

  		if (c.children) {
  			for (let child of c.children) {
  				this._renderItem(child, args);
  			}
  		}

  	}

  	_renderVertices(c) {
  		let id = c.id+"-vertices";
  		if (!this._compMap.hasOwnProperty(id)) {
  			let parent = c.parent,
  				pid = parent ? parent.id : this._svgId;
  			this._compMap[id] = select("#"+pid).append("g").attr("id", id);
  		}

  		let vertices = c.vertices.filter(d => d.shape !== undefined);
  		for (let v of vertices) {
  			let vid = id+"-"+v.id;
  			if (!this._compMap.hasOwnProperty(vid)) {
  				this._compMap[vid] = select("#"+id).append(v.shape).attr("id", vid);
  			}
  			if (v.shape == "rect") {
  				select("#"+vid).attr("x", v.center.x - v.width/2).attr("y", v.center.y - v.height/2)
  					.attr("width", v.width).attr("height", v.height);
  			} else if (v.shape == "circle") {
  				select("#"+vid).attr("cx", v.center.x).attr("cy", v.center.y).attr("r", v.radius);
  			}
  			select("#"+vid).style("fill", v.fillColor).style("opacity", v.opacity)
  				.style("stroke-width", v.strokeWidth).style("stroke", v.strokeColor);
  		}
  	}

  	_renderLayout(c) {
  		let gridId = c.id+"-grid";
  		if (!this._decoMap.hasOwnProperty(gridId)) {
  			this._decoMap[gridId] = select("#"+this._svgId).append("g")
  				.attr("id", gridId).attr("class", "deco");
  		}
  		let cellBounds = c.layout.cellBounds, hGap = c.layout.hGap, vGap = c.layout.vGap;
  		this._decoMap[gridId].selectAll("rect").remove();
  		this._decoMap[gridId].selectAll("rect").data(cellBounds.slice(0, cellBounds.length -1))
  			.enter().append("rect").attr("x", d => d.left).attr("y", d => d.bottom)
  				.attr("width", d => d.width).attr("height", vGap)
  				.style("fill", "pink").style("opacity", 0.5)
  				;
  		let left = Math.min(...cellBounds.map(d => d.left)),
  			top = Math.min(...cellBounds.map(d => d.top));
  		this._decoMap[gridId].append("rect").attr("x", left).attr("y", top)
  			.attr("width", c.bounds.width).attr("height", c.bounds.height)
  			.attr("stroke", "#1ecb40").attr("stroke-width", "1px")
  			.attr("stroke-dasharray", "5,5").attr("fill", "none");

  	}

  	_getTextAnchor(anchor) {
  		switch(anchor) {
              case "top":
                  return "text-before-edge";
              case "bottom":
  				return "text-after-edge";
  			case "left":
  				return "start";
  			case "right":
  				return "end";
  			case "center":
  				return "middle";
  			case "middle":
  				return "middle";
  			default:
  				return anchor;
          }
  	}

  	_getSVGElementType(cpnt) {
  		switch (cpnt.type) {
  			case ItemType.Rectangle:
  				return "rect";
  			case ItemType.Area:
  				return "path";
  			case ItemType.Collection:
  			case ItemType.Group:
  			case ItemType.Glyph:
  			case ItemType.Scene:
  			case ItemType.Axis:
  			case ItemType.Legend:
  			case ItemType.Gridlines:
  				return "g";
  			case ItemType.Path:
  			case ItemType.Polygon:
  				return "path";
  			case ItemType.Circle:
  				return "circle";
  			case ItemType.Pie:
  				return "path";
  			case ItemType.Line:
  				return "line";
  			case ItemType.PointText:
  				return "text";
  			case "vertex":
  				if (cpnt.shape == "circle")
  					return "circle";
  				else if (cpnt.shape == "rect")
  					return "rect";
  		}
  	}

  	// _getD3CurveFunction(v){
  	// 	switch(v) {
  	// 		case CurveMode.Natural:
  	// 			return d3.curveNatural;
  	// 		case CurveMode.Basis:
  	// 			return d3.curveBasis;
  	// 		case CurveMode.BumpX:
  	// 			return d3.curveBumpX;
  	// 		case CurveMode.BumpY:
  	// 			return d3.curveBumpY;
  	// 		case CurveMode.Linear:
  	// 			return d3.curveLinear;
  	// 		case CurveMode.Step:
  	// 			return d3.curveStep;
  	// 		default:
  	// 			return d3.curveLinear;
  	// 	}
  	// }
  }

  class PackingLayout {

      constructor(args) {
  		this.type = "packing";
          this.cx = args.hasOwnProperty("cx") ?  args.cx : 400;
          this.cy = args.hasOwnProperty("cy") ? args.cy : 400;
          this.width = args.width;
          this.height = args.height;
  	}

      clone() {
  		return new PackingLayout({cx: this.cx, cy: this.cy, width: this.width, height: this.height});
  	}

      run() {
  		if (this.collection == undefined)
  			return;
          let nodes = this.collection.children.map(d => ({"name": d.id, "radius": d.radius, "itm": d}));

          let area = nodes.reduce((total, current) => total + Math.pow(current.radius, 2), 0),
              s = Math.sqrt(area);
          
          if (this.width === undefined) {
              this.width = s;
          }

          if (this.height === undefined) {
              this.height = s;
          }

          let data = hierarchy({name: "root", children: nodes}).sum(d => d.radius ? d.radius : 0).sort((a, b) => b.value - a.value);
          index().size([this.width, this.height]).radius(d => d.value)(data);

          for (let c of data.children) {
              let itm = c.data.itm; //this.collection.children[c];
              let dx = this.cx - data.x + c.x - itm.center.x, dy = this.cy - data.y + c.y - itm.center.y;
              itm.translate(dx, dy);
          }
      }

  }

  class TreemapLayout {

      constructor(args) {
          this.type = "treemap";
          this.width = args["width"];
          this.height = args["height"];
          this.top = args["top"];
          this.left = args["left"];
      }

      clone() {
          return new TreemapLayout({});
      }

      run() {
          if (this.collection == undefined)
  			return;
          let w = this.width ? this.width : this.collection.bounds.width,
              h = this.height ? this.height : this.collection.bounds.height,
              top = this.top === undefined ? this.collection.bounds.top : this.top,
              left = this.left === undefined ? this.collection.bounds.left : this.left;
          let hierarchy$1 = hierarchy((this.collection)).sum(d => d.type == "rectangle" ? d.bounds.width * d.bounds.height : 0);
          index$1().size([w,h])(hierarchy$1);
          let n = this._apply(hierarchy$1, left, top);
          this.collection.getScene()._updateAncestorBounds(hierarchy$1.leaves()[0].data);
      }

      _apply(node, left, top) {
          if (node.data.type == "collection") {
              for (let c of node.children)
                  this._apply(c, left, top);
          } else if (node.data.type == "rectangle") {
              node.data.resize(node.x1 - node.x0, node.y1 - node.y0);
              node.data.translate(node.x0 + left - node.data.bounds.left, node.y0 + top - node.data.bounds.top);
          }
      }
  }

  // export {default as Point} from "./basic/Point";

  function scene() {
  	return new Scene();
  }

  function renderer(type) {
  	switch (type) {
  		case "svg":
  			return new SVGRenderer();
  	}
  }

  function createScale(type, args) {
  	if (ScaleType.indexOf(type) < 0) {
  		throw new Error(Errors.UNKOWNN_SCALE_TYPE + ": " + type);
  	}
  	return new Scale(type, args);
  }

  function layout(type, params) {
  	let args = params ? params : {};
  	switch (type.toLowerCase()) {
  		case "grid":
  			return new GridLayout(args);
  		case "circular":
  			return new CircularLayout(args);
  		case "pack":
  			return new PackingLayout(args);
  		case "treemap":
  			return new TreemapLayout(args);
  	}
  }

  function csv$1(url, callback) {
  	let async = callback? true : false;
  	var request = new XMLHttpRequest();
  	request.open('GET', url, async);
  	request.send();
  	if (!async && validResponse(request)) {
  		let name = _getCurrentFileName(url),
  			data = csvParse(request.responseText.trim(), autoType);
  		//return new DataTable(url, request.responseText);
  		return new DataTable(data, name);
  	}
  }

  // export function layout(collection, layout) {
  // 	collection.layout = layout;
  // 	layout.run(collection);
  // }

  function validResponse(request) {
  	var type = request.responseType;
  	return type && type !== 'text' ?
  		request.response : // null on error
  		request.responseText; // '' on error
  }

  function _getCurrentFileName(url){
  	var startIndex = (url.indexOf('\\') >= 0 ? url.lastIndexOf('\\') : url.lastIndexOf('/'));
  	var filename = url.substring(startIndex);
  	if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
  		filename = filename.substring(1);
  	}
  	return filename;
  }

  function cartesianToPolar(x, y, cx, cy){
  	return cartesian2Polar(x, y, cx, cy);
  }

  function polarToCartesian(cx, cy, r, deg){
  	return polar2Cartesian(cx, cy, r, deg);
  }

  exports.cartesianToPolar = cartesianToPolar;
  exports.createScale = createScale;
  exports.csv = csv$1;
  exports.layout = layout;
  exports.polarToCartesian = polarToCartesian;
  exports.renderer = renderer;
  exports.scene = scene;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
