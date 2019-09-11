"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuWidgetOutput = exports.MenuWidgetInput = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ProcessMenuInput = function ProcessMenuInput(props) {
  var response = props.response,
      properties = props.properties;
  var menu_widget = response;
  var _properties$ul_class = properties.ul_class,
      ul_class = _properties$ul_class === void 0 ? '' : _properties$ul_class,
      _properties$li_class = properties.li_class,
      li_class = _properties$li_class === void 0 ? '' : _properties$li_class,
      _properties$li_active = properties.li_active_class,
      li_active_class = _properties$li_active === void 0 ? '' : _properties$li_active,
      _properties$anchor_cl = properties.anchor_class,
      anchor_class = _properties$anchor_cl === void 0 ? '' : _properties$anchor_cl,
      _properties$menu_name = properties.menu_names,
      menu_names = _properties$menu_name === void 0 ? [] : _properties$menu_name;
  return _react["default"].createElement("div", null, _react["default"].createElement("small", null, "Menu Name"), Object.keys(menu_widget).map(function (menu_name) {
    return _react["default"].createElement("div", {
      key: menu_name
    }, _react["default"].createElement("input", {
      type: "checkbox",
      name: "menu_names",
      value: menu_name,
      defaultChecked: menu_names.indexOf(menu_name) > -1
    }), " ", menu_name);
  }), _react["default"].createElement("small", null, "UL Class"), _react["default"].createElement("input", {
    type: "text",
    name: "ul_class",
    className: "form-control",
    defaultValue: ul_class
  }), _react["default"].createElement("small", null, "LI Class"), _react["default"].createElement("input", {
    type: "text",
    name: "li_class",
    className: "form-control",
    defaultValue: li_class
  }), _react["default"].createElement("small", null, "LI Active Class"), _react["default"].createElement("input", {
    type: "text",
    name: "li_active_class",
    className: "form-control",
    defaultValue: li_active_class
  }), _react["default"].createElement("small", null, "Anchor Class"), _react["default"].createElement("input", {
    type: "text",
    name: "anchor_class",
    className: "form-control",
    defaultValue: anchor_class
  }));
};

var MenuWidgetInput = function MenuWidgetInput(props) {
  return _react["default"].createElement(_react2.Placeholder, {
    action: "nr_get_menu_for_visitor",
    component: ProcessMenuInput,
    properties: props
  });
};

exports.MenuWidgetInput = MenuWidgetInput;

var MenuWidgetOutput = function MenuWidgetOutput(props) {
  var _props$menu_names = props.menu_names,
      menu_names = _props$menu_names === void 0 ? [] : _props$menu_names;
  return menu_names.map(function (item) {
    return (0, _react2.nav_menu)({
      'menu_name': item
    });
  });
};

exports.MenuWidgetOutput = MenuWidgetOutput;