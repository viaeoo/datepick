const listenerRegistry = new WeakMap();

export function registerListeners (key: any, listeners: any) {
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

export function unregisterListeners (key: any) {
  let listeners = listenerRegistry.get(key);

  if (!listeners) {
    return false;
  }

  listeners.forEach((listener: any) => {
    listener[0].removeEventListener(listener[1], listener[2]);
  });

  listenerRegistry.delete(key);
}

// Event.composedPath() polyfill for Edge
// based on https://gist.github.com/kleinfreund/e9787d73776c0e3750dcfcdc89f100ec
if (!Event.prototype.composedPath) {
  const getComposedPath: any = function (node: any) {
    let parent;
    if (node.parentNode) {
      parent = node.parentNode;
    } else if (node.host) {
      parent = node.host;
    } else if (node.defaultView) {
      parent = node.defaultView;
    }

    if (parent !== undefined) {
      return [node].concat(getComposedPath(parent));
    }

    return [node];
  };

  Event.prototype.composedPath = function () {
    return getComposedPath(this.target);
  };
}

function findFromPath(path: any, criteria: any, currentTarget: any, index = 0): any {
  const el = path[index];

  if (criteria(el)) {
    return el;
  } else if (el === currentTarget || !el.parentElement) {
    // stop when reaching currentTarget or <html>
    return;
  }

  return findFromPath(path, criteria, currentTarget, index + 1);
}

// Search for the actual target of a delegated event
export function findElementInEventPath (ev: any, selector: any) {
  const criteria = typeof selector === 'function' ? selector : (el: any) => { return el.matches(selector); };
  return findFromPath(ev.composedPath(), criteria, ev.currentTarget);
}
