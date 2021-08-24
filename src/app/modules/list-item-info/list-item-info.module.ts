import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListItemInfoRoutingModule } from './list-item-info-routing.module';
import { ListItemInfoComponent } from '@components/list-item-info/list-item-info.component';
import { ElementModule } from '../public/element/element.module';
import { PipeModule } from '../public/pipe/pipe.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SharedModule } from '../public/shared/shared.module';


@NgModule({
  declarations: [ListItemInfoComponent],
  imports: [
    CommonModule,
    ElementModule,
    SharedModule,
    PipeModule,
    ClipboardModule,
    LazyLoadImageModule,
    ListItemInfoRoutingModule
  ]
})
export class ListItemInfoModule { }
