"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Browser = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

var _editor = require("./editor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Browser =
/*#__PURE__*/
function (_Component) {
  _inherits(Browser, _Component);

  function Browser(props) {
    var _this;

    _classCallCheck(this, Browser);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Browser).call(this, props));
    _this.state = {
      'loading': false,
      'selected': [],
      'editor': false
    };
    _this.openEditor = _this.openEditor.bind(_assertThisInitialized(_this));
    _this.closeEditor = _this.closeEditor.bind(_assertThisInitialized(_this));
    _this.deleteTaxonomy = _this.deleteTaxonomy.bind(_assertThisInitialized(_this));
    _this.taxonomySelect = _this.taxonomySelect.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Browser, [{
    key: "openEditor",
    value: function openEditor(id) {
      this.setState({
        'editor': id
      });
    }
  }, {
    key: "closeEditor",
    value: function closeEditor(update) {
      this.setState({
        'editor': false
      });
      var fetchTaxonomies = this.props.fetchTaxonomies;

      if (update === true) {
        fetchTaxonomies();
      }
    }
  }, {
    key: "taxonomySelect",
    value: function taxonomySelect(e) {
      var el = e.currentTarget;
      var term_id = el.value;
      var selected = this.state.selected;

      if (el.checked) {
        if (selected.indexOf(term_id) == -1) {
          selected.push(term_id);
        }
      } else if (selected.indexOf(term_id) > -1) {
        selected.splice(selected.indexOf(term_id), 1);
      }

      this.setState({
        'selected': selected
      });
    }
  }, {
    key: "deleteTaxonomy",
    value: function deleteTaxonomy(e, term_id) {
      var _this2 = this;

      var fetchTaxonomies = this.props.fetchTaxonomies;

      if (!term_id) {
        term_id = this.state.selected;
      }

      if (!Array.isArray(term_id)) {
        term_id = [term_id];
      }

      if (term_id.length == 0) {
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

        _this2.setState({
          'loading': true
        });

        (0, _react2.ajax_request)('nr_delete_taxonomy', {
          'term_ids': term_id
        }, function (r) {
          _this2.setState({
            'loading': false
          });

          if (r.status !== 'success') {
            _sweetalert["default"].fire('Error', 'Something Went Wrong', 'error');

            return;
          }

          fetchTaxonomies();
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          taxonomies = _this$props.taxonomies,
          taxonomy = _this$props.taxonomy,
          taxonomy_title = _this$props.taxonomy_title,
          hierarchical = _this$props.hierarchical,
          fetchTaxonomies = _this$props.fetchTaxonomies;
      var pass_prop = {
        taxonomies: taxonomies,
        taxonomy: taxonomy,
        hierarchical: hierarchical,
        fetchTaxonomies: fetchTaxonomies,
        taxonomy_title: taxonomy_title
      };
      taxonomies = (0, _react2.get_hierarchy)(taxonomies, 'parent', 'term_id'); // No need exclude current, cause it's the list, not edit

      return _react["default"].createElement("div", {
        className: "col-6 col-md-8 col-xl-9"
      }, _react["default"].createElement("h4", null, taxonomy_title, this.state.loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null), _react["default"].createElement("hr", null), _react["default"].createElement("div", {
        className: "mb-2 text-right"
      }, this.state.selected.length > 0 ? _react["default"].createElement("button", {
        className: "btn btn-outline-secondary btn-sm",
        onClick: this.deleteTaxonomy
      }, "Delete") : null), _react["default"].createElement("table", {
        style: {
          'background': 'white'
        },
        className: "table table-bordered"
      }, _react["default"].createElement("thead", null, _react["default"].createElement("tr", null, _react["default"].createElement("th", null), _react["default"].createElement("th", null, "Name"), _react["default"].createElement("th", null, "Slug"), _react["default"].createElement("th", null, "Description"), _react["default"].createElement("th", null, "Posts"))), _react["default"].createElement("tbody", null, taxonomies.map(function (item) {
        var key = item.term_id;

        if (_this3.state.editor == item.term_id) {
          return _react["default"].createElement("tr", {
            key: key
          }, _react["default"].createElement("td", {
            colSpan: "5"
          }, _react["default"].createElement(_editor.Editor, _extends({}, pass_prop, {
            closeEditor: _this3.closeEditor,
            cls: "container-fluid",
            term: item
          }))));
        }

        return _react["default"].createElement("tr", {
          key: key + '_ed'
        }, _react["default"].createElement("td", null, _react["default"].createElement("input", {
          type: "checkbox",
          name: "taxonomy_inp_check",
          value: item.term_id,
          onChange: _this3.taxonomySelect
        })), _react["default"].createElement("td", {
          className: "taxonomy-action"
        }, '→'.repeat(item.nest_level) + item.name, _react["default"].createElement("br", null), _this3.state.editor == item.term_id ? null : _react["default"].createElement("a", {
          className: "text-warning",
          onClick: function onClick() {
            return _this3.openEditor(item.term_id);
          }
        }, _react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
          icon: _freeSolidSvgIcons.faEdit
        })), " \xA0", _react["default"].createElement("a", {
          className: "text-info"
        }, _react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
          icon: _freeSolidSvgIcons.faEye
        })), " \xA0", _react["default"].createElement("a", {
          className: "text-danger",
          onClick: function onClick(e) {
            return _this3.deleteTaxonomy(e, item.term_id);
          }
        }, _react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
          icon: _freeSolidSvgIcons.faTrashAlt
        }))), _react["default"].createElement("td", null, item.slug), _react["default"].createElement("td", null, item.description), _react["default"].createElement("td", null, item.post_count));
      }))));
    }
  }]);

  return Browser;
}(_react.Component);

exports.Browser = Browser;