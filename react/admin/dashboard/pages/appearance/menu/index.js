"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuPage = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

var _react2 = require("nodereactor/react");

var _objects = require("./objects");

var _custom = require("./custom");

var _menuEditor = require("./menu-editor");

require("./style.scss");

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

var Menus =
/*#__PURE__*/
function (_Component) {
  _inherits(Menus, _Component);

  function Menus(props) {
    var _this;

    _classCallCheck(this, Menus);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Menus).call(this, props));
    _this.state = {
      'mode': false,
      'loading': false,
      'locations': {},
      'menus': {},
      'editor': {}
    };
    _this.fetchMenuContents = _this.fetchMenuContents.bind(_assertThisInitialized(_this));
    _this.createNew = _this.createNew.bind(_assertThisInitialized(_this));
    _this.closeMenuEditor = _this.closeMenuEditor.bind(_assertThisInitialized(_this));
    _this.deleteMenu = _this.deleteMenu.bind(_assertThisInitialized(_this));
    _this.openEditor = _this.openEditor.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Menus, [{
    key: "openEditor",
    value: function openEditor(menu) {
      var _this$props$lastOb = this.props.lastOb,
          lastOb = _this$props$lastOb === void 0 ? false : _this$props$lastOb;

      var ed = _react.default.createElement(_menuEditor.MenuEditor, {
        lastOb: lastOb,
        locations: this.state.locations,
        menus: this.state.menus[menu],
        menu_name: menu,
        closeMenuForm: this.closeMenuEditor
      });

      this.setState({
        'editor': {
          'name': menu,
          'component': ed
        },
        'mode': false
      });
    }
  }, {
    key: "createNew",
    value: function createNew() {
      this.setState({
        'mode': 'create',
        'editor': {}
      });
    }
  }, {
    key: "closeMenuEditor",
    value: function closeMenuEditor(saved) {
      this.setState({
        'editor': {},
        'mode': false
      });

      if (saved) {
        this.fetchMenuContents();
      }
    }
  }, {
    key: "deleteMenu",
    value: function deleteMenu(m) {
      var _this2 = this;

      _sweetalert.default.fire({
        title: 'Sure to delete?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true
      }).then(function (result) {
        if (!result.value) {
          return;
        }
        /* Now request to server to delete. */


        _this2.setState({
          'loading': true
        });

        (0, _axios.default)({
          method: 'post',
          data: {
            'action': 'nr_delete_menu',
            'menu_name': m
          },
          url: _react2.ajax_url
        }).then(function (r) {
          _this2.setState({
            'loading': true
          }, _this2.fetchMenuContents);
        }).catch(function (r) {
          _this2.setState({
            'loading': false
          });

          _sweetalert.default.fire('Request Error');
        });
      });
    }
  }, {
    key: "fetchMenuContents",
    value: function fetchMenuContents() {
      var _this3 = this;

      this.setState({
        'loading': true
      });
      (0, _axios.default)({
        'method': 'post',
        'url': _react2.ajax_url,
        'data': {
          'action': 'nr_get_menu_items'
        }
      }).then(function (r) {
        var set_ob = {
          'loading': false
        };

        if (r.data) {
          set_ob.locations = r.data.locations;
          set_ob.menus = r.data.nr_menus;

          var recurs = function recurs(ar) {
            return Array.isArray(ar) ? ar.map(function (item) {
              if (Array.isArray(item.children)) {
                item.children = recurs(item.children);
              }

              return item;
            }) : [];
          };

          for (var k in set_ob.menus) {
            if (set_ob.menus[k].items) {
              set_ob.menus[k].items = recurs(set_ob.menus[k].items);
            }
          }

          set_ob.menus = set_ob.menus;
        }

        _this3.setState(set_ob);
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchMenuContents();
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props$lastOb2 = this.props.lastOb,
          lastOb = _this$props$lastOb2 === void 0 ? false : _this$props$lastOb2;
      return _react.default.createElement("div", {
        className: "col-6 col-md-7"
      }, _react.default.createElement("h4", null, "Menus ", this.state.loading == true ? _react.default.createElement(_reactSvgSpinner.default, {
        size: "15px"
      }) : null), this.state.mode !== 'create' ? _react.default.createElement("span", {
        onClick: this.createNew
      }, "+ Create New") : _react.default.createElement("div", {
        className: "menu-name-list"
      }, _react.default.createElement(_menuEditor.MenuEditor, {
        locations: this.state.locations,
        closeMenuForm: this.closeMenuEditor,
        lastOb: lastOb
      })), Object.keys(this.state.menus).map(function (m) {
        return _react.default.createElement("div", {
          className: "menu-name-list",
          key: m
        }, _this4.state.editor.name == m ? null : _react.default.createElement("b", null, m), _this4.state.editor.name == m ? null : _react.default.createElement("span", null, _react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
          icon: _freeSolidSvgIcons.faEdit,
          onClick: function onClick() {
            return _this4.openEditor(m);
          }
        }), " \xA0", _react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
          icon: _freeSolidSvgIcons.faTrashAlt,
          onClick: function onClick() {
            return _this4.deleteMenu(m);
          }
        })), _this4.state.editor.name == m ? _react.default.createElement(_menuEditor.MenuEditor, {
          lastOb: lastOb,
          locations: _this4.state.locations,
          menus: _this4.state.menus[m],
          menu_name: m,
          closeMenuForm: _this4.closeMenuEditor
        }) : null);
      }));
    }
  }]);

  return Menus;
}(_react.Component);

