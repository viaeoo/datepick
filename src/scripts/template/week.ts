import { Options } from '../interface/options';
import { createTagRepeat, optimizeTemplateHTML } from '../lib/utlis';

const week = (options: Options) => {
  return optimizeTemplateHTML(`
    <div class="datepick-week${options.weekClass ? ` ${options.weekClass}` : ''}">${createTagRepeat('span', 7)}</div>
  `);
};

export default week;
