"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitTheme = exports.Init = void 0;

var _react = _interopRequireDefault(require("react"));

var _hookFinder = require("../helper/hook-finder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Init = function Init() {
  return _react["default"].createElement(_hookFinder.FindActionHook, {
    hook: "init",
    type: "function"
  });
};

exports.Init = Init;

var InitTheme = function InitTheme(props) {
  return _react["default"].createElement(_hookFinder.FindActionHook, {
    hook: "init_theme",
    type: "function",
    properties: props.properties
  });
};

exports.InitTheme = InitTheme;