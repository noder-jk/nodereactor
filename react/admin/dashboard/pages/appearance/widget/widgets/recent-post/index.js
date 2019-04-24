"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RecentPostOutput = exports.RecentPostInput = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var RecentPostInput = function RecentPostInput(props) {
  var properties = props.properties;
  return _react.default.createElement("div", null, _react.default.createElement("textarea", {
    type: "text",
    name: "arbitrary_text",
    placeholder: "Enter Texts",
    className: "form-control"
  }));
};

exports.RecentPostInput = RecentPostInput;

var RecentPostOutput = function RecentPostOutput() {
  return _react.default.createElement("p", null, "This is recent");
};

exports.RecentPostOutput = RecentPostOutput;