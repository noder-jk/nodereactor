"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostList = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

require("./style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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
    var resp = _this.props.ResponseData;

    if (!resp.posts || _typeof(resp.posts) !== 'object') {
      resp.posts = {};
    }

    for (var k in resp.posts) {
      resp.posts[k].checked_input = false;
    }

    _this.state = {
      'posts': resp.posts,
      'pagination': resp.pagination,
      'taxonomies': resp.taxonomies || [],
      'loading_icon': false
    };
    _this.deletePost = _this.deletePost.bind(_assertThisInitialized(_this));
    _this.toggleCheck = _this.toggleCheck.bind(_assertThisInitialized(_this));
    _this.filterPost = _this.filterPost.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PostProcess, [{
    key: "toggleCheck",
    value: function toggleCheck(e, post_name) {
      var el = e.currentTarget;
      var posts = this.state.posts;

      if (post_name && posts[post_name]) {
        posts[post_name].checked_input = el.checked;
        this.setState({
          'posts': posts
        });
      }
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
      /* Store unselected posts in this array */


      var new_posts = [];
      var posts = this.state.posts;
      var to_delete = [];
      /* Filter post based on checkbox checked */

      for (var k in posts) {
        posts[k].checked_input ? to_delete.push(posts[k].post_id) : new_posts.push(posts[k]);
      }

      if (to_delete.length == 0) {
        return;
      }
      /* Ask confirmation */


      _sweetalert.default.fire({
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

        (0, _axios.default)({
          method: 'post',
          url: _react2.ajax_url,
          data: {
            'action': 'nr_delete_posts',
            'post_id': to_delete
          }
        }).then(function (r) {
          var ob = {
            loading_icon: false
          };

          if (r.data && r.data.status == 'done') {
            ob.posts = new_posts;
          } else {
            _sweetalert.default.fire('Something went wrong.');
          }

          _this2.setState(ob);
        }).catch(function (e) {
          _this2.setState({
            loading_icon: false
          });

          _sweetalert.default.fire('Request Error');
        });
      });
    }
  }, {
    key: "filterPost",
    value: function filterPost(e, page_num) {
      var _this3 = this;

      if (!this.filter_container) {
        _sweetalert.default.fire('Something is not working.');

        return;
      }

      var el = this.filter_container;
      var form = (0, _react2.parse_form)(el);
      form.post_type = this.props.post_type;

      if (page_num) {
        /* This block will be called when user click pagination buttons */
        e.preventDefault();
        var _el = this.page_number;
        _el.value = page_num;
        form.page = page_num;
      }

      this.setState({
        loading_icon: true
      });
      (0, _axios.default)({
        method: 'post',
        data: {
          'action': 'nr_get_post_list',
          'query': JSON.stringify(form)
        },
        url: _react2.ajax_url
      }).then(function (r) {
        if (r.data && _typeof(r.data.posts) == 'object') {
          _this3.setState({
            'posts': r.data.posts,
            'pagination': r.data.pagination,
            'taxonomies': r.data.taxonomies
          });
        }

        _this3.setState({
          loading_icon: false
        });
      }).catch(function (r) {
        _this3.setState({
          loading_icon: false
        });

        _sweetalert.default.fire('Request Error');
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var post_type = this.props.post_type;
      var st_posts = this.state.posts;
      st_posts = (0, _react2.get_hierarchy)(st_posts, 'post_parent', 'post_id');
      return _react.default.createElement("div", {
        id: "post_list_container"
      }, _react.default.createElement("h4", null, "All Posts ", this.state.loading_icon ? _react.default.createElement(_reactSvgSpinner.default, {
        size: "15px"
      }) : null), _react.default.createElement("div", null, _react.default.createElement("div", {
        className: "d-inline-block form-group form-inline mr-2 mb-1"
      }, _react.default.createElement("select", {
        className: "form-control form-control-sm float-left"
      }, _react.default.createElement("option", {
        value: ""
      }, "Bulk Action"), _react.default.createElement("option", {
        value: "delete"
      }, "Delete Permanently")), _react.default.createElement("button", {
        className: "btn btn-sm btn-outline-secondary",
        onClick: this.deletePost,
        title: "Click to apply action"
      }, "Apply")), _react.default.createElement("div", {
        className: "d-inline-block form-group form-inline mb-1",
        ref: function ref(el) {
          return _this4.filter_container = el;
        }
      }, _react.default.createElement("input", {
        type: "hidden",
        name: "post_type",
        defaultValue: post_type
      }), _react.default.createElement("select", {
        className: "form-control form-control-sm float-left",
        name: "post_status",
        defaultValue: "publish",
        title: "Post Status"
      }, _react.default.createElement("option", {
        value: "publish"
      }, "Publish"), _react.default.createElement("option", {
        value: "draft"
      }, "Draft")), _react.default.createElement("input", {
        name: "keyword",
        type: "text",
        placeholder: "Search",
        className: "form-control form-control-sm float-left",
        title: "Search by keyword"
      }), _react.default.createElement("input", {
        name: "page",
        type: "number",
        min: "1",
        defaultValue: 1,
        placeholder: "Page Number",
        className: "form-control form-control-sm float-left",
        title: "Enter specific page number",
        ref: function ref(el) {
          return _this4.page_number = el;
        }
      }), _react.default.createElement("input", {
        name: "posts_per_page",
        type: "number",
        min: "1",
        defaultValue: 30,
        placeholder: "Posts Per Page",
        className: "form-control form-control-sm float-left",
        title: "How many posts you'd like to see in a single page"
      }), _react.default.createElement("button", {
        className: "btn btn-sm btn-outline-secondary",
        onClick: this.filterPost,
        title: "Press to filter"
      }, "Filter"))), _react.default.createElement("table", {
        className: "table table-bordered"
      }, _react.default.createElement("thead", null, _react.default.createElement("tr", null, _react.default.createElement("th", null), _react.default.createElement("th", null, "Title"), _react.default.createElement("th", null, "Author"), _react.default.createElement("th", null, "Status"), this.state.taxonomies.map(function (t) {
        return _react.default.createElement("th", {
          key: t
        }, t);
      }), _react.default.createElement("th", null, "Posted"))), _react.default.createElement("tbody", null, st_posts.map(function (item) {
        return _react.default.createElement("tr", {
          key: item.post_name
        }, _react.default.createElement("td", null, _react.default.createElement("input", {
          type: "checkbox",
          defaultChecked: item.checked_input,
          onChange: function onChange(e) {
            return _this4.toggleCheck(e, item.post_name);
          }
        })), _react.default.createElement("td", null, _react.default.createElement("p", null, '-'.repeat(item.nest_level), item.post_title), _react.default.createElement("a", {
          href: item.post_url,
          className: "text-info"
        }, "View"), " - ", _react.default.createElement("a", {
          className: "text-info",
          href: item.post_edit_link
        }, "Edit")), _react.default.createElement("td", null, item.display_name), _react.default.createElement("td", null, item.post_status), _this4.state.taxonomies.map(function (t) {
          return _react.default.createElement("td", {
            key: t
          }, item.terms && item.terms[t] ? item.terms[t].join(', ') : null);
        }), _react.default.createElement("td", null, item.post_date));
      }))), Object.keys(this.state.posts).length == 0 ? _react.default.createElement("span", null, "No Post Found") : null, _react.default.createElement("div", {
        className: "text-center"
      }, _react.default.createElement(_react2.Pagination, {
        pgn: this.state.pagination,
        activeClass: "btn btn-outline-secondary btn-sm ml-1 mr-1",
        clickEvent: this.filterPost,
        inactiveClass: "btn btn-secondary btn-sm ml-1 mr-1"
      })));
    }
  }]);

  return PostProcess;
}(_react.Component);

var PostList = function PostList() {
  var pt = window.location.pathname;
  pt = pt.slice(1);
  pt = pt.split('/');
  var type = pt[1];
  type = type.slice('post_type_'.length);
  var pg = (0, _react2.get_url_parameter)('page');
  var page = pg ? pg : 1;
  var w = {
    'post_type': type,
    'page': page
  };
  w = JSON.stringify(w);
  return _react.default.createElement(_react2.Placeholder, {
    Data: {
      'action': 'nr_get_post_list',
      'query': w
    },
    Component: PostProcess,
    post_type: type
  });
};

exports.PostList = PostList;