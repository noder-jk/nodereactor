"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomLink = void 0;

var _react = _interopRequireWildcard(require("react"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CustomLink =
/*#__PURE__*/
function (_Component) {
  _inherits(CustomLink, _Component);

  function CustomLink(props) {
    var _this;

    _classCallCheck(this, CustomLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CustomLink).call(this, props));
    _this.state = {
      'url': '',
      'title': ''
    };
    _this.storeVals = _this.storeVals.bind(_assertThisInitialized(_this));
    _this.addTo = _this.addTo.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CustomLink, [{
    key: "storeVals",
    value: function storeVals(e) {
      var el = e.currentTarget;
      this.setState(_defineProperty({}, el.name, el.value));
    }
  }, {
    key: "addTo",
    value: function addTo(position) {
      var addHook = this.props.addHook;
      var url = this.state.url.trim();
      var title = this.state.title.trim();

      if (/\S+/.test(url) && /\S+/.test(title)) {
        var item = [{
          url: url,
          title: title
        }];
        addHook({
          item: item,
          position: position
        });
      } else {
        _sweetalert["default"].fire('Input fields must not be empty.');
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react["default"].createElement("div", {
        className: "bg-white p-2"
      }, _react["default"].createElement("input", {
        type: "text",
        className: "form-control",
        placeholder: "Title",
        name: "title",
        onChange: this.storeVals
      }), _react["default"].createElement("br", null), _react["default"].createElement("input", {
        type: "text",
        className: "form-control",
        placeholder: "URL",
        name: "url",
        onChange: this.storeVals
      }), _react["default"].createElement("br", null), _react["default"].createElement("div", {
        className: "text-right"
      }, _react["default"].createElement("button", {
        onClick: function onClick() {
          return _this2.addTo('append');
        },
        className: "btn btn-secondary btn-sm",
        title: "Append to Selected"
      }, _react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
        icon: _freeSolidSvgIcons.faArrowCircleRight
      })), " \xA0", _react["default"].createElement("button", {
        onClick: function onClick() {
          return _this2.addTo('after');
        },
        className: "btn btn-secondary btn-sm",
        title: "Add After Selected"
      }, _react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
        icon: _freeSolidSvgIcons.faArrowAltCircleDown
      }))));
    }
  }]);

  return CustomLink;
}(_react.Component);

exports.CustomLink = CustomLink;