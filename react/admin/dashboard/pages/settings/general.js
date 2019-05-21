"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GSetting = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var Input = function Input(props) {
  var _props$title = props.title,
      title = _props$title === void 0 ? '' : _props$title,
      _props$name = props.name,
      name = _props$name === void 0 ? '' : _props$name,
      _props$type = props.type,
      type = _props$type === void 0 ? 'text' : _props$type,
      _props$def = props.def,
      def = _props$def === void 0 ? '' : _props$def,
      change = props.change,
      children = props.children,
      _props$inp = props.inp,
      inp = _props$inp === void 0 ? true : _props$inp,
      _props$txt = props.txt,
      txt = _props$txt === void 0 ? false : _props$txt,
      _props$style = props.style,
      style = _props$style === void 0 ? {} : _props$style,
      min = props.min;
  return _react["default"].createElement("div", {
    className: "row mb-4"
  }, _react["default"].createElement("div", {
    className: "col-12 col-sm-4 col-md-3 col-lg-2"
  }, title), _react["default"].createElement("div", {
    className: "col-12 col-sm-8 col-md-6 col-lg-4"
  }, inp ? _react["default"].createElement("input", {
    name: name,
    type: type,
    min: min,
    className: "form-control",
    defaultValue: def,
    onChange: change
  }) : null, txt ? _react["default"].createElement("textarea", {
    style: style,
    name: name,
    type: type,
    className: "form-control",
    defaultValue: def,
    onChange: change
  }) : null, children));
};

var GSetting =
/*#__PURE__*/
function (_Component) {
  _inherits(GSetting, _Component);

  function GSetting(props) {
    var _this;

    _classCallCheck(this, GSetting);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GSetting).call(this, props));
    var ResponseData = _this.props.ResponseData;
    var _ResponseData$values = ResponseData.values,
        values = _ResponseData$values === void 0 ? {} : _ResponseData$values;
    _this.state = {
      name: values.name,
      description: values.description,
      time_zone: values.time_zone,
      max_upload_size: values.max_upload_size || 1024 * 1 * 1024 * 1024,
      max_db_connection: values.max_db_connection || 50,
      session_max_age: values.session_max_age || 86400,
      track_file_request: values.track_file_request || 'no',
      file_request_pattern: values.file_request_pattern,
      hot_linking_pattern: values.hot_linking_pattern
    };
    _this.getVal = _this.getVal.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(GSetting, [{
    key: "getVal",
    value: function getVal(e) {
      var onChange = this.props.onChange;
      var el = e.currentTarget;

      if (el.type == 'radio' && el.checked == true) {
        this.setState(_defineProperty({}, el.name, el.value));
      }

      onChange(e);
    }
  }, {
    key: "render",
    value: function render() {
      var ResponseData = this.props.ResponseData;
      var _ResponseData$time_zo = ResponseData.time_zones,
          time_zones = _ResponseData$time_zo === void 0 ? [] : _ResponseData$time_zo;
      return _react["default"].createElement("div", null, _react["default"].createElement("div", {
        className: "row mb-4"
      }, _react["default"].createElement("div", {
        className: "col-12"
      }, _react["default"].createElement("h3", null, "General Settings"))), _react["default"].createElement(Input, {
        title: "Site Title",
        name: "name",
        change: this.getVal,
        def: this.state.name
      }), _react["default"].createElement(Input, {
        title: "Tagline",
        name: "description",
        change: this.getVal,
        def: this.state.description
      }, _react["default"].createElement("small", null, _react["default"].createElement("i", null, "In a few words, explain what this site is about."))), _react["default"].createElement(Input, {
        title: "Timezone",
        inp: false
      }, _react["default"].createElement("select", {
        name: "time_zone",
        className: "form-control",
        onChange: this.getVal,
        defaultValue: this.state.time_zone
      }, time_zones.map(function (item) {
        return _react["default"].createElement("option", {
          key: item.zone,
          value: item.zone
        }, item.name);
      }))), _react["default"].createElement(Input, {
        title: "Max Upload Size (Byte)",
        type: "number",
        min: 1,
        name: "max_upload_size",
        change: this.getVal,
        def: this.state.max_upload_size
      }), _react["default"].createElement(Input, {
        title: "Max DB Connection",
        name: "max_db_connection",
        type: "number",
        min: 5,
        change: this.getVal,
        def: this.state.max_db_connection
      }, _react["default"].createElement("small", null, _react["default"].createElement("i", null, "Firstly make sure how many concurrent connection your Database supports"))), _react["default"].createElement(Input, {
        title: "Session Max Age (Seconds)",
        name: "session_max_age",
        change: this.getVal,
        def: this.state.session_max_age
      }, _react["default"].createElement("small", null, _react["default"].createElement("i", null, "Explicit expiry will override this."))), _react["default"].createElement("div", {
        className: "row mb-4"
      }, _react["default"].createElement("div", {
        className: "col-12 col-sm-4 col-md-3 col-lg-2"
      }, "Track File Request"), _react["default"].createElement("div", {
        className: "col-12 col-sm-8 col-md-6 col-lg-4"
      }, _react["default"].createElement("input", {
        type: "radio",
        name: "track_file_request",
        value: "yes",
        defaultChecked: this.state.track_file_request == 'yes',
        onChange: this.getVal
      }), " Yes \xA0\xA0", _react["default"].createElement("input", {
        type: "radio",
        name: "track_file_request",
        value: "no",
        defaultChecked: this.state.track_file_request == 'no',
        onChange: this.getVal
      }), " No", _react["default"].createElement("br", null), _react["default"].createElement("small", null, _react["default"].createElement("i", null, "Hooks, functions ", this.state.track_file_request == 'no' ? 'won\'t' : 'will', " be able to manipulate file requests.")))), this.state.track_file_request == 'yes' ? _react["default"].createElement(Input, {
        title: "File URL Pattern (Regex)",
        name: "file_request_pattern",
        change: this.getVal,
        def: this.state.file_request_pattern,
        txt: true,
        inp: false,
        style: {
          'overflow': 'auto',
          'whiteSpace': 'nowrap'
        }
      }, _react["default"].createElement("small", null, _react["default"].createElement("i", null, "Multiple pattern allowed. Separate by new line without delimiter. At least one matched pattern will be tracked. Only relative path matchable, not domain."), _react["default"].createElement("br", null), _react["default"].createElement("i", null, "Tracking every file request will slow down webpage loading."))) : null, _react["default"].createElement(Input, {
        title: "Allowed Hot Linker (Regex)",
        name: "hot_linking_pattern",
        change: this.getVal,
        def: this.state.hot_linking_pattern,
        txt: true,
        inp: false,
        style: {
          'overflow': 'auto',
          'whiteSpace': 'nowrap'
        }
      }, _react["default"].createElement("small", null, _react["default"].createElement("i", null, "Enter allowed referrer patterns that can embed image, scripts etc."), _react["default"].createElement("br", null), _react["default"].createElement("i", null, "Multiple pattern allowed. Separate by new line without delimiter."))));
    }
  }]);

  return GSetting;
}(_react.Component);

exports.GSetting = GSetting;