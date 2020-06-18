import { IDatepick } from '../interface/datepick';

import { today, addMonths, dateValue } from '../lib/date';
import { findElementInEventPath } from '../lib/event';
import { debounceFn } from '../lib/utlis';
import { fade, swipe } from './effects';

export function onClickTodayBtn (datepick: IDatepick): void {
  datepick.setDate(today(), {
    today: true,
  });

  if (new Date(datepick.viewDate).getMonth() !== new Date(today()).getMonth()) {
    if (
      datepick.options.mode !== 'swipe'
      && datepick.options.mode !== 'fade'
      && datepick.options.grid > 1
    ) {
      datepick.views.view.classList.add('effect');

      const todayDate = new Date(today());
      const viewYear = todayDate.getFullYear();
      const viewMonth = todayDate.getMonth();
      const firstOfMonth = dateValue(viewYear, viewMonth, 1);
      const start = firstOfMonth;
      const last = dateValue(viewYear, viewMonth + 1, 0);

      const dataDate = start + '-' + last;
      const gridElement = datepick.views.days.querySelector('[data-date="'+ dataDate +'"]');

      let activeIndex = 0;
      [].forEach.call(datepick.views.grid, (element, index) => {
        if (element.dataset.date === dataDate) {
          activeIndex = index;
        }
      });

      if (datepick.options.animationDirection === 'vertical') {
        datepick.views.days.scrollTop = gridElement.offsetTop - datepick.views.days.offsetTop;
      } else {
        datepick.views.days.scrollLeft = gridElement.offsetLeft - datepick.views.days.offsetLeft;
      }

      datepick.views.active = activeIndex;
      datepick.views.updateActive();
      datepick.views.updateView({ scroll: true, viewDate: today() });

      setTimeout(() => {
        datepick.views.view.classList.remove('effect');
      }, 50);
    } else {
      datepick.views.renderToday();
    }
  }
}

export function onClickClearBtn (datepick: IDatepick): void {
  datepick.setDate(null, {
    clear: true,
  });
}

export async function onClickPrevBtn (datepick: IDatepick, direct = false): Promise<boolean> {
  if (
    datepick.views.view.classList.contains('effect')
    || datepick.views.view.classList.contains('loading')
    || datepick.views.first <= datepick.options.minDate
  ) {
    return false;
  }

  datepick.views.view.classList.add('effect');

  if (
    datepick.options.beforeEffect
    && typeof datepick.options.beforeEffect === 'function'
  ) {
    await datepick.options.beforeEffect(datepick, 'prev');
  }

  if (datepick.options.mode === 'fade') {
    await fade(datepick, 'prev');
  } else if (datepick.options.mode === 'swipe') {
    await swipe(datepick, 'prev');
  }

  datepick.views.renderGrid('prev');

  if (datepick.options.mode === 'swipe') {
    datepick.views.days.style.transform = datepick.options.animationDirection === 'vertical'
      ? `translateY(${-(datepick.options.grid - 1) / 2 * 100}%)`
      : `translateX(${-(datepick.options.grid - 1) / 2 * 100}%)`;
  }

  datepick.views.view.classList.remove('effect');

  if (
    direct
    && datepick.options.mode !== 'swipe'
    && datepick.options.mode !== 'fade'
    && datepick.options.grid > 1
    && datepick.options.touchEvent
  ) {
    const init = Math.floor(datepick.options.grid / 2) * 100;
    const transform = Number(datepick.views.days.style.transform.replace(/[^\d.]/g, ''));

    if (transform !== init) {
      datepick.views.days.style.transform = datepick.options.animationDirection === 'vertical'
        ? `translateY(${-init}%)`
        : `translateX(${-init}%)`;
    }
  }

  if (
    datepick.options.afterEffect
    && typeof datepick.options.afterEffect === 'function'
  ) {
    await datepick.options.afterEffect(datepick, 'prev');
  }
}

export async function onClickNextBtn (datepick: IDatepick, direct = false): Promise<boolean> {
  if (
    datepick.views.view.classList.contains('effect')
    || datepick.views.view.classList.contains('loading')
    || datepick.views.last >= datepick.options.maxDate
  ) {
    return false;
  }

  datepick.views.view.classList.add('effect');

  if (
    datepick.options.beforeEffect
    && typeof datepick.options.beforeEffect === 'function'
  ) {
    await datepick.options.beforeEffect(datepick, 'next');
  }

  if (datepick.options.mode === 'fade') {
    await fade(datepick, 'next');
  } else if (datepick.options.mode === 'swipe') {
    await swipe(datepick, 'next');
  }

  datepick.views.renderGrid('next');

  if (datepick.options.mode === 'swipe') {
    datepick.views.days.style.transform = datepick.options.animationDirection === 'vertical'
      ? `translateY(${-(datepick.options.grid - 1) / 2 * 100}%)`
      : `translateX(${-(datepick.options.grid - 1) / 2 * 100}%)`;
  }

  datepick.views.view.classList.remove('effect');

  if (
    direct
    && datepick.options.mode !== 'swipe'
    && datepick.options.mode !== 'fade'
    && datepick.options.grid > 1
    && datepick.options.touchEvent
  ) {
    const init = Math.floor(datepick.options.grid / 2) * 100;
    const transform = Number(datepick.views.days.style.transform.replace(/[^\d.]/g, ''));

    if (transform !== init) {
      datepick.views.days.style.transform = datepick.options.animationDirection === 'vertical'
        ? `translateY(${-init}%)`
        : `translateX(${-init}%)`;
    }
  }

  if (
    datepick.options.afterEffect
    && typeof datepick.options.afterEffect === 'function'
  ) {
    await datepick.options.afterEffect(datepick, 'next');
  }
}

