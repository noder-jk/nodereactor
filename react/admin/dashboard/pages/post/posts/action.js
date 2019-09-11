"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Action = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Action =
/*#__PURE__*/
function (_Component) {
  _inherits(Action, _Component);

  function Action(props) {
    var _this;

    _classCallCheck(this, Action);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Action).call(this, props));
    _this.passValue = _this.passValue.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Action, [{
    key: "passValue",
    value: function passValue(e) {
      var onChange = this.props.onChange;
      var el = e.currentTarget;

      var ob = _defineProperty({}, el.name, el.value);

      onChange(ob);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this,
          _React$createElement,
          _React$createElement2;

      var _this$props = this.props,
          post_type = _this$props.post_type,
          deletePost = _this$props.deletePost,
          getAction = _this$props.getAction,
          fetchPosts = _this$props.fetchPosts;
      return _react["default"].createElement("div", null, _react["default"].createElement("div", {
        className: "d-inline-block form-group form-inline mr-2 mb-1"
      }, _react["default"].createElement("select", {
        className: "form-control form-control-sm float-left",
        onChange: function onChange(e) {
          return getAction(e.currentTarget.value);
        },
        defaultValue: ""
      }, _react["default"].createElement("option", {
        value: ""
      }, "Bulk Actions"), _react["default"].createElement("option", {
        value: "delete"
      }, "Delete Permanently")), _react["default"].createElement("button", {
        className: "btn btn-sm btn-outline-secondary",
        onClick: deletePost,
        title: "Click to apply action"
      }, "Apply")), _react["default"].createElement("div", {
        className: "d-inline-block form-group form-inline mb-1",
        ref: function ref(el) {
          return _this2.filter_container = el;
        }
      }, _react["default"].createElement("input", {
        type: "hidden",
        name: "post_type",
        defaultValue: post_type
      }), _react["default"].createElement("select", (_React$createElement = {
        className: "form-control form-control-sm float-left",
        name: "post_status",
        defaultValue: "publish",
        title: "Post Status"
      }, _defineProperty(_React$createElement, "defaultValue", "publish"), _defineProperty(_React$createElement, "onChange", this.passValue), _React$createElement), _react["default"].createElement("option", {
        value: "publish"
      }, "Publish"), _react["default"].createElement("option", {
        value: "draft"
      }, "Draft")), _react["default"].createElement("input", {
        name: "keyword",
        type: "text",
        placeholder: "Search",
        className: "form-control form-control-sm float-left",
        title: "Search by keyword",
        onChange: this.passValue
      }), _react["default"].createElement("input", (_React$createElement2 = {
        name: "page",
        type: "number",
        min: "1",
        defaultValue: 1,
        placeholder: "Page Number",
        title: "Page Number",
        className: "form-control form-control-sm float-left nr_pagination_page_number"
      }, _defineProperty(_React$createElement2, "defaultValue", 1), _defineProperty(_React$createElement2, "ref", function ref(el) {
        return _this2.c_page = el;
      }), _defineProperty(_React$createElement2, "onChange", this.passValue), _React$createElement2)), _react["default"].createElement("input", {
        name: "posts_per_page",
        type: "number",
        min: "1",
        defaultValue: 30,
        placeholder: "Posts Per Page",
        title: "Posts Per Page",
        className: "form-control form-control-sm float-left",
        onChange: this.passValue
      }), _react["default"].createElement("button", {
        className: "btn btn-sm btn-outline-secondary",
        onClick: fetchPosts,
        title: "Press to filter"
      }, "Filter")));
    }
  }]);

  return Action;
}(_react.Component);

exports.Action = Action;