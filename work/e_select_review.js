(async () => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  $$('.cleanup-item input[type=checkbox]').forEach(cb => { if (!cb.checked) cb.click(); });
  await new Promise(r => setTimeout(r, 300));
  const review = document.querySelector('.cleanup-mode-bar button.primary');
  const reviewLabel = review ? review.textContent.trim() : null;
  review && review.click();
  await new Promise(r => setTimeout(r, 400));
  return {
    reviewLabel,
    warningBar: document.querySelector('.cleanup-mode-bar.warning span')?.textContent?.trim() ?? null,
    dangerBtn: document.querySelector('.cleanup-actions button.danger')?.textContent?.trim() ?? null,
    confirmListedItems: $$('.cleanup-list .cleanup-item').length,
  };
})()
