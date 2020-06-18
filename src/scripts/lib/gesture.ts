import Hammer from 'hammerjs';

import { IDatepick } from '../interface/datepick';

import { onClickPrevBtn, onClickNextBtn } from '../events/listeners';
import { swipePlace } from '../events/effects';

export function onTouchGesture (datepick: IDatepick): void {
  let hammer: Hammer;

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

    hammer.on('swipe', (event: any) => {
      if (
        datepick.views.view.classList.contains('effect')
        || datepick.views.view.classList.contains('loading')
      ) {
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
    hammer.on('pan', (event: any) => {
      if (
        datepick.views.view.classList.contains('effect')
        || datepick.views.view.classList.contains('loading')
      ) {
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

  if (
    (datepick.options.mode !== 'swipe' && datepick.options.mode !== 'fade')
    && datepick.options.grid === 1
  ) {
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

    hammer.on('swipe', (event: any) => {
      if (
        datepick.views.view.classList.contains('effect')
        || datepick.views.view.classList.contains('loading')
      ) {
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
}
