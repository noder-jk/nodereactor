"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FindActionHook = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var FindActionHook = function FindActionHook(props) {
  var comps = window.nr_vendor_comps;
  var _props$hook = props.hook,
      hook = _props$hook === void 0 ? '' : _props$hook,
      _props$danger = props.danger,
      danger = _props$danger === void 0 ? false : _props$danger;
  var _props$value = props.value,
      value = _props$value === void 0 ? '' : _props$value,
      _props$properties = props.properties,
      properties = _props$properties === void 0 ? {} : _props$properties;
  value = danger == true ? [_react["default"].createElement("div", {
    className: "nr-dangerous-html",
    key: "danger_html_" + hook,
    dangerouslySetInnerHTML: {
      __html: value
    }
  })] : [value];
  /* Loop through all node type, theme and plugin to find hook */

  for (var k in comps) {
    /* Loop through individual node (theme and plugin) */
    for (var i = 0; i < comps[k].length; i++) {
      /* Check if the specified hook is available in the node */
      if (comps[k][i] && comps[k][i].component && comps[k][i].component.action_hooks) {
        var hooks = comps[k][i].component.action_hooks;
        /* Check the hook type, multiple or single, position defined or not. */

        if (Array.isArray(hooks)) {
          for (var n = 0; n < hooks.length; n++) {
            if (_typeof(hooks[n]) == 'object' && !Array.isArray(hooks[n]) && hooks[n][hook]) {
              var Method = {
                'h': hooks[n][hook]
                /* Add hook before or after based on developers preference */

              };
              value[hooks[n].before == true ? 'unshift' : 'push'](_react["default"].createElement(Method.h, {
                key: k + '_' + i + '_hook',
                properties: properties
              }, value));
            }
          }
        } else if (_typeof(hooks) == 'object' && hooks[hook]) {
          /* It is single hook. So directly add after the hook caller. */
          var Hook = {
            'h': hooks[hook]
          };
          value.push(_react["default"].createElement(Hook.h, {
            key: k + '_' + i,
            properties: properties
          }, value));
        }
      }
    }
  }

  return value;
};

exports.FindActionHook = FindActionHook;