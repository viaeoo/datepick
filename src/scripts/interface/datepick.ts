import { IOptions } from './options';

export interface IDatepick {
  element: HTMLElement;
  options: IOptions;
  dates: Array<Date|number>;
  viewDate: Date|number;
  container: HTMLElement;
  main: HTMLElement;
  controls: Record<string, HTMLElement>;
  views: any;
  active: boolean;

  setInit(): void;
  setRender(): void;
  render(wrapper: string): void;
  show(): void;
  hide(): void;
  getDate(): Array<Date|number>;
  setDate(date: Date|number, opts?: Record<any, boolean>): boolean;
  computeResetViewDate(): number;
}
