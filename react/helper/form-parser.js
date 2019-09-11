"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse_input_value = exports.parse_dom_form = void 0;

var parse_input_value = function parse_input_value(el, values) {
  var name = el.name,
      type = el.type,
      checked = el.checked,
      value = el.value;

  switch (type) {
    case 'checkbox':
      !Array.isArray(values[name]) ? values[name] = [] : 0;
      var ind = values[name].indexOf(value);

      if (checked == true) {
        // Add to value array if already not exist
        ind == -1 ? values[name].push(value) : 0;
      } else {
        // Remove from value array if exist.
        ind > -1 ? values[name].splice(ind, 1) : 0;
      }

      break;

    case 'radio':
      checked == true ? values[name] = value : 0;
      break;

    default:
      values[name] = value;
  }

  return values;
};

exports.parse_input_value = parse_input_value;

var parse_dom_form = function parse_dom_form(elment) {
  /* Store all the parsed values in values object */
  var values = {};
  var fields = ['INPUT', 'SELECT', 'TEXTAREA'];
  fields.forEach(function (f) {
    var inps = elment.getElementsByTagName(f);

    for (var i = 0; i < inps.length; i++) {
      var inp = inps[i];
      var ignore_attr = inp.dataset ? inp.dataset.ignore : false;

      if (inp.name && ignore_attr !== true && ignore_attr !== 'true') {
        values = parse_input_value(inp, values);
      }
    }
  });
  return values;
};

exports.parse_dom_form = parse_dom_form;