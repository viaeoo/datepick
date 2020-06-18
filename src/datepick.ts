import './datepick.scss';

import { IOptions } from './scripts/interface/options';

import defaultOption from './scripts/options/default';

import { parser, show, hide } from './scripts/lib/dom';
import { getTime, today, addDays, dateValue } from './scripts/lib/date';
import { limitToRange, isInRange, deepCopy } from './scripts/lib/utlis';
import { registerListeners } from './scripts/lib/event';
import { parseDate } from './scripts/lib/format';
import { onTouchGesture } from './scripts/lib/gesture';

import locale from './scripts/lang/locale';

import * as listeners from './scripts/events/listeners';

import wrapper from './scripts/template/wrapper';

import Days from './scripts/views/days';

class Datepick {
  public element: HTMLElement;
  public options: IOptions;

  public dates: Array<Date|number>;
  public viewDate: Date|number;

  public container: HTMLElement;
  public main: HTMLElement;
  public controls: Record<string, HTMLElement>;
  public views: any;

  public active: boolean;

  constructor (
    element: HTMLElement,
    options: IOptions,
  ) {
    this.element = element;
    this.options = deepCopy({
      ...defaultOption,
      ...options,
    });

    this.dates = [];

    this.setInit();
    this.setRender();
    this.render(wrapper(this.options));
    this.show();
  }

