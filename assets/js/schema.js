(() => {
  const root = window.SITE?.dataRoot || 'https://cybercoretech.github.io/data';
  const set = (selector, value) => document.querySelectorAll(selector).forEach(element => {
    element.textContent = value;
  });
  fetch(`${root.replace(/\/$/, '')}/cybergrid.json`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(schema => {
      const families = Object.values(schema.families || {});
      const mashups = Array.isArray(window.SITE?.mashups) ? window.SITE.mashups.length : 0;
      set('[data-schema-version]', `SCHEMA V${schema.schema_version ?? '—'}`);
      set('[data-schema-families]', families.length);
      set('[data-schema-themes]', families.reduce((total, names) => total + names.length, 0) + mashups);
      set('[data-schema-updated]', schema.updated_at || 'LIVE');
    })
    .catch(() => set('[data-schema-version]', 'SCHEMA UNAVAILABLE'));
})();
