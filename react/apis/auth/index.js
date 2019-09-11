"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginRegistration = void 0;

var _react = _interopRequireWildcard(require("react"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _react2 = require("nodereactor/react");

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LoginRegistration =
/*#__PURE__*/
function (_Component) {
  _inherits(LoginRegistration, _Component);

  function LoginRegistration(props) {
    var _this;

    _classCallCheck(this, LoginRegistration);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LoginRegistration).call(this, props));
    _this.state = {
      'loading': false
    };
    _this.Login = _this.Login.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(LoginRegistration, [{
    key: "Login",
    value: function Login() {
      var _this2 = this;

      this.setState({
        'loading': true
      });
      var form = (0, _react2.parse_dom_form)(this.auth_form);
      console.log(form);
      (0, _react2.ajax_request)('nr_login', form, function (r, d, e) {
        _this2.setState({
          'loading': false
        });

        if (e) {
          _sweetalert["default"].fire('Error', 'Request Failed. Something Went Wrong.', 'error');

          return;
        }

        var _r$message = r.message,
            message = _r$message === void 0 ? 'Login Unsuccessful.' : _r$message,
            _r$status = r.status,
            status = _r$status === void 0 ? 'error' : _r$status,
            _r$go_to = r.go_to,
            go_to = _r$go_to === void 0 ? false : _r$go_to;

        if (status == 'success' && go_to) {
          window.location.assign(go_to);
          return;
        }

        _sweetalert["default"].fire('Error', message, 'error');
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return _react["default"].createElement("div", {
        className: "container-fluid"
      }, _react["default"].createElement("div", {
        className: "container login_container",
        ref: function ref(el) {
          return _this3.auth_form = el;
        }
      }, _react["default"].createElement("br", null), _react["default"].createElement("b", null, "Username or Email Address"), _react["default"].createElement("input", {
        name: "username",
        className: "form-control",
        type: "text"
      }), _react["default"].createElement("br", null), _react["default"].createElement("b", null, "Password"), _react["default"].createElement("input", {
        name: "password",
        className: "form-control",
        type: "text"
      }), (0, _react2.login)(), _react["default"].createElement("br", null), _react["default"].createElement("div", {
        className: "text-right"
      }, _react["default"].createElement("button", {
        className: "btn btn-secondary",
        onClick: this.Login
      }, "Log In", _react["default"].createElement(_react2.SpinIcon, {
        show: this.state.loading
      })))));
    }
  }]);

  return LoginRegistration;
}(_react.Component);

exports.LoginRegistration = LoginRegistration;