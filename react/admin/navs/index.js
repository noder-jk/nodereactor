"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNavList = exports.Navigation = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var FaIcons = _interopRequireWildcard(require("@fortawesome/free-solid-svg-icons"));

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

var AdminMenus = false;
var CurrentNav = false;
var OpenedNavRoot = '';
var OpenedNavSlug = '';
var OpenedSubSlug = '';

var getNavList = function getNavList(cback) {
  if (AdminMenus) {
    cback(AdminMenus, CurrentNav);
    return;
  }
  /* Get all admin menus and decide which component will be used to render admin page. */


  (0, _react2.ajaxRequest)('nr_get_admin_nav', function (r, d, e) {
    if (e) {
      cback(false, CurrentNav);
      return;
    }

    var _r$nr_admin_navs = r.nr_admin_navs,
        nr_admin_navs = _r$nr_admin_navs === void 0 ? false : _r$nr_admin_navs;

    if (nr_admin_navs) {
      AdminMenus = nr_admin_navs;
      var p = window.location.pathname;
      p = p.split('/').filter(function (item) {
        return item !== '';
      });
      /* Set default page if access to only /nr-admin */

      if (window.location.pathname == '/nr-admin' || window.location.pathname == '/nr-admin/') {
        p[1] = 'index';
        p[2] = 'dashboard';
      }

      if (p[2] && AdminMenus[p[1]]) {
        if (AdminMenus[p[1]].main && AdminMenus[p[1]].main.slug == p[2]) {
          /* This block determine main active nav */
          OpenedNavRoot = p[1];
          CurrentNav = AdminMenus[p[1]].main;
        } else if (AdminMenus[p[1]].sub) {
          /* This block determine active sub nav  */
          OpenedNavRoot = p[1];
          var s = AdminMenus[p[1]].sub.filter(function (item) {
            return item.slug == p[2];
          });
          CurrentNav = s.length == 1 ? s[0] : false;
          OpenedSubSlug = CurrentNav && CurrentNav.slug ? CurrentNav.slug : '';
        }

        OpenedNavSlug = AdminMenus[p[1]].main && AdminMenus[p[1]].main.slug ? AdminMenus[p[1]].main.slug : '';
      }
    }

    cback(AdminMenus, CurrentNav);
  });
};

exports.getNavList = getNavList;

var ProcessNav =
/*#__PURE__*/
function (_Component) {
  _inherits(ProcessNav, _Component);

  function ProcessNav(props) {
    var _this;

    _classCallCheck(this, ProcessNav);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProcessNav).call(this, props));
    _this.state = {
      left_offset: '',
      top_offset: '',
      collapsed: false,
      cls: 'fas fa-arrow-left'
    };
    _this.showPopNav = _this.showPopNav.bind(_assertThisInitialized(_this));
    _this.collapseExpand = _this.collapseExpand.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ProcessNav, [{
    key: "showPopNav",
    value: function showPopNav(ttl) {
      /* Show sub floating sub nav on hover */
      if (this.li_tags[ttl]) {
        var el = this.li_tags[ttl];
        var rect = el.getBoundingClientRect();
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var top_o = rect.top + scrollTop;
        var left_o = el.offsetWidth;
        this.setState({
          'top_offset': top_o + 'px',
          'left_offset': left_o + 'px'
        });
      }
    }
  }, {
    key: "collapseExpand",
    value: function collapseExpand(event) {
      /* Collapse/expand left navigation bar when click toggle button at the bottom. */
      event.preventDefault();
      this.setState({
        collapsed: !this.state.collapsed
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      this.li_tags = {};
      var navs = this.props.navs;
      return _react["default"].createElement("aside", {
        id: "nav_aside",
        className: this.state.collapsed ? 'collapsed_asside' : ''
      }, _react["default"].createElement("ul", null, Object.keys(navs).map(function (k) {
        var title = navs[k].main.menu_title;
        var icon = navs[k].main.menu_icon;
        var slug = navs[k].main.slug;
        return _react["default"].createElement("li", {
          key: title,
          onMouseOver: function onMouseOver() {
            return _this2.showPopNav(title);
          },
          ref: function ref(el) {
            return _this2.li_tags[title] = el;
          },
          className: OpenedNavSlug == slug && OpenedNavRoot == k ? 'main-opened' : 'main-closed'
        }, _react["default"].createElement("a", {
          href: '/nr-admin/' + k + '/' + slug
        }, _react["default"].createElement("span", null, FaIcons[icon] ? _react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
          icon: FaIcons[icon]
        }) : null), _react["default"].createElement("span", null, title)), _react["default"].createElement("ul", {
          className: "to_pop_up",
          style: {
            'left': _this2.state.left_offset,
            'top': _this2.state.top_offset
          }
        }, navs[k].sub.map(function (item) {
          var stl = {};

          if (!item.hide_if_not || window.location.pathname.indexOf(item.hide_if_not) === 0) {} else {
            stl.display = 'none';
          }

          return _react["default"].createElement("li", {
            key: item.slug,
            style: stl
          }, _react["default"].createElement("a", {
            href: '/nr-admin/' + k + '/' + item.slug,
            className: OpenedSubSlug == item.slug ? 'active_sub' : ''
          }, item.menu_title));
        })));
      }), _react["default"].createElement("li", {
        className: "main-closed"
      }, _react["default"].createElement("a", {
        href: "/",
        onClick: this.collapseExpand
      }, _react["default"].createElement("span", null, _react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
        icon: this.state.collapsed ? FaIcons.faArrowRight : FaIcons.faArrowLeft
      })), _react["default"].createElement("span", null, "Collapse")))));
    }
  }]);

  return ProcessNav;
}(_react.Component);

var Navigation =
/*#__PURE__*/
function (_Component2) {
  _inherits(Navigation, _Component2);

  function Navigation(props) {
    var _this3;

    _classCallCheck(this, Navigation);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Navigation).call(this, props));
    _this3.state = {
      content: _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      })
    };
    return _this3;
  }

  _createClass(Navigation, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this4 = this;

      getNavList(function (r) {
        if (r) {
          _this4.setState({
            'content': _react["default"].createElement(ProcessNav, {
              navs: r
            })
          });
        } else {
          _this4.setState({
            'content': _react["default"].createElement("span", {
              className: "text-danger"
            }, "Loading Failed")
          });
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return this.state.content;
    }
  }]);

  return Navigation;
}(_react.Component);

exports.Navigation = Navigation;