import { IDatepick } from '../../scripts/interface/datepick';
import { IOptions } from '../../scripts/interface/options';

import { today, dateValue, addDays, addMonths, dayOfTheWeekOf, getTime } from '../lib/date';
import { formatDate } from '../lib/format';
import { parser, eraser } from '../lib/dom';

import week from '../template/week';
import days from '../template/days';
import grid from '../template/grid';

export default class Days {
  public datepick: IDatepick;
  public view: HTMLElement;
  public week: HTMLElement;
  public days: HTMLElement;
  public grid: Array<HTMLElement>;

  public titleFormat: string;
  public title: string;

  public active: number;

  public year: number;
  public month: number;
  public first: number;
  public last: number;
  public start: number;
  public end: number;
  public renderFirst: number;
  public renderLast: number;

  public selected: Array<Date | number>;

  constructor (datepick: IDatepick) {
    this.datepick = datepick;
    this.setInit();
  }

  setInit (): void {
    const { datepick } = this;
    const { options } = datepick;

    const weekNode = parser(week(options));
    const daysNode = parser(days(options));

    this.view = parser('<div class="datepick-view"></div>').firstElementChild as HTMLElement;
    this.week = weekNode.firstElementChild as HTMLElement;
    this.days = daysNode.firstElementChild as HTMLElement;

    this.grid = [];
    for (let i = 0; i < datepick.options.grid; i++) {
      const node: any = daysNode.firstChild;
      this.grid.push(node.children[i]);
    }

    if (!datepick.options.hideWeek) {
      this.view.appendChild(weekNode);
    }

    this.view.appendChild(daysNode);

    this.setOptions(options);
    this.updateView();
    this.updateSelected();
  }

  setOptions (options: IOptions): void {
    let daysFormat = null;

    if (options.lang) {
      daysFormat = options.locale.dowFormat === 'D' ? options.locale.daysShort : options.locale.days;
      this.titleFormat = options.locale.titleFormat;
      this.title = formatDate(this.datepick.viewDate, options.locale.titleFormat, options.locale);
    }

    if (options.grid > 1) {
      this.active = Math.floor(options.grid / 2);
    }

    Array.from(this.week.children).forEach((el: any, index) => {
      const dow = index % 7;

      el.textContent = daysFormat[dow];
      el.className = 'dow';

      if (
        options.dowClass
      ) {
        el.className += ` ${options.dowClass}`;
      }
    });
  }

  updateView (): void {
    const { datepick, titleFormat } = this;

    const viewDate = new Date(datepick.viewDate);
    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();
    const firstOfMonth = dateValue(viewYear, viewMonth, 1);
    const start = dayOfTheWeekOf(firstOfMonth, 0);
    const gridNum = (datepick.options.grid - 1) / 2;

    this.year = viewDate.getFullYear();
    this.month = viewMonth + 1;
    this.first = firstOfMonth;
    this.last = dateValue(viewYear, viewMonth + 1, 0);
    this.start = start;
    this.end = addDays(start, 41);
    this.title = formatDate(viewDate, titleFormat, datepick.options.locale);
    this.renderFirst = addMonths(this.first, -gridNum);
    this.renderLast = addMonths(this.first, gridNum);

    this.updateControl(
      this.title,
      this.first,
      this.last,
      datepick.options.minDate,
      datepick.options.maxDate,
    );
  }

  updateSelected (): void {
    const { dates } = this.datepick;
    this.selected = dates instanceof Array
      ? dates.map((date) => { return getTime(date); })
      : [ getTime(dates) ];
  }

  updateControl (title: string, first: Date|number, last: Date|number, minDate: Date|number, maxDate: Date|number): void {
    this.setViewTitle(title);
    this.setPrevBtnDisabled(first <= minDate);
    this.setNextBtnDisabled(last >= maxDate);
  }

  updateActive (): void {
    if (this.datepick.options.grid > 1) {
      Array.prototype.forEach.call(this.grid, (item) => {
        item.classList.remove('active');
      });

      this.grid[this.active].classList.add('active');
    }
  }

  updateGrid (): void {
    this.grid = [];
    for (let i = 0; i < this.datepick.options.grid; i++) {
      this.grid.push(this.days.children[i] as HTMLElement);
    }
  }

