"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = void 0;

var _react = _interopRequireWildcard(require("react"));

var _renderMedia = require("../../helper/render-media");

var _react2 = require("nodereactor/react");

require("./style.scss");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var field_classes = {
  textarea: 'form-control',
  text: 'form-control',
  number: 'form-control',
  select: 'form-control',
  radio: '',
  checkbox: ''
};

var RenderURL = function RenderURL(props) {
  var url = props.url;
  var ext = url.split('.');
  ext = ext[ext.length - 1] || '';
  return _react["default"].createElement("div", null, _react["default"].createElement("div", null, _react["default"].createElement(_renderMedia.RenderMediaFile, {
    url: url,
    extension: ext
  })), url);
};

var Input =
/*#__PURE__*/
function (_Component) {
  _inherits(Input, _Component);

  function Input(props) {
    var _this;

    _classCallCheck(this, Input);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Input).call(this, props));
    _this.state = {
      'media_opened': false
    };
    _this.getVal = _this.getVal.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Input, [{
    key: "getVal",
    value: function getVal(e, ob) {
      var _this$props = this.props,
          _this$props$set_value = _this$props.set_values,
          set_values = _this$props$set_value === void 0 ? {} : _this$props$set_value,
          onChange = _this$props.onChange;

      if (ob) {
        // No need parse, it is value directly
        set_values = Object.assign(set_values, ob);
      } else {
        // It is non linear value like text, number
        var parse = (0, _react2.parse_input_value)(e.currentTarget, set_values);
        set_values = Object.assign(set_values, parse);
      }

      onChange(set_values);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var media_opened = this.state.media_opened;
      var _this$props2 = this.props,
          name = _this$props2.name,
          title = _this$props2.title,
          _this$props2$type = _this$props2.type,
          type = _this$props2$type === void 0 ? "text" : _this$props2$type,
          children = _this$props2.children,
          _this$props2$min = _this$props2.min,
          min = _this$props2$min === void 0 ? null : _this$props2$min,
          _this$props2$max = _this$props2.max,
          max = _this$props2$max === void 0 ? null : _this$props2$max,
          _this$props2$step = _this$props2.step,
          step = _this$props2$step === void 0 ? null : _this$props2$step,
          _this$props2$multiple = _this$props2.multiple,
          multiple = _this$props2$multiple === void 0 ? false : _this$props2$multiple,
          _this$props2$accept = _this$props2.accept,
          accept = _this$props2$accept === void 0 ? [] : _this$props2$accept,
          hint = _this$props2.hint,
          _this$props2$required = _this$props2.required,
          required = _this$props2$required === void 0 ? false : _this$props2$required,
          _this$props2$values = _this$props2.values,
          values = _this$props2$values === void 0 ? [] : _this$props2$values,
          _this$props2$default_ = _this$props2.default_value,
          default_value = _this$props2$default_ === void 0 ? '' : _this$props2$default_,
          _this$props2$containe = _this$props2.container_class,
          container_class = _this$props2$containe === void 0 ? 'row mb-4' : _this$props2$containe,
          _this$props2$first_co = _this$props2.first_column_class,
          first_column_class = _this$props2$first_co === void 0 ? 'col-12 col-sm-5 col-md-4 col-lg-3' : _this$props2$first_co,
          _this$props2$second_c = _this$props2.second_column_class,
          second_column_class = _this$props2$second_c === void 0 ? 'col-12 col-sm-7 col-md-6 col-lg-5' : _this$props2$second_c,
          input_class = _this$props2.input_class;
      !Array.isArray(hint) ? hint = [hint] : 0;
      input_class = input_class || field_classes[type];
      return _react["default"].createElement("div", {
        className: container_class + ' nr-core-input-component'
      }, _react["default"].createElement("div", {
        className: first_column_class
      }, !title ? null : _react["default"].createElement("b", null, title, " ", required ? '*' : null)), _react["default"].createElement("div", {
        className: second_column_class
      }, _react["default"].createElement("div", null, type == 'textarea' ? _react["default"].createElement("textarea", {
        name: name,
        onChange: this.getVal,
        defaultValue: default_value,
        className: input_class
      }) : null, type == 'text' ? _react["default"].createElement("input", {
        name: name,
        type: "text",
        onChange: this.getVal,
        defaultValue: default_value,
        className: input_class
      }) : null, type == 'number' ? _react["default"].createElement("input", {
        name: name,
        type: "number",
        min: min,
        max: max,
        step: step,
        onChange: this.getVal,
        defaultValue: default_value,
        className: input_class
      }) : null, type !== 'select' ? null : _react["default"].createElement("select", {
        name: name,
        className: input_class,
        defaultValue: default_value,
        onChange: this.getVal
      }, values.map(function (v) {
        var _ref = _typeof(v) == 'object' ? v : {
          value: v,
          title: v
        },
            title = _ref.title,
            value = _ref.value;

        return _react["default"].createElement("option", {
          key: value,
          value: value
        }, title);
      })), type !== 'radio' && type !== 'checkbox' ? null : _react["default"].createElement("form", null, !Array.isArray(values) ? null : values.map(function (item) {
        // if it is array rather than key value paired object
        var _ref2 = _typeof(item) == 'object' ? item : {
          value: item,
          title: item
        },
            title = _ref2.title,
            value = _ref2.value;

        !Array.isArray(default_value) ? default_value = [default_value] : 0;
        return _react["default"].createElement("label", {
          key: value
        }, _react["default"].createElement("input", {
          type: type,
          name: name,
          value: value,
          defaultChecked: default_value.indexOf(value) > -1,
          onChange: _this2.getVal,
          className: input_class
        }), " ", title);
      })), type !== 'media' ? null : _react["default"].createElement("div", null, default_value ? _react["default"].createElement(RenderURL, {
        url: default_value
      }) : null, _react["default"].createElement("button", {
        className: "btn btn-outline-secondary btn-sm",
        onClick: function onClick() {
          return _this2.setState({
            media_opened: true
          });
        }
      }, default_value ? 'Change' : 'Choose'), !media_opened ? null : _react["default"].createElement(_react2.Media, {
        onClose: function onClose() {
          return _this2.setState({
            media_opened: false
          });
        },
        onResult: function onResult(f) {
          return _this2.getVal(false, _defineProperty({}, name, f.file_url));
        },
        multiple: multiple,
        accept: accept
      })), children), hint.map(function (h) {
        return _react["default"].createElement("small", {
          key: h
        }, _react["default"].createElement("i", {
          dangerouslySetInnerHTML: {
            __html: h
          }
        }));
      })));
    }
  }]);

  return Input;
}(_react.Component);

exports.Input = Input;