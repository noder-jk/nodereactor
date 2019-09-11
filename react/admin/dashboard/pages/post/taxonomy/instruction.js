"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Instruction = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Instruction = function Instruction() {
  return _react["default"].createElement("p", null, _react["default"].createElement("i", null, "Please read", _react["default"].createElement("a", {
    href: "https://nodereactor.com/theme-development/taxonomy/",
    target: "_blank"
  }, " taxonomy instructions "), "to avoid term conflict."));
};

exports.Instruction = Instruction;