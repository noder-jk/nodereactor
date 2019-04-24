"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomTemplate = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CustomTemplate =
/*#__PURE__*/
function (_Component) {
  _inherits(CustomTemplate, _Component);

  function CustomTemplate(props) {
    var _this;

    _classCallCheck(this, CustomTemplate);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CustomTemplate).call(this, props));
    var _this$props = _this.props,
        _this$props$custom_te = _this$props.custom_templates,
        custom_templates = _this$props$custom_te === void 0 ? {} : _this$props$custom_te,
        _this$props$post_meta = _this$props.post_meta,
        post_meta = _this$props$post_meta === void 0 ? {} : _this$props$post_meta;
    var _post_meta$custom_tem = post_meta.custom_template,
        custom_template = _post_meta$custom_tem === void 0 ? "0" : _post_meta$custom_tem;
    _this.state = {
      'page_templates': custom_templates,
      'default': custom_template
    };
    return _this;
  }

  _createClass(CustomTemplate, [{
    key: "render",
    value: function render() {
      var templates = this.state.page_templates;
      return _react.default.createElement("div", null, Object.keys(templates).length > 0 ? _react.default.createElement("select", {
        name: "custom_template",
        className: "form-control",
        defaultValue: this.state.default
      }, _react.default.createElement("option", {
        key: "0",
        value: "0"
      }, "None"), Object.keys(templates).map(function (comp) {
        return _react.default.createElement("option", {
          key: comp,
          value: comp
        }, templates[comp]);
      })) : _react.default.createElement("span", null, "No Template Set"));
    }
  }]);

  return CustomTemplate;
}(_react.Component);

exports.CustomTemplate = CustomTemplate;