"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse_form = void 0;

var ignore_value = function ignore_value(inp_el, ignore) {
  var ignore_attr = inp_el.dataset ? inp_el.dataset.ignore : false;

  if (!inp_el.name || ignore == true && (ignore_attr == true || ignore_attr == 'true')) {
    return false;
  }

  return inp_el;
};

var parse_form = function parse_form(elment, ignore) {
  /* Store all the parsed values in values object */
  var values = {};
  /* As because input type is various, so treat it separately. */

  var inp = elment.getElementsByTagName('INPUT');

  for (var nm = 0; nm < inp.length; nm++) {
    var el = ignore_value(inp[nm], ignore);

    if (!el) {
      continue;
    }

    var name = el.name;
    var value = el.value;
    var type = el.type;
    var checked = el.checked;

    switch (type) {
      case 'radio':
      case 'checkbox':
        if (!checked) {
          continue;
        }

        if (type == 'radio' && !values[name]) {
          values[name] = value;
          continue;
        }

        if (!values[name]) {
          values[name] = [];
        }

        if (Array.isArray(values[name])) {
          values[name].push(value);
        }

        break;

      default:
        values[name] = value;
    }
  }
  /* Now parse other type of value such as text area, select */


  var get_val = function get_val(tag, ignore) {
    for (var n = 0; n < tag.length; n++) {
      var t = ignore_value(tag[n], ignore);

      if (t && !values[t.name]) {
        values[t.name] = t.value;
      }
    }
  };

  get_val(elment.getElementsByTagName('SELECT'), ignore);
  get_val(elment.getElementsByTagName('TEXTAREA'), ignore);
  return values;
};

exports.parse_form = parse_form;