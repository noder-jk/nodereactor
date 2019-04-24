"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectContents = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

var _react2 = require("nodereactor/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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

var ObjectContents =
/*#__PURE__*/
function (_Component) {
  _inherits(ObjectContents, _Component);

  function ObjectContents(props) {
    var _this;

    _classCallCheck(this, ObjectContents);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObjectContents).call(this, props));
    _this.state = {
      'checked': [],
      'items': {}
    };
    _this.adder = _this.adder.bind(_assertThisInitialized(_this));
    _this.checker = _this.checker.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ObjectContents, [{
    key: "checker",
    value: function checker(e) {
      var el = e.currentTarget;
      var checked = this.state.checked;

      if (el.checked) {
        if (checked.indexOf(el.value) == -1) {
          checked.push(el.value);
        }
      } else {
        checked.splice(checked.indexOf(el.value), 1);
      }

      this.setState({
        'checked': checked
      });
    }
  }, {
    key: "adder",
    value: function adder(pos) {
      var _this2 = this;

      var _this$props$propertie = this.props.properties,
          id_name = _this$props$propertie.id_name,
          title_name = _this$props$propertie.title_name;
      var checked = this.state.checked;
      console.log(checked);

      if (checked.length == 0) {
        return;
      }

      var ret = [];
      /* Loop through all checked elements and add to menu */

      checked.map(function (id) {
        Object.keys(_this2.state.items).map(function (itm) {
          _this2.state.items[itm].map(function (obj) {
            if (id == obj[id_name]) {
              var _ret$push;

              ret.push((_ret$push = {}, _defineProperty(_ret$push, id_name, id), _defineProperty(_ret$push, 'title', obj[title_name]), _ret$push));
            }
          });
        });
      });

      if (ret.length > 0) {
        var addHook = this.props.addHook;
        addHook({
          'item': ret,
          'position': pos
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      var action = this.props.properties.action;
      (0, _axios.default)({
        'method': 'post',
        'url': _react2.ajax_url,
        'data': {
          'action': action
        }
      }).then(function (r) {
        if (r.data.objects) {
          _this3.setState({
            'items': r.data.objects
          });
        }
      }).catch(function (e) {});
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props = this.props,
          opener = _this$props.opener,
          current_tab = _this$props.current_tab;
      var _this$props$propertie2 = this.props.properties,
          title_name = _this$props$propertie2.title_name,
          id_name = _this$props$propertie2.id_name;
      var items = this.state.items;
      return Object.keys(items).map(function (item) {
        var tab_ttl = item.charAt(0).toUpperCase() + item.slice(1);
        return _react.default.createElement("div", {
          className: "menu-content-type",
          key: item,
          onClick: function onClick() {
            return opener(item);
          },
          style: {
            'overflowY': 'auto',
            'maxHeight': '300px'
          }
        }, _react.default.createElement("b", null, tab_ttl, " "), current_tab == item ? _react.default.createElement("div", {
          className: "bg-white p-2"
        }, items[item].length == 0 ? _react.default.createElement("i", null, "No ", tab_ttl) : items[item].map(function (post) {
          return _react.default.createElement("p", {
            key: post[id_name],
            className: "item-single-post"
          }, _react.default.createElement("input", {
            type: "checkbox",
            name: "nv_" + id_name,
            value: post[id_name],
            onChange: _this4.checker
          }), " ", post[title_name]);
        }), _react.default.createElement("div", {
          className: "text-right"
        }, _react.default.createElement("button", {
          onClick: function onClick() {
            return _this4.adder('append');
          },
          className: "btn btn-secondary btn-sm",
          title: "Append to Selected"
        }, _react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
          icon: _freeSolidSvgIcons.faArrowCircleRight
        })), " \xA0", _react.default.createElement("button", {
          onClick: function onClick() {
            return _this4.adder('after');
          },
          className: "btn btn-secondary btn-sm",
          title: "Add After Selected"
        }, _react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
          icon: _freeSolidSvgIcons.faArrowAltCircleDown
        })))) : null);
      });
    }
  }]);

  return ObjectContents;
}(_react.Component);

exports.ObjectContents = ObjectContents;