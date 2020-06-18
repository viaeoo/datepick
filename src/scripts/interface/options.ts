import { ILocale } from './locale';
import { IDatepick } from './datepick';

export interface IOptions {
  // Basic
  grid: number;
  today: null|Date|number;
  nextBtnText: string;
  prevBtnText: string;

  // Animation
  mode: string;
  animationTiming: string;
  animationDuration: number;
  animationDirection: string;

  // Range
  range: boolean;
  rangeIncludeDisabled: boolean;
  rangeDistanceDay: number;
  rangeEqualDateDelete: boolean;

  // Multiple
  multiple: boolean;
  multipleMaximum: number;

  // Language
  lang: string;
  locale: null|ILocale;

  // Min, Max Date
  minDate: null|Date|number;
  maxDate: null|Date|number;

  // initial
  initialDate: Array<Date|number>;

  // Touch
  touchEvent: boolean;

  // Highlighted
  highlightedDate: Array<Date|number>;
  highlightedToday: boolean;

  // Hide
  hideTodayBtn: boolean;
  hideClearBtn: boolean;
  hidePrevNextDate: boolean;
  hidePrevNextBtn: boolean;
  hideWeek: boolean;

  // Disabled day
  disabledDate: Array<Date|number>;

  // Holiday
  holidayDate: Array<Date|number>;

  // Class
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

  // Custom
  customDayElement(datepick: IDatepick, current: Date|number): string;
  customInsertBeforeDay(datepick: IDatepick, firstDate: Date|number): string;
  customInsertAfterDay(datepick: IDatepick, firstDate: Date|number): string;

  // Callback
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
