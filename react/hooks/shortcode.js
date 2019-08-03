"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.do_shortcodes = exports.do_shortcode = void 0;

var _react = _interopRequireDefault(require("react"));

var _compFinder = require("nodereactor/react/helper/comp-finder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function trim(s, c) {
  if (c === "]") c = "\\]";
  if (c === "\\") c = "\\\\";
  return s.replace(new RegExp("^[" + c + "]+|[" + c + "]+$", "g"), "");
}

var do_shortcode = function do_shortcode(str) {
  var pack = '';
  var properties = {};
  var comp_name = '';
  /* Parse properties */

  var ind = str.indexOf(' ');
  ind = ind > -1 ? ind : str.indexOf(']');
  comp_name = str.slice(1, ind);
  var props = str.indexOf('properties=');

  if (props > -1) {
    try {
      var prp = str.slice(props + 'properties='.length, str.lastIndexOf('}') + 1);
      prp = prp.trim();
      properties = JSON.parse(prp);
    } catch (e) {}
  }
  /* Parse package name */


  pack = str.split('package=')[1] || '';
  pack = pack.split(' ').filter(function (item) {
    return /\S+/.test(item) == true;
  });
  pack = pack[0] || '';
  pack = trim(pack, ']');
  var comp_props = {
    'component': comp_name,
    'nr_package': pack,
    'fallback_content': str
  };
  return _react["default"].createElement(_compFinder.FindComp, _extends({
    comp_props: comp_props
  }, properties));
};

exports.do_shortcode = do_shortcode;

var do_shortcodes = function do_shortcodes(value_p) {
  var resps = [];
  var s_codes = value_p.match(/\[([a-z0-9_])+(\s.*?)?\]/ig);

  if (!Array.isArray(s_codes) || s_codes.length == 0) {
    resps = _react["default"].createElement("div", {
      className: "nr-dangerous-html",
      key: 'danger_',
      dangerouslySetInnerHTML: {
        __html: value_p
      }
    });
  } else {
    s_codes.forEach(function (c, i) {
      var v = value_p.split(c);

      var raw = _react["default"].createElement("div", {
        className: "nr-dangerous-html",
        key: 'danger_' + i,
        dangerouslySetInnerHTML: {
          __html: v[0] || ''
        }
      });

      resps.push(raw);
      resps.push(_react["default"].createElement("div", {
        className: "nr-shortcode-container",
        key: 'shortcode_' + i
      }, do_shortcode(c)));
      v = v.slice(1);
      value_p = v.join(c);
    });
  }

  return [resps];
};

exports.do_shortcodes = do_shortcodes;