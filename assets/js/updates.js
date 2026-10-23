(() => {
  const grid = document.querySelector('#updatesGrid');
  const status = document.querySelector('#signalStatus');
  if (!grid || !status) return;

  const card = item => {
    const article = document.createElement('article');
    article.className = `signal-card signal-${item.tone || 'cyan'} reveal`;

    const meta = document.createElement('div');
    meta.className = 'signal-meta';
    meta.textContent = `${item.type} / ${item.date}`;

    const title = document.createElement('h3');
    title.textContent = item.title;

    const summary = document.createElement('p');
    summary.textContent = item.summary;

    const command = document.createElement('code');
    command.textContent = item.command;

    const footer = document.createElement('div');
    footer.className = 'signal-footer';
    const state = document.createElement('span');
    state.textContent = item.status;
    const link = document.createElement('a');
    link.href = item.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'OPEN SOURCE ↗';
    footer.append(state, link);

    article.append(meta, title, summary, command, footer);
    return article;
  };

  fetch('data/updates.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(feed => {
      grid.replaceChildren(...feed.items.map(card));
      status.textContent = `FEED UPDATED ${feed.updated_at} / ${feed.items.length} SIGNALS`;
      requestAnimationFrame(() => grid.querySelectorAll('.reveal').forEach(item => item.classList.add('in')));
    })
    .catch(error => {
      status.textContent = 'UPDATE FEED OFFLINE / SEE RAW REPOSITORY';
      const message = document.createElement('p');
      message.className = 'signal-error';
      message.textContent = `Unable to load updates: ${error.message}`;
      grid.replaceChildren(message);
    });
})();
