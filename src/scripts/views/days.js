// Lib
import { today, dateValue, addDays, addMonths, dayOfTheWeekOf, getTime } from '../lib/date';
import { formatDate } from '../lib/format';
import { parseHTML, emptyChildNodes } from '../lib/dom';

// Templates
import week from '../template/week';
import days from '../template/days';
import grid from '../template/grid';

// Extends
import View from './view.js';

export default class Days extends View {
  constructor (datepick) {
    super(datepick);
  }

  setInit (opts) {
    const { datepick } = this;
    const { options } = datepick;

    const weekNode = parseHTML(week(options));
    const daysNode = parseHTML(days(options));

    this.week = weekNode.firstChild;
    this.days = daysNode.firstChild;

    this.grid = [];
    for (let i = 0; i < datepick.options.grid; i++) {
      this.grid.push(daysNode.firstChild.children[i]);
    }

    if (!datepick.options.hideWeek) {
      this.view.appendChild(weekNode);
    }

    this.view.appendChild(daysNode);

    super.setInit(opts);
  }

  setOptions (options) {
    let days = null;

    if (options.lang) {
      days = options.locale.days;
      this.titleFormat = options.locale.titleFormat;
      this.title = formatDate(this.datepick.viewDate, options.locale.titleFormat, options.locale);
    }

    if (options.grid > 1) {
      this.active = parseInt(options.grid / 2);
    }

    Array.from(this.week.children).forEach((el, index) => {
      const dow = index % 7;
      el.textContent = days[dow];
      el.className = 'dow';

      if (options.dowClass) {
        el.className += ` ${options.dowClass}`;
      }
    });
  }

  updateView () {
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
    this.title = formatDate(viewDate, titleFormat, datepick.options.lang);
    this.renderFirst = addMonths(this.first, -gridNum);
    this.renderLast = addMonths(this.first, gridNum);

    this.updateControl({ title: this.title, first: this.first, last: this.last, minDate: datepick.options.minDate, maxDate: datepick.options.maxDate});
  }

  updateSelected () {
    const { dates } = this.datepick;
    this.selected = dates instanceof Array
      ? dates.map((date) => { return getTime(date); })
      : getTime(dates);
  }

  updateControl ({ title, first, last, minDate, maxDate }) {
    this.setViewTitle(title);
    this.setPrevBtnDisabled(first <= minDate);
    this.setNextBtnDisabled(last >= maxDate);
  }

  updateActive () {
    if (this.datepick.options.grid > 1) {
      Array.prototype.forEach.call(this.grid, (item) => {
        item.classList.remove('active');
      });
      this.grid[this.active].classList.add('active');
    }
  }

  updateGrid () {
    this.grid = [];
    for (let i = 0; i < this.datepick.options.grid; i++) {
      this.grid.push(this.days.children[i]);
    }
  }

  async render () {
    const { datepick, title, first, last } = this;
    const { options, renderDirection } = datepick;

    if (options.beforeRender && typeof options.beforeRender === 'function') {
      await options.beforeRender(datepick, renderDirection || null);
    }

    this.updateControl({ title, first, last, minDate: options.minDate, maxDate: options.maxDate });
    this.renderGrid(renderDirection);
    this.updateActive();

    if (options.afterRender && typeof options.afterRender === 'function') {
      await options.afterRender(datepick, renderDirection || null);
    }
  }

  renderToday () {
    emptyChildNodes(this.days);

    let days = '';
    for (let i = 0; i < this.datepick.options.grid; i++) {
      days += grid(this.datepick.options, true);
    }

    this.days.appendChild(parseHTML(days));
    this.datepick.viewDate = getTime(today());

    this.updateGrid();
    this.updateView();
    this.renderGrid();
    this.updateGrid();
    this.updateActive();
  }

