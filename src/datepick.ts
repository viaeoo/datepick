// Style
import './datepick.scss';

// Polyfills
import './scripts/polyfills/composedPath';

// Interface
import { Options } from './scripts/interface/options';
import { Locale } from './scripts/interface/locale';

// Options
import defaultOption from './scripts/options/default';

// Lib
import { parseHTML, showElement, hideElement, emptyChildNodes } from './scripts/lib/dom';
import { getTime, today, addDays, dateValue } from './scripts/lib/date';
import { limitToRange, isInRange, deepCopy } from './scripts/lib/utlis';
import { registerListeners } from './scripts/lib/event';
import { formatDate, parseDate } from './scripts/lib/format';
import { onTouchGesture } from './scripts/lib/gesture';

// Lang
import locale from './scripts/lang/locale';

// Events
import * as listeners from './scripts/events/listeners';

// Templates
import wrapper from './scripts/template/wrapper';

// Views
import Days from './scripts/views/days';

class Datepick {
  public element: Element;
  public options: Options;

  public dates: Array<Date|number>;
  public viewDate: Date|number;

  public container: Element;
  public main: Element;
  public controls: Record<string, Element>;
  public views: any;

  public active: boolean;

  constructor (element: Element, options: Options) {
    this.element = element;
    this.options = deepCopy({ ...options, ...defaultOption });
    this.dates = [];

    this.setInit();
    this.render(wrapper(this.options), listeners);
    this.show();
  }

  setInit () {
    // Set initial date
    if (!this.options.initialDate) {
      this.options.initialDate = today();
    } else if (
      !(this.options.initialDate instanceof Array)
      && !(this.options.initialDate instanceof Date)
    ) {
      throw new Error('Invalid initialDate');
    } else if (this.options.initialDate instanceof Array) {
      this.options.initialDate.map((date: Date|number) => {
        if (!(date instanceof Date)) {
          throw new Error('Invalid initialDate');
        }
      });
    }

    // Set today
    if (
      this.options.today
      || !(this.options.today instanceof Date)
    ) {
      this.options.today = today();
    }

    // Set locale
    if (
      this.options.locale
      && Object.keys(this.options.locale).length
    ) {
      this.options.locale = deepCopy({ ...locale[this.options.lang], ...this.options.locale });
    } else {
      this.options.locale = deepCopy(locale[this.options.lang]);
    }

    // Set dates
    if (
      !this.options.dates
      || !(this.options.dates instanceof Array)
    ) {
      if (this.options.initialDate instanceof Array) {
        if (this.options.range) {
          this.dates = this.options.initialDate.length > 1
            ? [ getTime(this.options.initialDate[0]), getTime(this.options.initialDate[1]) ]
            : [ getTime(this.options.initialDate[0]), addDays(getTime(this.options.initialDate[0]), 1) ];
        } else if (this.options.multiple) {
          this.dates = this.options.multipleMaximum !== 0
            ? this.options.initialDate.slice(0, this.options.multipleMaximum)
            : this.options.initialDate.map((date) => { return getTime(date); });
        } else {
          this.dates.push(this.options.initialDate[0]);
        }
      } else {
        if (this.options.range) {
          this.dates = [
            getTime(this.options.initialDate),
            addDays(getTime(this.options.initialDate), 1),
          ];
        } else if (this.options.multiple) {
          this.dates.push(getTime(this.options.initialDate));
        } else {
          this.dates.push(getTime(this.options.initialDate));
        }
      }
    } else {
      if (
        (this.options.range && this.options.dates.length > 2)
        || ((!this.options.range && !this.options.multiple) && this.options.dates.length > 1)
      ) {
        throw new Error('Invalid dates length');
      }

      this.dates = this.options.dates.map((date: Date|number) => {
        return getTime(date);
      });
    }

    // Set grid
    if (
      this.options.grid
      && typeof this.options.grid === 'number'
      && this.options.grid !== 1
    ) {
      if (this.options.grid % 2 !== 1) {
        throw new Error('Grid option can only be odd');
      }

      if (
        this.options.grid < 3
        && (this.options.mode === 'swipe' || this.options.mode === 'fade')
      ) {
        throw new Error('If Swipe or fade mode, Grid options is only values ​​greater than 3 are possible');
      }
    } else {
      if (
        this.options.mode === 'swipe'
        || this.options.mode === 'fade'
      ) {
        this.options.grid = 3;
      } else {
        this.options.grid = 1;
      }
    }

    // Set view date
    this.viewDate = this.options.initialDate instanceof Array
      ? this.options.initialDate[0]
      : this.options.initialDate;

    // Set minimum and maximum
    let minDt = this.options.minDate;
    let maxDt = this.options.maxDate;

    if (this.options.minDate !== undefined) {
      minDt = this.options.minDate === null
        ? dateValue(0, 0, 1)
        : this.validateDate(this.options.minDate, this.options.locale.format, this.options.locale, minDt);

      delete this.options.minDate;
    }

    if (this.options.maxDate !== undefined) {
      maxDt = this.options.maxDate === null
        ? undefined
        : this.validateDate(this.options.maxDate, this.options.locale.format, this.options.locale, maxDt);

      delete this.options.maxDate;
    }

    if (maxDt < minDt) {
      this.options.minDate = maxDt;
      this.options.maxDate = minDt;
    } else {
      if (this.options.minDate !== minDt) {
        this.options.minDate = this.options.minDate = minDt;
      }

      if (this.options.maxDate !== maxDt) {
        this.options.maxDate = this.options.maxDate = maxDt;
      }
    }
  }

