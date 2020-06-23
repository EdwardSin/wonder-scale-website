import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SharedModule } from '../public/shared/shared.module';
import { SearchComponent } from '@components/search/search.component';


@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    SearchRoutingModule
  ]
})
export class SearchModule { }
