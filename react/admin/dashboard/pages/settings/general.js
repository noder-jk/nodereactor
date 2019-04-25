"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GSetting = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var GSetting = function GSetting(props) {
  var onChange = props.onChange,
      ResponseData = props.ResponseData;
  var _ResponseData$values = ResponseData.values,
      values = _ResponseData$values === void 0 ? {} : _ResponseData$values,
      _ResponseData$time_zo = ResponseData.time_zones,
      time_zones = _ResponseData$time_zo === void 0 ? [] : _ResponseData$time_zo;
  var _values$name = values.name,
      name = _values$name === void 0 ? '' : _values$name,
      _values$description = values.description,
      description = _values$description === void 0 ? '' : _values$description,
      _values$time_zone = values.time_zone,
      time_zone = _values$time_zone === void 0 ? '' : _values$time_zone;
  return _react["default"].createElement("div", null, _react["default"].createElement("div", {
    className: "row mb-4"
  }, _react["default"].createElement("div", {
    className: "col-12"
  }, _react["default"].createElement("h3", null, "General Settings"))), _react["default"].createElement("div", {
    className: "row mb-4"
  }, _react["default"].createElement("div", {
    className: "col-12 col-sm-4 col-md-3 col-lg-2"
  }, "Site Title"), _react["default"].createElement("div", {
    className: "col-12 col-sm-8 col-md-6 col-lg-4"
  }, _react["default"].createElement("input", {
    name: "name",
    type: "text",
    className: "form-control",
    defaultValue: name,
    onChange: onChange
  }))), _react["default"].createElement("div", {
    className: "row mb-4"
  }, _react["default"].createElement("div", {
    className: "col-12 col-sm-4 col-md-3 col-lg-2"
  }, "Tagline"), _react["default"].createElement("div", {
    className: "col-12 col-sm-8 col-md-6 col-lg-4"
  }, _react["default"].createElement("input", {
    name: "description",
    type: "text",
    className: "form-control",
    defaultValue: description,
    onChange: onChange
  }), _react["default"].createElement("small", null, _react["default"].createElement("i", null, "In a few words, explain what this site is about.")))), _react["default"].createElement("div", {
    className: "row mb-4"
  }, _react["default"].createElement("div", {
    className: "col-12 col-sm-4 col-md-3 col-lg-2"
  }, "Timezone"), _react["default"].createElement("div", {
    className: "col-12 col-sm-8 col-md-6 col-lg-4"
  }, _react["default"].createElement("select", {
    name: "time_zone",
    className: "form-control",
    onChange: onChange,
    defaultValue: time_zone
  }, time_zones.map(function (item) {
    return _react["default"].createElement("option", {
      key: item.zone,
      value: item.zone
    }, item.name);
  })))));
};

exports.GSetting = GSetting;