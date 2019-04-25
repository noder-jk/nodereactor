"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArbitraryTextOutput = exports.ArbitraryTextInput = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ArbitraryTextInput = function ArbitraryTextInput(props) {
  var _props$arbitrary_text = props.arbitrary_text,
      arbitrary_text = _props$arbitrary_text === void 0 ? '' : _props$arbitrary_text;
  return _react["default"].createElement("div", null, _react["default"].createElement("textarea", {
    type: "text",
    name: "arbitrary_text",
    placeholder: "Enter Texts",
    defaultValue: arbitrary_text,
    className: "form-control"
  }));
};

exports.ArbitraryTextInput = ArbitraryTextInput;

var ArbitraryTextOutput = function ArbitraryTextOutput(props) {
  var _props$arbitrary_text2 = props.arbitrary_text,
      arbitrary_text = _props$arbitrary_text2 === void 0 ? '' : _props$arbitrary_text2;
  return _react["default"].createElement("p", null, arbitrary_text);
};

exports.ArbitraryTextOutput = ArbitraryTextOutput;