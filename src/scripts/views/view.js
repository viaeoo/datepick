import { parseHTML } from '../lib/dom';

export default class View {
  constructor (datepick, options) {
    Object.assign(this, options, {
      datepick,
      view: parseHTML('<div class="datepick-view"></div>').firstChild,
      selected: [],
    });
    this.setInit(this.datepick.options);
  }

  setInit (options) {
    this.setOptions(options);
    this.updateView();
    this.updateSelected();
  }

  setViewTitle (title) {
    this.datepick.controls.title.textContent = title;
  }

  setPrevBtnDisabled (disabled) {
    this.datepick.controls.prevBtn.disabled = disabled;
  }

  setNextBtnDisabled (disabled) {
    this.datepick.controls.nextBtn.disabled = disabled;
  }
}
