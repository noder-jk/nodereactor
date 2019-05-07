"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Browser = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

var _react2 = require("nodereactor/react");

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FileDetails = function FileDetails(props) {
  var _props$details_for = props.details_for,
      details_for = _props$details_for === void 0 ? [] : _props$details_for,
      fileCount = props.fileCount;
  return _react["default"].createElement("div", {
    className: "media-sidebar visible"
  }, _react["default"].createElement("div", _defineProperty({
    className: "file_details"
  }, "className", "attachment-details"), details_for == null || details_for.length == 0 ? _react["default"].createElement("span", null, fileCount, " files.") : null, details_for && details_for.length > 1 ? _react["default"].createElement("table", {
    className: "table table-striped",
    style: {
      "background": "white"
    }
  }, _react["default"].createElement("tbody", null, details_for.map(function (item) {
    return _react["default"].createElement("tr", {
      key: item.post_name
    }, _react["default"].createElement("td", null, _react["default"].createElement(_react2.RenderMediaFile, {
      url: item.file_url,
      mime: item.mime_type,
      extension: item.file_extension,
      style: {
        'width': '40px'
      }
    })), _react["default"].createElement("td", null, item.post_title, item.file_extension));
  }))) : null, details_for !== null && details_for[0] ? _react["default"].createElement("div", {
    className: "attachment-info"
  }, _react["default"].createElement("p", null, _react["default"].createElement("b", null, details_for[0].post_title), _react["default"].createElement("br", null), _react["default"].createElement("small", null, details_for[0].post_date), _react["default"].createElement("br", null), _react["default"].createElement("small", null, "Uploaded By ", details_for[0].display_name)), _react["default"].createElement("p", null, details_for[0].post_excerpt), _react["default"].createElement("div", {
    dangerouslySetInnerHTML: {
      __html: details_for[0].post_content
    }
  }), details_for[0].file_size, _react["default"].createElement("p", null, _react["default"].createElement("small", null, _react["default"].createElement("a", {
    href: details_for[0].edit_url,
    target: "_blank"
  }, "Edit Details"), " - ", _react["default"].createElement("a", {
    href: details_for[0].file_url,
    target: "_blank"
  }, "Open in New Tab")))) : null));
};

