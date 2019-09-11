"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileChooser = void 0;

var _react = _interopRequireWildcard(require("react"));

var _renderMedia = require("../../helper/render-media");

var _react2 = require("nodereactor/react");

require("./style.scss");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FileChooser =
/*#__PURE__*/
function (_Component) {
  _inherits(FileChooser, _Component);

  function FileChooser(props) {
    var _this;

    _classCallCheck(this, FileChooser);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FileChooser).call(this, props));
    _this.state = {
      media_opened: false,
      file: {}
    };
    _this.getFile = _this.getFile.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(FileChooser, [{
    key: "getFile",
    value: function getFile(file) {
      var onChange = this.props.onChange;
      onChange(file);
      this.setState({
        file: file
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          media_opened = _this$state.media_opened,
          _this$state$file = _this$state.file,
          file = _this$state$file === void 0 ? {} : _this$state$file;
      var _this$props = this.props,
          multiple = _this$props.multiple,
          _this$props$render = _this$props.render,
          render = _this$props$render === void 0 ? true : _this$props$render,
          accept = _this$props.accept;
      var url = file.file_url;
      var extension = file.file_extension;
      var mime = file.mime_type;
      return _react["default"].createElement("div", {
        className: "nr-file-chooser-container"
      }, _react["default"].createElement("button", {
        className: "btn btn-outline-secondary btn-sm",
        onClick: function onClick() {
          return _this2.setState({
            media_opened: true
          });
        }
      }, url ? 'Change' : 'Choose'), !render || !url ? null : _react["default"].createElement(_renderMedia.RenderMediaFile, {
        url: url,
        mime: mime,
        extension: extension
      }), !media_opened ? null : _react["default"].createElement(_react2.Media, {
        onClose: function onClose() {
          return _this2.setState({
            media_opened: false
          });
        },
        onResult: this.getFile,
        multiple: multiple,
        accept: accept
      }));
    }
  }]);

  return FileChooser;
}(_react.Component);

exports.FileChooser = FileChooser;