  render (wrapper: string, listeners: any) {
    const container = parseHTML(wrapper).firstElementChild;

    const [ header, main, footer ] = Array.from(container.children);
    const [ prevBtn, title, nextBtn ] = Array.from(header.lastElementChild.children);
    const [ todayBtn, clearBtn ] = Array.from(footer.firstElementChild.children);
    const controls = { prevBtn, title, nextBtn, todayBtn, clearBtn };

    // Property
    this.container = container;
    this.main = main;
    this.controls = controls;

    // Add wrapper class
    if (this.options.containerClass) {
      container.classList.add(this.options.containerClass);
    }

    if (
      this.options.mode
      && typeof this.options.mode === 'string'
      && (this.options.mode === 'swipe' || this.options.mode === 'fade')
    ) {
      container.classList.add(this.options.mode);
    }

    if (
      this.options.animationDirection
      && typeof this.options.animationDirection === 'string'
    ) {
      container.classList.add(this.options.animationDirection);
    }

    // Set render options
    this.renderSetting(this, this.options);

    // Set viewdate
    this.viewDate = this.computeResetViewDate();

    // Event binding
    registerListeners(this, [
      [container, 'click', listeners.onClickPicker.bind(this)],
      [main, 'click', listeners.onClickView.bind(null, this)],
      [controls.prevBtn, 'click', listeners.onClickPrevBtn.bind(null, this, true)],
      [controls.nextBtn, 'click', listeners.onClickNextBtn.bind(null, this, true)],
      [controls.todayBtn, 'click', listeners.onClickTodayBtn.bind(null, this)],
      [controls.clearBtn, 'click', listeners.onClickClearBtn.bind(null, this)],
    ]);

    // Views
    this.views = new Days(this);
    this.views.render();

    // If swipe mode
    if (this.options.mode === 'swipe') {
      this.views.days.style.transform = this.options.animationDirection === 'vertical'
        ? `translateY(-${Math.floor(this.options.grid / 2) * 100}%)`
        : `translateX(-${Math.floor(this.options.grid / 2) * 100}%)`;
    }

    // If default mode & grid > 1
    if (
      this.options.mode !== 'fade'
      && this.options.mode !== 'swipe'
      && this.options.grid > 1
    ) {
      this.views.days.style.transform = this.options.animationDirection === 'vertical'
        ? `translateY(-${Math.floor(this.options.grid / 2) * 100}%)`
        : `translateX(-${Math.floor(this.options.grid / 2) * 100}%)`;
    }

    // Gesture
    if (this.options.touchEvent) {
      onTouchGesture(this);
    }

    // Add Element
    this.main.appendChild(this.views.view);
    this.element.appendChild(container);
  }

  show () {
    if (this.active) {
      return;
    }

    this.container.classList.add('active');
    this.active = true;
  }

  getDate (format = undefined) {
    const { options, dates } = this;
    const { locale, range, multiple } = options;

    const callback = format
      ? (date: Date|number) => formatDate(date, format, locale)
      : (date: Date|number) => new Date(date);

    if (range || multiple) {
      return this.dates.map(callback);
    }

    if (dates.length > 0) {
      return callback(dates[0]);
    }
  }

