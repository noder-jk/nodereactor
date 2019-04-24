"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaxItems = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

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

var TaxItems =
/*#__PURE__*/
function (_Component) {
  _inherits(TaxItems, _Component);

  function TaxItems(props) {
    var _this;

    _classCallCheck(this, TaxItems);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TaxItems).call(this, props));
    _this.state = {
      'checked': [],
      'items': {}
    };
    _this.adder = _this.adder.bind(_assertThisInitialized(_this));
    _this.checker = _this.checker.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TaxItems, [{
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
    value: function adder() {
      var _this2 = this;

      var checked = this.state.checked;
      console.log(checked);

      if (checked.length == 0) {
        return;
      }

      var ret = [];
      checked.map(function (id) {
        Object.keys(_this2.state.items).map(function (p_type) {
          _this2.state.items[p_type].map(function (term) {
            if (id == term.term_id) {
              ret.push({
                'term_id': id,
                'title': term.term_name
              });
            }
          });
        });
      });

      if (ret.length > 0) {
        var addHook = this.props.addHook;
        addHook(ret);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      (0, _axios.default)({
        'method': 'post',
        'url': _react2.ajax_url,
        'data': {
          'action': 'nr_get_nav_terms'
        }
      }).then(function (r) {
        if (r.data.terms) {
          _this3.setState({
            'items': r.data.terms
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
      var items = this.state.items;
      return Object.keys(items).map(function (item) {
        var tab_ttl = item.charAt(0).toUpperCase() + item.slice(1);
        return _react.default.createElement("div", {
          className: "menu-content-type",
          key: item,
          onClick: function onClick() {
            return opener(item);
          }
        }, _react.default.createElement("b", null, tab_ttl), current_tab == item ? _react.default.createElement("div", {
          className: "bg-white p-2"
        }, items[item].length == 0 ? _react.default.createElement("i", null, "No ", tab_ttl) : items[item].map(function (term) {
          return _react.default.createElement("p", {
            key: term.term_id,
            className: "item-single-term"
          }, _react.default.createElement("input", {
            type: "checkbox",
            name: "nv_term_id",
            value: term.term_id,
            onChange: _this4.checker
          }), " ", term.term_name);
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

  return TaxItems;
}(_react.Component);

exports.TaxItems = TaxItems;