"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostHierarchy = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PostHierarchy =
/*#__PURE__*/
function (_Component) {
  _inherits(PostHierarchy, _Component);

  function PostHierarchy(props) {
    var _this;

    _classCallCheck(this, PostHierarchy);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PostHierarchy).call(this, props));
    _this.state = {
      'loading': false,
      'posts': [],
      'error': null
    };
    return _this;
  }

  _createClass(PostHierarchy, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props = this.props,
          post_type = _this$props.post_type,
          _this$props$post_id = _this$props.post_id,
          post_id = _this$props$post_id === void 0 ? false : _this$props$post_id;
      this.setState({
        'loading': true
      });
      (0, _react2.ajax_request)('nr_get_hierarchy', {
        post_type: post_type,
        post_id: post_id
      }, function (r, d, e) {
        var psts = r.posts && r.posts.length > 0 ? r.posts : [];
        psts = (0, _react2.get_hierarchy)(psts, 'post_parent', 'post_id', post_id);
        var st = {
          'loading': false,
          'posts': psts
        };

        _this2.setState(st);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          loading = _this$state.loading,
          posts = _this$state.posts;
      var _this$props$post_pare = this.props.post_parent,
          post_parent = _this$props$post_pare === void 0 ? 0 : _this$props$post_pare;
      return loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : _react["default"].createElement("div", null, _react["default"].createElement("select", {
        className: "form-control",
        name: "nr_post_parent",
        defaultValue: post_parent
      }, _react["default"].createElement("option", {
        value: "0"
      }, "None"), posts.map(function (item) {
        return _react["default"].createElement("option", {
          key: item.post_id,
          value: item.post_id,
          title: item.post_title
        }, '-'.repeat(item.nest_level) + item.post_title);
      })));
    }
  }]);

  return PostHierarchy;
}(_react.Component);

exports.PostHierarchy = PostHierarchy;