  setDate (date: Date|number, opts: Options) {
    const { options, dates } = this;
    const { minDate, maxDate, locale, range, multiple } = options;

    const setDateOptions = { ...{ clear: false, render: true }, ...opts };

    if (setDateOptions.clear) {
      this.dates = [];
    } else {
      const newDate = isInRange(date instanceof Date ? date.getTime() : date, minDate, maxDate)
        ? parseDate(date, locale.format, locale)
        : null;

      if (!newDate) {
        return false;
      }

      if (range) {
        const max = Math.max.apply(null, dates);

        if (
          getTime(newDate) === getTime(today())
          && setDateOptions.today
        ) {
          this.dates = [ newDate, addDays(newDate, 1) ];
        } else if (!dates.length) {
          this.dates.push(newDate);
        } else if (dates.length === 2) {
          this.dates = [];
          this.dates.push(newDate);
        } else {
          if (
            newDate === dates[0]
            && options.isClickDayEqual
            && typeof options.isClickDayEqual === 'function'
          ) {
            options.isClickDayEqual(this);

            return false;
          }

          if (
            !options.rangeIncludeDisabled
            && options.disabledDate.length
          ) {
            const newArr = this.dates.concat([ newDate ]);
            const newMax = Math.max.apply(null, newArr);
            const newMin = Math.min.apply(null, newArr);

            let includeDisable = false;
            for (let i = 0; i < options.disabledDate.length; i++) {
              const disabledDate = getTime(options.disabledDate[i]);

              if (disabledDate < newMax && disabledDate > newMin) {
                includeDisable = true;

                break;
              }
            }

            if (includeDisable) {
              if (options.isClickIncludeDisabled && typeof options.isClickIncludeDisabled === 'function') {
                options.isClickIncludeDisabled(this);

                return false;
              }
            }
          }

          if (newDate > max) {
            this.dates.push(newDate);
          } else {
            this.dates.unshift(newDate);
          }
        }
      } else if (multiple) {
        const isInclude = this.dates.includes(newDate);

        if (isInclude) {
          if (
            !setDateOptions.today
            && dates.length === 1
            && newDate === dates[0]
            && options.isClickDayEqual
            && typeof options.isClickDayEqual === 'function'
          ) {
            options.isClickDayEqual(this);

            return false;
          }

          if (!setDateOptions.today) {
            this.dates = dates.filter((item) => {
              return item !== newDate;
            });
          }
        } else {
          if (
            typeof options.multipleMaximum === 'number'
            && (options.multipleMaximum === 0 || options.multipleMaximum > dates.length)
          ) {
            this.dates.push(newDate);
          } else {
            if (
              options.isClickMultipleMaximum
              && typeof options.isClickMultipleMaximum === 'function'
            ) {
              options.isClickMultipleMaximum(this);

              return false;
            }
          }
        }
      } else {
        if (
          !dates[0]
          || newDate !== dates[0]
          || (getTime(newDate) === getTime(today()) && setDateOptions.today)
        ) {
          this.dates = [ newDate ];
        } else {
          if (
            newDate === dates[0]
            && options.isClickDayEqual
            && typeof options.isClickDayEqual === 'function'
          ) {
            options.isClickDayEqual(this);

            return false;
          }

          this.dates = [];
        }
      }
    }

    this.views.updateSelected();
    this.views.refresh();
  }

  computeResetViewDate () {
    const { dates, options } = this;
    const { minDate, maxDate } = options;
    const viewDate = dates.length > 0 ? dates[0] : this.viewDate;

    return limitToRange(viewDate instanceof Date ? viewDate.getTime() : viewDate, minDate, maxDate);
  }

  private validateDate (value: Date|number, format: string, locale: Locale, originValue: Date|number) {
    const date = parseDate(value, format, locale);

    return date !== undefined ? date : originValue;
  }

  private renderSetting (datepick: this, options: Options) {
    // Set prev btn
    if (
      options.prevBtnText
      && typeof options.prevBtnText === 'string'
    ) {
      const prevBtn = datepick.controls.prevBtn;
      const prevBtnNode = parseHTML(options.prevBtnText);

      if (prevBtnNode.childNodes.length > 0) {
        const prev = prevBtnNode.childNodes;

        emptyChildNodes(prevBtn);

        prev.forEach((node) => {
          prevBtn.appendChild(node.cloneNode(true));
        });
      }
    }

    // Set next btn
    if (options.nextBtnText) {
      const nextBtn = datepick.controls.nextBtn;
      const nextBtnNode = parseHTML(options.nextBtnText);

      if (nextBtnNode.childNodes.length > 0) {
        const next = nextBtnNode.childNodes;

        emptyChildNodes(nextBtn);

        next.forEach((node) => {
          nextBtn.appendChild(node.cloneNode(true));
        });
      }
    }

    // Set today and clear btn text
    if (options.locale) {
      datepick.controls.todayBtn.textContent = options.locale.today;
      datepick.controls.clearBtn.textContent = options.locale.clear;
    }

    // Set today btn show or hide
    if (options.hideTodayBtn !== undefined) {
      if (!options.hideTodayBtn) {
        showElement(datepick.controls.todayBtn);
      } else {
        hideElement(datepick.controls.todayBtn);
      }
    }

    // Set clear btn show or hide
    if (options.hideClearBtn !== undefined) {
      if (!options.hideClearBtn) {
        showElement(datepick.controls.clearBtn);
      } else {
        hideElement(datepick.controls.clearBtn);
      }
    }

    // Set today btn disabeld
    if (
      Object.prototype.hasOwnProperty.call(options, 'minDate')
      || Object.prototype.hasOwnProperty.call(options, 'maxDate')
    ) {
      const { minDate, maxDate } = options;

      !isInRange(today(), minDate, maxDate)
        ? datepick.controls.todayBtn.setAttribute('disabled', '')
        : datepick.controls.todayBtn.removeAttribute('disabled');
    }
  }
}

export default Datepick;
