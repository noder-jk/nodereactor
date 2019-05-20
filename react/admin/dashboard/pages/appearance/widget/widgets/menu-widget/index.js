"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuWidgetOutput = exports.MenuWidgetInput = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ProcessMenuInput = function ProcessMenuInput(props) {
  var menu_widget = props.ResponseData;
  var _props$ul_class = props.ul_class,
      ul_class = _props$ul_class === void 0 ? '' : _props$ul_class,
      _props$li_class = props.li_class,
      li_class = _props$li_class === void 0 ? '' : _props$li_class,
      _props$li_active_clas = props.li_active_class,
      li_active_class = _props$li_active_clas === void 0 ? '' : _props$li_active_clas,
      _props$anchor_class = props.anchor_class,
      anchor_class = _props$anchor_class === void 0 ? '' : _props$anchor_class,
      _props$menu_names = props.menu_names,
      menu_names = _props$menu_names === void 0 ? [] : _props$menu_names;
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
  return _react["default"].createElement(_react2.Placeholder, _extends({
    Data: {
      'action': 'nr_get_menu_for_visitor'
    },
    Component: ProcessMenuInput
  }, props));
};

exports.MenuWidgetInput = MenuWidgetInput;

var MenuWidgetOutput = function MenuWidgetOutput(props) {
  var _props$menu_names2 = props.menu_names,
      menu_names = _props$menu_names2 === void 0 ? [] : _props$menu_names2;
  return menu_names.map(function (item) {
    return (0, _react2.nav_menu)({
      'menu_name': item
    });
  });
};

exports.MenuWidgetOutput = MenuWidgetOutput;