var Browser =
/*#__PURE__*/
function (_Component) {
  _inherits(Browser, _Component);

  function Browser(props) {
    var _this;

    _classCallCheck(this, Browser);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Browser).call(this, props));
    var _this$props$multiple = _this.props.multiple,
        multiple = _this$props$multiple === void 0 ? false : _this$props$multiple;
    _this.state = {
      'files': [],
      'pagination': {},
      'selected': [],
      'message': null,
      'spinner': null,
      'details_for': null,
      'multiple': multiple,
      'keyword': '',
      'posts_per_page': 30,
      'page': 1
    };
    _this.getMedia = _this.getMedia.bind(_assertThisInitialized(_this));
    _this.fileClicked = _this.fileClicked.bind(_assertThisInitialized(_this));
    _this.deleteFile = _this.deleteFile.bind(_assertThisInitialized(_this));
    _this.handlePaginate = _this.handlePaginate.bind(_assertThisInitialized(_this));
    _this.unSelectAll = _this.unSelectAll.bind(_assertThisInitialized(_this));
    _this.storeFilterCriteria = _this.storeFilterCriteria.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Browser, [{
    key: "unSelectAll",
    value: function unSelectAll() {
      this.setState({
        'selected': [],
        'details_for': null
      });
    }
  }, {
    key: "fileClicked",
    value: function fileClicked(e, index) {
      e.stopPropagation();
      var f = this.state.files[index] ? this.state.files[index] : null;
      var ob = {};

      if (!e.ctrlKey || this.state.multiple == false) {
        /* If the click is without ctrl, then simply store the clicked file as selected */
        ob.selected = f ? [f] : [];
      } else {
        /* If it's ctrl clicked, then unselect if already selected. Or add to select if already not selected. */
        var s = this.state.selected;
        var new_s = [];
        var exist = false;

        for (var n = 0; n < s.length; n++) {
          /* loops through already selected file and new array. if current loop file is the clicked then don't add to new array. If not found, then add to new array. */
          if (s[n].file_url !== f.file_url) {
            new_s.push(s[n]);
          } else {
            exist = true;
          }
        }

        if (!exist) {
          new_s.push(f);
        }

        ob.selected = new_s;
      }

      ob.details_for = ob.selected.length > 0 ? ob.selected : null;
      this.setState(ob);
      var _this$props$onSelectC = this.props.onSelectChange,
          onSelectChange = _this$props$onSelectC === void 0 ? false : _this$props$onSelectC;

      if (typeof onSelectChange == 'function') {
        onSelectChange(ob.selected);
      }
    }
  }, {
    key: "deleteFile",
    value: function deleteFile() {
      var _this2 = this;

      var f = this.state.selected;

      if (f.length == 0) {
        return;
      }

      _sweetalert["default"].fire({
        title: 'Sure to delete?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true
      }).then(function (result) {
        if (!result.value) {
          return;
        }

        var post_ids = [];

        for (var i = 0; i < f.length; i++) {
          post_ids.push(f[i].post_id);
        }

        (0, _axios["default"])({
          method: 'post',
          url: _react2.ajax_url,
          data: {
            'action': 'nr_delete_media',
            'post_id': post_ids
          }
        }).then(function (r) {
          var files = _this2.state.selected;
          var new_ar = [];

          _this2.state.files.map(function (item) {
            var exist = false;
            files.map(function (item2) {
              if (item.post_id == item2.post_id) {
                exist = true;
              }
            });

            if (!exist) {
              new_ar.push(item);
            }
          });

          _this2.setState({
            'selected': [],
            'files': new_ar
          });
        })["catch"](function (r) {
          _sweetalert["default"].fire('Request Error');
        });
      });
    }
  }, {
    key: "storeFilterCriteria",
    value: function storeFilterCriteria(e) {
      var el = e.currentTarget;
      this.setState(_defineProperty({}, el.name, el.value));
    }
  }, {
    key: "getMedia",
    value: function getMedia(page_num) {
      var _this3 = this;

      var _this$state = this.state,
          page = _this$state.page,
          posts_per_page = _this$state.posts_per_page,
          keyword = _this$state.keyword;

      if (page_num) {
        page = page_num;

        if (this.page_number) {
          this.page_number.value = page;
        }
      }

      this.setState({
        'spinner': _react["default"].createElement(_reactSvgSpinner["default"], {
          size: "15px"
        })
      });
      var _this$props$accept = this.props.accept,
          accept = _this$props$accept === void 0 ? [] : _this$props$accept;
      (0, _axios["default"])({
        method: 'post',
        data: {
          'action': 'nr_get_gallery',
          'accept': JSON.stringify(accept),
          page: page,
          posts_per_page: posts_per_page,
          keyword: keyword
        },
        url: _react2.ajax_url
      }).then(function (r) {
        var ob = {};

        if (r.data && r.data.files && Array.isArray(r.data.files) && r.data.files.length > 0) {
          ob.message = null;
          ob.files = r.data.files;
          ob.pagination = r.data.pagination;
        } else {
          ob.message = _react["default"].createElement("span", null, "No file");
        }

        ob.spinner = null;

        _this3.setState(ob);
      })["catch"](function (r) {
        _this3.setState({
          'spinner': null,
          'message': _react["default"].createElement("span", null, "Request Error")
        });
      });
    }
  }, {
    key: "handlePaginate",
    value: function handlePaginate(e, page) {
      e.preventDefault();
      this.getMedia(page);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getMedia();
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var flength = this.state.files ? this.state.files.length : 0;
      var cls = 'form-control form-control-sm float-left';
      var json = {
        'right': '267px'
      };
      return _react["default"].createElement("div", _defineProperty({
        className: "attachment_browser"
      }, "className", "attachments-browser"), _react["default"].createElement("div", {
        className: "attachments",
        style: json
      }, _react["default"].createElement("div", {
        style: json,
        className: "file_option"
      }, _react["default"].createElement("div", {
        className: "d-inline-block form-group form-inline float-left mb-0",
        ref: function ref(el) {
          return _this4.filter_container = el;
        }
      }, _react["default"].createElement("input", {
        name: "keyword",
        type: "text",
        placeholder: "Search",
        onChange: this.storeFilterCriteria,
        defaultValue: this.state.keyword,
        className: cls,
        title: "Keyword"
      }), _react["default"].createElement("input", {
        name: "page",
        type: "number",
        min: "1",
        placeholder: "Page Number",
        onChange: this.storeFilterCriteria,
        defaultValue: this.state.page,
        className: cls,
        ref: function ref(el) {
          return _this4.page_number = el;
        },
        title: "Specific Page"
      }), _react["default"].createElement("input", {
        name: "posts_per_page",
        type: "number",
        min: "1",
        placeholder: "Files Per Page",
        onChange: this.storeFilterCriteria,
        defaultValue: this.state.posts_per_page,
        className: cls,
        title: "File limit per page"
      }), _react["default"].createElement("button", {
        className: "btn btn-sm btn-outline-secondary",
        title: "Press to filter",
        onClick: function onClick() {
          return _this4.getMedia();
        }
      }, "Filter")), _react["default"].createElement("span", null, this.state.selected.length > 0 ? _react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
        icon: _freeSolidSvgIcons.faTrash,
        onClick: this.deleteFile
      }) : null)), _react["default"].createElement("div", {
        className: "attachment_gallery"
      }, _react["default"].createElement("div", {
        "data-block": "media",
        onClick: this.unSelectAll
      }, this.state.files.map(function (item, index) {
        var s = _this4.state.selected;
        var cls = '';

        for (var n = 0; n < s.length; n++) {
          if (s[n].file_url == item.file_url) {
            cls = 'data_file_selected';
            break;
          }
        }

        return _react["default"].createElement("span", {
          key: item.real_path,
          "data-element": "file",
          onClick: function onClick(e) {
            return _this4.fileClicked(e, index);
          },
          className: cls
        }, _react["default"].createElement(_react2.RenderMediaFile, {
          url: item.file_url,
          extension: item.file_extension,
          mime: item.mime_type,
          style: {
            "height": "140px"
          }
        }), _react["default"].createElement("small", null, item.post_title));
      })), this.state.spinner, this.state.message), _react["default"].createElement("div", {
        className: "text-center mt-1 mb-1"
      }, _react["default"].createElement(_react2.Pagination, {
        pgn: this.state.pagination,
        activeClass: "btn btn-outline-secondary btn-sm ml-1 mr-1",
        inactiveClass: "btn btn-secondary btn-sm ml-1 mr-1",
        clickEvent: this.handlePaginate
      }))), _react["default"].createElement(FileDetails, {
        details_for: this.state.details_for,
        fileCount: flength
      }));
    }
  }]);

  return Browser;
}(_react.Component);

exports.Browser = Browser;