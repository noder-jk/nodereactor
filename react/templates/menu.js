"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nav_menu = void 0;

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("nodereactor/react");

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

var MenuProcessor =
/*#__PURE__*/
function (_Component) {
  _inherits(MenuProcessor, _Component);

  function MenuProcessor(props) {
    var _this;

    _classCallCheck(this, MenuProcessor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MenuProcessor).call(this, props));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(MenuProcessor, [{
    key: "handleClick",
    value: function handleClick(e) {
      var el = e.currentTarget;

      if (!el.href || /\S+/.test(el.href) == false || el.href == '#') {
        e.preventDefault();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      /* Store widget lst in variable, so no need to fetch again. */
      var _this$props = this.props,
          response = _this$props.response,
          properties = _this$props.properties;
      window.nr_menu_list = response;
      var _properties$id = properties.id,
          id = _properties$id === void 0 ? '' : _properties$id,
          _properties$menu_name = properties.menu_name,
          menu_name = _properties$menu_name === void 0 ? false : _properties$menu_name,
          _properties$li_class = properties.li_class,
          li_class = _properties$li_class === void 0 ? '' : _properties$li_class,
          _properties$ul_class = properties.ul_class,
          ul_class = _properties$ul_class === void 0 ? '' : _properties$ul_class,
          _properties$anchor_cl = properties.anchor_class,
          anchor_class = _properties$anchor_cl === void 0 ? '' : _properties$anchor_cl,
          _properties$li_active = properties.li_active_class,
          li_active_class = _properties$li_active === void 0 ? '' : _properties$li_active,
          _properties$Renderer = properties.Renderer,
          Renderer = _properties$Renderer === void 0 ? false : _properties$Renderer;
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
        return _react["default"].createElement(Renderer, {
          menus: render_menus
        });
      }

      var nest = 0;
      /* Loop through all menus recursively */

      var recurs = function recurs(menu) {
        if (Array.isArray(menu)) {
          nest++;
          return _react["default"].createElement("ul", {
            key: 'nest_' + nest,
            className: ul_class
          }, menu.map(function (m) {
            return recurs(m);
          }));
        } else if (_typeof(menu) == 'object') {
          return _react["default"].createElement("li", {
            key: menu.key,
            className: li_class
          }, _react["default"].createElement("a", {
            href: menu.url,
            className: anchor_class + (window.location.pathname == menu.url ? li_active_class : ''),
            onClick: _this2.handleClick
          }, menu.title), menu.children && Array.isArray(menu.children) ? recurs(menu.children) : null);
        }

        return null;
      };

      return render_menus.map(function (item) {
        return recurs(item);
      });
    }
  }]);

  return MenuProcessor;
}(_react.Component);

var nav_menu = function nav_menu(props) {
  if (window.nr_menu_list) {
    return _react["default"].createElement(MenuProcessor, {
      response: window.nr_menu_list,
      properties: props
    });
  }

  return _react["default"].createElement(_react2.Placeholder, {
    action: "nr_get_menu_for_visitor",
    component: MenuProcessor,
    properties: props
  });
};

exports.nav_menu = nav_menu;