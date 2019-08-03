"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Users = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSvgSpinner = _interopRequireDefault(require("react-svg-spinner"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

require("./style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var Users =
/*#__PURE__*/
function (_Component) {
  _inherits(Users, _Component);

  function Users(props) {
    var _this;

    _classCallCheck(this, Users);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Users).call(this, props));
    _this.state = {
      'users': [],
      'current_user_id': 0,
      'user_action': '',
      'loading': false
    };
    _this.selectUser = _this.selectUser.bind(_assertThisInitialized(_this));
    _this.deleteUser = _this.deleteUser.bind(_assertThisInitialized(_this));
    _this.userAction = _this.userAction.bind(_assertThisInitialized(_this));
    _this.fetchUser = _this.fetchUser.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Users, [{
    key: "userAction",
    value: function userAction(e) {
      var el = e.currentTarget;
      this.setState({
        'user_action': el.value
      });
    }
  }, {
    key: "selectUser",
    value: function selectUser(e, id) {
      var el = e.currentTarget;
      var users = this.state.users;
      users.forEach(function (u, i) {
        u.user_id == id ? users[i].user_selected = el.checked : null;
      });
      this.setState({
        users: users
      });
    }
  }, {
    key: "deleteUser",
    value: function deleteUser() {
      var _this2 = this;

      var _this$state = this.state,
          user_action = _this$state.user_action,
          users = _this$state.users;
      /* Get selected ids */

      var selected = users.map(function (u) {
        return u.user_selected ? u.user_id : false;
      }).filter(function (u) {
        return u !== false;
      });
      /* Check if deletable */

      if (selected.length == 0 || user_action == '') {
        _sweetalert["default"].fire('No User or Action Selected.');

        return;
      }

      _sweetalert["default"].fire({
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

        (0, _react2.ajaxRequest)('nr_delete_users', {
          'user_ids': selected,
          user_action: user_action
        }, function (r, d, e) {
          var ob = {
            'loading': true
          };

          _this2.setState(ob, e ? function () {} : _this2.fetchUser);

          e ? _sweetalert["default"].fire('Request Error') : 0;
        });
      });
    }
  }, {
    key: "fetchUser",
    value: function fetchUser() {
      var _this3 = this;

      this.setState({
        'loading': true
      });
      (0, _react2.ajaxRequest)('nr_get_users', function (r) {
        var users = r.users,
            current_user_id = r.current_user_id;

        _this3.setState({
          'loading': false,
          users: users,
          current_user_id: current_user_id
        });
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchUser();
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$state2 = this.state,
          current_user_id = _this$state2.current_user_id,
          loading = _this$state2.loading,
          user_action = _this$state2.user_action,
          users = _this$state2.users;
      var selected = users.map(function (u) {
        return u.user_selected ? true : false;
      }).filter(function (u) {
        return u;
      });
      return _react["default"].createElement("div", {
        id: "users_container"
      }, _react["default"].createElement("h4", null, "Registered Users ", loading == true ? _react["default"].createElement(_reactSvgSpinner["default"], {
        size: "15px"
      }) : null), user_action == 'abandon' ? _react["default"].createElement("small", null, "Everything except username and email will be deleted that prevents someone else from creating same account.") : null, user_action == 'delete' ? _react["default"].createElement("small", null, "Everything will be deleted. Username and email will be reusable by someone else.") : null, selected.length == 0 ? null : _react["default"].createElement("div", null, _react["default"].createElement("div", {
        className: "d-inline-block form-group form-inline mr-2 mb-1"
      }, _react["default"].createElement("select", {
        className: "form-control form-control-sm float-left",
        defaultValue: user_action,
        onChange: this.userAction
      }, _react["default"].createElement("option", {
        value: ""
      }, "Bulk Action"), _react["default"].createElement("option", {
        value: "abandon",
        title: "All data except user name and email will be deleted permanently."
      }, "Abandon Permanently"), _react["default"].createElement("option", {
        value: "delete",
        title: "Delete everything. The email and username associated with this account can be allocated again."
      }, "Delete Permanently")), _react["default"].createElement("button", {
        className: "btn btn-sm btn-outline-secondary",
        onClick: this.deleteUser,
        title: "Click to apply action"
      }, "Apply"))), _react["default"].createElement("table", {
        className: "table table-bordered"
      }, _react["default"].createElement("thead", null, _react["default"].createElement("tr", null, _react["default"].createElement("th", null), _react["default"].createElement("th", null, "Username"), _react["default"].createElement("th", null, "Display Name"), _react["default"].createElement("th", null, "Email"), _react["default"].createElement("th", null, "Role"), _react["default"].createElement("th", null, "Status"))), _react["default"].createElement("tbody", null, users.map(function (item) {
        return _react["default"].createElement("tr", {
          key: item.user_id
        }, _react["default"].createElement("td", null, current_user_id == item.user_id ? null : _react["default"].createElement("input", {
          type: "checkbox",
          onClick: function onClick(e) {
            return _this4.selectUser(e, item.user_id);
          }
        })), _react["default"].createElement("td", null, _react["default"].createElement("span", {
          style: {
            'display': 'inline-block',
            'float': 'left'
          }
        }, _react["default"].createElement("img", {
          src: item.gravatar
        })), _react["default"].createElement("span", {
          style: {
            'display': 'inline-block',
            'float': 'left',
            'marginLeft': '5px'
          }
        }, item.user_login, _react["default"].createElement("br", null), _react["default"].createElement("a", {
          className: "text-info",
          href: "/nr-admin/users/edit/" + item.user_id
        }, "Edit"))), _react["default"].createElement("td", null, item.display_name), _react["default"].createElement("td", null, item.user_email), _react["default"].createElement("td", null, item.user_role), _react["default"].createElement("td", null, item.user_status));
      }))));
    }
  }]);

  return Users;
}(_react.Component);

exports.Users = Users;