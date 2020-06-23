import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from '@components/feature/authentication/forgot-password/forgot-password.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    SharedModule,
    ForgotPasswordRoutingModule
  ]
})
export class ForgotPasswordModule { }