  async render (): Promise<any> {
    const { datepick, title, first, last } = this;
    const { options } = datepick;

    if (
      options.beforeRender
      && typeof options.beforeRender === 'function'
    ) {
      await options.beforeRender(datepick);
    }

    this.updateControl(
      title,
      first,
      last,
      options.minDate,
      options.maxDate,
    );

    this.renderGrid();
    this.updateActive();

    if (
      options.afterRender
      && typeof options.afterRender === 'function'
    ) {
      await options.afterRender(datepick);
    }
  }

  renderToday (): void {
    eraser(this.days);

    let days = '';
    for (let i = 0; i < this.datepick.options.grid; i++) {
      days += grid(this.datepick.options, true);
    }

    this.days.appendChild(parser(days));
    this.datepick.viewDate = getTime(today());

    this.updateGrid();
    this.updateView();
    this.renderGrid();
    this.updateGrid();
    this.updateActive();
  }

  renderGrid (direction = null): void {
    let maximum: number;
    let minimum: number;

    const customDayElement = this.datepick.options.customDayElement && typeof this.datepick.options.customDayElement === 'function'
      ? this.datepick.options.customDayElement
      : null;

    const customInsertBeforeDay = this.datepick.options.customInsertBeforeDay && typeof this.datepick.options.customInsertBeforeDay === 'function'
      ? this.datepick.options.customInsertBeforeDay
      : null;

    const customInsertAfterDay = this.datepick.options.customInsertAfterDay && typeof this.datepick.options.customInsertAfterDay === 'function'
      ? this.datepick.options.customInsertAfterDay
      : null;

    const todayDate = this.datepick.options.highlightedToday
      ? getTime(this.datepick.options.today)
      : null;

    const disabledDate = this.datepick.options.disabledDate.map((date) => {
      return getTime(date);
    });

    const hoildayDate = this.datepick.options.holidayDate.map((date) => {
      return getTime(date);
    });

    const highlightedDate = this.datepick.options.highlightedDate.map((date) => {
      return getTime(date);
    });

    if (
      this.datepick.options.rangeDistanceDay
      && typeof this.datepick.options.rangeDistanceDay === 'number'
      && this.datepick.options.rangeDistanceDay > 0
      && this.datepick.dates.length === 1
    ) {
      maximum = addDays(this.datepick.dates[0], this.datepick.options.rangeDistanceDay);
      minimum = addDays(this.datepick.dates[0], -this.datepick.options.rangeDistanceDay);
    }

    let firstDate: Date;
    let firstDateTime: number;
    let viewYear: number;
    let viewMonth: number;
    let lastDate: number;
    let firstOfMonth: number;
    let startDate: number;

    if (direction) {
      let target: HTMLElement;
      const node = parser(grid(this.datepick.options, true));
      const amount = direction === 'next' ? 1 : -1;

      firstDate = new Date(addMonths(amount > 0 ? this.renderLast : this.renderFirst, amount));
      firstDateTime = getTime(firstDate);
      viewYear = firstDate.getFullYear();
      viewMonth = firstDate.getMonth();
      lastDate = dateValue(viewYear, viewMonth + 1, 0);
      firstOfMonth = dateValue(viewYear, viewMonth, 1);
      startDate = dayOfTheWeekOf(firstOfMonth, 0);

      if (direction === 'next') {
        this.days.appendChild(node);
        target = this.days.lastChild as HTMLElement;
      }

      if (direction === 'prev') {
        this.days.insertBefore(node, this.grid[0]);
        target = this.days.firstChild as HTMLElement;
      }

      target.dataset.date = `${firstDateTime}-${lastDate}`;
      this.datepick.viewDate = addMonths(this.datepick.viewDate, amount);

      this.updateGrid();
      this.renderCell(
        target,
        startDate,
        firstDate,
        lastDate,
        todayDate,
        disabledDate,
        hoildayDate,
        highlightedDate,
        minimum,
        maximum,
        customDayElement,
        customInsertBeforeDay,
        customInsertAfterDay,
        );

      if (direction === 'next') {
        this.days.removeChild(this.grid[0]);
      }

      if (direction === 'prev') {
        this.days.removeChild(this.days.children[this.datepick.options.grid]);
      }

      this.updateGrid();
      this.updateActive();
      this.updateView();
    } else {
      const gridNum = Math.floor(this.datepick.options.grid / 2);

      Array.prototype.forEach.call(this.grid, (target: HTMLElement, index: number) => {
        firstDate = new Date(addMonths(this.first, index - gridNum));
        firstDateTime = getTime(firstDate);
        viewYear = firstDate.getFullYear();
        viewMonth = firstDate.getMonth();
        lastDate = dateValue(viewYear, viewMonth + 1, 0);
        firstOfMonth = dateValue(viewYear, viewMonth, 1);
        startDate = dayOfTheWeekOf(firstOfMonth, 0);

        if (index === 0) {
          this.renderFirst = firstDateTime;
        } else if (index === this.grid.length - 1) {
          this.renderLast = firstDateTime;
        }

        target.dataset.date = `${firstDateTime}-${lastDate}`;

        this.renderCell(
          target,
          startDate,
          firstDate,
          lastDate,
          todayDate,
          disabledDate,
          hoildayDate,
          highlightedDate,
          minimum,
          maximum,
          customDayElement,
          customInsertBeforeDay,
          customInsertAfterDay,
        );
      });
    }
  }

