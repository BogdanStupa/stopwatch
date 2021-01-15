import { FromEventTarget } from "rxjs/internal/observable/fromEvent";

export interface TimeI {
  hh: string;
  mm: string;
  ss: string;
}

export interface CounterStateI {
  count: number | TimeI;
  isTicking: boolean;
}

export interface ControllersI {
  btnStartStop: FromEventTarget<MouseEvent>;
  btnWait: FromEventTarget<MouseEvent>;
  btnReset: FromEventTarget<MouseEvent>;
}
