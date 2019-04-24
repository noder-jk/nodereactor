"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomHtmlOutput = exports.CustomHtmlInput = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var CustomHtmlInput = function CustomHtmlInput(props) {
  var _props$properties = props.properties,
      properties = _props$properties === void 0 ? {} : _props$properties;
  return _react.default.createElement("div", null, _react.default.createElement("textarea", {
    type: "text",
    name: "custom_code",
    placeholder: "Enter Code",
    defaultValue: properties.custom_code,
    className: "form-control"
  }));
};

exports.CustomHtmlInput = CustomHtmlInput;

var CustomHtmlOutput = function CustomHtmlOutput(props) {
  var _props$properties2 = props.properties,
      properties = _props$properties2 === void 0 ? {} : _props$properties2;
  var _properties$custom_co = properties.custom_code,
      custom_code = _properties$custom_co === void 0 ? '' : _properties$custom_co;
  return _react.default.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: custom_code
    }
  });
};

exports.CustomHtmlOutput = CustomHtmlOutput;