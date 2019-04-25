"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuEditor = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

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

var MenuEditor =
/*#__PURE__*/
function (_Component) {
  _inherits(MenuEditor, _Component);

  function MenuEditor(props) {
    var _this;

    _classCallCheck(this, MenuEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MenuEditor).call(this, props));
    var _this$props = _this.props,
        _this$props$menus = _this$props.menus,
        menus = _this$props$menus === void 0 ? {} : _this$props$menus,
        _this$props$locations = _this$props.locations,
        locations = _this$props$locations === void 0 ? {} : _this$props$locations,
        _this$props$menu_name = _this$props.menu_name,
        menu_name = _this$props$menu_name === void 0 ? 'Sample Menu Name' : _this$props$menu_name;
    var _menus$association = menus.association,
        association = _menus$association === void 0 ? [] : _menus$association,
        _menus$items = menus.items,
        items = _menus$items === void 0 ? [] : _menus$items;
    /* Set already associated locations */

    Object.keys(locations).map(function (item) {
      if (association.indexOf(item) > -1) {
        locations[item].checked = true;
      }
    });
    _this.state = {
      'loading': false,
      'items': items,
      'menu_name': menu_name,
      'locations': locations,
      'active_index': '',
      'association': association,
      'show_keyboard_shortcut': false,
      'saved_menu': false
    };
    _this.saveMenu = _this.saveMenu.bind(_assertThisInitialized(_this));
    _this.renderItems = _this.renderItems.bind(_assertThisInitialized(_this));
    _this.setIndex = _this.setIndex.bind(_assertThisInitialized(_this));
    _this.setValState = _this.setValState.bind(_assertThisInitialized(_this));
    _this.eventListener = _this.eventListener.bind(_assertThisInitialized(_this));
    _this.processOrder = _this.processOrder.bind(_assertThisInitialized(_this));
    _this.locationChecker = _this.locationChecker.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(MenuEditor, [{
    key: "setIndex",
    value: function setIndex(e, ind) {
      e.stopPropagation();
      this.setState({
        'active_index': ind
      });
    }
  }, {
    key: "setValState",
    value: function setValState(e, child, key) {
      window.nr_itm = this.state.items;

      if (e) {
        var el = e.currentTarget;
        window.nr_iv = el.value;
        child = child + '.' + key;
        window.eval('window.nr_itm' + child + ' ? window.nr_itm' + child + '=window.nr_iv : null;');
      }

      this.alt_val_store = window.nr_itm;
    }
  }, {
    key: "processOrder",
    value: function processOrder(action) {
      window.nr_items = this.state.items;
      var cur_index = this.state.active_index;
      var ind_int_pos = cur_index.lastIndexOf('[') + 1;
      var index = parseInt(cur_index.slice(ind_int_pos, -1)); // exclude [], parse int

      var child = this.state.active_index.slice(0, ind_int_pos - 1);
      window.nr_m = [];
      window.nr_up = _react2.array_pull_up;
      window.nr_down = _react2.array_pull_down;

      switch (action) {
        case 'pull_up':
          window.eval('\
                                    var r=window.nr_up(window.nr_items' + child + ', ' + index + ', true);\
                                    window.nr_items' + child + '=r[0];\
                                    window.nr_ind=r[1];\
                                ');
          break;

        case 'pull_down':
          window.eval('\
                                    var r=window.nr_down(window.nr_items' + child + ', ' + index + ', true);\
                                    window.nr_items' + child + '=r[0];\
                                    window.nr_ind=r[1];\
                                ');
          break;

        case 'delete':
          window.eval('\
                                    window.nr_items' + child + '.splice(' + index + ',1);\
                                    window.nr_ind="";\
                                ');
          break;
      }

      var ob = {
        'items': window.nr_items
      };

      if (window.nr_ind === false) {} else {
        ob.active_index = child + '[' + window.nr_ind + ']';
      }

      this.setState(ob);
    }
  }, {
    key: "locationChecker",
    value: function locationChecker(e) {
      var el = e.currentTarget;
      var _this$state$locations = this.state.locations,
          locations = _this$state$locations === void 0 ? {} : _this$state$locations;

      if (locations[el.value]) {
        locations[el.value].checked = el.checked;
        this.setState({
          'locations': locations
        }, this.setValState);
      }
    }
  }, {
    key: "saveMenu",
    value: function saveMenu() {
      var _this2 = this;

      if (!this.alt_val_store) {
        return;
      }

      var menu_name = this.state.menu_name.trim();

      if (/\S+/.test(menu_name) == false) {
        _sweetalert["default"].fire('Error', 'Menu name must not be empty.', 'error');

        return;
      }

      var association = this.state.locations;
      association = Object.keys(association).map(function (item) {
        return association[item].checked ? item : false;
      }).filter(function (item) {
        return typeof item == 'string';
      });

      var standalone_menu = _defineProperty({}, menu_name, {
        'items': this.alt_val_store,
        'association': association
      });

      this.setState({
        'loading': true
      });
      (0, _axios["default"])({
        'method': 'post',
        'url': _react2.ajax_url,
        'data': {
          'action': 'nr_save_menu',
          'menus': standalone_menu
        }
      }).then(function (r) {
        _sweetalert["default"].fire('Saved');

        _this2.setState({
          'loading': false,
          'saved_menu': true
        });
      })["catch"](function (e) {
        _this2.setState({
          'loading': false
        });

        _sweetalert["default"].fire('Error', 'Menu Could Not Saved', 'error');
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$props$lastOb = this.props.lastOb,
          lastOb = _this$props$lastOb === void 0 ? false : _this$props$lastOb;
      var ind = this.state.active_index;

      if (!lastOb) {
        return;
      }

      var position = lastOb.position;
      window.nr_add_m_i = this.state.items;
      window.nr_ad_i = lastOb.item;
      window.nr_ad_i = window.nr_ad_i.map(function (item) {
        item.key = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        return item;
      });
      window.nr_ad_s = true;

      try {
        if (position == 'append') {
          window.nr_ind_ = ind;
          window.eval('!window.nr_add_m_i' + window.nr_ind_ + '.children ? window.nr_add_m_i' + window.nr_ind_ + '.children=[] : null;\
                window.nr_add_m_i' + window.nr_ind_ + '.children=window.nr_add_m_i' + window.nr_ind_ + '.children.concat(window.nr_ad_i);');
        } else {
          window.nr_ind_ = ind.slice(0, ind.lastIndexOf('['));
          window.eval('window.nr_add_m_i' + window.nr_ind_ + '=window.nr_add_m_i' + window.nr_ind_ + '.concat(window.nr_ad_i);');
        }
      } catch (e) {
        window.nr_ad_s = false;
      }

      ;

      if (window.nr_ad_s == true) {
        this.setState({
          'items': window.nr_add_m_i
        }, this.setValState);
      }
    }
  }, {
    key: "eventListener",
    value: function eventListener(e) {
      var key_action = {
        '38': 'pull_up',
        '40': 'pull_down',
        '46': 'delete',
        'parent': 'pull_up_level'
      };
      var cd = e.keyCode;
      cd = cd.toString();

      if (key_action[cd]) {
        this.processOrder(key_action[e.shiftKey && cd == '38' ? 'parent' : cd]);
        e.preventDefault();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('keydown', this.eventListener);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('keydown', this.eventListener);
    }
  }, {
    key: "renderItems",
    value: function renderItems() {
      var _this3 = this;

      var menus = this.state.items;

      var recurs = function recurs(ar, child) {
        if (Array.isArray(ar)) {
          var ind = child;
          return ar.map(function (item, index) {
            var act_ind = ind + '[' + index + ']';
            var act_st = {
              'border': '1px dashed red',
              'marginTop': '5px',
              'marginBottom': '5px',
              'paddingTop': '5px',
              'paddingRight': '5px',
              'paddingBottom': '5px'
            };
            return _typeof(item) == 'object' ? _react["default"].createElement("div", {
              key: item.key,
              className: "recursive_menu_items",
              style: _this3.state.active_index == act_ind ? act_st : {},
              onClick: function onClick(e) {
                return _this3.setIndex(e, act_ind);
              }
            }, _react["default"].createElement("div", {
              className: "actions-container"
            }, _react["default"].createElement("input", {
              type: "text",
              defaultValue: item.title,
              className: "form-control",
              onChange: function onChange(e) {
                return _this3.setValState(e, act_ind, 'title');
              }
            }), item.url ? _react["default"].createElement("input", {
              type: "text",
              defaultValue: item.url,
              className: "form-control",
              onChange: function onChange(e) {
                return _this3.setValState(e, act_ind, 'url');
              }
            }) : null), Array.isArray(item.children) ? recurs(item.children, act_ind + '["children"]') : null) : null;
          });
        }
      };

      return recurs(menus, '');
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props$closeMenu = this.props.closeMenuForm,
          closeMenuForm = _this$props$closeMenu === void 0 ? function () {} : _this$props$closeMenu;
      var _this$state$locations2 = this.state.locations,
          locations = _this$state$locations2 === void 0 ? {} : _this$state$locations2;
      return _react["default"].createElement("div", null, _react["default"].createElement("input", {
        type: "text",
        className: "form-control",
        defaultValue: this.state.menu_name
      }), _react["default"].createElement("small", null, _react["default"].createElement("i", null, "Existing menu that matches this name will be replaced, if any.")), _react["default"].createElement("br", null), _react["default"].createElement("div", null, _react["default"].createElement("b", null, "Menu Items"), this.renderItems()), _react["default"].createElement("div", null, _react["default"].createElement("div", {
        className: "text-right"
      }, _react["default"].createElement("i", {
        style: {
          'cursor': 'pointer'
        },
        onClick: function onClick() {
          return _this4.setState({
            'show_keyboard_shortcut': !_this4.state.show_keyboard_shortcut
          });
        }
      }, this.state.show_keyboard_shortcut ? 'Hide' : 'Show', " Keyboard Shortcut")), this.state.show_keyboard_shortcut ? _react["default"].createElement("ul", null, _react["default"].createElement("li", null, "Up Arrow: Move selected menu one step up"), _react["default"].createElement("li", null, "Down Arrow: Move selected menu one step down"), _react["default"].createElement("li", null, "Delete Key: Remove selected menu")) : null), _react["default"].createElement("br", null), _react["default"].createElement("div", null, _react["default"].createElement("b", null, "Associate To Locations"), _react["default"].createElement("hr", null), Object.keys(locations).length == 0 ? _react["default"].createElement("span", null, "No Locations Registered") : Object.keys(locations).map(function (item) {
        return _react["default"].createElement("p", {
          key: item
        }, _react["default"].createElement("input", {
          type: "checkbox",
          name: "locations_checker",
          value: item,
          defaultChecked: _this4.state.association.indexOf(item) > -1,
          onChange: _this4.locationChecker
        }), " ", locations[item].title, " ", _react["default"].createElement("br", null), _react["default"].createElement("small", null, locations[item].description));
      })), _react["default"].createElement("div", {
        className: "text-right"
      }, this.state.loading ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null, " \xA0", _react["default"].createElement("button", {
        className: "btn btn-secondary btn-sm",
        onClick: function onClick() {
          return closeMenuForm(_this4.state.saved_menu);
        }
      }, "Close"), " \xA0", _react["default"].createElement("button", {
        className: "btn btn-secondary btn-sm",
        onClick: this.saveMenu
      }, "Save")));
    }
  }]);

  return MenuEditor;
}(_react.Component);

exports.MenuEditor = MenuEditor;