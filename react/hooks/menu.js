"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nav_menu = void 0;

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("nodereactor/react");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
      window.nr_menu_list = this.props.ResponseData;
      var _this$props = this.props,
          _this$props$id = _this$props.id,
          id = _this$props$id === void 0 ? '' : _this$props$id,
          _this$props$menu_name = _this$props.menu_name,
          menu_name = _this$props$menu_name === void 0 ? false : _this$props$menu_name,
          _this$props$li_class = _this$props.li_class,
          li_class = _this$props$li_class === void 0 ? '' : _this$props$li_class,
          _this$props$ul_class = _this$props.ul_class,
          ul_class = _this$props$ul_class === void 0 ? '' : _this$props$ul_class,
          _this$props$anchor_cl = _this$props.anchor_class,
          anchor_class = _this$props$anchor_cl === void 0 ? '' : _this$props$anchor_cl,
          _this$props$li_active = _this$props.li_active_class,
          li_active_class = _this$props$li_active === void 0 ? '' : _this$props$li_active,
          _this$props$Renderer = _this$props.Renderer,
          Renderer = _this$props$Renderer === void 0 ? false : _this$props$Renderer;
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
      /* Loop through all menus recursively */


      var recurs = function recurs(menu) {
        if (Array.isArray(menu)) {
          return _react["default"].createElement("ul", {
            key: menu.key,
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
      ResponseData: window.nr_menu_list,
      properties: props
    });
  }

  return _react["default"].createElement(_react2.Placeholder, _extends({
    Data: {
      'action': 'nr_get_menu_for_visitor'
    },
    Component: MenuProcessor
  }, props));
};

exports.nav_menu = nav_menu;