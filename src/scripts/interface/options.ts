import { Locale } from './locale';

export interface Options {
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

  // Multiple
  multiple: boolean;
  multipleMaximum: number;

  // Language
  lang: string;
  locale: null|Locale;

  // Min, Max Date
  minDate: null|Date|number;
  maxDate: null|Date|number;

  // initial
  dates: null|Array<Date|number>;
  initialDate: null|Date|number;

  // Touch
  touchEvent: boolean;

  // Highlighted
  highlightedDate: Array<Date|number>;
  highlightedToday: boolean;

  // Hide
  hideTodayBtn: boolean;
  hideClearBtn: boolean;
  hidePrevNextDate: boolean;
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
  customDayElement: null|string;
  customInsertBeforeDay: null|string;
  customInsertAfterDay: null|string;

  // Callback
  beforeClickDay: null|Function;
  beforeEffect: null|Function;
  beforeRender: null|Function;

  isClickDayEqual: null|Function;
  isClickIncludeDisabled: null|Function;
  isClickMultipleMaximum: null|Function;

  afterClickDay: null|Function;
  afterRender: null|Function;
  afterEffect: null|Function;
}
