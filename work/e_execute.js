(async () => {
  const $ = (s) => document.querySelector(s);
  const btn = $('.cleanup-actions button.danger');
  const label = btn ? btn.textContent.trim() : null;
  if (!btn) return { label: null, error: 'no danger button (not in confirm mode?)' };
  btn.click();
  const t0 = Date.now();
  while (Date.now() - t0 < 30000) {
    await new Promise(r => setTimeout(r, 300));
    const success = $('.cleanup-mode-bar.success span');
    if (success) return { label, executed: true, banner: success.textContent.trim(), doneBtn: !!$('.cleanup-actions button') };
    const err = document.querySelector('.cleanup-mode-bar span');
    if (err && err.textContent.includes('Pro')) {
      return { label, executed: false, rejected: true, banner: err.textContent.trim(), upsellHref: err.querySelector('a')?.href ?? null };
    }
  }
  return { label, executed: null, pageText: document.body.textContent.replace(/\s+/g, ' ').slice(0, 500) };
})()
