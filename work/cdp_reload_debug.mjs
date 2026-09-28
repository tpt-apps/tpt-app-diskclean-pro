import { CDP } from './cdp_lib.mjs';

const cdp = await CDP.create();
try {
  await cdp.send('Page.enable');
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `window.__errs = []; window.onerror = function (m, s, l, c) { window.__errs.push(String(m) + ' @' + (s || '') + ':' + l + ':' + c); };`,
  });
  await cdp.send('Page.reload');
  await new Promise((r) => setTimeout(r, 4000));
  const errs = await cdp.eval('JSON.stringify(window.__errs)');
  const root = await cdp.eval("document.getElementById('root')?.innerHTML.length ?? -1");
  console.log('ERRORS:', errs);
  console.log('root length:', root);
} finally {
  cdp.close();
}
