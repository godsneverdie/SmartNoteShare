document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar");
  const collapseBtn = document.getElementById("collapsebtn");
  collapseBtn.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
    collapseBtn.classList.toggle("collapsed");
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const collapseBtn = document.getElementById("logout");
  collapseBtn.addEventListener("click", function () {
      window.location.href='/logout'
  });
});