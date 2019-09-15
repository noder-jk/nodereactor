"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nr_footer = exports.nr_head = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var nr_head = function nr_head() {
  return _react["default"].createElement(_react2.DoAction, {
    hook: "nr_head"
  });
};

exports.nr_head = nr_head;

var nr_footer = function nr_footer() {
  return _react["default"].createElement(_react2.DoAction, {
    hook: "nr_footer"
  });
};

exports.nr_footer = nr_footer;