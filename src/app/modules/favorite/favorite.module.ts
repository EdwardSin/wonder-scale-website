import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoriteRoutingModule } from './favorite-routing.module';
import { SharedModule } from '../public/shared/shared.module';
import { FavoriteComponent } from '@components/favorite/favorite.component';


@NgModule({
  declarations: [FavoriteComponent],
  imports: [
    CommonModule,
    SharedModule,
    FavoriteRoutingModule
  ]
})
export class FavoriteModule { }
