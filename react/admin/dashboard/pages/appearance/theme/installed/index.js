"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstalledThemes = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _react2 = require("nodereactor/react");

require("./style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var InstalledThemes =
/*#__PURE__*/
function (_Component) {
  _inherits(InstalledThemes, _Component);

  function InstalledThemes(props) {
    var _this;

    _classCallCheck(this, InstalledThemes);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InstalledThemes).call(this, props));
    _this.state = {
      'themes': {},
      'loading': false
    };
    _this.activateTheme = _this.activateTheme.bind(_assertThisInitialized(_this));
    _this.fetchThemes = _this.fetchThemes.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(InstalledThemes, [{
    key: "fetchThemes",
    value: function fetchThemes() {
      var _this2 = this;

      this.setState({
        'loading': true
      });
      (0, _axios["default"])({
        'method': 'post',
        'url': _react2.ajax_url,
        'data': {
          'action': 'nr_get_installed_themes'
        }
      }).then(function (r) {
        var ob = {
          'loading': false
        };

        if (r.data.themes) {
          ob.themes = r.data.themes;
        }

        _this2.setState(ob);
      })["catch"](function (e) {
        _this2.setState({
          'loading': false
        });
      });
    }
  }, {
    key: "activateTheme",
    value: function activateTheme(pkg) {
      var _this3 = this;

      var dt = {
        type: 'theme',
        action: 'nr_theme_plugin_action',
        to_do: 'activate',
        node_package: pkg
      };
      this.setState({
        'loading': true
      });
      (0, _axios["default"])({
        'method': 'post',
        'url': _react2.ajax_url,
        'data': dt
      }).then(function (r) {
        _this3.fetchThemes();
      })["catch"](function (e) {
        _this3.setState({
          'loading': false
        });

        _sweetalert["default"].fire('Error', 'Request Failed. Something went wrong.', 'error');
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchThemes();
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var themes = this.state.themes;
      return _react["default"].createElement("div", {
        className: "row",
        id: "theme_list_cont"
      }, _react["default"].createElement("div", {
        className: "col-12"
      }, _react["default"].createElement("h3", null, "Installed Themes ", this.state.loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null)), Object.keys(themes).map(function (k) {
        var item = themes[k];
        var ind_theme = _this4.state.themes[k] ? _this4.state.themes[k] : {};
        return _react["default"].createElement("div", {
          key: k,
          className: "data_el col-12 col-md-6 col-xl-3 mb-4" + (ind_theme.activated ? ' activated_theme' : '')
        }, _react["default"].createElement("div", {
          className: "theme_thumb_cont"
        }, _react["default"].createElement("div", {
          className: "background_thumb",
          style: {
            'backgroundImage': 'url(' + item.thumbnail + ')'
          }
        }), _react["default"].createElement("div", {
          className: "details_overlay"
        }, _react["default"].createElement("div", {
          className: "theme_detail_btn"
        }, _react["default"].createElement("div", null, _react["default"].createElement("span", null, "Theme Details"), _react["default"].createElement("br", null), _react["default"].createElement("br", null)))), _react["default"].createElement("div", {
          className: "button_container"
        }, _react["default"].createElement("span", {
          style: {
            "float": "left",
            "padding": "6px 0px"
          }
        }, k, "\xA0"), _react["default"].createElement("span", {
          className: "theme_action"
        }, _react["default"].createElement("button", {
          className: "btn btn-info btn-sm float-right",
          onClick: function onClick() {
            return _this4.activateTheme(k);
          }
        }, "Activate \xA0", _this4.state.loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
          size: "15px"
        }) : null)))));
      }));
    }
  }]);

  return InstalledThemes;
}(_react.Component);

exports.InstalledThemes = InstalledThemes;