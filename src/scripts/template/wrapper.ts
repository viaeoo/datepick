import { IOptions } from '../interface/options';
import { optimizeTemplateHTML } from '../lib/utlis';

const wrapper = (options: IOptions): string => {
  return optimizeTemplateHTML(`
    <div class="datepick${options.containerClass ? ` ${options.containerClass}` : ''}">
      <div class="datepick-header${options.headerClass ? ` ${options.headerClass}` : ''}">
        <div class="datepick-controls${options.controlsClass ? ` ${options.controlsClass}` : ''}">
          <button class="datepick-btn datepick-btn-prev${options.controlsPrevClass ? ` ${options.controlsPrevClass}` : ''}"></button>
          <h6 class="datepick-controls-title${options.controlsTitleClass ? ` ${options.controlsTitleClass}` : ''}"></h6>
          <button class="datepick-btn datepick-btn-next${options.controlsNextClass ? ` ${options.controlsNextClass}` : ''}"></button>
        </div>
      </div>
      <div class="datepick-main${options.mainClass ? ` ${options.mainClass}` : ''}"></div>
      <div class="datepick-footer${options.footerClass ? ` ${options.footerClass}` : ''}">
        <div class="datepick-controls${options.controlsClass ? ` ${options.controlsClass}` : ''}">
          <button class="datepick-btn datepick-btn-today${options.controlsTodayClass ? ` ${options.controlsTodayClass}` : ''}"></button>
          <button class="datepick-btn datepick-btn-clear${options.controlsClearClass ? ` ${options.controlsClearClass}` : ''}"></button>
        </div>
      </div>
    </div>
  `);
};

export default wrapper;