  renderCell (
    grid: HTMLElement,
    startDate: Date|number,
    firstDate: Date|number,
    lastDate: Date|number,
    todayDate: Date|number,
    disabledDate: Array<Date|number>,
    hoildayDate: Array<Date|number>,
    highlightedDate: Array<Date|number>,
    minimum: number,
    maximum: number,
    customDayElement: (datepick: IDatepick, current: Date|number) => string,
    customInsertBeforeDay: (datepick: IDatepick, firstDate: Date|number) => string,
    customInsertAfterDay: (datepick: IDatepick, lastDate: Date|number) => string,
  ): void {
    for (let i = 0; i < grid.children.length; i++) {
      const current = addDays(startDate, i);
      const date = new Date(current);
      const element = grid.children[i] as HTMLElement;

      let className = 'datepick-cell day';

      if (
        this.datepick.options.dayClass
        && typeof this.datepick.options.dayClass === 'string'
      ) {
        className += ` ${this.datepick.options.dayClass}`;
      }

      if (
        i === 0
        && this.datepick.options.startDayClass
        && typeof this.datepick.options.startDayClass === 'string'
      ) {
        className += ` ${this.datepick.options.startDayClass}`;
      }

      if (
        i === (grid.children.length - 1)
        && this.datepick.options.endDayClass
        && typeof this.datepick.options.endDayClass === 'string'
      ) {
        className += ` ${this.datepick.options.endDayClass}`;
      }

      if (
        getTime(firstDate) === current
        && this.datepick.options.firstDayClass
        && typeof this.datepick.options.firstDayClass === 'string'
      ) {
        className += ` ${this.datepick.options.firstDayClass}`;
      }

      if (
        getTime(lastDate) === current
        && this.datepick.options.lastDayClass
        && typeof this.datepick.options.lastDayClass === 'string'
      ) {
        className += ` ${this.datepick.options.lastDayClass}`;
      }

      if (current < firstDate) {
        className += ' prev';
      } else if (current > lastDate) {
        className += ' next';
      }

      if (todayDate === current) {
        className += ' today';
      }

      if (
        current < this.datepick.options.minDate
        || current > this.datepick.options.maxDate
        || (maximum && current > maximum)
        || (minimum && current < minimum)
        || disabledDate.includes(current)
      ) {
        className += ' disabled';
      }

      if (
        i % 7 === 0
        && this.datepick.options.sundayClass
        && typeof this.datepick.options.sundayClass === 'string'
      ) {
        className += ` ${this.datepick.options.sundayClass}`;
      }

      if (
        i % 7 === 6
        && this.datepick.options.saturdayClass
        && typeof this.datepick.options.saturdayClass === 'string'
      ) {
        className += ` ${this.datepick.options.saturdayClass}`;
      }

      if (
        hoildayDate.includes(current)
        && this.datepick.options.holidayClass
        && typeof this.datepick.options.holidayClass === 'string'
      ) {
        className += ` ${this.datepick.options.holidayClass}`;
      }

      if (highlightedDate.includes(current)) {
        className += ' highlighted';
      }

      if (
        this.datepick.options.range
        && this.datepick.dates instanceof Array
        && this.datepick.dates.length > 1
      ) {
        const rangeStart = this.datepick.dates[0];
        const rangeEnd = this.datepick.dates[1];

        if (current > rangeStart && current < rangeEnd) {
          className += ' range';
        }

        if (current === rangeStart) {
          className += ' range-start';
        }

        if (current === rangeEnd) {
          className += ' range-end';
        }
      }

      if (this.selected.includes(current)) {
        className += ' selected';
      }

      if (
        !(this.datepick.options.hidePrevNextDate && current < firstDate)
        && !(this.datepick.options.hidePrevNextDate && current > lastDate)
      ) {
        customDayElement
          ? element.appendChild(parser(customDayElement(this.datepick, current)))
          : element.appendChild(parser(`<span class="date">${date.getDate()}</span>`));
      } else {
        className += ' hide';
      }

      element.dataset.date = `${current}`;
      element.className = className;
    }

    if (customInsertBeforeDay) {
      grid.insertBefore(parser(customInsertBeforeDay(this.datepick, firstDate)), grid.children[0]);
    }

    if (customInsertAfterDay) {
      grid.appendChild(parser(customInsertAfterDay(this.datepick, lastDate)));
    }
  }

