"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dynamic_sidebar = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

var _compFinder = require("../helper/comp-finder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SidebarProcessor = function SidebarProcessor(props) {
  /* Store widget lst in variable, so no need to fetch again. */
  var response = props.response,
      properties = props.properties;

  if (!window.nr_widget_list) {
    window.nr_widget_list = response;
  }
  /* Store simplified alias of widget objects */


  var sidebars = window.nr_widget_list.sidebars;
  var widgets = window.nr_widget_list.widgets;
  var l = window.nr_widget_list.widget_in_sidebar;
  /* Get the sidebar/area id */

  var sidebar_id = properties.sidebar_id,
      WidgetContainer = properties.WidgetContainer;
  /* Store multiple widget component to render output */

  var comps = [];
  /* Check if the area exist in fetched area list */

  if (sidebars[sidebar_id] && l[sidebar_id]) {
    /* Loop through all the widgets that was saved for this area */
    for (var i = 0; i < l[sidebar_id].length; i++) {
      /* Simplify alias */
      var s = l[sidebar_id][i];
      /* Loop through all actual registered available widgets */

      for (var n = 0; n < widgets.length; n++) {
        var w = widgets[n];
        /* Now load the component to render actual widget */

        if (w.nr_package == s.nr_package && w.id == s.widget_id) {
          comps.push(_react["default"].createElement(WidgetContainer, {
            key: s.key,
            title: s.properties.nr_widget_title
          }, _react["default"].createElement(_compFinder.FindComp, _extends({
            comp_props: {
              'component': w.output_component,
              'nr_package': s.nr_package
            }
          }, s.properties))));
        }
      }
    }
  }

  return comps;
};

var dynamic_sidebar = function dynamic_sidebar(sidebar_id, container) {
  var props = {
    'sidebar_id': sidebar_id,
    'WidgetContainer': container
  };

  if (window.nr_widget_list) {
    return _react["default"].createElement(SidebarProcessor, {
      response: window.nr_widget_list,
      properties: props
    });
  }

  return _react["default"].createElement(_react2.Placeholder, {
    action: "nr_get_widget_list",
    Data: {
      'sidebar': sidebar_id
    },
    component: SidebarProcessor,
    properties: props
  });
};

exports.dynamic_sidebar = dynamic_sidebar;