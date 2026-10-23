(() => {
  const grid = document.querySelector('#updatesGrid');
  const status = document.querySelector('#signalStatus');
  const dialog = document.querySelector('#updateDialog');
  const dialogTitle = document.querySelector('#updateDialogTitle');
  const dialogKicker = document.querySelector('#updateDialogKicker');
  const dialogBody = document.querySelector('#updateDialogBody');
  if (!grid || !status) return;

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  const linksFor = item => item.links?.length ? item.links : [{ label: 'OPEN SOURCE', url: item.link }];
  const badgesFor = item => item.badges?.length ? item.badges : [item.type, item.status];

  const showDetails = item => {
    if (!dialog || !dialogTitle || !dialogBody) return;
    dialogTitle.textContent = item.title;
    dialogKicker.textContent = `${item.type} / ${item.date}`;
    dialogBody.innerHTML = `
      <div class="update-detail-meta">
        <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time>
        <div class="update-badges">${badgesFor(item).map(badge => `<span class="badge ${escapeHtml(item.tone || 'info')}">${escapeHtml(badge)}</span>`).join('')}</div>
      </div>
      <p class="update-detail-summary">${escapeHtml(item.summary)}</p>
      <div class="update-detail-command"><span>COMMAND / PATH</span><code>${escapeHtml(item.command)}</code></div>
      <div class="stat-dialog-links">${linksFor(item).map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)} ↗</a>`).join('')}</div>`;
    dialog.showModal();
  };

  const closeDetails = () => dialog?.close();

  const card = item => {
    const article = document.createElement('article');
    article.className = `signal-card signal-${item.tone || 'cyan'} reveal`;
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `Open details for ${item.title}`);
    article.addEventListener('click', () => showDetails(item));
    article.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showDetails(item);
      }
    });

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
    link.addEventListener('click', event => event.stopPropagation());
    footer.append(state, link);

    article.append(meta, title, summary, command, footer);
    return article;
  };

  document.querySelector('[data-update-close]')?.addEventListener('click', closeDetails);
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) closeDetails();
  });

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
