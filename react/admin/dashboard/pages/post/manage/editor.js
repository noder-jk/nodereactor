"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostProcess = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

var _editorModules = require("./editor-modules");

require("./style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var PostProcess =
/*#__PURE__*/
function (_Component) {
  _inherits(PostProcess, _Component);

  function PostProcess(props) {
    var _this;

    _classCallCheck(this, PostProcess);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PostProcess).call(this, props));
    var _this$props$ResponseD = _this.props.ResponseData,
        _this$props$ResponseD2 = _this$props$ResponseD.meta_boxes,
        meta_boxes = _this$props$ResponseD2 === void 0 ? [] : _this$props$ResponseD2,
        _this$props$ResponseD3 = _this$props$ResponseD.post,
        post = _this$props$ResponseD3 === void 0 ? {} : _this$props$ResponseD3,
        post_type = _this$props$ResponseD.post_type;

    if (_typeof(post) !== 'object') {
      post = {};
    }

    meta_boxes = meta_boxes.map(function (item) {
      item.key = Math.random().toString(36);
      return item;
    });
    _this.state = {
      'slug': post.post_name || '',
      'slug_edit_mode': false,
      'mime_type': post.mime_type,
      'post_id': post.post_id || 0,
      'loading_icon': false,
      'post_updated': false,
      'meta_boxes': meta_boxes
    };
    _this.store_vals = {
      'post_type': post_type,
      'post_id': post.post_id,
      'post_title': post.post_title,
      'post_excerpt': post.post_excerpt,
      'post_status': post.post_status,
      'comment_status': post.comment_status,
      'post_content': post.post_content
    };
    _this.saveContent = _this.saveContent.bind(_assertThisInitialized(_this));
    _this.getValues = _this.getValues.bind(_assertThisInitialized(_this));
    _this.getSlug = _this.getSlug.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PostProcess, [{
    key: "getSlug",
    value: function getSlug(slug) {
      this.setState({
        'slug': slug
      });
    }
  }, {
    key: "getValues",
    value: function getValues(e_or_v, post_content) {
      if (post_content == true) {
        this.store_vals['post_content'] = e_or_v;
      } else {
        var el = e_or_v.currentTarget;
        this.store_vals[el.name] = el.value;
      }
    }
  }, {
    key: "saveContent",
    value: function saveContent(e) {
      var _this2 = this;

      if (!this.editor_container) {
        return;
      }

      var post = this.store_vals;
      post.post_name = this.state.slug;
      /* Now collect post meta from all meta box. */

      var el = this.editor_container.getElementsByClassName('nr_custom_meta_boxes');
      var post_meta = {};

      for (var num = 0; num < el.length; num++) {
        post_meta = Object.assign(post_meta, (0, _react2.parse_form)(el[num], true));
      }
      /* Store meta in post object */


      post.post_meta = post_meta;
      /* Now request to server to save */

      this.setState({
        'loading_icon': true
      });
      (0, _axios.default)({
        method: 'post',
        url: _react2.ajax_url,
        data: {
          'action': 'nr_save_post',
          'post': post
        }
      }).then(function (r) {
        var ob = {
          'loading_icon': false,
          'post_updated': true
        };

        if (r.data && r.data.status == 'done') {
          _sweetalert.default.fire('Success', r.data && r.data.message ? r.data.message : 'Saved', 'success');

          if (r.data.post_id) {
            /* Save the returned post id and set state */
            ob.post_id = r.data.post_id;
            _this2.store_vals.post_id = r.data.post_id;
          }
        } else {
          _sweetalert.default.fire('Error', r.data && r.data.message ? r.data.message : 'Action Failed.', 'error');
        }

        _this2.setState(ob, function () {
          _this2.setState({
            'post_updated': false
          });
        });
      }).catch(function (r) {
        _sweetalert.default.fire('Error', 'Request Failed', 'error');

        _this2.setState({
          loading_icon: false
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this,
          _React$createElement;

      var _this$props$ResponseD4 = this.props.ResponseData,
          _this$props$ResponseD5 = _this$props$ResponseD4.post,
          post = _this$props$ResponseD5 === void 0 ? {} : _this$props$ResponseD5,
          _this$props$ResponseD6 = _this$props$ResponseD4.post_modules,
          post_modules = _this$props$ResponseD6 === void 0 ? [] : _this$props$ResponseD6,
          post_type = _this$props$ResponseD4.post_type,
          _this$props$ResponseD7 = _this$props$ResponseD4.custom_templates,
          custom_templates = _this$props$ResponseD7 === void 0 ? {} : _this$props$ResponseD7;
      var _post$post_meta = post.post_meta,
          post_meta = _post$post_meta === void 0 ? {} : _post$post_meta,
          _post$post_parent = post.post_parent,
          post_parent = _post$post_parent === void 0 ? 0 : _post$post_parent;
      var meta_props = {};
      meta_props.post_id = this.state.post_id;
      meta_props.post_meta = post_meta;
      meta_props.post_type = post_type;
      meta_props.post_parent = post_parent;
      meta_props.custom_templates = custom_templates;
      meta_props.meta_boxes = this.state.meta_boxes;
      meta_props.post_updated = this.state.post_updated;
      return post == 'not_found' ? _react.default.createElement("span", {
        className: "text-danger"
      }, "Post Not Found") : _react.default.createElement("div", {
        className: "row",
        id: "post-editor-container",
        ref: function ref(el) {
          _this3.editor_container = el;
        }
      }, _react.default.createElement("div", {
        className: "col-12"
      }, _react.default.createElement("h4", null, this.state.post_id ? _react.default.createElement("span", null, "Edit") : _react.default.createElement("span", null, "Create"), " ", this.state.loading_icon == true ? _react.default.createElement(_reactSvgSpinner.default, {
        size: "15px"
      }) : null)), _react.default.createElement("div", {
        className: "col-12 col-sm-6 col-md-7 col-lg-8 col-xl-9"
      }, post_modules.indexOf('title') > -1 ? _react.default.createElement(_editorModules.Title, {
        defaultValue: this.store_vals.post_title,
        onChange: this.getValues,
        sendSlug: this.getSlug,
        defaultSlug: this.state.slug
      }) : null, post_modules.indexOf('editor') > -1 ? _react.default.createElement(_react2.Editor, {
        get_input_by: function get_input_by(content) {
          return _this3.getValues(content, true);
        },
        defaultValue: this.store_vals.post_content,
        addMedia: post_modules.indexOf('media') > -1
      }) : null, post_modules.indexOf('excerpt') > -1 ? _react.default.createElement(_editorModules.Excerpt, {
        onChange: this.getValues,
        defaultValue: this.store_vals.post_excerpt
      }) : null, _react.default.createElement(_editorModules.LoadMetaBox, _extends({
        position: "left"
      }, meta_props))), _react.default.createElement("div", {
        className: "col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3"
      }, _react.default.createElement("div", {
        className: "nr_meta_box",
        id: "publish_box"
      }, _react.default.createElement("h4", null, "Action"), _react.default.createElement("div", null, _react.default.createElement("p", null, _react.default.createElement("b", null, "Status: "), _react.default.createElement("select", (_React$createElement = {
        name: "post_status"
      }, _defineProperty(_React$createElement, "name", "post_status"), _defineProperty(_React$createElement, "defaultValue", this.store_vals.post_status), _defineProperty(_React$createElement, "onChange", this.getValues), _defineProperty(_React$createElement, "className", "form-control"), _React$createElement), _react.default.createElement("option", {
        value: "draft"
      }, "Draft"), _react.default.createElement("option", {
        value: "publish"
      }, "Publish")), _react.default.createElement("small", null, "Only logged in administrators can see draft post.")), post_modules.indexOf('comment') > -1 ? _react.default.createElement(_editorModules.Comment, {
        defaultValue: this.store_vals.comment_status,
        onChange: this.getValues
      }) : null, _react.default.createElement("p", {
        className: "text-right"
      }, this.state.loading_icon ? _react.default.createElement(_reactSvgSpinner.default, {
        size: "15px"
      }) : null, " \xA0", _react.default.createElement("button", {
        className: "btn btn-secondary btn-sm",
        onClick: this.saveContent,
        disabled: this.state.loading_icon
      }, "Save")))), _react.default.createElement(_editorModules.LoadMetaBox, _extends({
        position: "right"
      }, meta_props))));
    }
  }]);

  return PostProcess;
}(_react.Component);

exports.PostProcess = PostProcess;