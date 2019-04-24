"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dynamic_sidebar = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _react2 = require("nodereactor/react");

var _compFinder = require("../helper/comp-finder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SidebarProcessor = function SidebarProcessor(props) {
  /* Store widget lst in variable, so no need to fetch again. */
  if (!window.nr_widget_list) {
    var pr = props.ResponseData;
    window.nr_widget_list = props.ResponseData;
  }
  /* Store simplified alias of widget objects */


  var sidebars = window.nr_widget_list.sidebars;
  var widgets = window.nr_widget_list.widgets;
  var l = window.nr_widget_list.widget_in_sidebar;
  /* Get the sidebar/area id */

  var sidebar_id = props.sidebar_id,
      WidgetContainer = props.WidgetContainer;
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

        if (w.node_type == s.node_type && w.nr_package == s.nr_package && w.id == s.widget_id) {
          comps.push(_react.default.createElement(WidgetContainer, {
            key: s.key,
            title: s.properties.nr_widget_title
          }, _react.default.createElement(_compFinder.FindComp, _extends({
            comp_props: {
              'component': w.output_component,
              'node_type': s.node_type,
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
    return _react.default.createElement(SidebarProcessor, {
      ResponseData: window.nr_widget_list,
      properties: props
    });
  }

  return _react.default.createElement(_react2.Placeholder, _extends({
    Data: {
      'action': 'nr_get_widget_list',
      'sidebar': sidebar_id
    },
    Component: SidebarProcessor
  }, props));
};

exports.dynamic_sidebar = dynamic_sidebar;