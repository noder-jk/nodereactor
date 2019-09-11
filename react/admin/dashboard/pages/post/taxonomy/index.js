"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Editor", {
  enumerable: true,
  get: function get() {
    return _editor.Editor;
  }
});
exports.TaxonomyPage = void 0;

var _react = _interopRequireWildcard(require("react"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _react2 = require("nodereactor/react");

var _browser = require("./browser");

var _editor = require("./editor");

require("./style.scss");

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

var TaxonomyPage =
/*#__PURE__*/
function (_Component) {
  _inherits(TaxonomyPage, _Component);

  function TaxonomyPage(props) {
    var _this;

    _classCallCheck(this, TaxonomyPage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TaxonomyPage).call(this, props));
    _this.state = {
      'taxonomies': [],
      'hierarchical': false,
      'taxonomy': '',
      'taxonomy_title': ''
    };
    _this.fetchTaxonomies = _this.fetchTaxonomies.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TaxonomyPage, [{
    key: "fetchTaxonomies",
    value: function fetchTaxonomies() {
      var _this2 = this;

      /* Retrieve taxonomy name from url */
      var pth = window.location.pathname;
      pth = pth.slice(pth.lastIndexOf('/') + 1);
      var taxonomy = pth.slice(pth.indexOf('_') + 1);
      /* Now get taxonomies, taxonomy hierarchy etc. */

      this.setState({
        'loading': true,
        'taxonomy': taxonomy
      });
      (0, _react2.ajax_request)('nr_get_taxonomy', {
        'taxonomy': taxonomy
      }, function (r, d, e) {
        var ob = {
          'loading': false
        };

        if (e) {
          ob.selected = [];

          _this2.setState(ob);

          _sweetalert["default"].fire('Request Error. Could Not Fetch Taxonomies.');

          return;
        }

        ob.taxonomies = r.taxonomies;
        ob.hierarchical = r.hierarchical;
        ob.taxonomy_title = r.taxonomy_title;

        _this2.setState(ob);
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchTaxonomies();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          taxonomies = _this$state.taxonomies,
          taxonomy = _this$state.taxonomy,
          hierarchical = _this$state.hierarchical,
          taxonomy_title = _this$state.taxonomy_title;
      var pass_prop = {
        taxonomies: taxonomies,
        taxonomy: taxonomy,
        hierarchical: hierarchical,
        taxonomy_title: taxonomy_title
      };
      pass_prop.fetchTaxonomies = this.fetchTaxonomies;
      return _react["default"].createElement("div", {
        className: "row taxonomy-admin-page"
      }, _react["default"].createElement(_editor.Editor, pass_prop), _react["default"].createElement(_browser.Browser, pass_prop));
    }
  }]);

  return TaxonomyPage;
}(_react.Component);

exports.TaxonomyPage = TaxonomyPage;