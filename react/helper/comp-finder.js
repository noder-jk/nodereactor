"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FindComp = void 0;

var _react = _interopRequireDefault(require("react"));

var AdminComps = _interopRequireWildcard(require("../admin/dashboard/pages"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var FindComp = function FindComp(props) {
  var vendor_comps = window.nr_vendor_comps;
  var _props$comp_props = props.comp_props,
      comp_props = _props$comp_props === void 0 ? {} : _props$comp_props;
  var _comp_props$nr_packag = comp_props.nr_package,
      nr_package = _comp_props$nr_packag === void 0 ? false : _comp_props$nr_packag,
      component = comp_props.component,
      _comp_props$fallback_ = comp_props.fallback_component,
      fallback_component = _comp_props$fallback_ === void 0 ? false : _comp_props$fallback_,
      _comp_props$fallback_2 = comp_props.fallback_content,
      fallback_content = _comp_props$fallback_2 === void 0 ? false : _comp_props$fallback_2;
  var params = Object.assign({}, props);
  delete params.comp_props;

  var default_resp = fallback_content || _react["default"].createElement("small", {
    className: "text-danger"
  }, "Component ", _react["default"].createElement("u", null, _react["default"].createElement("b", null, _react["default"].createElement("i", null, component))), " not found.");

  if (nr_package === true) {
    if (AdminComps[component]) {
      /* If it's admin component */
      var Cmp = {
        c: AdminComps[component]
      };
      return _react["default"].createElement(Cmp.c, params);
    }
  } else {
    var ret = function ret(component) {
      /* Find in third party components, theme and plugins. */
      for (var node_type in vendor_comps) {
        for (var i = 0; i < vendor_comps[node_type].length; i++) {
          var node = vendor_comps[node_type][i];

          if (node.component && node.nr_package == nr_package && node.component[component]) {
            var Cmpc = {
              c: node.component[component]
            };
            return _react["default"].createElement(Cmpc.c, params);
          }
        }
      }

      return false;
    };

    var resp = ret(component);

    if (!resp && fallback_component) {
      resp = ret(fallback_component);

      if (!resp) {
        return _react["default"].createElement("small", {
          className: "text-danger"
        }, "Component ", _react["default"].createElement("u", null, _react["default"].createElement("b", null, _react["default"].createElement("i", null, component))), " not found.", component == fallback_component ? null : _react["default"].createElement("span", null, "Also fallback component", _react["default"].createElement("u", null, _react["default"].createElement("b", null, _react["default"].createElement("i", null, fallback_component))), "not found."));
      }
    }

    if (resp) {
      return resp;
    }
  }

  return default_resp;
};

exports.FindComp = FindComp;