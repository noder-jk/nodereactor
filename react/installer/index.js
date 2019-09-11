"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeReactorInstaller = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactHelmet = _interopRequireDefault(require("react-helmet"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _react2 = require("nodereactor/react");

require("./style.css");

var _banner = _interopRequireDefault(require("./banner.jpg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var NodeReactorInstaller =
/*#__PURE__*/
function (_Component) {
  _inherits(NodeReactorInstaller, _Component);

  function NodeReactorInstaller(props) {
    var _this;

    _classCallCheck(this, NodeReactorInstaller);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NodeReactorInstaller).call(this, props));
    _this.state = {
      active_tab: 'db',
      db_name: '',
      db_username: 'root',
      db_password: '',
      db_host: 'localhost',
      db_engine: 'InnoDB',
      tb_prefix: 'nr_',
      user_display_name: '',
      user_username: '',
      user_email: '',
      user_password: '',
      loading: false
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.goNext = _this.goNext.bind(_assertThisInitialized(_this));
    _this.input = _this.input.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(NodeReactorInstaller, [{
    key: "input",
    value: function input(props) {
      var title = props.title,
          name = props.name;
      return _react["default"].createElement("div", {
        className: "row"
      }, _react["default"].createElement("div", {
        className: "col-12 col-sm-5"
      }, _react["default"].createElement("b", null, title)), _react["default"].createElement("div", {
        className: "col-12 col-sm-7"
      }, _react["default"].createElement("input", {
        onChange: this.handleChange,
        className: "form-control",
        name: name,
        type: "text",
        defaultValue: this.state[name]
      })));
    }
  }, {
    key: "showHide",
    value: function showHide(tab) {
      return this.state.active_tab == tab ? {} : {
        'display': 'none'
      };
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      this.setState(_defineProperty({}, event.target.name, event.target.value));
    }
  }, {
    key: "goNext",
    value: function goNext(install_now) {
      var _this2 = this;

      var to_do = 'check_db';
      var next_tab = 'account';

      if (install_now == true) {
        if (!confirm('Existing table will be replaced. It can not be undone. Sure to continue?')) {
          return;
        }

        to_do = 'set_up';
        next_tab = 'login';
      }

      if (/\S+/.test(this.state.db_name) == false) {
        _sweetalert["default"].fire('Attention', 'Please enter database name', 'warning');

        return;
      }

      this.setState({
        'loading': true
      });
      (0, _react2.ajax_request)('nr_install_check', _objectSpread({
        to_do: to_do
      }, this.state), function (r, d, e) {
        _this2.setState({
          'loading': false
        });

        if (e) {
          _sweetalert["default"].fire('Error', 'Could not connect server.', 'error');

          return;
        }

        var _r$status = r.status,
            status = _r$status === void 0 ? 'error' : _r$status,
            _r$message = r.message,
            message = _r$message === void 0 ? 'Could not process request. Please make sure configs are correct.' : _r$message;

        if (status !== 'success') {
          _sweetalert["default"].fire('Error', message, 'error');

          return;
        }

        _this2.setState({
          active_tab: next_tab
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return _react["default"].createElement("main", {
        id: "installer_main"
      }, _react["default"].createElement(_reactHelmet["default"], null, _react["default"].createElement("title", null, "NodeReactor Installation")), _react["default"].createElement("br", null), _react["default"].createElement("div", {
        className: "text-center"
      }), _react["default"].createElement("div", {
        className: "text-center installation_steps",
        id: "get_config"
      }, _react["default"].createElement("img", {
        src: _banner["default"],
        style: {
          'width': '100%'
        }
      }), _react["default"].createElement("small", null, "Inspired by WordPress.")), _react["default"].createElement("div", {
        className: "text-center"
      }, this.state.loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null), _react["default"].createElement("div", {
        className: "installation_steps",
        id: "get_config",
        style: this.showHide('db')
      }, _react["default"].createElement("h4", null, "Database Information"), _react["default"].createElement("hr", null), _react["default"].createElement("p", null, "Enter database connection details.", _react["default"].createElement("span", {
        style: {
          "color": "#aa0000"
        }
      }, "Please make sure MySQL database is running. And rememeber,", _react["default"].createElement("b", null, "existing table with same name will be replaced"), "."), "Visit ", _react["default"].createElement("a", {
        href: "http://NodeReactor.com/getting-started/installation/",
        target: "_blank"
      }, "installation"), " tutorial for details and using existing tables."), _react["default"].createElement(this.input, {
        title: "Database Name",
        name: "db_name"
      }), _react["default"].createElement("br", null), _react["default"].createElement(this.input, {
        title: "Database Username",
        name: "db_username"
      }), _react["default"].createElement("br", null), _react["default"].createElement(this.input, {
        title: "Database Password",
        name: "db_password"
      }), _react["default"].createElement("br", null), _react["default"].createElement(this.input, {
        title: "Database Host",
        name: "db_host"
      }), _react["default"].createElement("br", null), _react["default"].createElement(this.input, {
        title: "Table Prefix",
        name: "tb_prefix"
      }), _react["default"].createElement("br", null), _react["default"].createElement(this.input, {
        title: "Database Engine",
        name: "db_engine"
      }), _react["default"].createElement("br", null), _react["default"].createElement("div", {
        className: "text-right"
      }, _react["default"].createElement("button", {
        "data-button": "submit",
        className: "btn btn-secondary",
        onClick: this.goNext
      }, "Next"))), _react["default"].createElement("div", {
        className: "installation_steps",
        id: "siteinfo",
        style: this.showHide('account')
      }, _react["default"].createElement("h4", null, "Information needed"), _react["default"].createElement("hr", null), _react["default"].createElement("p", null, "Please provide the following information to create admin account. ", _react["default"].createElement("br", null), _react["default"].createElement("small", null, "Don\u2019t worry, you can always change these (except username) in setting page later.")), _react["default"].createElement(this.input, {
        title: "Display Name",
        name: "user_display_name"
      }), _react["default"].createElement("br", null), _react["default"].createElement(this.input, {
        title: "Username",
        name: "user_username"
      }), _react["default"].createElement("br", null), _react["default"].createElement(this.input, {
        title: "Password",
        name: "user_password"
      }), _react["default"].createElement("br", null), _react["default"].createElement(this.input, {
        title: "Email",
        name: "user_email"
      }), _react["default"].createElement("br", null), _react["default"].createElement("div", {
        className: "text-right"
      }, _react["default"].createElement("button", {
        className: "btn btn-secondary",
        onClick: function onClick() {
          _this3.setState({
            'active_tab': 'db'
          });
        }
      }, "Back"), "\xA0\xA0", _react["default"].createElement("button", {
        className: "btn btn-secondary",
        onClick: function onClick() {
          return _this3.goNext(true);
        }
      }, "Install"))), _react["default"].createElement("div", {
        className: "installation_steps",
        id: "login_hint",
        style: this.showHide('login')
      }, _react["default"].createElement("h2", null, "Success!"), _react["default"].createElement("hr", null), _react["default"].createElement("p", null, "NodeReactor has been installed. Now you may login using account info you submitted during installation."), _react["default"].createElement("br", null), _react["default"].createElement(_react2.LoginRegistration, null)));
    }
  }]);

  return NodeReactorInstaller;
}(_react.Component);

exports.NodeReactorInstaller = NodeReactorInstaller;