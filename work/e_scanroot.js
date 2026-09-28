(async () => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  const btn = (txt) => $$('button').find(b => b.textContent.trim() === txt);
  const inp = document.querySelector('header input');
  const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  set.call(inp, 'C:\\');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  btn('Start Scan').click();
  const t0 = Date.now();
  let timedOut = true;
  while (Date.now() - t0 < 420000) {
    await new Promise(r => setTimeout(r, 500));
    if (btn('Start Scan') && !document.querySelector('.empty-state')) { timedOut = false; break; }
  }
  return {
    path: document.querySelector('header input').value,
    timedOut,
    seconds: Math.round((Date.now() - t0) / 1000),
    errorBar: document.querySelector('.error-bar')?.textContent?.trim() ?? null,
  };
})()
