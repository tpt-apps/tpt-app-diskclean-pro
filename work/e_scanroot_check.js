(() => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  const btn = (txt) => $$('button').find(b => b.textContent.trim() === txt);
  return {
    scanning: !!btn('Scanning...'),
    progress: document.querySelector('.progress-text')?.textContent?.trim()?.replace(/\s+/g, ' ').slice(0, 140) ?? null,
    errorBar: document.querySelector('.error-bar')?.textContent?.trim() ?? null,
    rootSummary: document.querySelector('.report-summary')?.textContent?.trim()?.replace(/\s+/g, ' ') ?? null,
    firstRows: $$('.report-row .name').slice(0, 6).map((n) => n.textContent.trim()),
  };
})()
