(function () {
  const gallery = document.getElementById("gallery");

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

  init();
})();
