export function parseHTML (html: any) {
  const range = document.createRange();
  return range.createContextualFragment(html);
}

export function emptyChildNodes (el: any) {
  if (el.firstChild) {
    el.removeChild(el.firstChild);
    emptyChildNodes(el);
  }
}

export function replaceChildNodes (el: any, newChildNodes: any) {
  emptyChildNodes (el);

  if (newChildNodes) {
    el.appendChild(newChildNodes);
  } else if (typeof newChildNodes === 'string') {
    el.appendChild(parseHTML(newChildNodes));
  } else if (typeof newChildNodes.forEach === 'function') {
    newChildNodes.forEach((node: any) => {
      el.appendChild(node);
    });
  }
}

export function hideElement (el: any) {
  if (el.style.display === 'none') {
    return false;
  }

  // back up the existing display setting in data-style-display
  if (el.style.display) {
    el.dataset.styleDisplay = el.style.display;
  }

  el.style.display = 'none';
}

export function showElement (el: any) {
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