"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostTaxonomy = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

var _index = require("../taxonomy/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PostTaxonomy =
/*#__PURE__*/
function (_Component) {
  _inherits(PostTaxonomy, _Component);

  function PostTaxonomy(props) {
    var _this;

    _classCallCheck(this, PostTaxonomy);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PostTaxonomy).call(this, props));
    var _this$props = _this.props,
        _this$props$meta_box_ = _this$props.meta_box_id,
        meta_box_id = _this$props$meta_box_ === void 0 ? '' : _this$props$meta_box_,
        _this$props$post_meta = _this$props.post_meta,
        post_meta = _this$props$post_meta === void 0 ? {} : _this$props$post_meta;
    var primary_term_key = 'primary_term_id_of_' + meta_box_id;
    _this.state = {
      'all_terms': [],
      'current_terms': [],
      'loading': false,
      'hierarchical': false,
      'create': false,
      'primary_term_key': primary_term_key,
      'primary_term': post_meta[primary_term_key] || false
    };
    _this.fetchTaxonomy = _this.fetchTaxonomy.bind(_assertThisInitialized(_this));
    _this.toggleEditor = _this.toggleEditor.bind(_assertThisInitialized(_this));
    _this.saveTaxonomy = _this.saveTaxonomy.bind(_assertThisInitialized(_this));
    _this.toggleCurrentTerms = _this.toggleCurrentTerms.bind(_assertThisInitialized(_this));
    _this.setPrimaryTerm = _this.setPrimaryTerm.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PostTaxonomy, [{
    key: "fetchTaxonomy",
    value: function fetchTaxonomy() {
      var _this2 = this;

      this.setState({
        'loading': true
      });
      var _this$props2 = this.props,
          post_id = _this$props2.post_id,
          meta_box_id = _this$props2.meta_box_id;
      (0, _react2.ajaxRequest)('nr_get_taxonomy_in_editor', {
        'taxonomy': meta_box_id,
        post_id: post_id
      }, function (r, d, e) {
        if (e) {
          _this2.setState({
            'loading': false
          });

          _sweetalert["default"].fire('Error', 'Request Error In Taxonomy Parse', 'error');

          return;
        }

        var taxonomies = r.all_terms || [];
        var current_terms = r.current_terms || [];
        var hierarchical = r.hierarchical || false;
        var multiple = r.multiple == true;
        current_terms = current_terms.map(function (item) {
          return parseInt(item);
        }).filter(function (item) {
          return Number.isInteger(item);
        });

        _this2.setState({
          'loading': false,
          'all_terms': (0, _react2.get_hierarchy)(taxonomies, 'parent', 'term_id'),
          current_terms: current_terms,
          hierarchical: hierarchical,
          multiple: multiple
        });
      });
    }
  }, {
    key: "setPrimaryTerm",
    value: function setPrimaryTerm(e) {
      var el = e.currentTarget;

      if (el.checked) {
        this.setState(_defineProperty({}, el.name, el.value));
      }
    }
  }, {
    key: "toggleCurrentTerms",
    value: function toggleCurrentTerms(e) {
      var el = e.currentTarget;
      var val = parseInt(el.value);
      var ct = this.state.current_terms;

      if (el.checked == true) {
        if (ct.indexOf(val) == -1) {
          ct.push(val);
        }
      } else {
        if (ct.indexOf(val) > -1) {
          ct.splice(ct.indexOf(val), 1);
        }
      }
      /* Keeps only one if it is radio button. It means the taxonomy accepts only single */


      if (el.type == 'radio' && ct.length > 0) {
        ct = [ct[ct.length - 1]];
      }

      this.setState({
        'current_terms': ct
      });
    }
  }, {
    key: "toggleEditor",
    value: function toggleEditor(a, b) {
      this.setState({
        'create': b == true
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$props$post_upda = this.props.post_updated,
          post_updated = _this$props$post_upda === void 0 ? false : _this$props$post_upda;

      if (post_updated) {
        this.saveTaxonomy();
      }
    }
  }, {
    key: "saveTaxonomy",
    value: function saveTaxonomy() {
      var _this3 = this;

      var _this$props3 = this.props,
          post_id = _this$props3.post_id,
          meta_box_id = _this$props3.meta_box_id;
      var current_terms = this.state.current_terms;
      var req_ob = {
        'post_id': post_id,
        'current_terms': current_terms,
        'taxonomy': meta_box_id
      };
      this.setState({
        'loading': true
      });
      (0, _react2.ajaxRequest)('nr_save_post_editor_taxonomy', req_ob, function (r) {
        _this3.setState({
          'loading': false
        });
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchTaxonomy();
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var meta_box_id = this.props.meta_box_id;
      var pass_prop = {
        'taxonomy': meta_box_id,
        'hierarchical': this.state.hierarchical,
        'taxonomy_title': false,
        'taxonomies': this.state.all_terms
      };
      var _this$state = this.state,
          all_terms = _this$state.all_terms,
          _this$state$current_t = _this$state.current_terms,
          current_terms = _this$state$current_t === void 0 ? [] : _this$state$current_t;
      return _react["default"].createElement("div", null, this.state.loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null, _react["default"].createElement("form", {
        onSubmit: function onSubmit(e) {
          return e.preventDefault();
        },
        style: {
          'maxHeight': '500px',
          'overflow': 'auto'
        }
      }, _react["default"].createElement("table", {
        style: {
          'width': '100%'
        }
      }, _react["default"].createElement("tbody", null, all_terms.map(function (item) {
        return _react["default"].createElement("tr", {
          key: item.term_id
        }, _react["default"].createElement("td", null, _react["default"].createElement("div", {
          style: {
            'paddingLeft': item.nest_level * 12 + 'px'
          }
        }, _react["default"].createElement("input", {
          type: _this4.state.multiple == true ? "checkbox" : "radio",
          "data-ignore": true,
          name: "taxonomy_" + meta_box_id,
          value: item.term_id,
          defaultChecked: current_terms.indexOf(item.term_id) > -1,
          onChange: _this4.toggleCurrentTerms
        }), " ", item.name)), _react["default"].createElement("td", {
          className: "text-right"
        }, current_terms.indexOf(item.term_id) > -1 ? _react["default"].createElement("input", {
          type: "radio",
          title: "Select Primary Term",
          name: _this4.state.primary_term_key,
          value: item.term_id,
          defaultChecked: _this4.state.primary_term == item.term_id,
          onChange: _this4.setPrimaryTerm
        }) : null));
      })))), this.state.create ? _react["default"].createElement("div", {
        className: "mt-2"
      }, _react["default"].createElement(_index.Editor, _extends({}, pass_prop, {
        fetchTaxonomies: this.fetchTaxonomy,
        closeEditor: this.toggleEditor,
        cls: "container-fluid"
      }))) : _react["default"].createElement("div", {
        className: "text-right mt-2"
      }, _react["default"].createElement("span", {
        className: "text-info pointer",
        onClick: function onClick() {
          return _this4.toggleEditor(true, true);
        },
        style: {
          'cursor': 'pointer'
        }
      }, "Create")));
    }
  }]);

  return PostTaxonomy;
}(_react.Component);

exports.PostTaxonomy = PostTaxonomy;