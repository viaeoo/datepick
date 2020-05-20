import Hammer from 'hammerjs';

import { onClickPrevBtn, onClickNextBtn } from '../events/listeners';
import { swipePlace } from '../events/effects';

export function onTouchGesture (datepick) {
  let hammer;

  // Fade mode
  if (datepick.options.mode === 'fade') {
    hammer = new Hammer(datepick.views.days, {
      recognizers: [
        [Hammer.Swipe, {
          velocity: 0.3,
          direction: datepick.options.animationDirection === 'vertical'
            ? Hammer.DIRECTION_VERTICAL
            : Hammer.DIRECTION_HORIZONTAL,
        }],
      ],
    });

    hammer.on('swipe', (event) => {
      if (datepick.views.view.classList.contains('effect') || datepick.views.view.classList.contains('loading')) {
        return false;
      }

      const percent = datepick.options.animationDirection === 'vertical'
        ? Number((event.deltaY / datepick.container.offsetWidth) * 100)
        : Number((event.deltaX / datepick.container.offsetWidth) * 100);

      if (percent > 5) {
        onClickPrevBtn(datepick);
      } else if (percent < -5) {
        onClickNextBtn(datepick);
      }
    });
  }

  // Swipe mode
  if (datepick.options.mode === 'swipe') {
    hammer = new Hammer(datepick.views.days, {
      recognizers: [
        [Hammer.Pan, {
          pointers: 1,
          threshold: 0,
          direction: Hammer.DIRECTION_ALL,
        }],
      ],
    });

    let init = null;
    hammer.on('pan', (event) => {
      if (datepick.views.view.classList.contains('effect') || datepick.views.view.classList.contains('loading')) {
        return false;
      }

      if (!datepick.views.view.classList.contains('panning')) {
        datepick.views.view.classList.add('panning');
      }

      if (!init) {
        init = -Number(datepick.views.days.style.transform.replace(/[^\d.]/g, ''));
      }

      const percent = datepick.options.animationDirection === 'vertical'
        ? Number((event.deltaY / datepick.container.offsetWidth) * 100)
        : Number((event.deltaX / datepick.container.offsetWidth) * 100);

      const calculated = init + percent;

      datepick.options.animationDirection === 'vertical'
        ? datepick.views.days.style.transform = `translateY(${calculated}%)`
        : datepick.views.days.style.transform = `translateX(${calculated}%)`;

      if (event.isFinal) {
        if (percent < -20 && datepick.views.last >= datepick.options.maxDate) {
          swipePlace(datepick);
        }

        if (percent > 20 && datepick.views.first <= datepick.options.minDate) {
          swipePlace(datepick);
        }

        if (percent > 20) {
          onClickPrevBtn(datepick);
        } else if (percent < -20) {
          onClickNextBtn(datepick);
        } else {
          swipePlace(datepick);
        }

        init = null;
        datepick.views.view.classList.remove('panning');
      }
    });
  }

  // Default Animation (Touch)
  if ((datepick.options.mode !== 'swipe' && datepick.options.mode !== 'fade') && datepick.options.grid === 1) {
    hammer = new Hammer(datepick.views.days, {
      recognizers: [
        [Hammer.Swipe, {
          velocity: 0.3,
          direction: datepick.options.animationDirection === 'vertical'
            ? Hammer.DIRECTION_VERTICAL
            : Hammer.DIRECTION_HORIZONTAL,
        }],
      ],
    });

    hammer.on('swipe', (event) => {
      if (datepick.views.view.classList.contains('effect') || datepick.views.view.classList.contains('loading')) {
        return false;
      }

      const percent = datepick.options.animationDirection === 'vertical'
        ? Number((event.deltaY / datepick.container.offsetWidth) * 100)
        : Number((event.deltaX / datepick.container.offsetWidth) * 100);

      if (percent > 5) {
        onClickPrevBtn(datepick);
      } else if (percent < -5) {
        onClickNextBtn(datepick);
      }
    });
  }

  // Default Animation (Scroll)
  if ((datepick.options.mode !== 'swipe' && datepick.options.mode !== 'fade') && datepick.options.grid > 1) {
    hammer = new Hammer(datepick.views.days, {
      recognizers: [
        [Hammer.Pan, {
          pointers: 0,
          threshold: 0,
          direction: Hammer.DIRECTION_ALL,
        }],
      ],
    });

    let grid = Math.round(datepick.options.grid / 2) * -100;
    let init = null;

    let last = false;
    let first = false;

    hammer.on('pan', (event) => {
      if (datepick.views.view.classList.contains('effect') || datepick.views.view.classList.contains('loading')) {
        return false;
      }

      if (!datepick.views.view.classList.contains('panning')) {
        datepick.views.view.classList.add('panning');
      }

      if (!init) {
        init = -Number(datepick.views.days.style.transform.replace(/[^\d.]/g, ''));
      }

      const percent = datepick.options.animationDirection === 'vertical'
        ? Number((event.deltaY / datepick.container.offsetWidth) * 100)
        : Number((event.deltaX / datepick.container.offsetWidth) * 100);

      let calculated = init + percent;

      if (calculated < grid - 70) {
        if (!last) {
          last = true;
          onClickNextBtn(datepick);
        }

        calculated = calculated + 100;
      }

      if (calculated > grid + 70) {
        if (!first) {
          first = true;
          onClickPrevBtn(datepick);
        }

        calculated = calculated - 100;
      }

      if (calculated <= 0 && calculated >= grid - 100) {
        datepick.views.days.style.transform = datepick.options.animationDirection === 'vertical'
          ? `translateY(${calculated}%)`
          : `translateX(${calculated}%)`;
      }

      if (event.isFinal) {
        init = null;
        first = false;
        last = false;

        const delta = datepick.options.animationDirection === 'vertical'
          ? event.deltaY
          : event.deltaX;

        if ((delta > 0 && datepick.views.first <= datepick.options.minDate) || (delta < 0 && datepick.views.last >= datepick.options.maxDate)) {
          datepick.views.days.style.transform = datepick.options.animationDirection === 'vertical'
            ? `translateY(${grid}%)`
            : `translateX(${grid}%)`;
        }

        datepick.views.view.classList.remove('panning');
      }
    });
  }
}
