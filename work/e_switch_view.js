(async () => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  const b = $$('.view-tabs button').find(x => x.textContent.trim() === 'Sunburst');
  if (!b) return { error: 'no Treemap tab' };
  b.click();
  await new Promise(r => setTimeout(r, 500));
  return {
    active: b.className,
    svgRects: $$('main svg path').length,
  };
})()