  setInit (): void {
    if (
      this.options.today
      || !(this.options.today instanceof Date)
    ) {
      this.options.today = today();
    }

    if (
      this.options.locale
      && Object.keys(this.options.locale).length
    ) {
      this.options.locale = deepCopy({
        ...locale[this.options.lang],
        ...this.options.locale,
      });
    } else {
      this.options.locale = deepCopy(locale[this.options.lang]);
    }

    if (
      this.options.initialDate
      && this.options.initialDate instanceof Array
    ) {
      if (
        this.options.initialDate.length === 0
      ) {
        this.options.initialDate.push(today());
      }

      if (
        this.options.range
      ) {
        this.dates = [
          getTime(this.options.initialDate[0]),
          addDays(getTime(this.options.initialDate[0]), 1),
        ];
      } else if (
        this.options.multiple
      ) {
        this.dates = this.options.multipleMaximum !== 0
          ? this.options.initialDate.slice(0, this.options.multipleMaximum).map((date: Date|number) => {
            return getTime(date);
          })
          : this.options.initialDate.map((date: Date|number) => { return getTime(date); });
      } else {
        this.dates.push(this.options.initialDate[0]);
      }
    } else {
      throw new Error('InitialDate type is Array<Date|number>');
    }

    if (
      this.options.grid
      && typeof this.options.grid === 'number'
      && this.options.grid !== 1
    ) {
      if (this.options.grid % 2 !== 1) {
        throw new Error('Grid options are odd only');
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

    this.viewDate = this.options.initialDate[0];

    let minDt: Date|number;
    let maxDt: Date|number;

    if (this.options.minDate !== undefined) {
      minDt = this.options.minDate === null
        ? dateValue(0, 0, 1)
        : parseDate(this.options.minDate, this.options.locale);

      delete this.options.minDate;
    }

    if (this.options.maxDate !== undefined) {
      maxDt = this.options.maxDate === null
        ? dateValue(9999, 11, 31)
        : parseDate(this.options.maxDate, this.options.locale);

      delete this.options.maxDate;
    }

    if (maxDt < minDt) {
      this.options.minDate = maxDt;
      this.options.maxDate = minDt;
    } else {
      if (this.options.minDate !== minDt) {
        this.options.minDate = minDt;
      }

      if (this.options.maxDate !== maxDt) {
        this.options.maxDate = maxDt;
      }
    }
  }

  setRender (): void {
    if (
      this.options.prevBtnText
      && typeof this.options.prevBtnText === 'string'
    ) {
      const prevBtn = this.controls.prevBtn;
      const prevBtnNode = parser(this.options.prevBtnText);

      if (prevBtnNode.childNodes.length > 0) {
        prevBtn.appendChild(prevBtnNode);
      }
    }

    if (
      this.options.nextBtnText
      && typeof this.options.nextBtnText === 'string'
    ) {
      const nextBtn = this.controls.nextBtn;
      const nextBtnNode = parser(this.options.nextBtnText);

      if (nextBtnNode.childNodes.length > 0) {
        nextBtn.appendChild(nextBtnNode);
      }
    }

    if (this.options.locale) {
      this.controls.todayBtn.textContent = this.options.locale.today;
      this.controls.clearBtn.textContent = this.options.locale.clear;
    }

    if (!this.options.hideTodayBtn) {
      show(this.controls.todayBtn);
    } else {
      hide(this.controls.todayBtn);
    }

    if (!this.options.hideClearBtn) {
      show(this.controls.clearBtn);
    } else {
      hide(this.controls.clearBtn);
    }

    const { minDate, maxDate } = this.options;
    isInRange(today(), minDate, maxDate)
      ? this.controls.todayBtn.removeAttribute('disabled')
      : this.controls.todayBtn.setAttribute('disabled', '');
  }

  render (wrapper: string): void {
    const container = parser(wrapper).firstElementChild as HTMLElement;
    const [ header, main, footer ] = Array.from(container.children) as HTMLElement[];
    const [ prevBtn, title, nextBtn ] = Array.from(header.lastElementChild.children) as HTMLElement[];
    const [ todayBtn, clearBtn ] = Array.from(footer.firstElementChild.children) as HTMLElement[];
    const controls = { prevBtn, title, nextBtn, todayBtn, clearBtn };

    this.container = container;
    this.main = main;
    this.controls = controls;

    const eventList = [];
    let containerClass = '';

    if (
      this.options.containerClass
      && typeof this.options.containerClass === 'string'
    ) {
      containerClass += ` ${this.options.containerClass}`;
    }

    if (
      this.options.mode
      && typeof this.options.mode === 'string'
      && (this.options.mode === 'swipe' || this.options.mode === 'fade')
    ) {
      containerClass += ` ${this.options.mode}`;
    }

    if (
      this.options.animationDirection
      && typeof this.options.animationDirection === 'string'
    ) {
      containerClass += ` ${this.options.animationDirection}`;
    }

    container.classList.add(containerClass);

    this.viewDate = this.computeResetViewDate();

    eventList.push(
      [container, 'click', listeners.onClickPicker.bind(this)],
      [main, 'click', listeners.onClickView.bind(null, this)],
    );

    if (!this.options.hidePrevNextBtn) {
      eventList.push(
        [controls.prevBtn, 'click', listeners.onClickPrevBtn.bind(null, this, true)],
        [controls.nextBtn, 'click', listeners.onClickNextBtn.bind(null, this, true)],
      );
    }

    if (!this.options.hideTodayBtn) {
      eventList.push([controls.todayBtn, 'click', listeners.onClickTodayBtn.bind(null, this)]);
    }

    if (!this.options.hideClearBtn) {
      eventList.push([controls.clearBtn, 'click', listeners.onClickClearBtn.bind(null, this)]);
    }

    this.views = new Days(this);
    this.views.render();

    if (this.options.mode === 'swipe') {
      this.views.days.style.transform = this.options.animationDirection === 'vertical'
        ? `translateY(-${Math.floor(this.options.grid / 2) * 100}%)`
        : `translateX(-${Math.floor(this.options.grid / 2) * 100}%)`;
    }

    if (this.options.touchEvent) {
      onTouchGesture(this);
    }

    this.main.appendChild(this.views.view);
    this.element.appendChild(container);

    if (
      this.options.mode !== 'fade'
      && this.options.mode !== 'swipe'
      && this.options.grid > 1
    ) {
      if (this.options.animationDirection === 'vertical') {
        this.views.days.style.overflowY = 'auto';

        this.views.scroll = {
          init: this.views.grid[this.views.active].offsetTop - this.views.days.offsetTop,
          diff: Math.floor(this.views.days.clientHeight / 4),
        };

        this.views.days.scrollTop = this.views.scroll.init;
      } else {
        this.views.days.style.overflowX = 'auto';

        this.views.scroll = {
          init: this.views.grid[this.views.active].offsetLeft - this.views.days.offsetLeft,
          diff: Math.floor(this.views.days.clientHeight / 4),
        };

        this.views.days.scrollLeft = this.views.scroll.init;
      }

      eventList.push(
        [this.views.days, 'scroll', listeners.onScrollView.bind(null, this)],
      );
    }

    registerListeners(this, eventList);
  }

  show (): void {
    if (this.active) {
      return;
    }

    this.container.classList.add('active');
    this.active = true;
  }

  hide (): void {
    if (!this.active) {
      return;
    }

    this.container.classList.remove('active');
    this.active = false;
  }

  getDate (): Array<Date|number> {
    return this.dates;
  }

  setDate (date: Date|number, opts?: Record<any, boolean>): boolean {
    const { options, dates } = this;
    const { minDate, maxDate, locale, range, multiple } = options;

    const setDateOptions = {
      ...{
        clear: false,
        today: false,
        render: true,
      },
      ...opts,
    };

    if (setDateOptions.clear) {
      this.dates = [];
    } else {
      const newDate = isInRange(date instanceof Date ? date.getTime() : date, minDate, maxDate)
        ? parseDate(date, locale)
        : null;

      if (!newDate) {
        return false;
      }

      if (range) {
        const max = Math.max.apply(null, dates);

        if (
          newDate === today()
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
              if (
                options.isClickIncludeDisabled &&
                typeof options.isClickIncludeDisabled === 'function'
              ) {
                options.isClickIncludeDisabled(this);

                return false;
              }
            }
          }

          if (
            newDate === dates[0]
            && this.options.rangeEqualDateDelete
          ) {
            dates.pop();
          } else {
            if (newDate > max) {
              this.dates.push(newDate);
            } else {
              this.dates.unshift(newDate);
            }
          }
        }
      } else if (multiple) {
        const isInclude = this.dates.includes(newDate);

        if (isInclude) {
          if (
            !setDateOptions.today
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
          || (newDate === today() && setDateOptions.today)
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

  computeResetViewDate (): number {
    const { dates, options } = this;
    const { minDate, maxDate } = options;
    const viewDate = dates.length > 0 ? dates[0] : this.viewDate;

    return limitToRange(viewDate instanceof Date ? viewDate.getTime() : viewDate, minDate, maxDate);
  }
}

export default Datepick;
