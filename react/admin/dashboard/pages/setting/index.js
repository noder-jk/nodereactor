"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeneralSetting = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

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

var FormProcess =
/*#__PURE__*/
function (_Component) {
  _inherits(FormProcess, _Component);

  function FormProcess(props) {
    var _this;

    _classCallCheck(this, FormProcess);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormProcess).call(this, props));
    _this.state = _this.props.ResponseData.values || {};
    _this.storeVal = _this.storeVal.bind(_assertThisInitialized(_this));
    _this.saveOption = _this.saveOption.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(FormProcess, [{
    key: "storeVal",
    value: function storeVal(e) {
      var el = e.target;
      var state = {};

      if (el.type == 'radio' && !el.checked) {
        return;
      }

      state[el.name] = el.value;
      this.setState(state);
    }
  }, {
    key: "saveOption",
    value: function saveOption() {
      (0, _axios.default)({
        method: 'post',
        url: _react2.ajax_url ,
        data: Object.assign({
          'action': 'nr_save_general_settings'
        }, this.state)
      }).then(function (r) {
        _sweetalert.default.fire(r.data && r.data.status == 'done' ? 'Saved' : 'Could not saved');
      }).catch(function (r) {
        _sweetalert.default.fire('Request error');
      });
    }
  }, {
    key: "render",
    value: function render() {
      var v = this.props.ResponseData;
      var values = v.values || v;
      var time_zones = v.time_zones || [];
      var p_structure = v.permalink_structure || 'post_name';
      var _values$name = values.name,
          name = _values$name === void 0 ? '' : _values$name,
          _values$description = values.description,
          description = _values$description === void 0 ? '' : _values$description,
          _values$time_zone = values.time_zone,
          time_zone = _values$time_zone === void 0 ? '' : _values$time_zone,
          _values$posts_per_pag = values.posts_per_page,
          posts_per_page = _values$posts_per_pag === void 0 ? 10 : _values$posts_per_pag;
      return _react.default.createElement("div", null, _react.default.createElement("div", {
        className: "row mb-4"
      }, _react.default.createElement("div", {
        className: "col-12"
      }, _react.default.createElement("h3", null, "General Settings"))), _react.default.createElement("div", {
        className: "row mb-4"
      }, _react.default.createElement("div", {
        className: "col-12 col-sm-4 col-md-3 col-lg-2"
      }, "Site Title"), _react.default.createElement("div", {
        className: "col-12 col-sm-8 col-md-6 col-lg-4"
      }, _react.default.createElement("input", {
        name: "name",
        type: "text",
        className: "form-control",
        defaultValue: name,
        onChange: this.storeVal
      }))), _react.default.createElement("div", {
        className: "row mb-4"
      }, _react.default.createElement("div", {
        className: "col-12 col-sm-4 col-md-3 col-lg-2"
      }, "Tagline"), _react.default.createElement("div", {
        className: "col-12 col-sm-8 col-md-6 col-lg-4"
      }, _react.default.createElement("input", {
        name: "description",
        type: "text",
        className: "form-control",
        defaultValue: description,
        onChange: this.storeVal
      }), _react.default.createElement("small", null, _react.default.createElement("i", null, "In a few words, explain what this site is about.")))), _react.default.createElement("form", {
        className: "row mb-4"
      }, _react.default.createElement("div", {
        className: "col-12 col-sm-4 col-md-3 col-lg-2"
      }, "Permalink"), _react.default.createElement("div", {
        className: "col-12 col-sm-8 col-md-6 col-lg-4"
      }, _react.default.createElement("label", {
        className: "d-block"
      }, _react.default.createElement("input", {
        type: "radio",
        name: "permalink_structure",
        value: "post_type/post_name",
        defaultChecked: p_structure == 'post_type/post_name',
        onChange: this.storeVal
      }), " example.com/post_type/post_name"), _react.default.createElement("label", {
        className: "d-block"
      }, _react.default.createElement("input", {
        type: "radio",
        name: "permalink_structure",
        value: "post_name",
        defaultChecked: p_structure == 'post_name',
        onChange: this.storeVal
      }), " example.com/post_name"))), _react.default.createElement("div", {
        className: "row mb-4"
      }, _react.default.createElement("div", {
        className: "col-12 col-sm-4 col-md-3 col-lg-2"
      }, "Default Post Limit"), _react.default.createElement("div", {
        className: "col-12 col-sm-8 col-md-6 col-lg-4"
      }, _react.default.createElement("input", {
        className: "form-control",
        type: "number",
        name: "posts_per_page",
        defaultValue: posts_per_page,
        onChange: this.storeVal
      }), _react.default.createElement("small", null, _react.default.createElement("i", null, "Applicable only if limit is undefined in query.")))), _react.default.createElement("div", {
        className: "row mb-4"
      }, _react.default.createElement("div", {
        className: "col-12 col-sm-4 col-md-3 col-lg-2"
      }, "Timezone"), _react.default.createElement("div", {
        className: "col-12 col-sm-8 col-md-6 col-lg-4"
      }, _react.default.createElement("select", {
        name: "time_zone",
        className: "form-control",
        onChange: this.storeVal,
        defaultValue: time_zone
      }, time_zones.map(function (item) {
        return _react.default.createElement("option", {
          key: item.zone,
          value: item.zone
        }, item.name);
      })))), _react.default.createElement("div", {
        className: "row"
      }, _react.default.createElement("div", {
        className: "col-12 col-sm-4 col-md-3 col-lg-2"
      }), _react.default.createElement("div", {
        className: "col-12 col-sm-8 col-md-6 col-lg-4"
      }, _react.default.createElement("button", {
        "data-button": "save",
        className: "btn btn-secondary btn-sm",
        onClick: this.saveOption
      }, "Save Chagnes"))));
    }
  }]);

  return FormProcess;
}(_react.Component);

var GeneralSetting = function GeneralSetting() {
  return _react.default.createElement(_react2.Placeholder, {
    Data: {
      'action': 'nr_get_general_settings'
    },
    Component: FormProcess
  });
};

exports.GeneralSetting = GeneralSetting;