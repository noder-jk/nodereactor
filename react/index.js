"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Placeholder", {
  enumerable: true,
  get: function get() {
    return _compPlaceholder.Placeholder;
  }
});
Object.defineProperty(exports, "parse_form", {
  enumerable: true,
  get: function get() {
    return _formParser.parse_form;
  }
});
Object.defineProperty(exports, "get_url_parameter", {
  enumerable: true,
  get: function get() {
    return _utility.get_url_parameter;
  }
});
Object.defineProperty(exports, "Pagination", {
  enumerable: true,
  get: function get() {
    return _utility.Pagination;
  }
});
Object.defineProperty(exports, "get_hierarchy", {
  enumerable: true,
  get: function get() {
    return _utility.get_hierarchy;
  }
});
Object.defineProperty(exports, "LoginRegistration", {
  enumerable: true,
  get: function get() {
    return _auth.LoginRegistration;
  }
});
Object.defineProperty(exports, "AdminBar", {
  enumerable: true,
  get: function get() {
    return _adminBar.AdminBar;
  }
});
Object.defineProperty(exports, "Editor", {
  enumerable: true,
  get: function get() {
    return _editor.Editor;
  }
});
Object.defineProperty(exports, "Media", {
  enumerable: true,
  get: function get() {
    return _media.Media;
  }
});
Object.defineProperty(exports, "RenderMediaFile", {
  enumerable: true,
  get: function get() {
    return _renderMedia.RenderMediaFile;
  }
});
Object.defineProperty(exports, "array_pull_down", {
  enumerable: true,
  get: function get() {
    return _array.array_pull_down;
  }
});
Object.defineProperty(exports, "array_pull_up", {
  enumerable: true,
  get: function get() {
    return _array.array_pull_up;
  }
});
Object.defineProperty(exports, "ajaxRequest", {
  enumerable: true,
  get: function get() {
    return _ajax.ajaxRequest;
  }
});
exports.nr_socket_event = exports.nr_ajax_url = void 0;

var _compPlaceholder = require("./helper/comp-placeholder");

var _formParser = require("./helper/form-parser");

var _utility = require("./helper/utility");

var _auth = require("./tools/auth");

var _adminBar = require("./tools/admin-bar");

var _editor = require("./tools/editor");

var _media = require("./tools/media");

var _renderMedia = require("./helper/render-media");

var _array = require("./helper/array");

var _ajax = require("./helper/ajax");

var ScodeHooks = _interopRequireWildcard(require("./hooks/shortcode"));

var MenuHooks = _interopRequireWildcard(require("./hooks/menu"));

var PostHooks = _interopRequireWildcard(require("./hooks/post"));

var SidebarHooks = _interopRequireWildcard(require("./hooks/sidebar"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var hooks = [PostHooks, SidebarHooks, MenuHooks, ScodeHooks];
var nr_ajax_url = '/admin-ajax';
exports.nr_ajax_url = nr_ajax_url;
var nr_socket_event = 'nr-socket-io-core-channel';
exports.nr_socket_event = nr_socket_event;

/* Export various hooks dynamically */
for (var i = 0; i < hooks.length; i++) {
  for (var k in hooks[i]) {
    module.exports[k] = hooks[i][k];
  }
}