export async function onClickView (datepick: IDatepick, event: Record<any, any>): Promise<boolean> {
  if (
    datepick.views.view.classList.contains('effect')
    || datepick.views.view.classList.contains('loading')
    || datepick.views.view.classList.contains('panning')
  ) {
    return false;
  }

  const target = findElementInEventPath(event, '.datepick-cell');

  if (
    !target
    || target.classList.contains('disabled')
    || target.classList.contains('hide')
    || Number(target.dataset.date) < datepick.options.minDate
    || Number(target.dataset.date) > datepick.options.maxDate
  ) {
    return false;
  }

  if (
    datepick.options.beforeClickDay
    && typeof datepick.options.beforeClickDay === 'function'
  ) {
    await datepick.options.beforeClickDay(datepick);
  }

  datepick.setDate(Number(target.dataset.date));

  if (
    datepick.options.afterClickDay
    && typeof datepick.options.afterClickDay === 'function'
  ) {
    await datepick.options.afterClickDay(datepick, datepick.dates);
  }
}


let prevScrollAmount = null;
export function onScrollView (datepicker: IDatepick, event: Record<any, any>): boolean {
  if (
    datepicker.views.view.classList.contains('effect')
    || datepicker.views.view.classList.contains('loading')
    || datepicker.views.view.classList.contains('panning')
  ) {
    return false;
  }

  const animationDirection = datepicker.options.animationDirection;

  const scrollAmount = animationDirection === 'vertical'
    ? event.target.scrollTop
    : event.target.scrollLeft;

  const gridLength = datepicker.views.grid.length;

  const startPoint = animationDirection === 'vertical'
    ? datepicker.views.grid[datepicker.views.active].offsetTop - datepicker.views.days.offsetTop
    : datepicker.views.grid[datepicker.views.active].offsetLeft - datepicker.views.days.offsetLeft;

  const diff = datepicker.views.scroll.diff;

  const nextGrid = animationDirection === 'vertical'
    ? scrollAmount + datepicker.views.days.clientHeight > datepicker.views.days.scrollHeight - diff
    : scrollAmount + datepicker.views.days.clientWidth > datepicker.views.days.scrollWidth - diff;

  let scrollDirection = null;
  if (prevScrollAmount < scrollAmount) {
    scrollDirection = 'next';
  } else if (prevScrollAmount > scrollAmount) {
    scrollDirection = 'prev';
  }

  prevScrollAmount = scrollAmount;

  if (
    nextGrid
    && addMonths(datepicker.views.renderLast, 1) <= datepicker.options.maxDate
  ) {
    debounceFn(() => {
      datepicker.views.renderGrid('next', true);

      datepicker.views.renderLast = addMonths(datepicker.views.renderLast, 1);
    }, 10);
  } else if (
    scrollAmount < diff
    && addMonths(datepicker.views.renderFirst, -1) >= datepicker.options.minDate
  ) {
    debounceFn(() => {
      datepicker.views.renderGrid('prev', true);
      datepicker.views.renderFirst = addMonths(datepicker.views.renderFirst, -1);
      datepicker.views.active += 1;

      if (animationDirection === 'vertical') {
        datepicker.views.days.scrollTop = datepicker.views.grid[datepicker.views.active].offsetTop - datepicker.views.days.offsetTop;
      } else {
        datepicker.views.days.scrollLeft = datepicker.views.grid[datepicker.views.active].offsetLeft - datepicker.views.days.offsetLeft;
      }
    }, 10);
  }

  if (
    scrollAmount < startPoint - diff
    && scrollDirection === 'prev'
  ) {
    datepicker.views.active = datepicker.views.active > 0
      ? datepicker.views.active - 1
      : 0;

    datepicker.views.updateActive();
    datepicker.views.updateView({ scroll: true, direction: 'prev' });
  } else if (
    scrollAmount >= startPoint + diff
    && scrollDirection === 'next'
  ) {
    datepicker.views.active = datepicker.views.active < gridLength - 1
      ? datepicker.views.active + 1
      : gridLength - 1;

    datepicker.views.updateActive();
    datepicker.views.updateView({ scroll: true, direction: 'next' });
  }
}

export function onClickPicker (event: Record<any, any>): void {
  event.preventDefault();
  event.stopPropagation();
}
