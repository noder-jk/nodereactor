"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostList = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

var _action = require("./action");

var _list = require("./list");

require("./style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// collect current post type and page
var pt = window.location.pathname;
pt = pt.slice(1);
pt = pt.split('/');
var type = pt[1] || '';
type = type.slice('post_type_'.length);
var pg = (0, _react2.get_url_parameter)('page');
var page = pg ? pg : 1;
var initial_query = {
  'post_type': type,
  'page': page
};

var PostList =
/*#__PURE__*/
function (_Component) {
  _inherits(PostList, _Component);

  function PostList(props) {
    var _this;

    _classCallCheck(this, PostList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PostList).call(this, props));
    _this.state = {
      'filter': {},
      'action': '',
      'posts': [],
      'pagination': {},
      'taxonomies': [],
      'loading_icon': false,
      'checked_posts': []
    };
    _this.getAction = _this.getAction.bind(_assertThisInitialized(_this));
    _this.getFilter = _this.getFilter.bind(_assertThisInitialized(_this));
    _this.deletePost = _this.deletePost.bind(_assertThisInitialized(_this));
    _this.toggleCheck = _this.toggleCheck.bind(_assertThisInitialized(_this));
    _this.fetchPosts = _this.fetchPosts.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PostList, [{
    key: "getAction",
    value: function getAction(action) {
      this.setState({
        action: action
      });
    }
  }, {
    key: "getFilter",
    value: function getFilter(value) {
      var filter = this.state.filter;
      filter = Object.assign(filter, value);
      this.setState({
        filter: filter
      });
    }
  }, {
    key: "toggleCheck",
    value: function toggleCheck(e, post_id) {
      var el = e.currentTarget;
      var checked = this.state.checked_posts;

      if (el.checked) {
        checked.indexOf(post_id) == -1 ? checked.push(post_id) : 0;
      } else if (checked.indexOf(post_id) > -1) {
        checked.splice(checked.indexOf(post_id), 1);
      }

      this.setState({
        'checked_posts': checked
      });
    }
  }, {
    key: "deletePost",
    value: function deletePost(e) {
      var _this2 = this;

      var el = e.currentTarget;
      var action = el.previousElementSibling.value;

      if (action !== 'delete') {
        return;
      }

      var checked_posts = this.state.checked_posts;

      if (checked_posts.length == 0) {
        return;
      }
      /* Ask confirmation */


      _sweetalert["default"].fire({
        title: 'Sure to delete permanently?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true
      }).then(function (result) {
        if (!result.value) {
          return;
        }
        /* Request delete action */


        _this2.setState({
          loading_icon: true
        });

        (0, _react2.ajaxRequest)('nr_delete_posts', {
          'post_id': checked_posts
        }, function (r) {
          _this2.setState({
            'loading_icon': false
          });

          r.status == 'done' ? _this2.fetchPosts() : _sweetalert["default"].fire('Error', 'Something went wrong.', 'error');
        });
      });
    }
  }, {
    key: "fetchPosts",
    value: function fetchPosts(e, page_num) {
      var _this3 = this;

      var filter = this.state.filter;
      var form = Object.assign(initial_query, filter);

      if (page_num) {
        /* This block will be called when user click pagination buttons */
        e.preventDefault();
        var el = this.page_number;
        el.value = page_num;
        form.page = page_num;
      }

      this.setState({
        loading_icon: true
      });
      (0, _react2.ajaxRequest)('nr_get_post_list', {
        'query': JSON.stringify(form)
      }, function (r, d, e) {
        if (e) {
          return;
        }

        var _r$posts = r.posts,
            posts = _r$posts === void 0 ? false : _r$posts,
            pagination = r.pagination,
            taxonomies = r.taxonomies;

        _this3.setState({
          posts: posts,
          pagination: pagination,
          taxonomies: taxonomies,
          loading_icon: false
        });
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchPosts();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          taxonomies = _this$state.taxonomies,
          posts = _this$state.posts,
          loading_icon = _this$state.loading_icon,
          pagination = _this$state.pagination;
      posts = (0, _react2.get_hierarchy)(posts, 'post_parent', 'post_id');
      return _react["default"].createElement("div", {
        id: "post_list_container"
      }, _react["default"].createElement("h4", null, "All Posts ", loading_icon ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null), _react["default"].createElement(_action.Action, {
        post_type: initial_query.post_type,
        deletePost: this.deletePost,
        onChange: this.getFilter,
        getAction: this.getAction,
        fetchPosts: this.fetchPosts
      }), _react["default"].createElement(_list.List, {
        taxonomies: taxonomies,
        st_posts: posts,
        toggleCheck: this.toggleCheck
      }), Object.keys(posts).length == 0 ? _react["default"].createElement("span", null, "No Post Found") : null, _react["default"].createElement("div", {
        className: "text-center"
      }, _react["default"].createElement(_react2.Pagination, {
        pgn: pagination,
        activeClass: "btn btn-outline-secondary btn-sm ml-1 mr-1",
        clickEvent: this.fetchPosts,
        inactiveClass: "btn btn-secondary btn-sm ml-1 mr-1"
      })));
    }
  }]);

  return PostList;
}(_react.Component);

exports.PostList = PostList;