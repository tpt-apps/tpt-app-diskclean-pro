(async () => {
  const dirName = 'Temp';
  const $$ = (s) => [...document.querySelectorAll(s)];
  const row = $$('.report-row').find((r) => r.querySelector('.name')?.textContent?.trim()?.endsWith(dirName));
  if (!row) return { error: 'row not found: ' + dirName };
  row.click();
  await new Promise((r) => setTimeout(r, 400));
  return {
    summary: document.querySelector('.report-summary')?.textContent?.trim()?.replace(/\s+/g, ' ') ?? null,
    rows: $$('.report-row').map((r) => r.querySelector('.name')?.textContent?.trim()),
  };
})()
