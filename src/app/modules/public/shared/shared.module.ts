import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedRoutingModule } from './shared-routing.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { DirectiveModule } from '../directive/directive.module';
import { PipeModule } from '../pipe/pipe.module';
import { ElementModule } from '../element/element.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListItemComponent } from '@elements/list-item/list-item.component';
import { PageComponent } from '@elements/page/page.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    ListItemComponent,
    PageComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    PipeModule,
    ElementModule,
    MDBBootstrapModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBTVuemjzI8vqXoCPeJhtt0WgFQ9TNizLQ'
    })
  ],
  exports: [
    ListItemComponent,
    PageComponent,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSliderModule,
    MatCheckboxModule,
    SwiperModule,
    DirectiveModule,
    PipeModule,
    ElementModule,
    ClipboardModule,
    DragDropModule,
    LazyLoadImageModule,
    MDBBootstrapModule,
    AgmCoreModule
  ]
})
export class SharedModule { }
