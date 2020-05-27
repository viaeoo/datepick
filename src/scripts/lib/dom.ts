export function parseHTML (html: string): DocumentFragment {
  const range = document.createRange();

  return range.createContextualFragment(html);
}

export function emptyChildNodes (element: any): void {
  if (element.firstChild) {
    element.removeChild(element.firstChild);
    emptyChildNodes(element);
  }
}

export function hideElement (element: any): boolean {
  if (element.style.display === 'none') {
    return false;
  }

  if (element.style.display) {
    element.dataset.styleDisplay = element.style.display;
  }

  element.style.display = 'none';
}

export function showElement (element: any): boolean {
  if (element.style.display !== 'none') {
    return false;
  }

  if (element.dataset.styleDisplay) {
    element.style.display = element.dataset.styleDisplay;

    delete element.dataset.styleDisplay;
  } else {
    element.style.display = '';
  }
}
