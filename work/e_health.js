(() => ({
  title: document.title,
  h1: document.querySelector('h1')?.textContent ?? null,
  buttons: [...document.querySelectorAll('header button')].map(b => b.textContent.trim()),
  inputValue: document.querySelector('header input')?.value ?? null,
  emptyState: !!document.querySelector('.empty-state'),
}))()
