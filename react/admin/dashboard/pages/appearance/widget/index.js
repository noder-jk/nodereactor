"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdminWidget = void 0;

var _react = _interopRequireWildcard(require("react"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _compFinder = require("nodereactor/react/helper/comp-finder");

var _react2 = require("nodereactor/react");

require("./style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var array_chunk = function array_chunk(arr, chunkLen) {
  var chunkList = [];
  var chunkCount = Math.ceil(arr.length / chunkLen);

  for (var i = 0; i < chunkCount; i++) {
    chunkList.push(arr.splice(0, chunkLen));
  }

  return chunkList;
};

var LoadInputComponent = function LoadInputComponent(props) {
  var _props$area = props.area,
      area = _props$area === void 0 ? false : _props$area,
      _props$widgets = props.widgets,
      widgets = _props$widgets === void 0 ? [] : _props$widgets,
      _props$linking = props.linking,
      linking = _props$linking === void 0 ? {} : _props$linking,
      widget_action = props.widget_action;
  var ret = [];

  if (area && linking[area]) {
    var _loop = function _loop(i) {
      var l = linking[area][i];
      /* Loop through all widget to match current widget using nr_package and node type. */

      for (var n = 0; n < widgets.length; n++) {
        if (widgets[n].nr_package == l.nr_package && widgets[n].id == l.widget_id) {
          var component = widgets[n].input_component;
          ret.push(_react["default"].createElement("div", {
            key: l.key,
            className: "widget_form mb-4",
            "data-widget_id": l.widget_id,
            "data-nr_package": l.nr_package
          }, _react["default"].createElement("b", null, _react["default"].createElement("span", {
            style: {
              "float": "left"
            }
          }, widgets[n].title), _react["default"].createElement("i", {
            className: "widget_action_i fa fa-trash",
            onClick: function onClick() {
              return widget_action('delete', area, i);
            }
          }), _react["default"].createElement("i", {
            className: "widget_action_i fa fa-arrow-up",
            onClick: function onClick() {
              return widget_action('up', area, i);
            }
          }), _react["default"].createElement("i", {
            className: "widget_action_i fa fa-arrow-down",
            onClick: function onClick() {
              return widget_action('down', area, i);
            }
          })), _react["default"].createElement("div", null, _react["default"].createElement("form", null, "Widget Title", _react["default"].createElement("input", {
            name: "nr_widget_title",
            className: "form-control mb-3",
            defaultValue: l.properties.nr_widget_title || widgets[n].title
          }), _react["default"].createElement(_compFinder.FindComp, _extends({
            comp_props: {
              'component': component,
              'nr_package': widgets[n].nr_package
            }
          }, l.properties))))));
          break;
        }
      }
    };

    /* Loop through all widgets in a single area. */
    for (var i = 0; i < linking[area].length; i++) {
      _loop(i);
    }
  }

  return ret;
};

var WidgetProcess =
/*#__PURE__*/
function (_Component) {
  _inherits(WidgetProcess, _Component);

  function WidgetProcess(props) {
    var _this;

    _classCallCheck(this, WidgetProcess);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WidgetProcess).call(this, props));
    var _this$props$response = _this.props.response,
        _this$props$response$ = _this$props$response.widgets,
        widgets = _this$props$response$ === void 0 ? {} : _this$props$response$,
        _this$props$response$2 = _this$props$response.sidebars,
        sidebars = _this$props$response$2 === void 0 ? {} : _this$props$response$2,
        _this$props$response$3 = _this$props$response.widget_in_sidebar,
        widget_in_sidebar = _this$props$response$3 === void 0 ? {} : _this$props$response$3;
    Object.keys(widget_in_sidebar).forEach(function (k) {
      if (Array.isArray(widget_in_sidebar[k])) {
        widget_in_sidebar[k].forEach(function (it, i) {
          widget_in_sidebar[k][i].key = Math.random().toString(36);
        });
      }
    });
    var ob = {
      widgets: widgets,
      sidebars: sidebars,
      widget_in_sidebar: widget_in_sidebar
    };
    ob.loading = false;
    _this.state = ob;
    _this.saveWidgets = _this.saveWidgets.bind(_assertThisInitialized(_this));
    _this.addWidget = _this.addWidget.bind(_assertThisInitialized(_this));
    _this.widgetAction = _this.widgetAction.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(WidgetProcess, [{
    key: "saveWidgets",
    value: function saveWidgets() {
      var _this2 = this;

      if (!this.widget_container) {
        _sweetalert["default"].fire('Something went wrong.');

        return;
      }

      var widget_in_sidebar = {};
      /* Loop through every widget are to gather individual widget values */

      var area = this.widget_container.getElementsByClassName('.indiv_area_container');

      for (var i = 0; i < area.length; i++) {
        var area_id = area[i].dataset.area_id;
        var widget_value_array = [];
        /* Loop through every widget in certain area. */

        var widget = area[i].getElementsByClassName('widget_form');

        for (var n = 0; n < widget.length; n++) {
          var widget_id = widget[n].dataset.widget_id;
          var pkg = widget[n].dataset.nr_package;
          pkg = pkg == 'true' ? true : pkg;
          var properties = (0, _react2.parse_dom_form)(widget[n]);
          widget_value_array.push({
            'key': Math.random().toString(36),
            'widget_id': widget_id,
            'properties': properties,
            'nr_package': pkg
          });
        }

        widget_in_sidebar[area_id] = widget_value_array;
      }

      this.setState({
        'loading': true
      });
      (0, _react2.ajax_request)('nr_widget_save', {
        'widget_and_areas': widget_in_sidebar
      }, function (r, d, e) {
        _this2.setState({
          'loading': false
        });

        _sweetalert["default"].fire(!e ? 'Changes Saved.' : 'Request Error');
      });
    }
  }, {
    key: "addWidget",
    value: function addWidget(e, area_id) {
      var el = e.currentTarget;

      if (el && el.value !== '0') {
        var id = el.value;
        var _this$state = this.state,
            widgets = _this$state.widgets,
            widget_in_sidebar = _this$state.widget_in_sidebar;

        for (var i = 0; i < widgets.length; i++) {
          if (widgets[i].unique_key == id) {
            if (!widget_in_sidebar[area_id]) {
              widget_in_sidebar[area_id] = [];
            }

            widget_in_sidebar[area_id].push({
              'key': Math.random().toString(36),
              'widget_id': widgets[i].id,
              'properties': {},
              'nr_package': widgets[i].nr_package
            });
            this.setState({
              'widget_in_sidebar': widget_in_sidebar
            });
            break;
          }
        }

        el.value = '0';
      }
    }
  }, {
    key: "widgetAction",
    value: function widgetAction(action, area, n) {
      var lnk = this.state.widget_in_sidebar;

      if (!lnk[area] || !lnk[area][n]) {
        _sweetalert["default"].fire('Error', 'Something Went Wrong. Page Reload May Resolve the Issue.', 'error');

        return;
      }

      switch (action) {
        case 'delete':
          if (!confirm('Sure to remove ?')) {
            return;
          }

          lnk[area].splice(n, 1);
          break;

        case 'up':
          lnk[area] = (0, _react2.array_pull_up)(lnk[area], n);
          break;

        case 'down':
          lnk[area] = (0, _react2.array_pull_down)(lnk[area], n);
      }

      this.setState({
        'widget_in_sidebar': lnk
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$state2 = this.state,
          _this$state2$widgets = _this$state2.widgets,
          widgets = _this$state2$widgets === void 0 ? [] : _this$state2$widgets,
          _this$state2$sidebars = _this$state2.sidebars,
          sidebars = _this$state2$sidebars === void 0 ? {} : _this$state2$sidebars,
          _this$state2$widget_i = _this$state2.widget_in_sidebar,
          widget_in_sidebar = _this$state2$widget_i === void 0 ? {} : _this$state2$widget_i;
      var ob = Object.keys(sidebars).map(function (k) {
        return sidebars[k];
      });
      var ch_length = Math.floor(ob.length / 3);
      ch_length = ch_length < 1 ? 1 : ch_length;
      var chunk = ob.length > 0 ? array_chunk(ob, ch_length) : [];
      return _react["default"].createElement("div", {
        id: "widget_area_page",
        className: "row",
        ref: function ref(el) {
          _this3.widget_container = el;
        }
      }, _react["default"].createElement("div", {
        className: "col-12 mb-4"
      }, _react["default"].createElement("h4", null, "Widget & Areas \xA0", _react["default"].createElement("button", {
        className: "btn btn-secondary btn-sm",
        onClick: this.saveWidgets
      }, "Save All"), this.state.loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null), _react["default"].createElement("hr", null)), chunk.map(function (item, ind) {
        return _react["default"].createElement("div", {
          key: 'area_' + ind,
          className: "col-12 col-md-6 col-xl-4"
        }, item.map(function (s_bar) {
          return _react["default"].createElement("div", {
            key: s_bar.id,
            "data-area_container": "",
            className: ".indiv_area_container",
            "data-area_id": s_bar.id
          }, _react["default"].createElement("h5", {
            className: "area-head"
          }, s_bar.title), _react["default"].createElement("div", {
            "data-area": ""
          }, _react["default"].createElement(LoadInputComponent, {
            area: s_bar.id,
            widgets: widgets,
            linking: widget_in_sidebar,
            widget_action: _this3.widgetAction
          })), _react["default"].createElement("div", {
            className: "text-center adder_select"
          }, _react["default"].createElement("hr", null), _react["default"].createElement("select", {
            className: "form-control d-inline-block",
            style: {
              'width': '160px'
            },
            defaultValue: "0",
            onChange: function onChange(e) {
              return _this3.addWidget(e, s_bar.id);
            }
          }, _react["default"].createElement("option", {
            value: "0"
          }, "Select Widget"), widgets.map(function (item) {
            return _react["default"].createElement("option", {
              key: item.unique_key,
              value: item.unique_key
            }, item.title);
          }))));
        }));
      }));
    }
  }]);

  return WidgetProcess;
}(_react.Component);

var AdminWidget = function AdminWidget(props) {
  return _react["default"].createElement(_react2.Placeholder, {
    action: "nr_get_widget_list",
    component: WidgetProcess
  });
};

exports.AdminWidget = AdminWidget;