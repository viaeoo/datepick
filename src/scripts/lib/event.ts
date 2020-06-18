import { IDatepick } from '../interface/datepick';

const listenerRegistry = new WeakMap();

function findFromPath (path: Array<any>, criteria: any, target: any, index = 0): HTMLElement {
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

export function registerListeners (datepick: IDatepick, listeners: Array<any>): void {
  let registered = listenerRegistry.get(datepick);

  if (!registered) {
    registered = [];
    listenerRegistry.set(datepick, registered);
  }

  listeners.forEach((listener: Array<any>) => {
    listener[0].addEventListener(listener[1], listener[2]);
    registered.push(listener);
  });
}

export function findElementInEventPath (event: Record<any, any>, selector: string): HTMLElement {
  if (!Element.prototype.matches) {
    const proto: any = Element.prototype;
  
    Element.prototype.matches = proto.msMatchesSelector || proto.webkitMatchesSelector;
  }

  if (!Event.prototype.composedPath) {
    const getComposedPath: any = function (node: any) {
      let parent: any;
  
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

  const criteria = typeof selector === 'function'
    ? selector
    : (el: any) => {
      return el.matches(selector);
    };

  return findFromPath(event.composedPath(), criteria, event.currentTarget);
}
