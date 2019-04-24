"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArbitraryTextOutput = exports.ArbitraryTextInput = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var ArbitraryTextInput = function ArbitraryTextInput(props) {
  var _props$properties = props.properties,
      properties = _props$properties === void 0 ? {} : _props$properties;
  return _react.default.createElement("div", null, _react.default.createElement("textarea", {
    type: "text",
    name: "arbitrary_text",
    placeholder: "Enter Texts",
    defaultValue: properties.arbitrary_text,
    className: "form-control"
  }));
};

exports.ArbitraryTextInput = ArbitraryTextInput;

var ArbitraryTextOutput = function ArbitraryTextOutput(props) {
  var _props$properties2 = props.properties,
      properties = _props$properties2 === void 0 ? {} : _props$properties2;
  var _properties$arbitrary = properties.arbitrary_text,
      arbitrary_text = _properties$arbitrary === void 0 ? '' : _properties$arbitrary;
  return _react.default.createElement("p", null, arbitrary_text);
};

exports.ArbitraryTextOutput = ArbitraryTextOutput;