(() => {
  const $$ = (s) => [...document.querySelectorAll(s)];
  const btn = (txt) => $$('button').find(b => b.textContent.trim() === txt);
  const inp = document.querySelector('header input');
  const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  set.call(inp, 'C:\\');
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  const b = btn('Start Scan');
  if (!b) return { started: false, reason: 'button missing / already scanning' };
  b.click();
  return { started: true, path: document.querySelector('header input').value };
})()
