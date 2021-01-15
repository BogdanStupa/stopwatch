import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { StartStopBtnDirective, ResetBtnDirective, WaitBtnDirective } from './controllers/controllers.directive';
import { JsonValuePipe } from './pipes/json-value.pipe';



@NgModule({
  declarations: [
    StopwatchComponent, 
    StartStopBtnDirective,
    ResetBtnDirective,
    WaitBtnDirective,
    JsonValuePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StopwatchComponent
  ]
})
export class StopwatchModule { }
