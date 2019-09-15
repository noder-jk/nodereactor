"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apply_filters = exports.DoAction = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var invokeHooks = function invokeHooks(h_name, single_hook, properties) {
  var before = false;
  var comps_ar = []; // Loop through all the hook object keys

  var _loop = function _loop(n) {
    if (n !== h_name) {
      return "continue";
    } // Make object if its component directly, rather than defining before, component property.


    if (typeof single_hook[n] == 'function') {
      single_hook[n] = {
        'component': single_hook[n],
        'before': false
      };
    } // Check if the name matches with desired hook, and if it's object.


    if (_typeof(single_hook[n]) == 'object' && single_hook[n].component) {
      // decide if it should be appended or prepended.
      before = single_hook[n].before == true; // Make component array if not already

      var comps = single_hook[n].component;
      !Array.isArray(comps) ? comps = [comps] : 0; // Loop through all the components in component array

      comps.forEach(function (C) {
        // This block is to add content before/after specific hook
        comps_ar.push(_react["default"].createElement(C, {
          key: h_name + '_' + n,
          properties: properties
        }));
      });
    }
  };

  for (var n in single_hook) {
    var _ret = _loop(n);

    if (_ret === "continue") continue;
  }

  return {
    position: before ? 'unshift' : 'push',
    content: comps_ar
  };
};

var DoAction = function DoAction(props) {
  var comps = window.nr_vendor_comps;
  var _props$hook = props.hook,
      hook = _props$hook === void 0 ? '' : _props$hook,
      _props$danger = props.danger,
      danger = _props$danger === void 0 ? false : _props$danger,
      _props$value = props.value,
      value = _props$value === void 0 ? '' : _props$value,
      _props$properties = props.properties,
      properties = _props$properties === void 0 ? {} : _props$properties;
  var apply_filt = props.apply_filters == undefined ? true : props.apply_filters; // Filter the string

  apply_filt ? value = apply_filters(hook, value, properties) : 0; // Now do shortcode (if necessary) and make array

  value = danger == true ? [(0, _react2.do_shortcodes)(value)] : [value];
  /* Loop through all node type, theme and plugin to find hook */

  for (var k in comps) {
    /* Loop through individual node (theme and plugin) */
    for (var i = 0; i < comps[k].length; i++) {
      /* Check if the specified hook is available in the node */
      if (comps[k][i] && comps[k][i].component && _typeof(comps[k][i].component.action_hooks) == 'object') {
        var hooks = comps[k][i].component.action_hooks;
        /* Check the hook type, multiple or single, position defined or not. */
        // It needs to be array, because devs might need to attach multiple handler to same hook.
        // So it would be something like this [{the_title:Comp}, {the_title:Comp2}] and so on

        !Array.isArray(hooks) ? hooks = [hooks] : 0; // Loop through 

        hooks.forEach(function (h) {
          var _invokeHooks = invokeHooks(hook, h, properties),
              position = _invokeHooks.position,
              content = _invokeHooks.content;

          value[position](content);
        });
      }
    }
  }

  return value;
};

exports.DoAction = DoAction;

var apply_filters = function apply_filters(hook_name, str, props) {
  if (typeof str !== 'string') {
    return str;
  }

  var comps = window.nr_vendor_comps;
  /* Loop through all node type, theme and plugin to find hook */

  for (var k in comps) {
    /* Loop through individual node (theme and plugin) */
    for (var i = 0; i < comps[k].length; i++) {
      /* Check if the specified hook is available in the node */
      if (comps[k][i] && comps[k][i].component && _typeof(comps[k][i].component.filter_hooks) == 'object') {
        var hooks = comps[k][i].component.filter_hooks;

        if (hooks[hook_name]) {
          var hk = hooks[hook_name];
          !Array.isArray(hk) ? hk = [hk] : 0; // Call the filter function

          hk.forEach(function (h) {
            return typeof h == 'function' ? str = h(str, props) : 0;
          });
        }
      }
    }
  }

  return str;
};

exports.apply_filters = apply_filters;