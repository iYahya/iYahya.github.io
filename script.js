(function () {
  var THEME_KEY = "theme";
  var LANG_KEY = "lang";

  function getStoredLang() {
    return localStorage.getItem(LANG_KEY) || "en";
  }

  function setHtmlLang(lang) {
    var root = document.documentElement;
    if (lang === "ar") {
      root.setAttribute("lang", "ar");
      root.setAttribute("dir", "rtl");
    } else {
      root.setAttribute("lang", "en");
      root.setAttribute("dir", "ltr");
    }
    localStorage.setItem(LANG_KEY, lang);
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var btnLang = btn.getAttribute("data-lang");
      btn.setAttribute("aria-pressed", btnLang === lang ? "true" : "false");
    });
  }

  function toggleTheme() {
    var root = document.documentElement;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  }

  function applyTranslations(dict) {
    if (!dict) return;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      var parts = key.split(".");
      var val = dict;
      for (var i = 0; i < parts.length; i++) {
        val = val && val[parts[i]];
      }
      if (typeof val === "string") {
        el.innerHTML = val;
      }
    });
  }

  function loadTranslations(lang) {
    return fetch("./translations/" + lang + ".json")
      .then(function (r) {
        if (!r.ok) throw new Error("Failed to load translations");
        return r.json();
      })
      .then(applyTranslations)
      .catch(function () {
        if (lang !== "en") return loadTranslations("en");
      });
  }

  function initNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelector(".theme-toggle")?.addEventListener("click", toggleTheme);

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-lang") || "en";
      setHtmlLang(lang);
      loadTranslations(lang);
    });
  });

  var initialLang = getStoredLang();
  setHtmlLang(initialLang);
  loadTranslations(initialLang);
  initNavToggle();
})();
