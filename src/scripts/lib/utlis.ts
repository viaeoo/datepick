export function hasProperty (obj: object, prop: string): any {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function lastItemOf (arr: Array<any>): any {
  return arr[arr.length - 1];
}

export function createTagRepeat (tagName: string, repeat: number, index = 0, html = ''): string {
  html += `<${tagName}></${tagName}>`;

  const next = index + 1;

  return next < repeat
    ? createTagRepeat(tagName, repeat, next, html)
    : html;
}

export function optimizeTemplateHTML (html: string): string {
  return html.replace(/>\s+/g, '>').replace(/\s+</, '<');
}

export function isInRange (val: number, min: number, max: number): boolean {
  const minOK = min === undefined || val >= min;
  const maxOK = max === undefined || val <= max;

  return minOK && maxOK;
}

export function limitToRange (val: number, min: number, max: number): number {
  if (val < min) {
    return min;
  }

  if (val > max) {
    return max;
  }

  return val;
}

export function deepCopy (obj: object): object {
  const clone = {};

  for (const i in obj) {
    if (typeof obj[i] === 'function') {
      clone[i] = obj[i];
    } else if (Array.isArray(obj[i])) {
      clone[i] = obj[i].slice(0);
    } else if (typeof(obj[i]) === 'object' && obj[i] !== null) {
      clone[i] = deepCopy(obj[i]);
    } else {
      clone[i] = obj[i];
    }
  }

  return clone;
}
