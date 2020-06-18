export function parser (html: string): DocumentFragment {
  const range = document.createRange();

  return range.createContextualFragment(html);
}

export function eraser (element: HTMLElement): void {
  if (element.firstChild) {
    element.removeChild(element.firstChild);
    eraser(element);
  }
}

export function hide (element: HTMLElement): boolean {
  if (element.style.display === 'none') {
    return false;
  }

  if (element.style.display) {
    element.dataset.styleDisplay = element.style.display;
  }

  element.style.display = 'none';
}

export function show (element: HTMLElement): boolean {
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
