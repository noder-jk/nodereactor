"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstalledPlugins = void 0;

var _react = _interopRequireWildcard(require("react"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

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

var ProcessPlugins =
/*#__PURE__*/
function (_Component) {
  _inherits(ProcessPlugins, _Component);

  function ProcessPlugins(props) {
    var _this;

    _classCallCheck(this, ProcessPlugins);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProcessPlugins).call(this, props));
    var plugins = _this.props.ResponseData;
    var ob = {};

    for (var k in plugins) {
      ob[k] = plugins[k];
    }

    _this.state = {
      'plugins': ob
    };
    _this.activateDeactivate = _this.activateDeactivate.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ProcessPlugins, [{
    key: "activateDeactivate",
    value: function activateDeactivate(e, pkg, t_do) {
      var _this2 = this;

      e.preventDefault();
      var dt = {
        type: 'plugin',
        to_do: t_do,
        node_package: pkg
      };
      (0, _react2.ajaxRequest)('nr_theme_plugin_action', dt, function (r, d, e) {
        if (e) {
          _sweetalert["default"].fire('Request Error');

          return;
        }

        if (r.status !== 'done') {
          _sweetalert["default"].fire('Action failed.');

          return;
        }

        var pl = _this2.state.plugins;
        pl[pkg].activated = dt.to_do == 'activate' ? true : false;

        _this2.setState({
          'plugins': pl
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var plugins = this.props.ResponseData;
      return _react["default"].createElement("div", {
        id: "installed_plugins"
      }, _react["default"].createElement("h3", null, "Installed Plugins"), _react["default"].createElement("table", {
        className: "table table-bordered"
      }, _react["default"].createElement("thead", null, _react["default"].createElement("tr", null, _react["default"].createElement("th", null, "Name"), _react["default"].createElement("th", null, "Author"), _react["default"].createElement("th", null, "Description"), _react["default"].createElement("th", null, "Version"), _react["default"].createElement("th", null, "License"))), _react["default"].createElement("tbody", null, Object.keys(plugins).map(function (k) {
        var ind_p = _this3.state.plugins[k] || {};
        var _plugins$k$author = plugins[k].author,
            author = _plugins$k$author === void 0 ? {} : _plugins$k$author;
        var _author$name = author.name,
            name = _author$name === void 0 ? '' : _author$name,
            _author$url = author.url,
            url = _author$url === void 0 ? false : _author$url;
        return _react["default"].createElement("tr", {
          key: k,
          className: ind_p.activated ? 'activated_plugin' : 'deactivated_plugin'
        }, _react["default"].createElement("td", null, k, _react["default"].createElement("div", {
          className: "mt-4"
        }, _react["default"].createElement("a", {
          className: "activate_plugin text-success",
          onClick: function onClick(e) {
            return _this3.activateDeactivate(e, k, 'activate');
          }
        }, "Activate"), _react["default"].createElement("a", {
          className: "deactivate_plugin text-danger",
          onClick: function onClick(e) {
            return _this3.activateDeactivate(e, k, 'deactivate');
          }
        }, "Deactivate"))), _react["default"].createElement("td", null, !url ? name : _react["default"].createElement("a", {
          href: url,
          target: "_blank"
        }, name)), _react["default"].createElement("td", null, plugins[k].description), _react["default"].createElement("td", null, plugins[k].version), _react["default"].createElement("td", null, plugins[k].license));
      }))));
    }
  }]);

  return ProcessPlugins;
}(_react.Component);

var InstalledPlugins = function InstalledPlugins() {
  return _react["default"].createElement(_react2.Placeholder, {
    Data: {
      'action': 'nr_get_plugins'
    },
    Component: ProcessPlugins
  });
};

exports.InstalledPlugins = InstalledPlugins;