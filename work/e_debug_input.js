(() => {
  const inputs = [...document.querySelectorAll('header input')];
  const allInputs = [...document.querySelectorAll('input')].map((i) => ({
    parent: i.closest('header') ? 'header' : i.closest('.report') ? 'report' : i.closest('.cleanup-panel') ? 'cleanup' : 'other',
    type: i.type,
  }));
  return {
    headerInputCount: inputs.length,
    headerInputTag: inputs[0]?.tagName ?? null,
    headerInputType: inputs[0]?.type ?? null,
    allInputs,
    buttons: [...document.querySelectorAll('button')].slice(0, 8).map((b) => b.textContent.trim()),
  };
})()
