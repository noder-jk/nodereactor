"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PSetting = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PSetting =
/*#__PURE__*/
function (_Component) {
  _inherits(PSetting, _Component);

  function PSetting(props) {
    var _this;

    _classCallCheck(this, PSetting);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PSetting).call(this, props));
    var _this$props$ResponseD = _this.props.ResponseData,
        ResponseData = _this$props$ResponseD === void 0 ? {} : _this$props$ResponseD;
    var _ResponseData$values = ResponseData.values,
        values = _ResponseData$values === void 0 ? {} : _ResponseData$values;
    _this.state = {
      'configs': {},
      'loading': false,
      values: values
    };
    return _this;
  }

  _createClass(PSetting, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.setState({
        'loading': true
      });
      (0, _react2.ajaxRequest)('nr_get_permalink_settings', function (r) {
        _this2.setState({
          'loading': false,
          configs: r
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var onChange = this.props.onChange;
      var _this$state$configs = this.state.configs,
          configs = _this$state$configs === void 0 ? {} : _this$state$configs;
      var _configs$post_types = configs.post_types,
          post_types = _configs$post_types === void 0 ? {} : _configs$post_types,
          _configs$taxonomies = configs.taxonomies,
          taxonomies = _configs$taxonomies === void 0 ? {} : _configs$taxonomies,
          _configs$used_taxonom = configs.used_taxonomies,
          used_taxonomies = _configs$used_taxonom === void 0 ? {} : _configs$used_taxonom;
      var values = this.state.values;
      return _react["default"].createElement("div", null, _react["default"].createElement("div", {
        className: "row mb-4"
      }, _react["default"].createElement("div", {
        className: "col-12"
      }, _react["default"].createElement("h4", null, "Permalink Structure", this.state.loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null))), Object.keys(post_types).map(function (pt) {
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
        }, post_types[pt].hierarchical == true ? _react["default"].createElement("div", null, _react["default"].createElement("input", {
          type: "radio",
          name: ptn,
          onChange: onChange,
          defaultChecked: true,
          value: "h"
        }), " hierarchical") : _react["default"].createElement("div", null, _react["default"].createElement("input", {
          type: "radio",
          name: ptn,
          onChange: onChange,
          value: "n",
          defaultChecked: used_tx.length == 0 || values[ptn] == 'n'
        }), " post-name", _react["default"].createElement("br", null), used_tx.length > 0 ? _react["default"].createElement("div", null, _react["default"].createElement("input", {
          type: "radio",
          name: ptn,
          onChange: onChange,
          value: "tn",
          defaultChecked: values[ptn] == 'tn'
        }), " terms/post-name", _react["default"].createElement("br", null), _react["default"].createElement("input", {
          type: "radio",
          name: ptn,
          onChange: onChange,
          value: "ttn",
          defaultChecked: values[ptn] == 'ttn'
        }), " taxonomy/terms/post-name") : null, _react["default"].createElement("br", null), used_tx.length > 0 ? _react["default"].createElement("b", null, "Permalink Taxonomy :") : null, used_tx.map(function (tx) {
          return _react["default"].createElement("div", {
            key: tx
          }, _react["default"].createElement("input", {
            type: "radio",
            onChange: onChange,
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
      }, _react["default"].createElement("div", null, _react["default"].createElement("input", {
        type: "radio",
        name: "term_permalink",
        value: "t",
        onChange: onChange,
        defaultChecked: values.term_permalink == 't'
      }), " terms"), _react["default"].createElement("div", null, _react["default"].createElement("input", {
        type: "radio",
        name: "term_permalink",
        value: "tt",
        onChange: onChange,
        defaultChecked: values.term_permalink == 'tt'
      }), " taxonomy/terms"))));
    }
  }]);

  return PSetting;
}(_react.Component);

exports.PSetting = PSetting;