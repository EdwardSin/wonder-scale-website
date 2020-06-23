import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListItemInfoRoutingModule } from './list-item-info-routing.module';
import { ListItemInfoComponent } from '@components/list-item-info/list-item-info.component';
import { SharedModule } from '../public/shared/shared.module';


@NgModule({
  declarations: [ListItemInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    ListItemInfoRoutingModule
  ]
})
export class ListItemInfoModule { }
