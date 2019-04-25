"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitPostEditor = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

var _editor = require("./editor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var InitPostEditor = function InitPostEditor(props) {
  /* detect if it is create or edit. if edit parse post id */
  var pt = window.location.pathname;
  pt = pt.slice(1);
  pt = pt.split('/');
  var type = pt[1];
  type = type.slice('post_type_'.length);
  var c_or_e = pt[2];
  var p_id = pt[3] ? pt[3] : false;
  var ob = {
    'action': 'nr_get_post_create_edit',
    'post_type': type,
    'c_or_e': c_or_e
  };

  if (p_id) {
    ob.post_id = p_id;
  } else if (pt[2] && pt[2] == 'edit') {
    window.location.replace('all');
    return;
  }

  return _react["default"].createElement(_react2.Placeholder, {
    Data: ob,
    Component: _editor.PostProcess
  });
};

exports.InitPostEditor = InitPostEditor;