import { createTagRepeat, optimizeTemplateHTML } from '../lib/utlis';

const week = (options: any) => {
  return optimizeTemplateHTML(`
    <div class="datepick-week${options.weekClass ? ` ${options.weekClass}` : ''}">${createTagRepeat('span', 7)}</div>
  `);
};

export default week;
