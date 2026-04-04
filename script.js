(function () {
  var THEME_KEY = "theme";
  var LANG_KEY = "lang";
  var currentDict = null;

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
      var val = getByPath(dict, key);
      if (typeof val === "string") el.innerHTML = val;
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      var val = key ? getByPath(dict, key) : null;
      if (typeof val === "string") el.setAttribute("alt", val);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      var val = key ? getByPath(dict, key) : null;
      if (typeof val === "string") el.setAttribute("aria-label", val);
    });
  }

  function getByPath(obj, path) {
    var parts = path.split(".");
    var val = obj;
    for (var i = 0; i < parts.length; i++) {
      val = val && val[parts[i]];
    }
    return val;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderSkills(dict) {
    var root = document.getElementById("skills-root");
    if (!root || !dict.skills || !dict.skills.categories) return;
    var html = "";
    dict.skills.categories.forEach(function (cat, ci) {
      html += '<div class="skill-category section-animate" style="--cat:' + ci + '">';
      html += '<h3 class="skill-category-title">' + cat.title + "</h3>";
      html += '<ul class="skill-badges" role="list">';
      (cat.items || []).forEach(function (item, ii) {
        html +=
          '<li class="skill-badge" style="--i:' +
          ii +
          '"><span class="skill-badge-inner">' +
          escapeHtml(item) +
          "</span></li>";
      });
      html += "</ul></div>";
    });
    root.innerHTML = html;
  }

  function renderExperience(dict) {
    var root = document.getElementById("experience-root");
    if (!root || !dict.experience || !dict.experience.jobs) return;
    var currentLabel = dict.experience.current || "Current";
    var html = '<div class="timeline-line" aria-hidden="true"></div><ul class="timeline-list" role="list">';
    dict.experience.jobs.forEach(function (job, i) {
      html += '<li class="timeline-item section-animate" style="--i:' + i + '">';
      html += '<span class="timeline-dot" aria-hidden="true"></span>';
      html += '<article class="timeline-card">';
      html += '<header class="timeline-card-head">';
      html += "<h3>" + escapeHtml(job.role) + "</h3>";
      html += '<p class="timeline-company">' + escapeHtml(job.company) + "</p>";
      html += '<p class="timeline-meta">' + escapeHtml(job.meta) + " · " + escapeHtml(currentLabel) + "</p>";
      html += "</header><ul class="timeline-bullets" role="list">';
      (job.bullets || []).forEach(function (b) {
        html += "<li>" + b + "</li>";
      });
      html += "</ul></article></li>";
    });
    html += "</ul>";
    root.innerHTML = html;
  }

  function renderProjects(dict) {
    var root = document.getElementById("projects-root");
    if (!root || !dict.projects || !dict.projects.items) return;
    var p = dict.projects;
    var html = "";
    p.items.forEach(function (item, i) {
      var cat = escapeHtml(item.cat || "all");
      html += '<article class="project-card section-animate" data-cat="' + cat + '" style="--i:' + i + '">';
      html += '<div class="project-card-inner">';
      html += '<span class="project-badge">' + cat + "</span>";
      html += "<h3>" + escapeHtml(item.name) + "</h3>";
      html += '<p class="project-desc">' + escapeHtml(item.desc) + "</p>";
      var pills = (item.stack || "").split(",").map(function (s) {
        return s.trim();
      });
      html += '<ul class="project-stack" role="list">';
      pills.forEach(function (pill) {
        if (pill) html += "<li>" + escapeHtml(pill) + "</li>";
      });
      html += "</ul>";
      html += '<div class="project-links">';
      var live = item.live;
      if (live && live !== "#") {
        html +=
          '<a class="project-link" href="' +
          escapeHtml(live) +
          '" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(p.live || "Live") +
          "</a>";
      }
      if (item.github) {
        html +=
          '<a class="project-link project-link--ghost" href="' +
          escapeHtml(item.github) +
          '" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(p.code || "GitHub") +
          "</a>";
      }
      html += "</div></div></article>";
    });
    root.innerHTML = html;
    applyProjectFilter(getActiveFilter());
  }

  function getActiveFilter() {
    var active = document.querySelector(".project-filter.is-active");
    return active ? active.getAttribute("data-filter") || "all" : "all";
  }

  function applyProjectFilter(filter) {
    document.querySelectorAll(".project-card").forEach(function (card) {
      var cat = card.getAttribute("data-cat") || "";
      var show = filter === "all" || cat === filter;
      card.classList.toggle("is-hidden", !show);
    });
  }

  function initProjectFilters() {
    var bar = document.querySelector(".project-filters");
    if (!bar) return;
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".project-filter");
      if (!btn || !bar.contains(btn)) return;
      bar.querySelectorAll(".project-filter").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      applyProjectFilter(btn.getAttribute("data-filter") || "all");
    });
  }

  function renderEducation(dict) {
    var root = document.getElementById("education-root");
    if (!root || !dict.education || !dict.education.degrees) return;
    var html = "";
    dict.education.degrees.forEach(function (d, i) {
      html += '<article class="education-card section-animate" style="--i:' + i + '">';
      html += "<h3>" + escapeHtml(d.title) + "</h3>";
      html += '<p class="education-school">' + escapeHtml(d.school) + "</p>";
      html += "</article>";
    });
    root.innerHTML = html;
  }

  function renderContact(dict) {
    var root = document.getElementById("contact-root");
    if (!root || !dict.contact) return;
    var c = dict.contact;
    var html = "";
    function card(href, label, text, external) {
      var attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return (
        '<a class="contact-card" href="' +
        escapeHtml(href) +
        '"' +
        attrs +
        "><span class=\"contact-card-label\">" +
        escapeHtml(label) +
        '</span><span class="contact-card-value">' +
        escapeHtml(text) +
        "</span></a>"
      );
    }
    html += card(c.email_href || "#", c.email_label || "Email", c.email_text || "", false);
    html += card(c.linkedin_href || "#", c.linkedin_label || "LinkedIn", c.linkedin_href || "", true);
    html += card(c.github_href || "#", c.github_label || "GitHub", c.github_href || "", true);
    html +=
      '<div class="contact-card contact-card--static"><span class="contact-card-label">' +
      escapeHtml(c.location_label || "Location") +
      '</span><span class="contact-card-value">' +
      escapeHtml(c.location || "") +
      "</span>";
    if (c.open_to) {
      html += '<span class="contact-card-note">' + escapeHtml(c.open_to) + "</span>";
    }
    html += "</div>";
    root.innerHTML = html;
  }

  function renderFooter(dict) {
    var root = document.getElementById("footer-links");
    if (!root || !dict.contact || !dict.footer) return;
    var c = dict.contact;
    var f = dict.footer;
    var html = "";
    if (c.github_href) {
      html +=
        '<a href="' +
        escapeHtml(c.github_href) +
        '" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(f.github || "GitHub") +
        "</a>";
    }
    if (c.linkedin_href) {
      html +=
        '<a href="' +
        escapeHtml(c.linkedin_href) +
        '" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(f.linkedin || "LinkedIn") +
        "</a>";
    }
    if (c.email_href) {
      html += '<a href="' + escapeHtml(c.email_href) + '">' + escapeHtml(f.email || "Email") + "</a>";
    }
    root.innerHTML = html;
  }

  function renderDynamic(dict) {
    currentDict = dict;
    renderSkills(dict);
    renderExperience(dict);
    renderProjects(dict);
    renderEducation(dict);
    renderContact(dict);
    renderFooter(dict);
    setupAboutPhoto();
    refreshObservers();
  }

  function setupAboutPhoto() {
    var img = document.querySelector(".about-photo");
    var wrap = document.querySelector(".about-visual");
    if (!img || !wrap) return;
    img.addEventListener("error", function onErr() {
      wrap.classList.add("is-fallback");
      img.removeEventListener("error", onErr);
    });
    if (!img.complete || img.naturalWidth === 0) {
      if (img.src && img.src.indexOf("profile.jpg") !== -1) {
        /* allow error handler */
      }
    }
  }

  var timelineObserver;
  var sectionObserver;
  var navSpyObserver = null;
  var navSpyScrollHandler = null;

  function refreshObservers() {
    if (sectionObserver) sectionObserver.disconnect();
    if (revealObserver) revealObserver.disconnect();
    if (timelineObserver) timelineObserver.disconnect();

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var opts = { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 };

    sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add("is-visible");
      });
    }, opts);

    document.querySelectorAll(".section-animate").forEach(function (el) {
      if (!reduce) sectionObserver.observe(el);
      else el.classList.add("is-visible");
    });

    var timeline = document.querySelector(".timeline");
    if (timeline && !reduce) {
      timelineObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) timeline.classList.add("is-line-visible");
          });
        },
        { threshold: 0.15 }
      );
      timelineObserver.observe(timeline);
    } else if (timeline) {
      timeline.classList.add("is-line-visible");
    }
  }

  function initNavScrollSpy() {
    var links = document.querySelectorAll(".nav-links a[href^='#']");
    var ids = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      if (id) ids.push(id);
    });
    var sections = ids
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    function setActive(id) {
      links.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
      });
    }

    if (!sections.length) return;

    if (navSpyObserver) {
      navSpyObserver.disconnect();
      navSpyObserver = null;
    }

    navSpyObserver = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (e) {
            return e.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach(function (sec) {
      navSpyObserver.observe(sec);
    });

    function syncActiveFromScroll() {
      var mid = window.innerHeight * 0.35;
      var best = null;
      var bestDist = Infinity;
      sections.forEach(function (sec) {
        var r = sec.getBoundingClientRect();
        if (r.bottom < 64 || r.top > window.innerHeight) return;
        var center = r.top + r.height / 2;
        var dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = sec;
        }
      });
      if (best) setActive(best.id);
    }

    syncActiveFromScroll();
    if (navSpyScrollHandler) {
      window.removeEventListener("scroll", navSpyScrollHandler);
    }
    navSpyScrollHandler = syncActiveFromScroll;
    window.addEventListener("scroll", navSpyScrollHandler, { passive: true });
  }

  function initHeaderScroll() {
    var header = document.getElementById("site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function loadTranslations(lang) {
    return fetch("./translations/" + lang + ".json")
      .then(function (r) {
        if (!r.ok) throw new Error("Failed to load translations");
        return r.json();
      })
      .then(function (dict) {
        applyTranslations(dict);
        renderDynamic(dict);
        initNavScrollSpy();
      })
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

  initProjectFilters();
  initHeaderScroll();
  initNavToggle();

  var initialLang = getStoredLang();
  setHtmlLang(initialLang);
  loadTranslations(initialLang);
})();
