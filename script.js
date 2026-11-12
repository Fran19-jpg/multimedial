document.addEventListener('DOMContentLoaded', () => {
  const linkButton = document.querySelector('.link-button');
  const form = document.getElementById('entry-form');
  const entriesList = document.getElementById('entries-list');
  const storageKey = 'bitacora-entries';

  if (linkButton) {
    linkButton.setAttribute('aria-label', 'Ver mi página en GitHub Pages');
  }

  function loadEntries() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveEntries(entries) {
    localStorage.setItem(storageKey, JSON.stringify(entries));
  }

  function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  function renderEntries() {
    const entries = loadEntries();

    if (!entries.length) {
      entriesList.innerHTML = '<li class="empty-state">Todavía no hay entradas guardadas.</li>';
      return;
    }

    entriesList.innerHTML = entries
      .map(
        (entry) => `
          <li class="entry-item">
            <div class="entry-header">
              <h3>${entry.title}</h3>
              <span class="entry-date">${formatDate(entry.date)}</span>
            </div>
            <p>${entry.content}</p>
          </li>
        `
      )
      .join('');
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const title = formData.get('title').toString().trim();
      const content = formData.get('content').toString().trim();
      const date = formData.get('date').toString();

      if (!title || !content || !date) {
        return;
      }

      const entries = loadEntries();
      entries.unshift({ title, content, date });
      saveEntries(entries);
      form.reset();
      renderEntries();
    });
  }

  renderEntries();
});
