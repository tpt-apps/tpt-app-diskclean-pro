(async () => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  const btn = document.querySelector('.report-actions button.primary');
  if (!btn) return { error: 'no Review button' };
  btn.click();
  const t0 = Date.now();
  while (Date.now() - t0 < 8000) {
    await new Promise((r) => setTimeout(r, 200));
    if (document.querySelector('.cleanup-panel')) break;
  }
  await new Promise((r) => setTimeout(r, 400));
  const review = document.querySelector('.cleanup-mode-bar button.primary');
  const reviewLabel = review?.textContent?.trim() ?? null;
  review && review.click();
  await new Promise((r) => setTimeout(r, 400));
  return {
    panelOpen: !!document.querySelector('.cleanup-panel'),
    previewItems: $$('.cleanup-list .cleanup-item').map((i) => ({
      checked: i.querySelector('input')?.checked ?? null,
      text: i.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
    })),
    afterReviewWarning: document.querySelector('.cleanup-mode-bar.warning span')?.textContent?.trim() ?? null,
    dangerButtonLabel: document.querySelector('.cleanup-actions button.danger')?.textContent?.trim() ?? null,
    // NOTE: verification stops here on purpose — the delete button is NOT clicked.
  };
})()
