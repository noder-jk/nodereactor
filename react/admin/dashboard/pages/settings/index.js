"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PermalinkSetting", {
  enumerable: true,
  get: function get() {
    return _permalink.PermalinkSetting;
  }
});
exports.ReadingSetting = exports.GeneralSetting = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("nodereactor/react");

var _permalink = require("./permalink");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var general_fields = {
  name: {
    title: 'Site Title'
  },
  description: {
    title: 'Tagline'
  },
  time_zone: {
    title: 'Timezone',
    type: 'select',
    values: [],
    default_value: 'UTC'
  },
  max_upload_size: {
    title: 'Max Upload Size (Byte)'
  },
  max_db_connection: {
    title: 'Max DB Connection'
  },
  nr_session_cookie_name: {
    title: 'Session Cookie Name Key',
    type: 'text',
    hint: 'All users will be logged out upon change.'
  },
  nr_session_cookie_pass: {
    title: 'Session Cookie Pass Key',
    type: 'text',
    hint: 'All users will be logged out upon change.'
  },
  session_max_age: {
    title: 'Default Session Expiry (Seconds)',
    type: 'number'
  },
  nr_cookie_expiry: {
    title: 'Default Cookie Expiry (Seconds)',
    type: 'number'
  },
  nr_login_expiry: {
    title: 'Default Login Expiry (Seconds)',
    type: 'number'
  },
  hot_linking_pattern: {
    title: 'Allowed Hot Linker Patterns (Regex)',
    type: 'textarea',
    hint: 'Separate multiple patterns by new line without delimiter. Only matched linkers will be allowed to embed contents.'
  }
};
var reading_fields = {
  posts_per_page: {
    title: 'Post Per Page Default',
    type: 'number',
    min: 1,
    default_value: 10
  },
  media_per_page: {
    title: 'Media per page in Media Dashboard',
    type: 'number',
    min: 1,
    default_value: 30
  }
};

var GeneralSettingProcess = function GeneralSettingProcess(props) {
  var response = props.response;
  var _response$time_zones = response.time_zones,
      time_zones = _response$time_zones === void 0 ? [] : _response$time_zones;
  general_fields.time_zone.values = time_zones;
  return _react["default"].createElement(_react2.BasicSettings, {
    title: "General Settings",
    package_name: true,
    get_data_action: "nr_get_general_settings",
    save_data_action: "nr_save_general_settings",
    fields: general_fields
  });
};

var GeneralSetting = function GeneralSetting() {
  return _react["default"].createElement(_react2.Placeholder, {
    action: "nr_get_gen_settings",
    component: GeneralSettingProcess
  });
};

exports.GeneralSetting = GeneralSetting;

var ReadingSetting = function ReadingSetting() {
  return _react["default"].createElement(_react2.BasicSettings, {
    title: "Reading Settings",
    package_name: true,
    fields: reading_fields
  });
};

exports.ReadingSetting = ReadingSetting;