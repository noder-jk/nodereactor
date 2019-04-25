"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyProfile = void 0;

var _react = _interopRequireDefault(require("react"));

var _edit = require("../edit");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var MyProfile = function MyProfile() {
  return _react["default"].createElement(_edit.EditUser, {
    user_id: true
  });
};

exports.MyProfile = MyProfile;