(function () {
  var year = String(new Date().getFullYear());
  document.querySelectorAll(".site-footer__year").forEach(function (el) {
    el.textContent = year;
  });
})();
