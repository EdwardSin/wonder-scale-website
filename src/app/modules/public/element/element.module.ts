import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementRoutingModule } from './element-routing.module';
import { WsLoadingComponent } from '@elements/ws-loading/ws-loading.component';
import { WsSpinnerBarComponent } from '@elements/ws-spinner-styles/ws-spinner-bar/ws-spinner-bar.component';
import { WsSpinnerDotComponent } from '@elements/ws-spinner-styles/ws-spinner-dot/ws-spinner-dot.component';
import { WsSpinnerHDotComponent } from '@elements/ws-spinner-styles/ws-spinner-h-dot/ws-spinner-h-dot.component';
import { WsSpinnerComponent } from '@elements/ws-spinner-styles/ws-spinner/ws-spinner.component';
import { WsToastComponent } from '@elements/ws-toast/ws-toast.component';
import { PaginationComponent } from '@elements/pagination/pagination.component';
import { WsLoadingButtonComponent } from '@elements/ws-loading-button/ws-loading-button.component';
import { WsLoadingScreenComponent } from '@elements/ws-loading-screen/ws-loading-screen.component';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { WsStepperComponent } from '@elements/ws-stepper/ws-stepper.component';
import { WsReviewComponent } from '@elements/ws-review/ws-review.component';
import { WsRatingComponent } from '@elements/ws-rating/ws-rating.component';


@NgModule({
  declarations: [
    WsLoadingComponent,
    WsSpinnerBarComponent,
    WsSpinnerDotComponent,
    WsSpinnerHDotComponent,
    WsSpinnerComponent,
    WsToastComponent,
    WsModalComponent,
    PaginationComponent,
    WsLoadingButtonComponent,
    WsLoadingScreenComponent,
    WsStepperComponent,
    WsReviewComponent,
    WsRatingComponent
  ],
  imports: [
    CommonModule,
    ElementRoutingModule
  ],
  exports: [
    WsLoadingComponent,
    WsSpinnerBarComponent,
    WsSpinnerDotComponent,
    WsSpinnerHDotComponent,
    WsSpinnerComponent,
    WsToastComponent,
    PaginationComponent,
    WsModalComponent,
    WsLoadingButtonComponent,
    WsLoadingScreenComponent,
    WsStepperComponent,
    WsReviewComponent,
    WsRatingComponent
  ]
})
export class ElementModule { }
