"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitTheme = exports.InitAdmin = exports.Init = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Init = function Init() {
  return _react["default"].createElement(_react2.DoAction, {
    hook: "init"
  });
};

exports.Init = Init;

var InitAdmin = function InitAdmin() {
  return _react["default"].createElement(_react2.DoAction, {
    hook: "init_admin"
  });
};

exports.InitAdmin = InitAdmin;

var InitTheme = function InitTheme() {
  return _react["default"].createElement(_react2.DoAction, {
    hook: "init_theme"
  });
};

exports.InitTheme = InitTheme;