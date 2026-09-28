(() => ({
  inputValue: document.querySelector('header input')?.value,
  buttons: [...document.querySelectorAll('header button')].map(b => b.textContent.trim()),
  emptyState: !!document.querySelector('.empty-state'),
  emptyText: document.querySelector('.empty-state')?.textContent?.trim() ?? null,
  hasTreeView: !!document.querySelector('.tree-view'),
  sidebarHTML: document.querySelector('.sidebar')?.innerHTML?.replace(/\s+/g, ' ').slice(0, 400) ?? null,
  errorBar: document.querySelector('.error-bar')?.textContent?.trim() ?? null,
  progress: document.querySelector('.scan-progress')?.textContent?.trim()?.replace(/\s+/g, ' ').slice(0, 200) ?? null,
  bodyClasses: document.body.className,
}))()
