"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitApp = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _socketIo = _interopRequireDefault(require("socket.io-client/dist/socket.io.js"));

var _core = require("../hooks/core");

var _admin = require("../admin");

var _frontend = require("../frontend");

var _installer = require("../installer");

var _react2 = require("nodereactor/react");

require("bootstrap/dist/css/bootstrap.min.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var InitApp =
/*#__PURE__*/
function (_Component) {
  _inherits(InitApp, _Component);

  function InitApp(props) {
    var _this;

    _classCallCheck(this, InitApp);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InitApp).call(this, props));
    _this.state = {
      content: _react["default"].createElement("div", {
        className: "text-center"
      }, _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }))
    };
    return _this;
  }

  _createClass(InitApp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var req_v = {
        'pathname': window.location.pathname,
        'search': window.location.search
      };
      (0, _react2.ajax_request)('nr_get_init_component', req_v, function (r, x, e) {
        if (e) {
          _this2.setState({
            'content': _react["default"].createElement("p", {
              className: "text-center text-danger"
            }, "Request Failed.")
          });

          return;
        }

        var _r$nr_configs = r.nr_configs,
            nr_configs = _r$nr_configs === void 0 ? {} : _r$nr_configs;
        var configs = nr_configs;
        /* Delete deactivated theme/plugin from vendor components object */

        var new_vendors = {
          'themes': [],
          'plugins': []
        };

        if (_typeof(configs.active_nodes) == 'object') {
          for (var k in window.nr_vendor_comps) {
            /* If there is any other property except theme and plugin delete those. */
            if (!configs.active_nodes[k] || !Array.isArray(window.nr_vendor_comps[k])) {
              continue;
            }
            /* Loop through all theme/plugin and check if the package is in active node. If not, delete. */


            for (var i = 0; i < window.nr_vendor_comps[k].length; i++) {
              var pkg = window.nr_vendor_comps[k][i].nr_package;

              if (pkg && configs.active_nodes[k].indexOf(pkg) > -1 && Array.isArray(new_vendors[k])) {
                new_vendors[k].push(window.nr_vendor_comps[k][i]);
              }
            }
          }
        }

        window.nr_vendor_comps = new_vendors;
        window.nr_configs = configs;
        /* Initialize socket connection */

        if (configs.nr_installed == true) {
          window.nr_socket_client = (0, _socketIo["default"])(configs.nr_home_url);
          /* Set cookie handler for socket request */

          window.nr_socket_client.on('nr_set_cookie_through_socket', function (cookie) {
            var c_ar = Array.isArray(cookie) ? cookie : [];
            c_ar.map(function (item) {
              return document.cookie = item;
            });
          });
        }
        /* Detect which root component to load */


        var comps = {
          InitAdmin: _admin.InitAdmin,
          InitFrontEnd: _frontend.InitFrontEnd,
          LoginRegistration: _react2.LoginRegistration,
          NodeReactorInstaller: _installer.NodeReactorInstaller
        };
        var Comps = {
          'component': _frontend.InitFrontEnd
        };
        /* Check if server specified component exist here */

        if (configs.component && comps[configs.component]) {
          Comps.component = comps[configs.component];
        }

        _this2.setState({
          'content': _react["default"].createElement(Comps.component, nr_configs)
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement("div", null, _react["default"].createElement(_core.Init, null), this.state.content);
    }
  }]);

  return InitApp;
}(_react.Component);

exports.InitApp = InitApp;