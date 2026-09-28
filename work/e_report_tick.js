(async () => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  // tick the marker rows only (sandbox files created for this test)
  const targets = $$('.report-row').filter((r) => r.querySelector('.name')?.textContent.includes('tpt_marker'));
  targets.forEach((r) => {
    const cb = r.querySelector('input[type=checkbox]');
    if (cb && !cb.checked) cb.click();
  });
  await new Promise((res) => setTimeout(res, 300));
  const bar = document.querySelector('.report-actions');
  return {
    ticked: targets.length,
    actionBar: bar?.textContent?.trim()?.replace(/\s+/g, ' ') ?? null,
    reviewBtn: !!bar?.querySelector('button.primary'),
  };
})()
