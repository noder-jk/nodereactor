"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RSetting = void 0;

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

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RSetting =
/*#__PURE__*/
function (_Component) {
  _inherits(RSetting, _Component);

  function RSetting(props) {
    var _this;

    _classCallCheck(this, RSetting);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RSetting).call(this, props));
    var _this$props$ResponseD = _this.props.ResponseData.values,
        values = _this$props$ResponseD === void 0 ? {} : _this$props$ResponseD;
    var _values$home_page_sho = values.home_page_shows,
        home_page_shows = _values$home_page_sho === void 0 ? 'lp' : _values$home_page_sho;
    _this.state = {
      'loading': false,
      'posts': [],
      'homepage': home_page_shows
    };
    _this.changHandle = _this.changHandle.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(RSetting, [{
    key: "changHandle",
    value: function changHandle(e) {
      var onChange = this.props.onChange;
      onChange(e);
      var el = e.currentTarget;

      if (el.checked) {
        this.setState({
          'homepage': el.value
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      /* this.setState({'loading':true});
      axios({
          'method':'post',
          'url':ajax_url ,
          'data':{'action':'get_posts_to_show_in_home'}
      }).then(r=>
      {
          let set_ob={'loading':false};
          
          if(r.data && r.data.posts)
          {
              set_ob.posts=r.data.posts;
          }
            this.setState(set_ob);
      }).catch(e=>
      {
          this.setState({'loading':false});
          
      }) */
    }
  }, {
    key: "render",
    value: function render() {
      var onChange = this.props.onChange;
      var _this$props$ResponseD2 = this.props.ResponseData.values,
          values = _this$props$ResponseD2 === void 0 ? {} : _this$props$ResponseD2;
      var _values$posts_per_pag = values.posts_per_page,
          posts_per_page = _values$posts_per_pag === void 0 ? 15 : _values$posts_per_pag;
      return _react.default.createElement("div", null, _react.default.createElement("div", {
        className: "row mb-4"
      }, _react.default.createElement("div", {
        className: "col-12"
      }, _react.default.createElement("h3", null, "Reading Settings ", this.state.loading ? _react.default.createElement(_reactSvgSpinner.default, {
        size: "15px"
      }) : null))), _react.default.createElement("div", {
        className: "row mb-4"
      }, _react.default.createElement("div", {
        className: "col-12 col-sm-4 col-md-3 col-lg-2"
      }, "Default Post Limit"), _react.default.createElement("div", {
        className: "col-12 col-sm-8 col-md-6 col-lg-4"
      }, _react.default.createElement("input", {
        className: "form-control",
        type: "number",
        min: "1",
        name: "posts_per_page",
        defaultValue: posts_per_page,
        onChange: onChange
      }), _react.default.createElement("small", null, _react.default.createElement("i", null, "Applicable only if limit is not defined explicitly in query.")))));
    }
  }]);

  return RSetting;
}(_react.Component);

exports.RSetting = RSetting;