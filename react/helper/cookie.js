"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCookie = getCookie;
exports.setCookie = setCookie;
exports.deleteCookie = deleteCookie;

// Collected from https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=" + path;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
}

function deleteCookie(cname) {
  setCookie(cname, ' ', -86000);
}