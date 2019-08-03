"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = exports.TaxonomyPage = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

require("./style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

var Editor =
/*#__PURE__*/
function (_Component) {
  _inherits(Editor, _Component);

  function Editor(props) {
    var _this;

    _classCallCheck(this, Editor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Editor).call(this, props));
    var _this$props$term = _this.props.term,
        term = _this$props$term === void 0 ? {} : _this$props$term;
    _this.state = {
      'term_id': term.term_id || 0,
      'loading': false,
      'parent': term.parent || 0,
      'name': term.name,
      'description': term.description,
      'slug': term.slug
    };
    _this.saveTaxonomy = _this.saveTaxonomy.bind(_assertThisInitialized(_this));
    _this.storeVals = _this.storeVals.bind(_assertThisInitialized(_this));
    _this.clearValues = _this.clearValues.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Editor, [{
    key: "storeVals",
    value: function storeVals(e) {
      var el = e.currentTarget;
      this.setState(_defineProperty({}, el.name, el.value));
    }
  }, {
    key: "clearValues",
    value: function clearValues() {
      if (this.filed_container) {
        var el = this.filed_container;

        var clr = function clr(el) {
          for (var i = 0; i < el.length; i++) {
            el[i].value = '';
          }
        };

        clr(el.getElementsByTagName('input'));
        clr(el.getElementsByTagName('textarea'));
      }
    }
  }, {
    key: "saveTaxonomy",
    value: function saveTaxonomy() {
      var _this2 = this;

      var _this$props = this.props,
          _this$props$closeEdit = _this$props.closeEditor,
          closeEditor = _this$props$closeEdit === void 0 ? false : _this$props$closeEdit,
          taxonomy = _this$props.taxonomy,
          fetchTaxonomies = _this$props.fetchTaxonomies;
      var values = this.state;
      values['taxonomy'] = taxonomy;
      this.setState({
        'loading': true
      });
      (0, _react2.ajaxRequest)('create_update_category', {
        'values': values
      }, function (r) {
        var set_ob = {
          'loading': false
        };

        if (r.status == 'done') {
          _this2.clearValues();

          closeEditor ? closeEditor(true) : _sweetalert["default"].fire('Success', 'Term Has Been Created', 'success');
          fetchTaxonomies();
        } else {
          _sweetalert["default"].fire('Error', r.message ? r.message : 'Action Failed.', 'error');
        }

        if (!closeEditor || r.status !== 'done') {
          _this2.setState(set_ob);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          _this$props2$closeEdi = _this$props2.closeEditor,
          closeEditor = _this$props2$closeEdi === void 0 ? false : _this$props2$closeEdi,
          _this$props2$cls = _this$props2.cls,
          cls = _this$props2$cls === void 0 ? 'col-6 col-md-4 col-xl-3' : _this$props2$cls,
          hierarchical = _this$props2.hierarchical,
          taxonomies = _this$props2.taxonomies,
          taxonomy_title = _this$props2.taxonomy_title;
      taxonomies = (0, _react2.get_hierarchy)(taxonomies, 'parent', 'term_id', this.state.term_id > 0 ? this.state.term_id : 'dddddd');
      return _react["default"].createElement("div", {
        className: cls
      }, taxonomy_title !== false ? _react["default"].createElement("h4", null, this.state.term_id == 0 ? 'Create New' : 'Edit', " ", taxonomy_title) : null, _react["default"].createElement("div", {
        ref: function ref(el) {
          return _this3.filed_container = el;
        }
      }, "Name", _react["default"].createElement("input", {
        type: "text",
        name: "name",
        className: "form-control",
        onChange: this.storeVals,
        defaultValue: this.state.name
      }), _react["default"].createElement("br", null), "Slug", _react["default"].createElement("input", {
        type: "text",
        name: "slug",
        className: "form-control",
        onChange: this.storeVals,
        defaultValue: this.state.slug
      }), _react["default"].createElement("br", null), hierarchical ? _react["default"].createElement("div", null, "Parent", _react["default"].createElement("select", {
        name: "parent",
        className: "form-control",
        onChange: this.storeVals,
        defaultValue: this.state.parent
      }, _react["default"].createElement("option", {
        value: "0"
      }, "None"), taxonomies.map(function (item) {
        return item.term_id !== _this3.state.term_id ? _react["default"].createElement("option", {
          key: item.term_id,
          value: item.term_id
        }, '-'.repeat(item.nest_level) + item.name) : null;
      })), _react["default"].createElement("br", null)) : null, "Description", _react["default"].createElement("textarea", {
        name: "description",
        className: "form-control",
        onChange: this.storeVals,
        defaultValue: this.state.description
      }), _react["default"].createElement("br", null), closeEditor ? _react["default"].createElement("button", {
        onClick: closeEditor,
        className: "btn btn-secondary btn-sm"
      }, "Close") : null, "\xA0", _react["default"].createElement("button", {
        onClick: this.saveTaxonomy,
        className: "btn btn-secondary btn-sm"
      }, this.state.term_id > 0 ? 'Update' : 'Create'), "\xA0", this.state.loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null));
    }
  }]);

  return Editor;
}(_react.Component);

exports.Editor = Editor;

var Browser =
/*#__PURE__*/
function (_Component2) {
  _inherits(Browser, _Component2);

  function Browser(props) {
    var _this4;

    _classCallCheck(this, Browser);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Browser).call(this, props));
    _this4.state = {
      'loading': false,
      'selected': [],
      'editor': false
    };
    _this4.openEditor = _this4.openEditor.bind(_assertThisInitialized(_this4));
    _this4.closeEditor = _this4.closeEditor.bind(_assertThisInitialized(_this4));
    _this4.deleteTaxonomy = _this4.deleteTaxonomy.bind(_assertThisInitialized(_this4));
    _this4.taxonomySelect = _this4.taxonomySelect.bind(_assertThisInitialized(_this4));
    return _this4;
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
      var _this5 = this;

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

        _this5.setState({
          'loading': true
        });

        (0, _react2.ajaxRequest)('nr_delete_taxonomy', {
          'term_ids': term_id
        }, function (r) {
          _this5.setState({
            'loading': false
          });

          if (r.status !== 'done') {
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
      var _this6 = this;

      var _this$props3 = this.props,
          taxonomies = _this$props3.taxonomies,
          taxonomy = _this$props3.taxonomy,
          taxonomy_title = _this$props3.taxonomy_title,
          hierarchical = _this$props3.hierarchical,
          fetchTaxonomies = _this$props3.fetchTaxonomies;
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
      }, _react["default"].createElement("h4", null, taxonomy_title, " ", this.state.loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
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
        return [_react["default"].createElement("tr", {
          key: item.term_id
        }, _react["default"].createElement("td", null, _react["default"].createElement("input", {
          type: "checkbox",
          name: "taxonomy_inp_check",
          value: item.term_id,
          onChange: _this6.taxonomySelect
        })), _react["default"].createElement("td", {
          className: "taxonomy-action"
        }, '-'.repeat(item.nest_level) + item.name, _react["default"].createElement("br", null), _this6.state.editor == item.term_id ? null : _react["default"].createElement("a", {
          className: "text-warning",
          onClick: function onClick() {
            return _this6.openEditor(item.term_id);
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
            return _this6.deleteTaxonomy(e, item.term_id);
          }
        }, _react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
          icon: _freeSolidSvgIcons.faTrashAlt
        }))), _react["default"].createElement("td", null, item.slug), _react["default"].createElement("td", null, item.description), _react["default"].createElement("td", null, item.post_count)), _this6.state.editor == item.term_id ? _react["default"].createElement("tr", {
          key: item.term_id + '_editor'
        }, _react["default"].createElement("td", {
          colSpan: "5"
        }, _react["default"].createElement(Editor, _extends({}, pass_prop, {
          closeEditor: _this6.closeEditor,
          cls: "container-fluid",
          term: item
        })))) : null];
      }))));
    }
  }]);

  return Browser;
}(_react.Component);

