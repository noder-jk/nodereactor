"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Media = void 0;

var _react = _interopRequireWildcard(require("react"));

var _browser = require("./browser");

var _uploader = require("./uploader");

require("./wp-style.css");

require("./style.scss");

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

var Media =
/*#__PURE__*/
function (_Component) {
  _inherits(Media, _Component);

  function Media(props) {
    var _this;

    _classCallCheck(this, Media);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Media).call(this, props));
    _this.state = {
      'active_tab': 'uploader',
      'selected_files': []
    };
    _this.navigate = _this.navigate.bind(_assertThisInitialized(_this));
    _this.closeThisMedia = _this.closeThisMedia.bind(_assertThisInitialized(_this));
    _this.getSelected = _this.getSelected.bind(_assertThisInitialized(_this));
    _this.insertEvent = _this.insertEvent.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Media, [{
    key: "getSelected",
    value: function getSelected(files) {
      this.setState({
        selected_files: files
      });
    }
  }, {
    key: "navigate",
    value: function navigate(e, tab) {
      e.preventDefault();
      this.setState({
        'active_tab': tab
      });
    }
  }, {
    key: "insertEvent",
    value: function insertEvent() {
      var _this$props = this.props,
          _this$props$onResult = _this$props.onResult,
          onResult = _this$props$onResult === void 0 ? false : _this$props$onResult,
          _this$props$multiple = _this$props.multiple,
          multiple = _this$props$multiple === void 0 ? false : _this$props$multiple;

      if (typeof onResult == 'function') {
        var f = multiple == true ? this.state.selected_files : this.state.selected_files[0];
        onResult(f);
      }

      this.closeThisMedia();
    }
  }, {
    key: "closeThisMedia",
    value: function closeThisMedia() {
      var _this$props$onClose = this.props.onClose,
          onClose = _this$props$onClose === void 0 ? function () {} : _this$props$onClose;
      onClose();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          _this$props2$adminCal = _this$props2.adminCall,
          adminCall = _this$props2$adminCal === void 0 ? false : _this$props2$adminCal,
          _this$props2$insertTe = _this$props2.insertText,
          insertText = _this$props2$insertTe === void 0 ? "Insert" : _this$props2$insertTe,
          _this$props2$cancelTe = _this$props2.cancelText,
          cancelText = _this$props2$cancelTe === void 0 ? "Cancel" : _this$props2$cancelTe,
          _this$props2$multiple = _this$props2.multiple,
          multiple = _this$props2$multiple === void 0 ? false : _this$props2$multiple;
      var cls = "media-modal wp-core-ui fixed-media";

      if (adminCall == true) {
        cls += ' dedicated-media';
      }

      var insert_disable = this.state.selected_files.length > 0 ? false : true;
      var _this$props$accept = this.props.accept,
          accept = _this$props$accept === void 0 ? [] : _this$props$accept;
      return _react["default"].createElement("div", {
        className: "nr-media-uploader-explorer"
      }, _react["default"].createElement("div", {
        className: cls
      }, _react["default"].createElement("div", {
        className: "media-modal-content"
      }, _react["default"].createElement("div", {
        className: "media-frame mode-select wp-core-ui",
        id: "__wp-uploader-id-0"
      }, _react["default"].createElement("div", {
        className: "media-frame-title"
      }, _react["default"].createElement("h1", null, "File Manager")), _react["default"].createElement("div", {
        className: "media-frame-router"
      }, _react["default"].createElement("div", {
        className: "media-router"
      }, _react["default"].createElement("a", {
        href: "#",
        className: "media-menu-item" + (this.state.active_tab == 'uploader' ? ' active' : ''),
        onClick: function onClick(e) {
          return _this2.navigate(e, 'uploader');
        }
      }, "Upload Files"), _react["default"].createElement("a", {
        href: "#",
        "data-current_offset": "1",
        className: "media-menu-item" + (this.state.active_tab == 'explorer' ? ' active' : ''),
        onClick: function onClick(e) {
          return _this2.navigate(e, 'explorer');
        }
      }, "Media Library"))), _react["default"].createElement("div", {
        className: "media-frame-content",
        "data-columns": "6"
      }, this.state.active_tab == 'explorer' ? _react["default"].createElement(_browser.Browser, {
        onSelectChange: this.getSelected,
        multiple: multiple,
        accept: accept
      }) : _react["default"].createElement(_uploader.Uploader, null)), adminCall ? null : _react["default"].createElement("div", {
        className: "media-frame-toolbar"
      }, _react["default"].createElement("div", {
        className: "media-toolbar"
      }, _react["default"].createElement("div", {
        className: "media-toolbar-secondary"
      }, _react["default"].createElement("div", {
        className: "media-selection"
      })), _react["default"].createElement("div", {
        className: "media-toolbar-primary search-form mr-3"
      }, _react["default"].createElement("button", {
        className: "btn btn-outline-secondary btn-sm mr-1 mt-3",
        onClick: this.closeThisMedia
      }, cancelText), _react["default"].createElement("button", {
        className: "btn btn-outline-secondary btn-sm mt-3",
        disabled: insert_disable,
        onClick: this.insertEvent
      }, insertText))))))), _react["default"].createElement("div", {
        className: "media-modal-backdrop"
      }));
    }
  }]);

  return Media;
}(_react.Component);

exports.Media = Media;