(async () => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  const btn = (txt) => $$('button').find(b => b.textContent.trim() === txt);
  btn('Detect Cleanup').click();
  const t0 = Date.now();
  while (Date.now() - t0 < 15000) {
    await new Promise(r => setTimeout(r, 200));
    if (document.querySelector('.cleanup-panel')) break;
  }
  await new Promise(r => setTimeout(r, 500));
  return {
    panelOpen: !!document.querySelector('.cleanup-panel'),
    mode: document.querySelector('.cleanup-mode-bar span')?.textContent?.trim() ?? null,
    items: $$('.cleanup-item').map(i => ({
      checked: i.querySelector('input')?.checked ?? null,
      text: i.textContent.trim().replace(/\s+/g, ' ').slice(0, 200),
    })),
  };
})()
