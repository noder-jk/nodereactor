"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadMetaBox = exports.Excerpt = exports.Comment = exports.Title = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _axios = _interopRequireDefault(require("axios"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

var _compFinder = require("nodereactor/react/helper/comp-finder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Title =
/*#__PURE__*/
function (_Component) {
  _inherits(Title, _Component);

  function Title(props) {
    var _this;

    _classCallCheck(this, Title);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Title).call(this, props));
    var _this$props$defaultSl = _this.props.defaultSlug,
        defaultSlug = _this$props$defaultSl === void 0 ? '' : _this$props$defaultSl;
    _this.state = {
      'slug': defaultSlug,
      'slug_edit_mode': false,
      'loading_icon': false
    };
    _this.slugCheck = _this.slugCheck.bind(_assertThisInitialized(_this));
    _this.enableSlugEdit = _this.enableSlugEdit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Title, [{
    key: "slugCheck",
    value: function slugCheck(e, element) {
      var _this2 = this;

      if (!element && this.state.slug !== '') {
        return;
      }

      var el = element ? element : e.currentTarget;
      var value = el.value;
      var sendSlug = this.props.sendSlug;
      this.setState({
        'loading_icon': true
      });
      (0, _axios["default"])({
        method: 'post',
        url: _react2.ajax_url,
        data: {
          'action': 'nr_slug_check',
          'post_name': value
        }
      }).then(function (r) {
        var ob = {
          slug_edit_mode: false,
          loading_icon: false
          /* Process if slug was sent from server */

        };

        if (r.data && r.data.post_name) {
          /* Store to the object to store in state */
          ob.slug = r.data.post_name;
          /* Pass to the root editor component */

          sendSlug(r.data.post_name);
        }
        /* Now set the slug in state */


        _this2.setState(ob);
      })["catch"](function (e) {
        _this2.setState({
          slug_edit_mode: false,
          loading_icon: false
        });

        _sweetalert["default"].fire('Slug Generate Request Error.');
      });
    }
  }, {
    key: "enableSlugEdit",
    value: function enableSlugEdit() {
      this.setState({
        slug_edit_mode: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          _this$props$defaultVa = _this$props.defaultValue,
          defaultValue = _this$props$defaultVa === void 0 ? '' : _this$props$defaultVa,
          onChange = _this$props.onChange;
      return _react["default"].createElement("div", {
        className: "editor_module"
      }, _react["default"].createElement("input", {
        type: "text",
        className: "form-control mb-1",
        placeholder: "Title",
        name: "post_title",
        defaultValue: defaultValue,
        onBlur: function onBlur(e) {
          return _this3.slugCheck(e);
        },
        onChange: onChange
      }), this.state.loading_icon ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null, this.state.slug_edit_mode == true ? _react["default"].createElement("p", {
        className: "form-inline"
      }, _react["default"].createElement("input", {
        type: "text",
        className: "form-control form-control-sm",
        style: {
          'width': '170px'
        },
        placeholder: "Post Slug",
        defaultValue: this.state.slug
      }), _react["default"].createElement("button", {
        className: "btn btn-outline-secondary btn-sm ml-1",
        onClick: function onClick(e) {
          _this3.slugCheck(e, e.currentTarget.previousElementSibling);
        },
        disabled: this.state.loading_icon
      }, "Ok")) : _react["default"].createElement("p", null, _react["default"].createElement("small", null, _react["default"].createElement("b", null, "Post Slug: "), " ", _react["default"].createElement("u", null, this.state.slug, " "), _react["default"].createElement("button", {
        className: "btn btn-outline-secondary btn-sm ml-1",
        onClick: this.enableSlugEdit,
        disabled: this.state.loading_icon
      }, "Edit"))));
    }
  }]);

  return Title;
}(_react.Component);

exports.Title = Title;

var Comment = function Comment(props) {
  var defaultValue = props.defaultValue,
      onChange = props.onChange;
  return _react["default"].createElement("p", null, _react["default"].createElement("b", null, "Comments: "), "\xA0", _react["default"].createElement("select", {
    name: "comment_status",
    defaultValue: defaultValue,
    onChange: onChange,
    className: "form-control"
  }, _react["default"].createElement("option", {
    value: "1"
  }, "Allowed"), _react["default"].createElement("option", {
    value: "0"
  }, "Disallowed")), _react["default"].createElement("small", null, "Commenting is not available yet. But you may specify for later versions."));
};

exports.Comment = Comment;

var Excerpt = function Excerpt(props) {
  var onChange = props.onChange,
      _props$defaultValue = props.defaultValue,
      defaultValue = _props$defaultValue === void 0 ? '' : _props$defaultValue;
  return _react["default"].createElement("div", {
    className: "nr_meta_box editor_module"
  }, _react["default"].createElement("h4", null, "Excerpt"), _react["default"].createElement("div", null, _react["default"].createElement("textarea", {
    className: "form-control",
    defaultValue: defaultValue,
    name: "post_excerpt",
    onChange: onChange
  })));
};

exports.Excerpt = Excerpt;

var LoadMetaBox = function LoadMetaBox(props) {
  var _props$meta_boxes = props.meta_boxes,
      meta_boxes = _props$meta_boxes === void 0 ? [] : _props$meta_boxes,
      _props$position = props.position,
      position = _props$position === void 0 ? 'right' : _props$position;
  var params = Object.assign({}, props);
  delete params.meta_boxes;
  delete params.position;
  return meta_boxes.map(function (item) {
    if (item.position == position) {
      return _react["default"].createElement("div", {
        key: item.key,
        className: "nr_meta_box nr_custom_meta_boxes"
      }, _react["default"].createElement("h4", null, item.title), _react["default"].createElement("div", null, _react["default"].createElement(_compFinder.FindComp, _extends({
        comp_props: {
          'component': item.component,
          'nr_package': item.nr_package
        }
      }, params, {
        meta_box_id: item.id
      }))));
    }

    return null;
  });
};

exports.LoadMetaBox = LoadMetaBox;