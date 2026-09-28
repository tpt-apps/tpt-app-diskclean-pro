(async () => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  await new Promise(r => setTimeout(r, 300));
  // back to the drive-level report
  $$('.view-tabs button').find(x => x.textContent.trim() === 'Report')?.click();
  await new Promise(r => setTimeout(r, 500));
  return {
    detailsPanelGone: !document.querySelector('.details-panel'),
    summary: document.querySelector('.report-summary')?.textContent?.trim()?.replace(/\s+/g, ' ') ?? null,
    rows: $$('.report-row').length,
  };
})()
