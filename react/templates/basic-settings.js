"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicSettings = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BasicSettings =
/*#__PURE__*/
function (_Component) {
  _inherits(BasicSettings, _Component);

  function BasicSettings(props) {
    var _this;

    _classCallCheck(this, BasicSettings);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BasicSettings).call(this, props));
    _this.state = {
      'fetching': true,
      'saving': false,
      'values': {}
    };
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_this));
    _this.saveData = _this.saveData.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(BasicSettings, [{
    key: "onChange",
    value: function onChange(v) {
      var values = this.state.values;
      values = Object.assign(values, v);
      this.setState({
        values: values
      });
    }
  }, {
    key: "saveData",
    value: function saveData() {
      var _this2 = this;

      var _this$props = this.props,
          _this$props$save_data = _this$props.save_data_action,
          save_data_action = _this$props$save_data === void 0 ? 'nr_basic_settings_saver' : _this$props$save_data,
          package_name = _this$props.package_name,
          fields = _this$props.fields;
      var values = this.state.values;
      fields = Object.keys(fields);
      this.setState({
        saving: true
      });
      (0, _react2.ajax_request)(save_data_action, {
        values: values,
        fields: fields,
        package_name: package_name
      }, function (r, d, e) {
        var _r$status = r.status,
            status = _r$status === void 0 ? 'error' : _r$status,
            message = r.message;
        !message ? message = status == 'success' ? 'Saved' : 'Action Failed' : 0;
        status = status.toLowerCase();
        status = status.charAt(0).toUpperCase() + status.slice(1);

        _this2.setState({
          saving: false
        });

        _sweetalert["default"].fire(status, message, status.toLowerCase());
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      var _this$props2 = this.props,
          _this$props2$get_data = _this$props2.get_data_action,
          get_data_action = _this$props2$get_data === void 0 ? 'nr_basic_settings_getter' : _this$props2$get_data,
          package_name = _this$props2.package_name,
          fields = _this$props2.fields;
      fields = Object.keys(fields);
      (0, _react2.ajax_request)(get_data_action, {
        package_name: package_name,
        fields: fields
      }, function (r, d, e) {
        e ? alert('Something Went Wrong.') : 0;

        _this3.setState({
          fetching: false,
          values: _objectSpread({}, r)
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$state = this.state,
          fetching = _this$state.fetching,
          saving = _this$state.saving,
          values = _this$state.values;
      var _this$props3 = this.props,
          _this$props3$fields = _this$props3.fields,
          fields = _this$props3$fields === void 0 ? {} : _this$props3$fields,
          onSave = _this$props3.onSave,
          title = _this$props3.title,
          package_name = _this$props3.package_name,
          description = _this$props3.description;
      return !package_name ? _react["default"].createElement("div", null, _react["default"].createElement("code", null, "package_name"), " property is mandatory to use ", _react["default"].createElement("code", null, "BasicSettings"), " component.") : _react["default"].createElement("div", null, !title ? null : _react["default"].createElement("div", null, _react["default"].createElement("h4", null, title), description ? _react["default"].createElement("small", null, description) : null, _react["default"].createElement("hr", null)), fetching ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : Object.keys(fields).map(function (name) {
        var f = fields[name];
        var def = values[name] || f.default_value;
        delete f.default_value;
        return _react["default"].createElement(_react2.Input, _extends({
          key: name
        }, f, {
          set_values: values,
          onChange: _this4.onChange,
          name: name,
          default_value: def
        }));
      }), _react["default"].createElement(_react2.Input, {
        type: "children"
      }, _react["default"].createElement("button", {
        disabled: fetching || saving,
        className: "btn btn-secondary btn-sm",
        onClick: onSave ? onSave() : this.saveData
      }, saving ? 'Saving' : 'Save', saving ? _react["default"].createElement("span", null, "\xA0 ", _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      })) : null)));
    }
  }]);

  return BasicSettings;
}(_react.Component);

exports.BasicSettings = BasicSettings;