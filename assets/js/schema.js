(() => {
  const root = window.SITE?.dataRoot || 'https://cybercoretech.github.io/data';
  const set = (selector, value) => document.querySelectorAll(selector).forEach(element => {
    element.textContent = value;
  });
  const base = root.replace(/\/$/, '');
  Promise.all([
    fetch(`${base}/cybergrid.json`).then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }),
    fetch(`${base}/mashups.json`).then(r => (r.ok ? r.json() : { mashups: [] })).catch(() => ({ mashups: [] }))
  ])
    .then(([schema, shared]) => {
      const families = Object.values(schema.families || {});
      const mashups = (shared.mashups || []).length;
      set('[data-schema-version]', `SCHEMA V${schema.schema_version ?? '—'}`);
      set('[data-schema-families]', families.length);
      set('[data-schema-themes]', families.reduce((total, names) => total + names.length, 0) + mashups);
      set('[data-schema-updated]', schema.updated_at || 'LIVE');
    })
    .catch(() => set('[data-schema-version]', 'SCHEMA UNAVAILABLE'));
})();
