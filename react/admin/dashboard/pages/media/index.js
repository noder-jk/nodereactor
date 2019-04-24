"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaPage = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MediaPage = function MediaPage() {
  return _react.default.createElement(_react2.Media, {
    open: true,
    adminCall: true,
    multiple: true
  });
};

exports.MediaPage = MediaPage;