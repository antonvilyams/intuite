(function () {
  const content = document.getElementById("model-content");

  function getModelId() {
    return new URLSearchParams(window.location.search).get("id");
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

      content.innerHTML = `
        <div class="model-page__photo">
          <img src="${model.photo_url}" alt="${model.name}" />
        </div>
        <h1 class="model-page__name">${model.name}</h1>
        <p class="model-page__placeholder">
          Model profile page — coming soon.
        </p>
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
