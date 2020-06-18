import { ILocale } from './locale';
import { IDatepick } from './datepick';

export interface IOptions {
  grid: number;
  today: null|Date|number;
  nextBtnText: string;
  prevBtnText: string;

  mode: string;
  animationTiming: string;
  animationDuration: number;
  animationDirection: string;

  range: boolean;
  rangeIncludeDisabled: boolean;
  rangeDistanceDay: number;
  rangeEqualDateDelete: boolean;

  multiple: boolean;
  multipleMaximum: number;

  lang: string;
  locale: null|ILocale;

  minDate: null|Date|number;
  maxDate: null|Date|number;

  initialDate: Array<Date|number>;

  touchEvent: boolean;

  highlightedDate: Array<Date|number>;
  highlightedToday: boolean;

  hideTodayBtn: boolean;
  hideClearBtn: boolean;
  hidePrevNextDate: boolean;
  hidePrevNextBtn: boolean;
  hideWeek: boolean;

  disabledDate: Array<Date|number>;
  holidayDate: Array<Date|number>;

  containerClass: string;
  headerClass: string;
  titleClass: string;
  controlsClass: string;
  controlsTitleClass: string;
  controlsPrevClass: string;
  controlsNextClass: string;
  controlsTodayClass: string;
  controlsClearClass: string;
  mainClass: string;
  footerClass: string;
  weekClass: string;
  dowClass: string;
  gridClass: string;
  daysClass: string;
  dayClass: string;
  sundayClass: string;
  saturdayClass: string;
  holidayClass: string;
  firstDayClass: string;
  lastDayClass: string;
  startDayClass: string;
  endDayClass: string;

  customDayElement(datepick: IDatepick, current: Date|number): string;
  customInsertBeforeDay(datepick: IDatepick, firstDate: Date|number): string;
  customInsertAfterDay(datepick: IDatepick, firstDate: Date|number): string;

  beforeClickDay(datepick: IDatepick): any;
  beforeEffect(datepick: IDatepick, direction: string): any;
  beforeRender(datepick: IDatepick): any;

  isClickDayEqual(datepick: IDatepick): any;
  isClickIncludeDisabled(datepick: IDatepick): any;
  isClickMultipleMaximum(datepick: IDatepick): any;

  afterClickDay(datepick: IDatepick, dates: Array<Date|number>): any;
  afterEffect(datepick: IDatepick, direction: string): any;
  afterRender(datepick: IDatepick): any;
}
