const listenerRegistry = new WeakMap();

export function registerListeners (key: any, listeners: Array<any>): void {
  let registered = listenerRegistry.get(key);

  if (!registered) {
    registered = [];
    listenerRegistry.set(key, registered);
  }

  listeners.forEach((listener: any) => {
    listener[0].addEventListener(listener[1], listener[2]);
    registered.push(listener);
  });
}

export function unregisterListeners (key: any): boolean {
  const listeners = listenerRegistry.get(key);

  if (!listeners) {
    return false;
  }

  listeners.forEach((listener: any) => {
    listener[0].removeEventListener(listener[1], listener[2]);
  });

  listenerRegistry.delete(key);
}

function findFromPath (path: any, criteria: any, target: any, index = 0): any {
  const element = path[index];

  if (criteria(element)) {
    return element;
  } else if (
    element === target ||
    !element.parentElement
  ) {
    return;
  }

  return findFromPath(path, criteria, target, index + 1);
}

export function findElementInEventPath (event: any, selector: any): any {
  const criteria = typeof selector === 'function'
    ? selector
    : (el: any) => {
      return el.matches(selector);
    };

  return findFromPath(event.composedPath(), criteria, event.currentTarget);
}
