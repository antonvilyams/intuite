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
      content.innerHTML =
        '<p class="model-page__error">Model not found.</p>';
      return;
    }

    try {
      const response = await fetch("models.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const models = await response.json();
      const model = models.find((m) => String(m.id) === String(id));

      if (!model) {
        content.innerHTML =
          '<p class="model-page__error">Model not found.</p>';
        return;
      }

      document.title = `Intuite — ${model.name}`;

      const infoHtml = renderInfo(model.info);

      content.innerHTML = `
        <div class="model-page__photo">
          <img src="${escapeHtml(model.photo_url)}" alt="${escapeHtml(model.name)}" />
        </div>
        <h1 class="model-page__name">${escapeHtml(model.name)}</h1>
        ${infoHtml}
        <a href="index.html" class="model-page__back">← Back</a>
      `;
    } catch (err) {
      content.innerHTML =
        '<p class="model-page__error">Failed to load model data.</p>';
      console.error(err);
    }
  }

  init();
})();
