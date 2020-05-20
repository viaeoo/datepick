import { today } from '../lib/date';
import { findElementInEventPath } from '../lib/event';
import { fade, swipe } from './effects';

export function onClickTodayBtn (datepick: any): void {
  datepick.setDate(today(), {
    today: true,
  });

  if (new Date(datepick.viewDate).getMonth() !== new Date(today()).getMonth()) {
    datepick.views.renderToday();
  }
}

export function onClickClearBtn (datepick: any): void {
  datepick.setDate(null, {
    clear: true,
  });
}

export async function onClickPrevBtn (datepick: any, direct = false): Promise<boolean> {
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

export async function onClickNextBtn (datepick: any, direct = false): Promise<boolean> {
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

export async function onClickView (datepick: any, event: any): Promise<boolean> {
  if (
    datepick.views.view.classList.contains('effect')
    || datepick.views.view.classList.contains('loading')
    || datepick.views.view.classList.contains('panning')
  ) {
    return false;
  }

  // Set target
  const target = findElementInEventPath(event, '.datepick-cell');

  // Cancel if disabled
  if (
    !target
    || target.classList.contains('disabled')
    || target.classList.contains('hide')
    || target.dataset.date < datepick.options.minDate
    || target.dataset.date > datepick.options.maxDate
  ) {
    return false;
  }

  // Before Click event
  if (
    datepick.options.beforeClickDay
    && typeof datepick.options.beforeClickDay === 'function'
  ) {
    await datepick.options.beforeClickDay(datepick);
  }

  // Set date
  datepick.setDate(Number(target.dataset.date));

  // After Click event
  if (
    datepick.options.afterClickDay
    && typeof datepick.options.afterClickDay === 'function'
  ) {
    await datepick.options.afterClickDay(datepick, datepick.dates);
  }
}

export function onClickPicker (event: any): void {
  event.preventDefault();
  event.stopPropagation();
}
