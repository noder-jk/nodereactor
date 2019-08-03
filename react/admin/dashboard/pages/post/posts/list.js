"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var List = function List(props) {
  var taxonomies = props.taxonomies,
      st_posts = props.st_posts,
      toggleCheck = props.toggleCheck;
  return _react["default"].createElement("table", {
    className: "table table-bordered"
  }, _react["default"].createElement("thead", null, _react["default"].createElement("tr", null, _react["default"].createElement("th", null), _react["default"].createElement("th", null, "Title"), _react["default"].createElement("th", null, "Author"), _react["default"].createElement("th", null, "Status"), taxonomies.map(function (t) {
    return _react["default"].createElement("th", {
      key: t
    }, t);
  }), _react["default"].createElement("th", null, "Posted"))), _react["default"].createElement("tbody", null, st_posts.map(function (item) {
    return _react["default"].createElement("tr", {
      key: item.post_id
    }, _react["default"].createElement("td", null, _react["default"].createElement("input", {
      type: "checkbox",
      defaultChecked: item.checked_input,
      onChange: function onChange(e) {
        return toggleCheck(e, item.post_id);
      }
    })), _react["default"].createElement("td", null, _react["default"].createElement("p", null, '-'.repeat(item.nest_level), item.post_title), _react["default"].createElement("a", {
      href: item.post_url,
      className: "text-info"
    }, "View"), " - ", _react["default"].createElement("a", {
      className: "text-info",
      href: item.post_edit_link
    }, "Edit")), _react["default"].createElement("td", null, item.display_name), _react["default"].createElement("td", null, item.post_status), taxonomies.map(function (t) {
      return _react["default"].createElement("td", {
        key: t
      }, item.terms && item.terms[t] ? item.terms[t].join(', ') : null);
    }), _react["default"].createElement("td", null, item.post_date));
  })));
};

exports.List = List;