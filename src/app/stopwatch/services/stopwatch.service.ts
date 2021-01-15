import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, interval, merge, NEVER, Observable, Subject } from 'rxjs';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { buffer, distinctUntilChanged, filter, map, mapTo, pluck, scan, shareReplay, startWith, switchMap, tap, throttleTime, withLatestFrom } from 'rxjs/operators';
import { CounterStateI, ControllersI, TimeI } from '../interfaces';


@Injectable()
export class StopwatchService {
  private initialCounterState: CounterStateI = {
    count: 0,
    isTicking: false
  };
  private counterState: BehaviorSubject<CounterStateI>;
  public counterState$: Observable<CounterStateI>; 

  constructor() { 
    this.counterState = new BehaviorSubject<CounterStateI>(this.initialCounterState);
    this.counterState$ = this.counterState.asObservable()
      .pipe(
        filter(x => x.count < 60*60*24),
        map(x => ({
          isTicking: x.isTicking,
          count: this.calculateTime(x.count as number)
        }))
      );
  }

  public create(controllers: ControllersI):Observable<any> {
    const counterSubject = new Subject<Partial<CounterStateI>>();

    const counterCommands$ = merge(
      fromEvent(controllers.btnStartStop, "click").pipe(
        map(() => this.counterState.value.isTicking ? { ...this.initialCounterState } : { isTicking: true })
      ),
      this.dbClickWait(controllers.btnWait).pipe(mapTo({ isTicking: false })),
      fromEvent(controllers.btnReset, "click").pipe(
        map(() => ({ ...this.initialCounterState, isTicking: true }))
      ),
      counterSubject.asObservable()
    );

    const counterState$ = counterCommands$.pipe(
      startWith(this.initialCounterState),
      scan((counterState: CounterStateI, command: Partial<CounterStateI>) => {
        const newState = { ...counterState, ...command };
        this.counterState.next(newState);
        return newState;
      }),
      shareReplay(1)
    );
    
    const tick$ = counterState$.pipe(
      pluck("isTicking"),
      distinctUntilChanged(),
      switchMap(isTicking => isTicking ? interval(1000) : NEVER),
    );
    
    const nextCount$ = tick$.pipe(
      withLatestFrom(counterState$),
      tap(([_, counterState]) => counterSubject.next({ count: Number(counterState.count) + 1 }))
    );

    return merge(nextCount$, counterState$);
  }

  private dbClickWait(target: FromEventTarget<MouseEvent>):Observable<boolean>{
    const click$ = fromEvent(target, "click");
    
    return click$.pipe(
      buffer(click$.pipe(throttleTime(300))),
      filter(arr => arr.length === 2),
      mapTo(true)
    );
  }

  private calculateTime(timeInSeconds: number): TimeI {
    const hours: number = Math.floor(timeInSeconds / 3600);
    const minutes: number = Math.floor((timeInSeconds - (hours * 3600)) / 60);
    const seconds: number = timeInSeconds - (hours * 3600) - (minutes * 60);
    
    const hh = hours < 10 ? `0${hours}` : `${hours}`;
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;
    
    return { hh, mm, ss}
  }
}
