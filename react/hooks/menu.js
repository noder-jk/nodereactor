"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nr_nav_menu = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var MenuProcessor = function MenuProcessor(props) {
  /* Store widget lst in variable, so no need to fetch again. */
  window.nr_menu_list = props.ResponseData;
  var _props$id = props.id,
      id = _props$id === void 0 ? '' : _props$id,
      _props$menu_name = props.menu_name,
      menu_name = _props$menu_name === void 0 ? false : _props$menu_name,
      _props$li_class = props.li_class,
      li_class = _props$li_class === void 0 ? '' : _props$li_class,
      _props$ul_class = props.ul_class,
      ul_class = _props$ul_class === void 0 ? '' : _props$ul_class,
      _props$anchor_class = props.anchor_class,
      anchor_class = _props$anchor_class === void 0 ? '' : _props$anchor_class,
      _props$li_active_clas = props.li_active_class,
      li_active_class = _props$li_active_clas === void 0 ? '' : _props$li_active_clas,
      _props$Renderer = props.Renderer,
      Renderer = _props$Renderer === void 0 ? false : _props$Renderer;
  var menus = window.nr_menu_list || {};
  var render_menus = [];

  if (menu_name !== false) {
    /* This block collect menu by menu name itself. not by location. */
    if (menus[menu_name]) {
      render_menus.push(menus[menu_name].items);
    }
  } else {
    /* This block collects menus by menu location. */
    Object.keys(menus).map(function (item) {
      if (menus[item].association && Array.isArray(menus[item].association) && menus[item].association.indexOf(id) > -1) {
        render_menus.push(menus[item].items);
      }
    });
  }

  if (Renderer) {
    return _react.default.createElement(Renderer, {
      menus: render_menus
    });
  }
  /* Loop through all menus recursively */


  var recurs = function recurs(menu) {
    if (Array.isArray(menu)) {
      return _react.default.createElement("ul", {
        key: menu.key,
        className: ul_class
      }, menu.map(function (m) {
        return recurs(m);
      }));
    } else if (_typeof(menu) == 'object') {
      return _react.default.createElement("li", {
        key: menu.key,
        className: li_class
      }, _react.default.createElement("a", {
        href: menu.url,
        className: anchor_class + (window.location.pathname == menu.url ? li_active_class : '')
      }, menu.title), menu.children && Array.isArray(menu.children) ? recurs(menu.children) : null);
    }

    return null;
  };

  return render_menus.map(function (item) {
    return recurs(item);
  });
};

var nr_nav_menu = function nr_nav_menu(props) {
  if (window.nr_menu_list) {
    return _react.default.createElement(MenuProcessor, {
      ResponseData: window.nr_menu_list,
      properties: props
    });
  }

  return _react.default.createElement(_react2.Placeholder, _extends({
    Data: {
      'action': 'nr_get_menu_for_visitor'
    },
    Component: MenuProcessor
  }, props));
};

exports.nr_nav_menu = nr_nav_menu;