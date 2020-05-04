import { createTagRepeat, optimizeTemplateHTML } from '../lib/utlis';

const grid = (options, optimize = false) => {
  return optimize
    ? optimizeTemplateHTML(`
      <div class="datepick-grid${options.gridClass ? ` ${options.gridClass}` : ''}">${createTagRepeat('span', 42)}</div>
    `)
    : `
      <div class="datepick-grid${options.gridClass ? ` ${options.gridClass}` : ''}">${createTagRepeat('span', 42)}</div>
    `;
};

export default grid;
