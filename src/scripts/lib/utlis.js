export function hasProperty (obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function lastItemOf (arr) {
  return arr[arr.length - 1];
}

export function createTagRepeat (tagName, repeat, index = 0, html = '') {
  html += `<${tagName}></${tagName}>`;

  const next = index + 1;

  return next < repeat
    ? createTagRepeat(tagName, repeat, next, html)
    : html;
}

export function optimizeTemplateHTML (html) {
  return html.replace(/>\s+/g, '>').replace(/\s+</, '<');
}

export function isInRange (testVal, min, max) {
  const minOK = min === undefined || testVal >= min;
  const maxOK = max === undefined || testVal <= max;

  return minOK && maxOK;
}

export function limitToRange (val, min, max) {
  if (val < min) {
    return min;
  }

  if (val > max) {
    return max;
  }

  return val;
}

export function deepCopy (obj) {
  const clone = {};

  for (let i in obj) {
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