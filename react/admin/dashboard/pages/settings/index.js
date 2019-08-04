"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReadingSetting = exports.PermalinkSetting = exports.GeneralSetting = void 0;

var _react = _interopRequireWildcard(require("react"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _react2 = require("nodereactor/react");

var _general = require("./general");

var _permalink = require("./permalink");

var _reading = require("./reading");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var FormProcess =
/*#__PURE__*/
function (_Component) {
  _inherits(FormProcess, _Component);

  function FormProcess(props) {
    var _this;

    _classCallCheck(this, FormProcess);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormProcess).call(this, props));
    _this.state = {
      'components': {
        'GeneralSetting': _general.GSetting,
        'PermalinkSetting': _permalink.PSetting,
        'ReadingSetting': _reading.RSetting
      },
      'loading': false
    };
    _this.saveOption = _this.saveOption.bind(_assertThisInitialized(_this));
    _this.storeVal = _this.storeVal.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(FormProcess, [{
    key: "storeVal",
    value: function storeVal(e) {
      var el = e.currentTarget;
      var state = {};

      if (el.type == 'radio' && !el.checked) {
        return;
      }

      state[el.name] = el.value;
      this.setState(state);
    }
  }, {
    key: "saveOption",
    value: function saveOption() {
      var _this2 = this;

      var vals = Object.assign({}, this.state);
      delete vals.components;
      delete vals.loading;
      this.setState({
        'loading': true
      });
      (0, _react2.ajaxRequest)('nr_save_general_settings', _objectSpread({}, vals), function (r, d, e) {
        _this2.setState({
          'loading': false
        });

        var _r$status = r.status,
            status = _r$status === void 0 ? 'failed' : _r$status;

        _sweetalert["default"].fire(status == 'done' ? 'Saved' : 'Could not saved');
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          settingPage = _this$props.settingPage,
          ResponseData = _this$props.ResponseData;
      var _this$state = this.state,
          components = _this$state.components,
          loading = _this$state.loading;
      var Comp = components[settingPage];
      return _react["default"].createElement("div", null, _react["default"].createElement(Comp, {
        onChange: this.storeVal,
        ResponseData: ResponseData
      }), _react["default"].createElement("div", {
        className: "row"
      }, _react["default"].createElement("div", {
        className: "col-12 col-sm-4 col-md-3 col-lg-2"
      }), _react["default"].createElement("div", {
        className: "col-12 col-sm-8 col-md-6 col-lg-4"
      }, _react["default"].createElement("button", {
        "data-button": "save",
        className: "btn btn-secondary btn-sm",
        disabled: loading,
        onClick: this.saveOption
      }, "Save ", loading ? _react["default"].createElement("span", null, "\xA0", _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px",
        color: "white"
      })) : null))));
    }
  }]);

  return FormProcess;
}(_react.Component);

var GeneralSetting = function GeneralSetting() {
  return _react["default"].createElement(_react2.Placeholder, {
    Data: {
      'action': 'nr_get_general_settings'
    },
    Component: FormProcess,
    settingPage: "GeneralSetting"
  });
};

exports.GeneralSetting = GeneralSetting;

var PermalinkSetting = function PermalinkSetting() {
  return _react["default"].createElement(_react2.Placeholder, {
    Data: {
      'action': 'nr_get_general_settings'
    },
    Component: FormProcess,
    settingPage: "PermalinkSetting"
  });
};

exports.PermalinkSetting = PermalinkSetting;

var ReadingSetting = function ReadingSetting() {
  return _react["default"].createElement(_react2.Placeholder, {
    Data: {
      'action': 'nr_get_general_settings'
    },
    Component: FormProcess,
    settingPage: "ReadingSetting"
  });
};

exports.ReadingSetting = ReadingSetting;