import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from '@components/feature/authentication/reset-password/reset-password.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    SharedModule,
    ResetPasswordRoutingModule
  ]
})
export class ResetPasswordModule { }
