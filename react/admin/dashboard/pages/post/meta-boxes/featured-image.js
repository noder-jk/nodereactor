"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeaturedImage = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FeaturedImage =
/*#__PURE__*/
function (_Component) {
  _inherits(FeaturedImage, _Component);

  function FeaturedImage(props) {
    var _this;

    _classCallCheck(this, FeaturedImage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FeaturedImage).call(this, props));
    var _this$props$post_meta = _this.props.post_meta,
        post_meta = _this$props$post_meta === void 0 ? {} : _this$props$post_meta;
    var _post_meta$featured_i = post_meta.featured_image,
        featured_image = _post_meta$featured_i === void 0 ? 0 : _post_meta$featured_i;
    _this.state = {
      'image_url': false,
      'media_opened': false,
      'image_post_id': featured_image,
      'loading_icon': false
    };
    _this.showMedia = _this.showMedia.bind(_assertThisInitialized(_this));
    _this.closeMedia = _this.closeMedia.bind(_assertThisInitialized(_this));
    _this.getFiles = _this.getFiles.bind(_assertThisInitialized(_this));
    _this.removeImage = _this.removeImage.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(FeaturedImage, [{
    key: "closeMedia",
    value: function closeMedia() {
      this.setState({
        'media_opened': false
      });
    }
  }, {
    key: "getFiles",
    value: function getFiles(f) {
      if (f) {
        this.setState({
          image_url: f.file_url,
          image_post_id: f.post_id
        });
      }
    }
  }, {
    key: "removeImage",
    value: function removeImage() {
      this.setState({
        'image_post_id': 0,
        'image_url': false
      });
    }
  }, {
    key: "showMedia",
    value: function showMedia() {
      this.setState({
        'media_opened': true
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      if (this.state.image_post_id > 0) {
        this.setState({
          loading_icon: true
        });
        (0, _axios.default)({
          method: 'post',
          data: {
            'action': 'nr_get_featured_image',
            'post_id': this.state.image_post_id
          },
          url: _react2.ajax_url
        }).then(function (r) {
          var ob = {
            loading_icon: false
          };

          if (r.data && r.data.url) {
            ob.image_url = r.data.url;
          }

          _this2.setState(ob);
        }).catch(function (r) {
          _this2.setState({
            loading_icon: false
          });
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        id: "featured_image_container"
      }, this.state.loading_icon ? _react.default.createElement("p", null, _react.default.createElement(_reactSvgSpinner.default, {
        size: "15px"
      })) : null, _react.default.createElement("input", {
        type: "hidden",
        name: "featured_image",
        value: this.state.image_post_id
      }), this.state.image_url ? _react.default.createElement("img", {
        src: this.state.image_url,
        style: {
          'width': '100%'
        }
      }) : null, this.state.image_url ? _react.default.createElement("span", {
        className: "text-danger",
        onClick: this.removeImage
      }, "- Remove Featured Image") : _react.default.createElement("span", {
        onClick: this.showMedia
      }, "+ Add Featured Image"), _react.default.createElement(_react2.Media, {
        open: this.state.media_opened,
        onClose: this.closeMedia,
        onResult: this.getFiles,
        accept: ['image/jpeg', 'image/png']
      }));
    }
  }]);

  return FeaturedImage;
}(_react.Component);

exports.FeaturedImage = FeaturedImage;