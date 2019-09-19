"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitFrontEnd = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _react2 = require("nodereactor/react");

var _compFinder = require("../helper/comp-finder");

var _core = require("../hooks/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var InitFrontEnd =
/*#__PURE__*/
function (_Component) {
  _inherits(InitFrontEnd, _Component);

  function InitFrontEnd(props) {
    var _this;

    _classCallCheck(this, InitFrontEnd);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InitFrontEnd).call(this, props));
    _this.state = {
      'content': _react["default"].createElement("div", {
        className: "text-center"
      }, _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }))
    };
    return _this;
  }

  _createClass(InitFrontEnd, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var pathname = window.location.pathname;
      (0, _react2.ajax_request)('get_init_frontend' + window.location.search, {
        pathname: pathname
      }, function (r, d, e) {
        if (e) {
          _this2.setState({
            'content': _react["default"].createElement("p", {
              className: "text-center text-danger"
            }, "Request Error.")
          });

          return;
        }

        var _r$nr_configs = r.nr_configs,
            nr_configs = _r$nr_configs === void 0 ? {} : _r$nr_configs;
        var _nr_configs$nr_packag = nr_configs.nr_package,
            nr_package = _nr_configs$nr_packag === void 0 ? ' ' : _nr_configs$nr_packag,
            _nr_configs$component = nr_configs.component,
            component = _nr_configs$component === void 0 ? 'Index' : _nr_configs$component,
            _nr_configs$redirect_ = nr_configs.redirect_to,
            redirect_to = _nr_configs$redirect_ === void 0 ? false : _nr_configs$redirect_;

        if (redirect_to !== false) {
          window.location.replace(redirect_to);
          return;
        }

        var params = Object.assign({}, r);
        delete params.nr_configs;
        /* Parameters to pass to theme component finder. */

        var find_params = {
          'nr_package': nr_package,
          'component': component,
          'fallback_component': 'Index'
        }; // Store contents in global scope

        window.nr_contents = params;
        /* Now load the theme component */

        _this2.setState({
          'content': _react["default"].createElement("div", null, _react["default"].createElement(_core.InitTheme, null), _react["default"].createElement(_compFinder.FindComp, _extends({
            comp_props: find_params
          }, params)))
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return this.state.content;
    }
  }]);

  return InitFrontEnd;
}(_react.Component);

exports.InitFrontEnd = InitFrontEnd;