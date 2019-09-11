"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nr_footer = exports.nr_head = void 0;

var nr_head = function nr_head() {
  return React.createElement(FindActionHook, {
    hook: "nr_head"
  });
};

exports.nr_head = nr_head;

var nr_footer = function nr_footer() {
  return React.createElement(FindActionHook, {
    hook: "nr_footer"
  });
};

exports.nr_footer = nr_footer;