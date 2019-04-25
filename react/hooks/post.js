"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.the_previous_url = exports.the_next_url = exports.the_excerpt = exports.the_permalink = exports.the_date = exports.the_author = exports.the_content = exports.the_title = void 0;

var _react = _interopRequireDefault(require("react"));

var _hookFinder = require("../helper/hook-finder");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var the_title = function the_title(item) {
  return _react["default"].createElement(_hookFinder.FindActionHook, {
    hook: "the_title",
    value: item.post_title,
    properties: {
      'post': item
    }
  });
};

exports.the_title = the_title;

var the_content = function the_content(item) {
  return _react["default"].createElement(_hookFinder.FindActionHook, {
    hook: "the_content",
    value: item.post_content,
    danger: true,
    properties: {
      'post': item
    }
  });
};

exports.the_content = the_content;

var the_author = function the_author(item) {
  return _react["default"].createElement(_hookFinder.FindActionHook, {
    hook: "the_author",
    value: item.display_name,
    properties: {
      'post': item
    }
  });
};

exports.the_author = the_author;

var the_next_url = function the_next_url(pagination, key) {
  var resp = false;
  key = !key ? 'next' : key;

  if (_typeof(pagination) == 'object' && pagination[key]) {
    var q = window.location.search;
    q = q.slice(1);
    q = q.split('&').map(function (item) {
      return item.split('=');
    }).map(function (item) {
      return item[0] == 'page' ? false : item.join('=');
    }).filter(function (item) {
      return item !== false;
    });
    q.push('page=' + pagination[key]);
    resp = '?' + q.filter(function (item) {
      return typeof item == 'string' && /\S+/.test(item);
    }).join('&');
  }

  return resp;
};

exports.the_next_url = the_next_url;

var the_previous_url = function the_previous_url(pagination) {
  return the_next_url(pagination, 'previous');
};

exports.the_previous_url = the_previous_url;

var the_date = function the_date(item, format) {
  var date = (0, _momentTimezone["default"])(item.post_date).tz(window.nr_configs.time_zone).format(format ? format : 'YYYY-MM-DD HH:mma z');
  return _react["default"].createElement(_hookFinder.FindActionHook, {
    hook: "the_date",
    value: date,
    properties: {
      'post': item
    }
  });
};

exports.the_date = the_date;

var the_excerpt = function the_excerpt(item) {
  return _react["default"].createElement(_hookFinder.FindActionHook, {
    hook: "the_excerpt",
    value: item.post_excerpt,
    properties: {
      'post': item
    }
  });
};

exports.the_excerpt = the_excerpt;

var the_permalink = function the_permalink(item) {
  return item.post_permalink;
};

exports.the_permalink = the_permalink;