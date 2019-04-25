"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_hierarchy = exports.Pagination = exports.get_url_parameter = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var get_url_parameter = function get_url_parameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(window.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

exports.get_url_parameter = get_url_parameter;

var Pagination = function Pagination(props) {
  var _props$pgn = props.pgn,
      pgn = _props$pgn === void 0 ? {} : _props$pgn,
      _props$wrapperId = props.wrapperId,
      wrapperId = _props$wrapperId === void 0 ? '' : _props$wrapperId,
      _props$activeClass = props.activeClass,
      activeClass = _props$activeClass === void 0 ? '' : _props$activeClass,
      _props$inactiveClass = props.inactiveClass,
      inactiveClass = _props$inactiveClass === void 0 ? '' : _props$inactiveClass,
      _props$clickEvent = props.clickEvent,
      clickEvent = _props$clickEvent === void 0 ? false : _props$clickEvent;

  if (!pgn.pages || !Array.isArray(pgn.pages) || pgn.pages.length == 0) {
    return null;
  }

  return _react["default"].createElement("div", {
    id: wrapperId
  }, pgn.pages.length > 1 ? pgn.pages.map(function (item) {
    var attr = {
      'href': '?page=' + item,
      'data-offset': item,
      'key': 'offset_' + item,
      'className': item == pgn.current ? activeClass : inactiveClass
    };

    if (clickEvent) {
      attr.onClick = function (e) {
        return clickEvent(e, item);
      };
    }

    return _react["default"].createElement("a", attr, item);
  }) : null);
};

exports.Pagination = Pagination;

var get_hierarchy = function get_hierarchy(arg, parent, id, not_parent) {
  if (!Array.isArray(arg)) {
    return arg;
  }

  var id_key = id;
  var parent_key = parent;
  not_parent = not_parent || 'sttt';
  var ar = [];
  /* Generate nested feelings in flat list */

  var get_space = function get_space(parent, base) {
    arg.map(function (item) {
      if (item[parent_key] == parent && item[id_key] !== not_parent) {
        item.nest_level = base;
        ar.push(item);
        get_space(item[id_key], base + 1);
      }
    });
  };

  get_space(0, 0);
  return ar;
};

exports.get_hierarchy = get_hierarchy;