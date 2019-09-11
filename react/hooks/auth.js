"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = void 0;

var _react = _interopRequireDefault(require("react"));

var _hookFinder = require("../helper/hook-finder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var login = function login() {
  return _react["default"].createElement(_hookFinder.FindActionHook, {
    hook: "login"
  });
};

exports.login = login;