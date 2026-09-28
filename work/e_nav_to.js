(async () => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  // dismiss details panel (Escape handler calls deselectNode)
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  // switch to Report tab
  $$('.view-tabs button').find(x => x.textContent.trim() === 'Report')?.click();
  await new Promise(r => setTimeout(r, 300));
  // navigate into the named folder row
  const target = $$('.report-row').find(r => r.querySelector('.name')?.textContent?.trim()?.endsWith('Windows'));
  if (!target) return { error: 'Windows row not found', rows: $$('.report-row .name').slice(0, 8).map(n => n.textContent.trim()) };
  target.click();
  await new Promise(r => setTimeout(r, 800));
  // switch to Treemap
  $$('.view-tabs button').find(x => x.textContent.trim() === 'Treemap')?.click();
  await new Promise(r => setTimeout(r, 600));
  return {
    summary: document.querySelector('.report-summary')?.textContent?.trim()?.replace(/\s+/g, ' ') ?? null,
    svgRects: $$('main svg rect').length,
  };
})()
