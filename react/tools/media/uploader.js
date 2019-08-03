"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Uploader = void 0;

var _react = _interopRequireWildcard(require("react"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Uploader =
/*#__PURE__*/
function (_Component) {
  _inherits(Uploader, _Component);

  function Uploader(props) {
    var _this;

    _classCallCheck(this, Uploader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Uploader).call(this, props));
    _this.state = {
      'button_disabled': false,
      'upload_details': _react["default"].createElement("span", null, "Select Files to Start Upload.")
    };
    _this.startUpload = _this.startUpload.bind(_assertThisInitialized(_this));
    _this.progressHandler = _this.progressHandler.bind(_assertThisInitialized(_this));
    _this.callbackHandler = _this.callbackHandler.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Uploader, [{
    key: "progressHandler",
    value: function progressHandler(progressEvent, files_to_upload_total, files_to_upload) {
      var percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);

      var d = _react["default"].createElement("span", null, "Upload in Progress:", files_to_upload_total - files_to_upload.length + '/' + files_to_upload_total + ' (' + percentCompleted + ')%');

      this.setState({
        upload_details: d
      });
    }
  }, {
    key: "callbackHandler",
    value: function callbackHandler(r, d, e, files_to_upload, upload_loop) {
      var ob = {
        button_disabled: false,
        upload_details: _react["default"].createElement("span", null, "Upload has been completed.")
      };

      if (e) {
        ob.upload_details = _react["default"].createElement("span", null, "Upload Request Failed.");
      } else if (!r.insertId) {
        ob.upload_details = _react["default"].createElement("span", null, "Upload Failed.");
      } else if (files_to_upload.length > 0) {
        upload_loop();
      }

      this.setState(ob);
    }
  }, {
    key: "startUpload",
    value: function startUpload(e) {
      var _this2 = this;

      var input = e.currentTarget;
      var files_to_upload = [];

      for (var i = 0; i < input.files.length; i++) {
        if (input.files[i].size > window.nr_configs.max_upload_size_byte) {
          _sweetalert["default"].fire('Action failed. ' + input.files[i].name + ' exceeds size limit ' + window.nr_configs.max_upload_size_readable + '.');

          return;
        }

        files_to_upload.push(input.files[i]);
      }

      var files_to_upload_total = files_to_upload.length;

      var upload_loop = function upload_loop() {
        if (files_to_upload.length == 0) {
          _this2.setState({
            button_disabled: false
          });

          return;
        }

        !_this2.state.button_disabled ? _this2.setState({
          button_disabled: true
        }) : 0; // process file

        var f = files_to_upload.shift();
        var formData = new FormData();
        formData.append('nr_media_file', f, f.name);
        formData.append('to_do', 'upload'); // start upload single file

        (0, _react2.ajaxRequest)('nr_media_upload', formData, function (r, d, e) {
          return _this2.callbackHandler(r, d, e, files_to_upload, upload_loop);
        }, function (p) {
          return _this2.progressHandler(p, files_to_upload_total, files_to_upload);
        });
      };

      upload_loop();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          button_disabled = _this$state.button_disabled,
          upload_details = _this$state.upload_details;
      return _react["default"].createElement("div", {
        id: "attachment_uploader",
        className: "uploader-inline"
      }, _react["default"].createElement("div", {
        className: "uploader-inline-content no-upload-message"
      }, _react["default"].createElement("div", {
        className: "upload-ui"
      }, _react["default"].createElement("button", {
        disabled: button_disabled,
        type: "button",
        className: "btn btn-outline-secondary btn-lg",
        onClick: function onClick(e) {
          return e.currentTarget.nextElementSibling.click();
        }
      }, "Select Files"), _react["default"].createElement("input", {
        type: "file",
        style: {
          'display': 'none'
        },
        onChange: this.startUpload,
        multiple: "multiple"
      })), _react["default"].createElement("div", {
        className: "upload-inline-status"
      }, upload_details), _react["default"].createElement("div", {
        className: "post-upload-ui"
      }, _react["default"].createElement("p", {
        className: "max-upload-size"
      }, "Individual File Size Limit ", window.nr_configs.max_upload_size_readable, "."))));
    }
  }]);

  return Uploader;
}(_react.Component);

exports.Uploader = Uploader;