var Contents =
/*#__PURE__*/
function (_Component2) {
  _inherits(Contents, _Component2);

  function Contents(props) {
    var _this5;

    _classCallCheck(this, Contents);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Contents).call(this, props));
    _this5.state = {
      'current_tab': ''
    };
    _this5.adder = _this5.adder.bind(_assertThisInitialized(_this5));
    _this5.open = _this5.open.bind(_assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(Contents, [{
    key: "open",
    value: function open(key) {
      this.setState({
        'current_tab': key
      });
    }
  }, {
    key: "adder",
    value: function adder(ob) {
      this.props.pingParent(ob);
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var pst = {
        'action': 'nr_get_nav_posts',
        'title_name': 'post_title',
        'id_name': 'post_id',
        'parent_name': 'post_parent'
      };
      var txn = {
        'action': 'nr_get_nav_terms',
        'title_name': 'name',
        'id_name': 'term_id',
        'parent_name': 'parent'
      };
      return _react.default.createElement("div", {
        className: "col-6 col-md-5"
      }, _react.default.createElement("h4", null, "Contents"), _react.default.createElement(_objects.ObjectContents, {
        properties: pst,
        opener: this.open,
        current_tab: this.state.current_tab,
        addHook: this.adder
      }), _react.default.createElement(_objects.ObjectContents, {
        properties: txn,
        opener: this.open,
        current_tab: this.state.current_tab,
        addHook: this.adder
      }), _react.default.createElement("div", {
        className: "menu-content-type",
        onClick: function onClick() {
          return _this6.open('custom');
        }
      }, _react.default.createElement("b", null, "Custom Link"), this.state.current_tab == 'custom' ? _react.default.createElement(_custom.CustomLink, {
        addHook: this.adder
      }) : null));
    }
  }]);

  return Contents;
}(_react.Component);

var MenuPage =
/*#__PURE__*/
function (_Component3) {
  _inherits(MenuPage, _Component3);

  function MenuPage(props) {
    var _this7;

    _classCallCheck(this, MenuPage);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(MenuPage).call(this, props));
    _this7.state = {
      'last_ob': false
    };
    _this7.getOb = _this7.getOb.bind(_assertThisInitialized(_this7));
    return _this7;
  }

  _createClass(MenuPage, [{
    key: "getOb",
    value: function getOb(ob) {
      var _this8 = this;

      this.setState({
        'last_ob': ob
      }, function () {
        return _this8.setState({
          'last_ob': false
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "row admin-menu-page"
      }, _react.default.createElement(Contents, {
        pingParent: this.getOb
      }), _react.default.createElement(Menus, {
        lastOb: this.state.last_ob
      }));
    }
  }]);

  return MenuPage;
}(_react.Component);

exports.MenuPage = MenuPage;