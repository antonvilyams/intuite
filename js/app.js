(function () {
  const gallery = document.getElementById("gallery");
  const CONTACT_EMAIL = "anton.williams@gmail.com";

  function chunkIntoRows(models) {
    const rows = [];
    let index = 0;
    let rowSize = 2;

    while (index < models.length) {
      const items = models.slice(index, index + rowSize);
      rows.push({ size: rowSize, items });
      index += rowSize;
      rowSize = rowSize === 2 ? 3 : 2;
    }

    return rows;
  }

  function createModelLink(model, mobileAlign) {
    const link = document.createElement("a");
    link.href = `model.html?id=${encodeURIComponent(model.id)}`;
    link.className = `gallery__item gallery__item--${mobileAlign}`;
    link.setAttribute("aria-label", model.name);

    const img = document.createElement("img");
    img.src = model.photo_url;
    img.alt = model.name;
    img.loading = "lazy";

    link.appendChild(img);
    return link;
  }

  function renderMobile(models) {
    gallery.innerHTML = "";
    gallery.className = "gallery";

    models.forEach((model, i) => {
      const align = i % 2 === 0 ? "left" : "right";
      gallery.appendChild(createModelLink(model, align));
    });
  }

  function renderDesktop(models) {
    const rows = chunkIntoRows(models);
    gallery.innerHTML = "";
    gallery.className = "gallery";

    rows.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = `gallery__row gallery__row--${row.size}`;

      row.items.forEach((model) => {
        rowEl.appendChild(createModelLink(model, "left"));
      });

      gallery.appendChild(rowEl);
    });
  }

  function render(models) {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) {
      renderDesktop(models);
    } else {
      renderMobile(models);
    }
  }

  function showContactSuccess(section, formWrap, successEl) {
    section.classList.add("contact--sent");
    formWrap.setAttribute("aria-hidden", "true");
    formWrap.inert = true;
    successEl.setAttribute("aria-hidden", "false");
  }

  function initContactFab() {
    const fab = document.getElementById("contact-fab");
    const contactSection = document.getElementById("contact-section");
    if (!fab || !contactSection) return;

    const setFabHidden = (isHidden) => {
      fab.classList.toggle("is-hidden", isHidden);
      fab.setAttribute("aria-hidden", String(isHidden));
    };

    fab.addEventListener("click", () => {
      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const top =
        window.scrollY +
        contactSection.getBoundingClientRect().top -
        headerHeight;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      });
    });

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFabHidden(entry.isIntersecting);
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(contactSection);
  }

  function initContactForm() {
    const section = document.getElementById("contact-section");
    const formWrap = document.getElementById("contact-form-wrap");
    const form = document.getElementById("contact-form");
    const statusEl = document.getElementById("contact-status");
    const successEl = document.getElementById("contact-success");
    if (!section || !formWrap || !form || !statusEl || !successEl) return;

    const submitBtn = form.querySelector(".contact__submit");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.reportValidity()) return;

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const honey = form._honey.value;

      if (honey) return;

      submitBtn.disabled = true;
      statusEl.textContent = "Sending…";
      statusEl.className = "contact__status contact__status--pending";

      try {
        const response = await fetch(
          `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              message,
              _honey: honey,
              _subject: `Intuite — message from ${name}`,
              _replyto: email,
              _template: "table",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Request failed");
        }

        statusEl.textContent = "";
        statusEl.className = "contact__status";
        showContactSuccess(section, formWrap, successEl);
      } catch (err) {
        statusEl.textContent = "Something went wrong. Please try again.";
        statusEl.className = "contact__status contact__status--error";
        submitBtn.disabled = false;
        console.error(err);
      }
    });
  }

  async function init() {
    try {
      const response = await fetch("models.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const models = await response.json();
      if (!Array.isArray(models) || models.length === 0) {
        gallery.innerHTML =
          '<p class="model-page__error">No models to display.</p>';
        return;
      }

      render(models);

      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => render(models), 150);
      });
    } catch (err) {
      gallery.innerHTML =
        '<p class="model-page__error">Failed to load models.</p>';
      console.error(err);
    }
  }

  initContactFab();
  initContactForm();
  init();
})();