  renderGrid (direction) {
    let maximum = null;
    let minimum = null;

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

    if (this.datepick.options.rangeDistanceDay && typeof this.datepick.options.rangeDistanceDay === 'number' && this.datepick.options.rangeDistanceDay > 0 && this.datepick.dates.length === 1) {
      maximum = addDays(this.datepick.dates[0], this.datepick.options.rangeDistanceDay);
      minimum = addDays(this.datepick.dates[0], -this.datepick.options.rangeDistanceDay);
    }

    let firstDate;
    let firstDateTime;
    let viewYear;
    let viewMonth;
    let lastDate;
    let firstOfMonth;
    let startDate;

    if (direction) {
      let target;
      const node = parseHTML(grid(this.datepick.options, true));
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
        target = this.days.lastChild;
      }

      if (direction === 'prev') {
        this.days.insertBefore(node, this.grid[0]);
        target = this.days.firstChild;
      }

      target.dataset.date = `${firstDateTime}-${lastDate}`;
      this.datepick.viewDate = addMonths(this.datepick.viewDate, amount);

      this.updateGrid();
      this.renderCell(target, { startDate, firstDate, lastDate, todayDate, disabledDate, hoildayDate, highlightedDate, minimum, maximum, customDayElement, customInsertBeforeDay, customInsertAfterDay });

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
      const gridNum = parseInt(this.datepick.options.grid / 2);
      Array.prototype.forEach.call(this.grid, (target, index) => {
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

        this.renderCell(target, { startDate, firstDate, lastDate, todayDate, disabledDate, hoildayDate, highlightedDate, minimum, maximum, customDayElement, customInsertBeforeDay, customInsertAfterDay });
      });
    }
  }

  renderCell (grid, { startDate, firstDate, lastDate, todayDate, disabledDate, hoildayDate, highlightedDate, minimum, maximum, customDayElement, customInsertBeforeDay, customInsertAfterDay }) {
    Array.from(grid.children).forEach((ele, ind) => {
      const current = addDays(startDate, ind);
      const date = new Date(current);

      ele.className = 'datepick-cell day';
      ele.dataset.date = current;

      emptyChildNodes(ele);

      if (this.datepick.options.dayClass && typeof this.datepick.options.dayClass === 'string') {
        ele.className += ` ${this.datepick.options.dayClass}`;
      }

      if (ind === 0 && this.datepick.options.startDayClass && typeof this.datepick.options.startDayClass === 'string') {
        ele.className += ` ${this.datepick.options.startDayClass}`;
      }

      if (ind === (grid.children.length - 1) && this.datepick.options.endDayClass && typeof this.datepick.options.endDayClass === 'string') {
        ele.className += ` ${this.datepick.options.endDayClass}`;
      }

      if (getTime(firstDate) === current && this.datepick.options.firstDayClass && typeof this.datepick.options.firstDayClass === 'string') {
        ele.className += ` ${this.datepick.options.firstDayClass}`;
      }

      if (getTime(lastDate) === current && this.datepick.options.lastDayClass && typeof this.datepick.options.lastDayClass === 'string') {
        ele.className += ` ${this.datepick.options.lastDayClass}`;
      }

      if (current < firstDate) {
        ele.className += ' prev';
      } else if (current > lastDate) {
        ele.className += ' next';
      }

      if (todayDate === current) {
        ele.className += ' today';
      }

      if (current < this.datepick.options.minDate || current > this.datepick.options.maxDate || (maximum && current > maximum) || (minimum && current < minimum) || disabledDate.includes(current)) {
        ele.className += ' disabled';
      }

      if (ind % 7 === 0 && this.datepick.options.sundayClass && typeof this.datepick.options.sundayClass === 'string') {
        ele.className += ` ${this.datepick.options.sundayClass}`;
      }

      if (ind % 7 === 6 && this.datepick.options.saturdayClass && typeof this.datepick.options.saturdayClass === 'string') {
        ele.className += ` ${this.datepick.options.saturdayClass}`;
      }

      if (hoildayDate.includes(current) && this.datepick.options.holidayClass && typeof this.datepick.options.holidayClass === 'string') {
        ele.className += ` ${this.datepick.options.holidayClass}`;
      }

      if (highlightedDate.includes(current)) {
        ele.className += ' highlighted';
      }

      if (this.datepick.options.range && this.datepick.dates instanceof Array && this.datepick.dates.length > 1) {
        const rangeStart = this.datepick.dates[0];
        const rangeEnd = this.datepick.dates[1];

        if (current > rangeStart && current < rangeEnd) {
          ele.className += ' range';
        }

        if (current === rangeStart) {
          ele.className += ' range-start';
        }

        if (current === rangeEnd) {
          ele.className += ' range-end';
        }
      }

      if (this.selected.includes(current)) {
        ele.className += ' selected';
      }

      if (!(this.datepick.options.hidePrevNextDate && current < firstDate) && !(this.datepick.options.hidePrevNextDate && current > lastDate)) {
        customDayElement
          ? ele.appendChild(parseHTML(customDayElement(this.datepick, current)))
          : ele.appendChild(parseHTML(`<span class="date">${date.getDate()}</span>`));
      } else {
        ele.classList.add('hide');
      }
    });

    if (customInsertBeforeDay) {
      grid.insertBefore(parseHTML(customInsertBeforeDay(this.datepick, getTime(firstDate))), grid.children[0]);
    }

    if (customInsertAfterDay) {
      grid.appendChild(parseHTML(customInsertAfterDay(this.datepick, lastDate)));
    }
  }

  refresh () {
    this.refreshGrid();
  }

  refreshGrid () {
    let rangeStart = null;
    let rangeEnd = null;

    const { datepick, grid, selected } = this;

    const disabledDate = datepick.options.disabledDate.map((date) => {
      return getTime(date);
    });

    if (datepick.options.range && datepick.dates instanceof Array && datepick.dates.length > 1) {
      rangeStart = datepick.dates[0];
      rangeEnd = datepick.dates[1];
    }

    grid.forEach((target) => {
      target
        .querySelectorAll('.disabled, .range, .range-start, .range-end, .selected')
        .forEach((ele) => {
          ele.classList.remove('disabled', 'range', 'range-start', 'range-end', 'selected');
        });

      Array.from(target.children).forEach((ele) => {
        let maximum = null;
        let minimum = null;

        const current = Number(ele.dataset.date);
        const classList = ele.classList;

        if (datepick.options.rangeDistanceDay && typeof datepick.options.rangeDistanceDay === 'number' && datepick.options.rangeDistanceDay > 0 && datepick.dates.length === 1) {
          maximum = addDays(datepick.dates[0], datepick.options.rangeDistanceDay);
          minimum = addDays(datepick.dates[0], -datepick.options.rangeDistanceDay);
        }

        if (current < datepick.options.minDate || current > datepick.options.maxDate || (maximum && current > maximum) || (minimum && current < minimum) || disabledDate.includes(current)) {
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
      });
    });
  }
}
