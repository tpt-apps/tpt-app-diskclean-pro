(() => ({
  bodyLen: document.body.innerHTML.length,
  bodyStart: document.body.innerHTML.replace(/\s+/g, ' ').slice(0, 300),
  rootHTML: document.getElementById('root')?.innerHTML?.length ?? null,
  scripts: [...document.querySelectorAll('script')].map((s) => s.src ?? 'inline'),
}))()