  refresh (): void {
    this.refreshGrid();
  }

  refreshGrid (): void {
    let rangeStart = null;
    let rangeEnd = null;
    let maximum = null;
    let minimum = null;

    const { datepick, grid, selected } = this;

    const disabledDate = datepick.options.disabledDate.map((date) => {
      return getTime(date);
    });

    if (
      datepick.options.range
      && datepick.dates instanceof Array
      && datepick.dates.length > 1
    ) {
      rangeStart = datepick.dates[0];
      rangeEnd = datepick.dates[1];
    }

    for (let i = 0; i < grid.length; i++) {
      grid[i]
        .querySelectorAll('.disabled, .range, .range-start, .range-end, .selected')
        .forEach((element) => {
          element.classList.remove('disabled');
          element.classList.remove('range');
          element.classList.remove('range-start');
          element.classList.remove('range-end');
          element.classList.remove('selected');
        });

      for (let j = 0; j < grid[i].children.length; j++) {
        const element = grid[i].children[j] as HTMLElement;
        const current = Number(element.dataset.date);
        const classList = element.classList;

        if (
          datepick.options.rangeDistanceDay
          && typeof datepick.options.rangeDistanceDay === 'number'
          && datepick.options.rangeDistanceDay > 0
          && datepick.dates.length === 1
        ) {
          maximum = addDays(datepick.dates[0], datepick.options.rangeDistanceDay);
          minimum = addDays(datepick.dates[0], -datepick.options.rangeDistanceDay);
        }

        if (
          current < datepick.options.minDate
          || current > datepick.options.maxDate
          || (maximum && current > maximum)
          || (minimum && current < minimum)
          || disabledDate.includes(current)
        ) {
          classList.add('disabled');
        }

        if (current > rangeStart && current < rangeEnd) {
          classList.add('range');
        }

        if (current === rangeStart) {
          classList.add('range-start');
        }

        if (current === rangeEnd) {
          classList.add('range-end');
        }

        if (selected.includes(current)) {
          classList.add('selected');
        }
      }
    }
  }

  setViewTitle (title: string): void {
    this.datepick.controls.title.textContent = title;
  }

  setPrevBtnDisabled (disabled: boolean): void {
    disabled
      ? this.datepick.controls.prevBtn.setAttribute('disabled', '')
      : this.datepick.controls.prevBtn.removeAttribute('disabled');
  }

  setNextBtnDisabled (disabled: boolean): void {
    disabled
      ? this.datepick.controls.nextBtn.setAttribute('disabled', '')
      : this.datepick.controls.nextBtn.removeAttribute('disabled');
  }
}
