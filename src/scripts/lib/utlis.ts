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

export function isInRange (val: number, min: number|Date, max: number|Date): boolean {
  const minOK = min === undefined || val >= (min instanceof Date ? min.getTime() : min);
  const maxOK = max === undefined || val <= (max instanceof Date ? max.getTime() : max);

  return minOK && maxOK;
}

export function limitToRange (val: number, min: number|Date, max: number|Date): number {
  if (val < min) {
    return min instanceof Date ? min.getTime() : min;
  }

  if (val > max) {
    return max instanceof Date ? max.getTime() : max;
  }

  return val;
}

export function deepCopy <T> (target: T): T {
  if (target === null) {
    return target;
  }

  if (target instanceof Date) {
    return new Date(target.getTime()) as any;
  }
  
  if (target instanceof Array) {
    const cp = [] as any[];
    (target as any[]).forEach((v) => { cp.push(v); });

    return cp.map((n: any) => deepCopy<any>(n)) as any;
  }
  
  if (typeof target === 'object' && target !== {}) {
    const cp = { ...(target as { [key: string]: any }) } as { [key: string]: any };

    Object.keys(cp).forEach(k => {
      cp[k] = deepCopy<any>(cp[k]);
    });
    
    return cp as T;
  }
  
  return target;
}
