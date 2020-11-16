import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListItemInfoRoutingModule } from './list-item-info-routing.module';
import { ListItemInfoComponent } from '@components/list-item-info/list-item-info.component';
import { ElementModule } from '../public/element/element.module';
import { PipeModule } from '../public/pipe/pipe.module';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { LazyLoadImageModule } from 'ng-lazyload-image';


@NgModule({
  declarations: [ListItemInfoComponent],
  imports: [
    CommonModule,
    ElementModule,
    PipeModule,
    SwiperModule,
    ClipboardModule,
    LazyLoadImageModule,
    ListItemInfoRoutingModule
  ]
})
export class ListItemInfoModule { }
