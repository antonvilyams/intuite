(function () {
  const content = document.getElementById("model-content");

  const INFO_COLUMNS = [
    [
      { key: "height", label: "Height" },
      { key: "bust", label: "Bust" },
      { key: "cup", label: "Cup" },
      { key: "waist", label: "Waist" },
    ],
    [
      { key: "hip", label: "Hip" },
      { key: "shoe", label: "Shoe" },
      { key: "hair", label: "Hair" },
      { key: "eyes", label: "Eyes" },
    ],
  ];

  function getModelId() {
    return new URLSearchParams(window.location.search).get("id");
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function skeletonInfoColumn(lineCount) {
    const lines = Array.from({ length: lineCount }, () =>
      '<span class="model-page__skeleton model-page__skeleton--line"></span>'
    ).join("");
    return `<div class="model-info__column">${lines}</div>`;
  }

  function renderSkeleton() {
    if (!content) return;

    const linesPerColumn = INFO_COLUMNS.map((column) => column.length);
    const infoHtml = linesPerColumn
      .map((count) => skeletonInfoColumn(count))
      .join("");

    content.className = "model-page__content model-page__content--loading";
    content.innerHTML = `
      <div class="model-page__photo" aria-hidden="true">
        <span class="model-page__skeleton model-page__skeleton--photo"></span>
      </div>
      <span class="model-page__skeleton model-page__skeleton--name" aria-hidden="true"></span>
      <div class="model-info model-info--skeleton" aria-hidden="true">${infoHtml}</div>
      <span class="model-page__skeleton model-page__skeleton--back" aria-hidden="true"></span>
    `;
  }

  function showError(message) {
    if (!content) return;
    content.className = "model-page__content";
    content.innerHTML = `<p class="model-page__error">${message}</p>`;
  }

  function renderModel(model) {
    if (!content) return;

    document.title = `Intuite — ${model.name}`;

    const infoHtml = renderInfo(model.info);

    content.className = "model-page__content";
    content.innerHTML = `
      <div class="model-page__photo">
        <img src="${escapeHtml(model.photo_url)}" alt="${escapeHtml(model.name)}" />
      </div>
      <h1 class="model-page__name">${escapeHtml(model.name)}</h1>
      ${infoHtml}
      <a href="index.html" class="model-page__back">← Back</a>
    `;
  }

  function renderInfo(info) {
    if (!info || typeof info !== "object") return "";

    const columns = INFO_COLUMNS.map((fields) =>
      fields.filter(
        ({ key }) => info[key] != null && String(info[key]).trim() !== ""
      )
    ).filter((column) => column.length > 0);

    if (columns.length === 0) return "";

    const columnsHtml = columns
      .map((fields) => {
        const items = fields
          .map(
            ({ key, label }) =>
              `<p class="model-info__item"><span class="model-info__label">${label}:</span> ${escapeHtml(info[key])}</p>`
          )
          .join("");
        return `<div class="model-info__column">${items}</div>`;
      })
      .join("");

    return `<div class="model-info">${columnsHtml}</div>`;
  }

  async function init() {
    const id = getModelId();

    if (!id) {
      showError("Model not found.");
      return;
    }

    renderSkeleton();

    try {
      const response = await fetch("models.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const models = await response.json();
      const model = models.find((m) => String(m.id) === String(id));

      if (!model) {
        showError("Model not found.");
        return;
      }

      renderModel(model);
    } catch (err) {
      showError("Failed to load model data.");
      console.error(err);
    }
  }

  init();
})();
