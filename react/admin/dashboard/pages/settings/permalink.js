"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PermalinkSetting = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

var _instruction = require("../post/taxonomy/instruction");

require("./permalink.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PermalinkSetting =
/*#__PURE__*/
function (_Component) {
  _inherits(PermalinkSetting, _Component);

  function PermalinkSetting(props) {
    var _this;

    _classCallCheck(this, PermalinkSetting);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PermalinkSetting).call(this, props));
    _this.state = {
      'configs': {},
      'loading': false,
      'saving': false,
      'values': {}
    };
    _this.saveData = _this.saveData.bind(_assertThisInitialized(_this));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PermalinkSetting, [{
    key: "saveData",
    value: function saveData() {
      var _this2 = this;

      var values = this.state.values;
      this.setState({
        saving: true
      });
      (0, _react2.ajax_request)('nr_save_general_settings', {
        values: values
      }, function (r, d, e) {
        _this2.setState({
          saving: false
        });

        var _r$status = r.status,
            status = _r$status === void 0 ? 'error' : _r$status;

        _sweetalert["default"].fire(status, status == 'success' ? 'Saved' : 'Action Failed', status);
      });
    }
  }, {
    key: "onChange",
    value: function onChange(e) {
      var values = this.state.values;
      values = (0, _react2.parse_input_value)(e.currentTarget, values);
      this.setState({
        values: values
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      this.setState({
        'loading': true
      });
      (0, _react2.ajax_request)('nr_get_permalink_settings', function (r) {
        _this3.setState(_objectSpread({
          'loading': false
        }, r));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$state = this.state,
          _this$state$configs = _this$state.configs,
          configs = _this$state$configs === void 0 ? {} : _this$state$configs,
          loading = _this$state.loading,
          saving = _this$state.saving,
          values = _this$state.values;
      var _configs$post_types = configs.post_types,
          post_types = _configs$post_types === void 0 ? {} : _configs$post_types,
          _configs$taxonomies = configs.taxonomies,
          taxonomies = _configs$taxonomies === void 0 ? {} : _configs$taxonomies,
          _configs$used_taxonom = configs.used_taxonomies,
          used_taxonomies = _configs$used_taxonom === void 0 ? {} : _configs$used_taxonom;
      return loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : _react["default"].createElement("div", {
        id: "nr-settings-permalink-page"
      }, _react["default"].createElement("div", {
        className: "row mb-4"
      }, _react["default"].createElement("div", {
        className: "col-12"
      }, _react["default"].createElement("h4", null, "Permalink Structure"), _react["default"].createElement("hr", null))), Object.keys(post_types).map(function (pt) {
        var used_tx = Object.keys(taxonomies).filter(function (tx) {
          return used_taxonomies[pt] && used_taxonomies[pt].indexOf(tx) > -1;
        });
        var ptn = pt + '_post_permalink';
        var ptxn = pt + '_post_taxonomy';
        return _react["default"].createElement("form", {
          key: pt,
          className: "row mb-4"
        }, _react["default"].createElement("div", {
          className: "col-12 col-sm-4 col-md-3 col-lg-2"
        }, pt), _react["default"].createElement("div", {
          className: "col-12 col-sm-8 col-md-6 col-lg-4"
        }, post_types[pt].hierarchical == true ? _react["default"].createElement("label", null, _react["default"].createElement("input", {
          type: "radio",
          name: ptn,
          onChange: _this4.onChange,
          defaultChecked: true,
          value: "h"
        }), " hierarchical~") : _react["default"].createElement("div", null, _react["default"].createElement("label", null, _react["default"].createElement("input", {
          type: "radio",
          name: ptn,
          onChange: _this4.onChange,
          value: "n",
          defaultChecked: used_tx.length == 0 || values[ptn] == 'n'
        }), " post-name"), used_tx.length > 0 ? _react["default"].createElement("div", null, _react["default"].createElement("label", null, _react["default"].createElement("input", {
          type: "radio",
          name: ptn,
          onChange: _this4.onChange,
          value: "tn",
          defaultChecked: values[ptn] == 'tn'
        }), " terms~/post-name"), _react["default"].createElement("label", null, _react["default"].createElement("input", {
          type: "radio",
          name: ptn,
          onChange: _this4.onChange,
          value: "ttn",
          defaultChecked: values[ptn] == 'ttn'
        }), " taxonomy/terms~/post-name")) : null, _react["default"].createElement("br", null), used_tx.length > 0 ? _react["default"].createElement("b", null, "Permalink Taxonomy :") : null, used_tx.map(function (tx) {
          return _react["default"].createElement("label", {
            key: tx
          }, _react["default"].createElement("input", {
            type: "radio",
            onChange: _this4.onChange,
            name: ptxn,
            value: tx,
            defaultChecked: values[ptxn] == tx
          }), " ", tx);
        }))));
      }), _react["default"].createElement("hr", null), _react["default"].createElement("form", {
        className: "row mb-4"
      }, _react["default"].createElement("div", {
        className: "col-12 col-sm-4 col-md-3 col-lg-2"
      }, "Terms"), _react["default"].createElement("div", {
        className: "col-12 col-sm-8 col-md-6 col-lg-4"
      }, _react["default"].createElement("label", null, _react["default"].createElement("input", {
        type: "radio",
        name: "term_permalink",
        value: "t",
        onChange: this.onChange,
        defaultChecked: values.term_permalink == 't'
      }), " terms~"), _react["default"].createElement("label", null, _react["default"].createElement("input", {
        type: "radio",
        name: "term_permalink",
        value: "tt",
        onChange: this.onChange,
        defaultChecked: values.term_permalink == 'tt'
      }), " taxonomy/terms~"))), _react["default"].createElement("button", {
        disabled: loading || saving,
        className: "btn btn-secondary",
        onClick: this.saveData
      }, saving ? 'Saving' : 'Save', saving ? _react["default"].createElement("span", null, "\xA0 ", _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      })) : null), _react["default"].createElement(_instruction.Instruction, null));
    }
  }]);

  return PermalinkSetting;
}(_react.Component);

exports.PermalinkSetting = PermalinkSetting;