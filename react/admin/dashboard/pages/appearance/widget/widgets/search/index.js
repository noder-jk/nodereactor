"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchWidgetOutput = exports.SearchWidgetInput = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SearchWidgetInput = function SearchWidgetInput() {
  return _react["default"].createElement("div", null);
};

exports.SearchWidgetInput = SearchWidgetInput;

var SearchWidgetOutput = function SearchWidgetOutput() {
  return _react["default"].createElement("form", {
    method: "get",
    action: "/"
  }, _react["default"].createElement("label", null, _react["default"].createElement("input", {
    type: "search",
    name: "search",
    placeholder: "Search . . ."
  })), _react["default"].createElement("button", {
    type: "submit"
  }, "Search"));
};

exports.SearchWidgetOutput = SearchWidgetOutput;