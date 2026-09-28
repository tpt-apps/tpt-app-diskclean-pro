(() => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  return {
    activeTab: document.querySelector('.view-tabs button.active')?.textContent?.trim() ?? null,
    summary: document.querySelector('.report-summary')?.textContent?.trim()?.replace(/\s+/g, ' ') ?? null,
    rows: $$('.report-row').map((r) => ({
      checked: r.querySelector('input')?.checked ?? false,
      name: r.querySelector('.name')?.textContent?.trim() ?? '',
      size: r.querySelector('.size')?.textContent?.trim() ?? '',
    })),
  };
})()
