"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaginateLinks = exports.the_previous_url = exports.the_next_url = exports.the_excerpt = exports.the_permalink = exports.the_date = exports.the_author = exports.the_content = exports.the_title = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var the_title = function the_title(item) {
  return _react["default"].createElement(_react2.DoAction, {
    hook: "the_title",
    value: item.post_title,
    apply_filters: false,
    properties: item
  });
};

exports.the_title = the_title;

var the_content = function the_content(item) {
  return _react["default"].createElement(_react2.DoAction, {
    hook: "the_content",
    value: item.post_content,
    danger: true,
    properties: item
  });
};

exports.the_content = the_content;

var the_author = function the_author(item) {
  return _react["default"].createElement(_react2.DoAction, {
    hook: "the_author",
    value: item.display_name,
    properties: item
  });
};

exports.the_author = the_author;

var the_date = function the_date(item, format) {
  var date = (0, _momentTimezone["default"])(item.post_date).tz(window.nr_configs.time_zone).format(format ? format : 'YYYY-MM-DD HH:mma z');
  return _react["default"].createElement(_react2.DoAction, {
    hook: "the_date",
    value: date,
    properties: item
  });
};

exports.the_date = the_date;

var the_excerpt = function the_excerpt(item) {
  return _react["default"].createElement(_react2.DoAction, {
    hook: "the_excerpt",
    value: item.post_excerpt,
    properties: item
  });
};

exports.the_excerpt = the_excerpt;

var the_permalink = function the_permalink(item) {
  return item.post_permalink;
}; // Pagination related functions


exports.the_permalink = the_permalink;

var pager_helper = function pager_helper(key) {
  var resp = '';

  if (!isNaN(key)) {
    // It is multiple post in pages, like term category page
    var q = window.location.search;
    q = q.slice(1);
    q = q.split('&').map(function (item) {
      return item.split('=');
    }).map(function (item) {
      return item[0] == 'page' ? false : item.join('=');
    }).filter(function (item) {
      return item !== false;
    });
    q.push('page=' + key);
    resp = '?' + q.filter(function (item) {
      return typeof item == 'string' && /\S+/.test(item);
    }).join('&');
  } else {
    // It's individual post
    resp = key;
  }

  return resp;
};

var the_next_url = function the_next_url(pagination, key) {
  key = !key ? 'next' : key;
  return _typeof(pagination) == 'object' && pagination[key] ? pager_helper(pagination[key]) : false;
};

exports.the_next_url = the_next_url;

var the_previous_url = function the_previous_url(pagination) {
  return the_next_url(pagination, 'previous');
};

exports.the_previous_url = the_previous_url;

var PaginateLinks = function PaginateLinks(props) {
  var _props$pagination = props.pagination,
      pagination = _props$pagination === void 0 ? {} : _props$pagination,
      wrapper = props.wrapper,
      _props$hide_single = props.hide_single,
      hide_single = _props$hide_single === void 0 ? true : _props$hide_single,
      _props$class_name = props.class_name,
      class_name = _props$class_name === void 0 ? '' : _props$class_name,
      _props$active_class = props.active_class,
      active_class = _props$active_class === void 0 ? 'current' : _props$active_class;

  var _ref = pagination || {},
      _ref$pages = _ref.pages,
      pages = _ref$pages === void 0 ? [] : _ref$pages,
      _ref$current = _ref.current,
      current = _ref$current === void 0 ? false : _ref$current;

  var Wrapper = wrapper;
  return pages.length <= 1 && hide_single ? null : pages.map(function (content) {
    // Get url and page number
    var url = pager_helper(content.url || content);
    var page = _typeof(content) == 'object' ? content.page + 1 : content; // Generate class name

    var className = class_name + ' ' + (current == (content.url || content) ? active_class : '');

    var anchor = _react["default"].createElement("a", _extends({
      key: url,
      href: url,
      className: className
    }, props), page);

    return Wrapper ? _react["default"].createElement(Wrapper, null, anchor) : anchor;
  });
};

exports.PaginateLinks = PaginateLinks;