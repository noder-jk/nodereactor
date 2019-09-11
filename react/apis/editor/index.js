"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = void 0;

var _react = _interopRequireWildcard(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _jquery = _interopRequireDefault(require("jquery"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _renderMedia = require("../../helper/render-media");

var _react2 = require("nodereactor/react");

var _tinymceMin = _interopRequireDefault(require("nodereactor/nr-includes/tinymce-4.9.3/tinymce.min.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var Editor =
/*#__PURE__*/
function (_Component) {
  _inherits(Editor, _Component);

  function Editor(props) {
    var _this;

    _classCallCheck(this, Editor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Editor).call(this, props));
    _this.state = {
      'editor_id': Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      'media': null,
      'loading': false,
      'media_open': false
    };
    _this.openMedia = _this.openMedia.bind(_assertThisInitialized(_this));
    _this.mediaClose = _this.mediaClose.bind(_assertThisInitialized(_this));
    _this.getResult = _this.getResult.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Editor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      if (typeof _tinymceMin["default"] == 'function') {
        (0, _tinymceMin["default"])(window.nr_configs.nr_home_url);
      }

      var editor_id = this.state.editor_id;
      var onChange = this.props.onChange;
      var nr_tyni_fullscreen = false;
      this.setState({
        'loading': true
      });
      /* Initialize html editor when tinymce object is available. */

      window.tinyMCE.init({
        /* replace textarea having class .tinymce with tinymce editor */
        selector: '#' + editor_id,
        removed_menuitems: 'newdocument',
        media_live_embeds: true,
        convert_urls: false,
        branding: false,
        setup: function setup(editor) {
          editor.on('change', function () {
            if (typeof onChange == 'function') {
              onChange(editor.getContent());
            }
          });
          editor.on('FullscreenStateChanged', function () {
            if (nr_tyni_fullscreen == false) {
              (0, _jquery["default"])('main').css('z-index', 103);
              nr_tyni_fullscreen = true;
            } else {
              (0, _jquery["default"])('main').css('z-index', 100);
              nr_tyni_fullscreen = false;
            }
          });
          editor.on('init', function () {
            _this2.setState({
              'loading': false
            });
          });
        },
        init_instance_callback: function init_instance_callback(editor) {
          editor.on('PastePreProcess', function (e) {
            var pattern = {};
            pattern.youtube = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
            var str = e.content.trim();
            var r = str.match(pattern.youtube);

            if (r && r[1]) {
              e.content = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + r[1] + '" frameborder="0" allowfullscreen></iframe>';
            }
          });
        },

        /* width and height of the editor */
        width: "100%",
        height: 300,

        /* display statusbar */
        statubar: true,

        /* plugin */
        plugins: ["advlist autolink link lists charmap hr anchor pagebreak code", "searchreplace visualblocks visualchars wordcount code fullscreen insertdatetime nonbreaking", "table contextmenu directionality template paste textcolor"],

        /* toolbar */
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | fullpage | forecolor backcolor | code",

        /* style */
        style_formats: [{
          title: "Headers",
          items: [{
            title: "Header 1",
            format: "h1"
          }, {
            title: "Header 2",
            format: "h2"
          }, {
            title: "Header 3",
            format: "h3"
          }, {
            title: "Header 4",
            format: "h4"
          }, {
            title: "Header 5",
            format: "h5"
          }, {
            title: "Header 6",
            format: "h6"
          }]
        }, {
          title: "Inline",
          items: [{
            title: "Bold",
            icon: "bold",
            format: "bold"
          }, {
            title: "Italic",
            icon: "italic",
            format: "italic"
          }, {
            title: "Underline",
            icon: "underline",
            format: "underline"
          }, {
            title: "Strikethrough",
            icon: "strikethrough",
            format: "strikethrough"
          }, {
            title: "Superscript",
            icon: "superscript",
            format: "superscript"
          }, {
            title: "Subscript",
            icon: "subscript",
            format: "subscript"
          }, {
            title: "Code",
            icon: "code",
            format: "code"
          }]
        }, {
          title: "Blocks",
          items: [{
            title: "Paragraph",
            format: "p"
          }, {
            title: "Blockquote",
            format: "blockquote"
          }, {
            title: "Div",
            format: "div"
          }, {
            title: "Pre",
            format: "pre"
          }]
        }, {
          title: "Alignment",
          items: [{
            title: "Left",
            icon: "alignleft",
            format: "alignleft"
          }, {
            title: "Center",
            icon: "aligncenter",
            format: "aligncenter"
          }, {
            title: "Right",
            icon: "alignright",
            format: "alignright"
          }, {
            title: "Justify",
            icon: "alignjustify",
            format: "alignjustify"
          }]
        }]
      });

      window.onbeforeunload = function () {
        if (window.tinyMCE && window.tinyMCE.activeEditor && window.tinyMCE.activeEditor.isDirty()) {
          return "Unsaved data may be lost. Sure to exit?";
        }
      };
    }
  }, {
    key: "getResult",
    value: function getResult(results) {
      var media = '';

      for (var i = 0; i < results.length; i++) {
        var url = results[i].file_url;
        var ext = results[i].file_extension;
        var mime = results[i].mime_type;
        var attachment_id = results[i].post_id;
        media += _server["default"].renderToStaticMarkup(_react["default"].createElement(_renderMedia.RenderMediaFile, {
          url: url,
          mime: mime,
          extension: ext,
          attachmentId: attachment_id,
          linkIfNonMedia: true,
          style: {
            'maxWidth': '100%'
          }
        }));
      }

      var text_area = window.tinyMCE.get(this.state.editor_id);

      if (text_area) {
        text_area.execCommand('mceInsertContent', false, media);
      } else {
        _sweetalert["default"].fire('Something went wrong. Media file could not be inserted into editor. Cancel Media, and save the post. Then try again.');
      }
    }
  }, {
    key: "mediaClose",
    value: function mediaClose() {
      this.setState({
        'media_open': false
      });
    }
  }, {
    key: "openMedia",
    value: function openMedia() {
      this.setState({
        'media_open': true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          media_open = _this$state.media_open,
          loading = _this$state.loading,
          editor_id = _this$state.editor_id;
      var _this$props = this.props,
          _this$props$defaultVa = _this$props.defaultValue,
          defaultValue = _this$props$defaultVa === void 0 ? '' : _this$props$defaultVa,
          _this$props$addMedia = _this$props.addMedia,
          addMedia = _this$props$addMedia === void 0 ? true : _this$props$addMedia;
      return _react["default"].createElement("div", null, addMedia ? _react["default"].createElement("button", {
        className: "btn btn-secondary btn-sm mb-1",
        onClick: this.openMedia
      }, "Add Media") : null, addMedia && media_open ? _react["default"].createElement(_react2.Media, {
        onClose: this.mediaClose,
        onResult: this.getResult,
        multiple: true
      }) : null, loading ? _react["default"].createElement("span", {
        style: {
          'display': 'inline-block',
          'float': 'right'
        }
      }, _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      })) : null, _react["default"].createElement("textarea", {
        id: editor_id,
        className: "form-control",
        defaultValue: defaultValue
      }));
    }
  }]);

  return Editor;
}(_react.Component);

exports.Editor = Editor;