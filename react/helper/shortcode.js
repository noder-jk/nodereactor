"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.do_shortcode = void 0;

var _react = _interopRequireDefault(require("react"));

var _compFinder = require("nodereactor/react/helper/comp-finder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var do_shortcode = function do_shortcode(str) {
  var pack = '';
  var properties = {};
  var comp_name = str.slice(1, ind);
  /* Parse properties */

  var ind = str.indexOf(' ');
  ind = ind > -1 ? ind : str.indexOf(']');
  var props = str.indexOf('properties=');

  if (props > -1) {
    properties = JSON.parse(str.slice(props, str.lastIndexOf('}') + 1).trim());
  }
  /* Parse package name */


  pack = str.split('package=')[1];
  ind = pack.indexOf(' ');
  ind = ind > -1 ? ind : str.indexOf(']');
  pack = pack.slice(0, ind);
  var comp_props = {
    'component': comp_name,
    'nr_package': widgets[n].pack
  };
  console.log(comp_props, properties);
  return null; // return <FindComp comp_props={comp_props} {...properties}/>
};

exports.do_shortcode = do_shortcode;