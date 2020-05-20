export function fade (datepick: any, direction: string|null): Promise<boolean> {
  return new Promise((resolve) => {
    const now = datepick.views.grid[datepick.views.active];

    const target = datepick.views.grid[
      direction === 'next'
        ? datepick.views.active + 1
        : datepick.views.active - 1
    ];

    now.style.transition = `opacity ${datepick.options.animationDuration}ms ${datepick.options.animationTiming}`;
    target.style.transition = `opacity ${datepick.options.animationDuration}ms ${datepick.options.animationTiming}`;

    now.style.opacity = 0;
    target.style.opacity = 1;

    setTimeout(() => {
      now.style.transition = '';
      target.style.transition = '';

      resolve(true);
    }, datepick.options.animationDuration);
  });
}

export function swipe (datepick: any, direction: string|null): Promise<boolean> {
  return new Promise((resolve) => {
    const calc = Math.floor(datepick.options.grid / 2) * 100;
    const init = Number(datepick.views.days.style.transform.replace(/[^\d.]/g, ''));
    const diff = calc - Math.abs(init - 100);

    datepick.views.days.style.transition = `transform ${datepick.options.animationDuration}ms ${datepick.options.animationTiming}`;
    datepick.views.days.style.transform = datepick.options.animationDirection === 'vertical'
      ? `translateY(${direction === 'next' ? -init - diff : -calc + 100 }%)`
      : `translateX(${direction === 'next' ? -init - diff : -calc + 100 }%)`;

    setTimeout(() => {
      datepick.views.days.style.transition = '';

      resolve(true);
    }, datepick.options.animationDuration);
  });
}

export function swipePlace (datepick: any): void {
  datepick.views.view.classList.add('effect');

  datepick.views.days.style.transition = `transform ${datepick.options.animationDuration}ms ${datepick.options.animationTiming}`;
  datepick.views.days.style.transform = datepick.options.animationDirection === 'vertical'
    ? `translateY(${-(datepick.options.grid - 1) / 2 * 100}%)`
    : `translateX(${-(datepick.options.grid - 1) / 2 * 100}%)`;

  setTimeout(() => {
    datepick.views.days.style.transition = '';
    datepick.views.view.classList.remove('effect');
  }, datepick.options.animationDuration);
}
