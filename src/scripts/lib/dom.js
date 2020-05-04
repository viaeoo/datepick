export function parseHTML (html) {
  const range = document.createRange() || document.body.createRange();
  return range.createContextualFragment(html);
}

export function emptyChildNodes (el) {
  if (el.firstChild) {
    el.removeChild(el.firstChild);
    emptyChildNodes(el);
  }
}

export function replaceChildNodes (el, newChildNodes) {
  emptyChildNodes (el);

  if (newChildNodes) {
    el.appendChild(newChildNodes);
  } else if (typeof newChildNodes === 'string') {
    el.appendChild(parseHTML(newChildNodes));
  } else if (typeof newChildNodes.forEach === 'function') {
    newChildNodes.forEach((node) => {
      el.appendChild(node);
    });
  }
}

export function hideElement (el) {
  if (el.style.display === 'none') {
    return false;
  }

  // back up the existing display setting in data-style-display
  if (el.style.display) {
    el.dataset.styleDisplay = el.style.display;
  }

  el.style.display = 'none';
}

export function showElement (el) {
  if (el.style.display !== 'none') {
    return false;
  }

  if (el.dataset.styleDisplay) {
    // restore backed-up dispay property
    el.style.display = el.dataset.styleDisplay;
    delete el.dataset.styleDisplay;
  } else {
    el.style.display = '';
  }
}