var TaxonomyPage =
/*#__PURE__*/
function (_Component3) {
  _inherits(TaxonomyPage, _Component3);

  function TaxonomyPage(props) {
    var _this7;

    _classCallCheck(this, TaxonomyPage);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(TaxonomyPage).call(this, props));
    _this7.state = {
      'taxonomies': [],
      'hierarchical': false,
      'taxonomy': '',
      'taxonomy_title': ''
    };
    _this7.fetchTaxonomies = _this7.fetchTaxonomies.bind(_assertThisInitialized(_this7));
    return _this7;
  }

  _createClass(TaxonomyPage, [{
    key: "fetchTaxonomies",
    value: function fetchTaxonomies() {
      var _this8 = this;

      /* Retrieve taxonomy name from url */
      var pth = window.location.pathname;
      pth = pth.slice(pth.lastIndexOf('/') + 1);
      var taxonomy = pth.slice(pth.indexOf('_') + 1);
      /* Now get taxonomies, taxonomy hierarchy etc. */

      this.setState({
        'loading': true,
        'taxonomy': taxonomy
      });
      (0, _react2.ajaxRequest)('nr_get_taxonomy', {
        'taxonomy': taxonomy
      }, function (r, d, e) {
        var ob = {
          'loading': false
        };

        if (e) {
          ob.selected = [];

          _this8.setState(ob);

          _sweetalert["default"].fire('Request Error. Could Not Fetch Taxonomies.');

          return;
        }

        ob.taxonomies = r.taxonomies;
        ob.hierarchical = r.hierarchical;
        ob.taxonomy_title = r.taxonomy_title;

        _this8.setState(ob);
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchTaxonomies();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          taxonomies = _this$state.taxonomies,
          taxonomy = _this$state.taxonomy,
          hierarchical = _this$state.hierarchical,
          taxonomy_title = _this$state.taxonomy_title;
      var pass_prop = {
        taxonomies: taxonomies,
        taxonomy: taxonomy,
        hierarchical: hierarchical,
        taxonomy_title: taxonomy_title
      };
      pass_prop.fetchTaxonomies = this.fetchTaxonomies;
      return _react["default"].createElement("div", {
        className: "row taxonomy-admin-page"
      }, _react["default"].createElement(Editor, pass_prop), _react["default"].createElement(Browser, pass_prop));
    }
  }]);

  return TaxonomyPage;
}(_react.Component);

exports.TaxonomyPage = TaxonomyPage;