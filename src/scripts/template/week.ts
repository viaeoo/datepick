import { IOptions } from '../interface/options';
import { createTagRepeat, optimizeTemplateHTML } from '../lib/utlis';

const week = (options: IOptions): string => {
  return optimizeTemplateHTML(`
    <div class="datepick-week${options.weekClass ? ` ${options.weekClass}` : ''}">${createTagRepeat('span', 7)}</div>
  `);
};

export default week;
