"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.array_pull_up = exports.array_pull_down = void 0;

var array_pull_up = function array_pull_up(ar, n, ret_ind) {
  var new_ind = false;

  if (n > 0) {
    var new_ar = [];
    new_ar = new_ar.concat(ar.slice(0, n - 1));
    new_ar.push(ar[n]); // queue argument index

    new_ind = new_ar.length - 1;
    new_ar.push(ar[n - 1]);

    if (ar[n + 1]) {
      new_ar = new_ar.concat(ar.slice(n + 1));
    }

    ar = new_ar;
  }

  return ret_ind ? [ar, new_ind] : ar;
};

exports.array_pull_up = array_pull_up;

var array_pull_down = function array_pull_down(ar, n, ret) {
  var new_ind = false;

  if (ar[n + 1]) {
    var new_ar = [];
    new_ar = new_ar.concat(ar.slice(0, n));
    new_ar.push(ar[n + 1]);
    new_ar.push(ar[n]); // queue argument index

    new_ind = new_ar.length - 1;

    if (ar[n + 2]) {
      new_ar = new_ar.concat(ar.slice(n + 2));
    }

    ar = new_ar;
  }

  return ret ? [ar, new_ind] : ar;
};

exports.array_pull_down = array_pull_down;