(function () {
  const year = String(new Date().getFullYear());
  document.querySelectorAll(".js-footer-year").forEach((el) => {
    el.textContent = year;
    el.setAttribute("datetime", year);
  });
})();
