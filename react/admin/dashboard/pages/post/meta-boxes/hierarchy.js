"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostHierarchy = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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
      (0, _axios.default)({
        method: 'post',
        url: _react2.ajax_url,
        data: {
          'action': 'nr_get_hierarchy',
          'post_type': post_type,
          'post_id': post_id
        }
      }).then(function (r) {
        var psts = r.data.posts && r.data.posts.length > 0 ? r.data.posts : [];
        psts = (0, _react2.get_hierarchy)(psts, 'post_parent', 'post_id', post_id);
        var st = {
          'loading': false,
          'posts': psts
        };

        _this2.setState(st);
      }).catch(function (e) {
        _this2.setState({
          'loading': false,
          'error': 'Request Error'
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props$post_pare = this.props.post_parent,
          post_parent = _this$props$post_pare === void 0 ? 0 : _this$props$post_pare;
      return _react.default.createElement("div", null, this.state.loading ? _react.default.createElement(_reactSvgSpinner.default, {
        size: "15px"
      }) : null, _react.default.createElement("select", {
        className: "form-control",
        name: "nr_post_parent",
        defaultValue: post_parent
      }, _react.default.createElement("option", {
        value: "0"
      }, "None"), this.state.posts.map(function (item) {
        return _react.default.createElement("option", {
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