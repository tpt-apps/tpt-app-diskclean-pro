(async () => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  const btn = (txt) => $$('button').find(b => b.textContent.trim() === txt);
  const inp = document.querySelector('header input');
  const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  set.call(inp, 'C:\\Users\\phill\\tpt-clean-test');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  btn('Start Scan').click();
  const t0 = Date.now();
  let timedOut = true;
  while (Date.now() - t0 < 90000) {
    await new Promise(r => setTimeout(r, 300));
    const b = btn('Start Scan');
    if (b && !document.querySelector('.empty-state') && document.querySelector('.tree-view')) { timedOut = false; break; }
  }
  return {
    path: document.querySelector('header input').value,
    timedOut,
    errorBar: document.querySelector('.error-bar')?.textContent?.trim() ?? null,
    treeRows: $$('table tr, .tree-view div').length,
  };
})()
