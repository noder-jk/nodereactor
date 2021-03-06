"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderMediaFile = void 0;

var _react = _interopRequireWildcard(require("react"));

var _zip = _interopRequireDefault(require("./img/zip.ico"));

var _pdf = _interopRequireDefault(require("./img/pdf.png"));

var _default = _interopRequireDefault(require("./img/default.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var files_icons = {
  '.zip': _zip["default"],
  '.pdf': _pdf["default"],
  'unsupported': _default["default"]
};

var RenderMediaFile =
/*#__PURE__*/
function (_Component) {
  _inherits(RenderMediaFile, _Component);

  function RenderMediaFile(props) {
    _classCallCheck(this, RenderMediaFile);

    return _possibleConstructorReturn(this, _getPrototypeOf(RenderMediaFile).call(this, props));
  }

  _createClass(RenderMediaFile, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          url = _this$props.url,
          mime = _this$props.mime,
          _this$props$style = _this$props.style,
          style = _this$props$style === void 0 ? {} : _this$props$style,
          _this$props$attachmen = _this$props.attachmentId,
          attachmentId = _this$props$attachmen === void 0 ? '' : _this$props$attachmen,
          _this$props$extension = _this$props.extension,
          extension = _this$props$extension === void 0 ? 'unsupported' : _this$props$extension,
          _this$props$linkIfNon = _this$props.linkIfNonMedia,
          linkIfNonMedia = _this$props$linkIfNon === void 0 ? false : _this$props$linkIfNon;
      extension = extension.toLowerCase();
      var imgs = ['.jpg', '.png', '.bmp', '.ico', '.svg'];
      var vids = ['.mp4', '.3gp', '.avi'];
      var auds = ['.mp3', '.wav'];
      var resp = null;

      if (imgs.indexOf(extension) > -1) {
        resp = _react["default"].createElement("img", {
          "data-attachment_id": attachmentId,
          src: url,
          style: style
        });
      } else if (vids.indexOf(extension) > -1) {
        resp = _react["default"].createElement("video", {
          controls: "controls",
          style: style
        }, _react["default"].createElement("source", {
          "data-attachment_id": attachmentId,
          src: url,
          type: mime
        }), "Unsupported Media");
      } else if (auds.indexOf(extension) > -1) {
        resp = _react["default"].createElement("audio", {
          controls: "controls",
          style: style
        }, _react["default"].createElement("source", {
          "data-attachment_id": attachmentId,
          src: url,
          type: mime
        }), "Unsupported Media");
      } else {
        if (linkIfNonMedia == true) {
          resp = _react["default"].createElement("a", {
            "data-attachment_id": attachmentId,
            href: url
          }, url);
        } else {
          var icon = files_icons[extension] ? files_icons[extension] : files_icons.unsupported;
          resp = _react["default"].createElement("img", {
            "data-attachment_id": attachmentId,
            src: icon,
            style: style
          });
        }
      }

      return resp;
    }
  }]);

  return RenderMediaFile;
}(_react.Component);

exports.RenderMediaFile = RenderMediaFile;