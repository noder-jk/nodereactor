"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ajax_request = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _react = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ajax_request = function ajax_request(action, data, callback, u_progress) {
  // Manage if data object is not provided
  if (_typeof(data) !== 'object') {
    u_progress = callback;
    callback = data;
    data = {};
  } // Create data object to send to server


  var form_data = data instanceof FormData;
  var ind = action.indexOf('?');
  var search = ind > -1 ? action.slice(ind) : '';
  ind > -1 ? action = action.slice(0, ind) : 0;
  form_data ? data.append('action', action) : data['action'] = action;
  var req_ob = {
    method: 'post',
    url: _react.ajax_url + search,
    timeout: 30000,
    data: data
  }; // Set headers and progress event handler

  form_data ? req_ob.headers = {
    'Content-Type': 'multipart/form-data'
  } : 0;
  u_progress ? req_ob.onUploadProgress = u_progress : 0; // Finally start ajax

  (0, _axios["default"])(req_ob).then(function (r) {
    _typeof(r) !== 'object' ? r = {} : 0;
    var _r = r,
        _r$data = _r.data,
        data = _r$data === void 0 ? {} : _r$data;
    callback ? callback(data, r, null) : 0;
  })["catch"](function (e) {
    callback ? callback({}, {}, e) : 0;
  });
};

exports.ajax_request = ajax_request;