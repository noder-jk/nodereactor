"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginDirectory = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var PluginDirectory = function PluginDirectory() {
  return _react["default"].createElement("h4", {
    className: "text-center"
  }, "It's Upcoming Feature");
};

exports.PluginDirectory = PluginDirectory;