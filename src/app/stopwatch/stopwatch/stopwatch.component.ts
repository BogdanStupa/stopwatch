import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ResetBtnDirective, StartStopBtnDirective, WaitBtnDirective } from '../controllers/controllers.directive';
import { StopwatchService } from '../services/stopwatch.service';
import { ControllersI } from '../interfaces';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
  providers: [StopwatchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StopwatchComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  @ViewChild(StartStopBtnDirective, { read: ElementRef, static: true })
  private btnStartStop: ElementRef;

  @ViewChild(WaitBtnDirective, { read: ElementRef, static: true })
  private btnWait: ElementRef;

  @ViewChild(ResetBtnDirective, { read: ElementRef, static: true })
  private btnReset: ElementRef;

  constructor(
    public counterService: StopwatchService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const controllers: ControllersI = {
      btnStartStop: this.btnStartStop.nativeElement,
      btnWait: this.btnWait.nativeElement,
      btnReset: this.btnReset.nativeElement
    };
    
    this.ngZone.runOutsideAngular(() => {
      this.sub = this.counterService.create(controllers).subscribe(() => this.cd.detectChanges());
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}
