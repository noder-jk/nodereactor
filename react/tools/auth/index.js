"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginRegistration = void 0;

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("nodereactor/react");

var _reactHelmet = require("react-helmet");

var _axios = _interopRequireDefault(require("axios"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
      user_username: '',
      user_password: '',
      'loading': false
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.Login = _this.Login.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(LoginRegistration, [{
    key: "handleChange",
    value: function handleChange(event) {
      this.setState(_defineProperty({}, event.target.name, event.target.value));
    }
  }, {
    key: "Login",
    value: function Login() {
      var _this2 = this;

      this.setState({
        'loading': true
      });
      (0, _axios.default)({
        method: 'post',
        url: _react2.ajax_url,
        data: Object.assign({
          'action': 'nr_login'
        }, this.state)
      }).then(function (r) {
        if (r.data && r.data.status == 'done' && r.data.go_to) {
          window.location.assign(r.data.go_to);
        } else {
          _sweetalert.default.fire('Error', r.data.message ? r.data.message : 'Something went wrong. Could not login.', 'error');
        }

        _this2.setState({
          'loading': false
        });
      }).catch(function (r) {
        _sweetalert.default.fire('Error', 'Something went wrong.', 'error');

        _this2.setState({
          'loading': false
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "container-fluid"
      }, _react.default.createElement(_reactHelmet.Helmet, null, _react.default.createElement("title", null, "NodeReactor Login")), _react.default.createElement("div", {
        className: "container login_container"
      }, _react.default.createElement("p", {
        className: "text-right"
      }, _react.default.createElement("i", null, "Login . . . "), " ", this.state.loading ? _react.default.createElement(_reactSvgSpinner.default, {
        size: "15px"
      }) : null), _react.default.createElement("br", null), _react.default.createElement("b", null, "Username or Email Address"), _react.default.createElement("input", {
        name: "user_username",
        className: "form-control",
        type: "text",
        onChange: this.handleChange
      }), _react.default.createElement("br", null), _react.default.createElement("b", null, "Password"), _react.default.createElement("input", {
        name: "user_password",
        className: "form-control",
        type: "text",
        onChange: this.handleChange
      }), _react.default.createElement("br", null), _react.default.createElement("div", {
        className: "right"
      }, _react.default.createElement("button", {
        className: "btn btn-secondary",
        onClick: this.Login
      }, "Log In"))));
    }
  }]);

  return LoginRegistration;
}(_react.Component);

exports.LoginRegistration = LoginRegistration;