"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Placeholder = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Placeholder =
/*#__PURE__*/
function (_Component) {
  _inherits(Placeholder, _Component);

  function Placeholder(props) {
    var _this;

    _classCallCheck(this, Placeholder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Placeholder).call(this, props));
    var _this$props$spinnerCe = _this.props.spinnerCenter,
        spinnerCenter = _this$props$spinnerCe === void 0 ? false : _this$props$spinnerCe;

    var ldr = _react["default"].createElement(_reactSvgSpinner["default"], {
      size: "15px"
    });

    _this.state = {
      content: spinnerCenter ? _react["default"].createElement("div", {
        style: {
          'textAlign': 'center'
        }
      }, ldr) : ldr
    };
    return _this;
  }

  _createClass(Placeholder, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props = this.props,
          _this$props$Data = _this$props.Data,
          Data = _this$props$Data === void 0 ? {} : _this$props$Data,
          Component = _this$props.Component;
      var params = Object.assign({}, this.props);
      delete params.Data;
      delete params.Component;
      var action = Data.action;
      delete Data.action;
      (0, _react2.ajaxRequest)(action, Data, function (r, d, e) {
        var ob = e ? {
          content: _react["default"].createElement("span", {
            className: "text-danger"
          }, "Request Error.")
        } : {
          content: _react["default"].createElement(Component, _extends({
            Response: d || {},
            ResponseData: r
          }, params))
        };

        _this2.setState(ob);
      });
    }
  }, {
    key: "componentDidCatch",
    value: function componentDidCatch() {
      this.setState({
        content: _react["default"].createElement("span", {
          className: "text-danger"
        }, "Component Crashed.")
      });
    }
  }, {
    key: "render",
    value: function render() {
      return this.state.content;
    }
  }]);

  return Placeholder;
}(_react.Component);

exports.Placeholder = Placeholder;