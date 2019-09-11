"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

var _instruction = require("./instruction");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
      'values': {
        'term_id': term.term_id || 0,
        'parent': term.parent || 0,
        'name': term.name,
        'description': term.description,
        'slug': term.slug,
        'featured_image': ''
      },
      'loading': false,
      'container_key': Math.random().toString(36).substring(7),
      'media_opened': false,
      'feat_image': term.featured_image
    };
    _this.saveTaxonomy = _this.saveTaxonomy.bind(_assertThisInitialized(_this));
    _this.storeVals = _this.storeVals.bind(_assertThisInitialized(_this));
    _this.clearValues = _this.clearValues.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Editor, [{
    key: "storeVals",
    value: function storeVals(e, ob) {
      var values = this.state.values;

      if (ob) {
        values = Object.assign(values, ob);
      } else {
        var el = e.currentTarget;
        values[el.name] = el.value;
      }

      this.setState({
        values: values
      });
    }
  }, {
    key: "clearValues",
    value: function clearValues() {
      this.setState({
        container_key: Math.random().toString(36).substring(7)
      }); // clear state

      var values = this.state.values;

      for (var k in values) {
        switch (k) {
          case 'term_id':
          case 'parent':
            values[k] = 0;
            break;

          default:
            values[k] = undefined;
        }
      } // Clear input values


      var el = this.filed_container;

      var clr = function clr(el) {
        for (var i = 0; i < el.length; i++) {
          el[i].value = '';
        }
      };

      clr(el.getElementsByTagName('input'));
      clr(el.getElementsByTagName('textarea'));
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
      var values = this.state.values;
      values.taxonomy = taxonomy;
      this.setState({
        'loading': true
      });
      (0, _react2.ajax_request)('nr_create_update_category', {
        values: values
      }, function (r) {
        var set_ob = {
          'loading': false
        };

        if (r.status == 'success') {
          _this2.clearValues();

          closeEditor ? closeEditor(true) : _sweetalert["default"].fire('Success', 'Term Has Been Created', 'success');
          fetchTaxonomies();
        } else {
          _sweetalert["default"].fire('Error', r.message ? r.message : 'Action Failed.', 'error');
        }

        if (!closeEditor || r.status !== 'success') {
          _this2.setState(set_ob);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$state = this.state,
          values = _this$state.values,
          container_key = _this$state.container_key,
          feat_image = _this$state.feat_image;
      var _this$props2 = this.props,
          _this$props2$closeEdi = _this$props2.closeEditor,
          closeEditor = _this$props2$closeEdi === void 0 ? false : _this$props2$closeEdi,
          _this$props2$cls = _this$props2.cls,
          cls = _this$props2$cls === void 0 ? 'col-6 col-md-4 col-xl-3' : _this$props2$cls,
          hierarchical = _this$props2.hierarchical,
          taxonomies = _this$props2.taxonomies,
          taxonomy_title = _this$props2.taxonomy_title;
      taxonomies = (0, _react2.get_hierarchy)(taxonomies, 'parent', 'term_id', values.term_id > 0 ? values.term_id : 'dddddd');
      return _react["default"].createElement("div", {
        className: cls
      }, taxonomy_title !== false ? _react["default"].createElement("h4", null, values.term_id == 0 ? 'Create New' : 'Edit', " ", taxonomy_title) : null, _react["default"].createElement("div", {
        ref: function ref(el) {
          return _this3.filed_container = el;
        }
      }, "Name", _react["default"].createElement("input", {
        type: "text",
        name: "name",
        className: "form-control",
        onChange: this.storeVals,
        defaultValue: values.name
      }), _react["default"].createElement("br", null), "Slug", _react["default"].createElement("input", {
        type: "text",
        name: "slug",
        className: "form-control",
        onChange: this.storeVals,
        defaultValue: values.slug
      }), _react["default"].createElement("br", null), hierarchical ? _react["default"].createElement("div", null, "Parent", _react["default"].createElement("select", {
        name: "parent",
        className: "form-control",
        onChange: this.storeVals,
        defaultValue: values.parent
      }, _react["default"].createElement("option", {
        value: "0"
      }, "None"), taxonomies.map(function (item) {
        return item.term_id !== values.term_id ? _react["default"].createElement("option", {
          key: item.term_id,
          value: item.term_id
        }, '-'.repeat(item.nest_level) + item.name) : null;
      })), _react["default"].createElement("br", null)) : null, "Description", _react["default"].createElement("textarea", {
        name: "description",
        className: "form-control",
        onChange: this.storeVals,
        defaultValue: values.description
      }), _react["default"].createElement("br", null), "Featured Image", _react["default"].createElement(_react2.FileChooser, {
        key: container_key,
        onChange: function onChange(f) {
          return _this3.storeVals(false, {
            featured_image: f.post_id
          });
        },
        multiple: false,
        accept: ['image/jpeg', 'image/png']
      }), values.featured_image || !feat_image ? null : _react["default"].createElement("img", {
        src: feat_image,
        style: {
          'maxHeight': '140px',
          'display': 'block'
        }
      }), _react["default"].createElement("br", null), closeEditor ? _react["default"].createElement("button", {
        onClick: closeEditor,
        className: "btn btn-secondary btn-sm"
      }, "Close") : null, "\xA0", _react["default"].createElement("button", {
        onClick: this.saveTaxonomy,
        className: "btn btn-secondary btn-sm"
      }, values.term_id > 0 ? 'Update' : 'Create'), "\xA0", this.state.loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null), _react["default"].createElement(_instruction.Instruction, null));
    }
  }]);

  return Editor;
}(_react.Component);

exports.Editor = Editor;