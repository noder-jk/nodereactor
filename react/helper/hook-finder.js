"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FindActionHook = void 0;

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
    } // Make object if its component directly


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

var FindActionHook = function FindActionHook(props) {
  var comps = window.nr_vendor_comps;
  var _props$hook = props.hook,
      hook = _props$hook === void 0 ? '' : _props$hook,
      _props$danger = props.danger,
      danger = _props$danger === void 0 ? false : _props$danger,
      _props$value = props.value,
      value = _props$value === void 0 ? '' : _props$value,
      _props$properties = props.properties,
      properties = _props$properties === void 0 ? {} : _props$properties;
  value = danger == true ? [(0, _react2.do_shortcodes)(value)] : [value];
  /* Loop through all node type, theme and plugin to find hook */

  for (var k in comps) {
    /* Loop through individual node (theme and plugin) */
    for (var i = 0; i < comps[k].length; i++) {
      /* Check if the specified hook is available in the node */
      if (comps[k][i] && comps[k][i].component && _typeof(comps[k][i].component.action_hooks) == 'object') {
        var hooks = comps[k][i].component.action_hooks;
        /* Check the hook type, multiple or single, position defined or not. */

        !Array.isArray(hooks) ? hooks = [hooks] : 0;
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

exports.FindActionHook = FindActionHook;