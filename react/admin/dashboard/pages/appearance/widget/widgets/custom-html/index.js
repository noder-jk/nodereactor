"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomHtmlOutput = exports.CustomHtmlInput = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CustomHtmlInput = function CustomHtmlInput(props) {
  var _props$custom_code = props.custom_code,
      custom_code = _props$custom_code === void 0 ? '' : _props$custom_code;
  return _react["default"].createElement("div", null, _react["default"].createElement("textarea", {
    type: "text",
    name: "custom_code",
    placeholder: "Enter Code",
    defaultValue: custom_code,
    className: "form-control"
  }), _react["default"].createElement("small", {
    className: "text-info"
  }, _react["default"].createElement("i", null, "This widget supports Shortcode")));
};

exports.CustomHtmlInput = CustomHtmlInput;

var CustomHtmlOutput = function CustomHtmlOutput(props) {
  var _props$custom_code2 = props.custom_code,
      custom_code = _props$custom_code2 === void 0 ? '' : _props$custom_code2;
  return (0, _react2.do_shortcodes)(custom_code);
};

exports.CustomHtmlOutput = CustomHtmlOutput;