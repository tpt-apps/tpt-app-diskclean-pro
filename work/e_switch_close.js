(async (viewName) => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  const closeBtn = document.querySelector('.cleanup-header button');
  if (closeBtn) { closeBtn.click(); await new Promise(r => setTimeout(r, 200)); }
  const b = $$('.view-tabs button').find(x => x.textContent.trim() === 'Treemap');
  if (!b) return { error: 'no Treemap tab' };
  b.click();
  await new Promise(r => setTimeout(r, 300));
  return { active: b.className, svgRects: $$('main svg rect').length, cleanupOpen: !!document.querySelector('.cleanup-panel') };
})()
