import { BrowserModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SwiperModule, SWIPER_CONFIG, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FacebookModule } from '@jemys89/ngx-facebook';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressRouterModule } from 'ngx-progressbar/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { MerchantComponent } from './components/merchant/merchant.component';
import { HomeComponent } from './components/home/home.component';
import { ItemInfoComponent } from './components/item-info/item-info.component';
import { ItemComponent } from './elements/item/item.component';
import { WsLoadingComponent } from './elements/ws-loading/ws-loading.component';
import { WsLoadingButtonComponent } from './elements/ws-loading-button/ws-loading-button.component';
import { WsSpinnerComponent } from './elements/ws-spinner-styles/ws-spinner/ws-spinner.component';
import { WsSpinnerBarComponent } from './elements/ws-spinner-styles/ws-spinner-bar/ws-spinner-bar.component';
import { WsSpinnerDotComponent } from './elements/ws-spinner-styles/ws-spinner-dot/ws-spinner-dot.component';
import { WsSpinnerHDotComponent } from './elements/ws-spinner-styles/ws-spinner-h-dot/ws-spinner-h-dot.component';
import { PaginationComponent } from './elements/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WsModalComponent } from './elements/ws-modal/ws-modal.component';
import { WsCurrencyPipe } from './pipes/ws-currency.pipe';
import { WsDiscountconverterPipe } from './pipes/ws-discountconverter.pipe';
import { FloatBannerComponent } from './elements/float-banner/float-banner.component';
import { LoginComponent } from '@components/feature/authentication/login/login.component';
import { RegisterComponent } from '@components/feature/authentication/register/register.component';
import { ForgotPasswordComponent } from '@components/feature/authentication/forgot-password/forgot-password.component';
import { ActivateComponent } from '@components/feature/authentication/activate/activate.component';
import { ResetPasswordComponent } from '@components/feature/authentication/reset-password/reset-password.component';
import { isPlatformBrowser } from '@angular/common';
import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, SocialLoginModule } from 'angular-6-social-login';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { WsToastComponent } from '@elements/ws-toast/ws-toast.component';
import { WsLoadingScreenComponent } from '@elements/ws-loading-screen/ws-loading-screen.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { PageComponent } from './elements/page/page.component';
import { ClickoutsideDirective } from './directives/clickoutside.directive';
import { WsLimitCtrlPipe } from './pipes/ws-limit-ctrl.pipe';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileSettingsComponent } from './components/settings/profile-settings/profile-settings.component';
import { GeneralSettingsComponent } from './components/settings/general-settings/general-settings.component';
import { SecuritySettingsComponent } from './components/settings/security-settings/security-settings.component';
import { SearchComponent } from './components/search/search.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { ListItemComponent } from './elements/list-item/list-item.component';
import { ListItemInfoComponent } from './components/list-item-info/list-item-info.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  observer: true,
  observeParents: true,
  pagination: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
}
export function jwtOptionsFactory(platformId) {
  return {
    tokenGetter: () => {
      let token = null;
      if (isPlatformBrowser(platformId)) {
        token = sessionStorage.getItem('token');
      }
      return token;
    },
    whitelistedDomains: ['localhost:4000/users', 'localhost:9005/users', 'wonderscale.com/users']
  };
}
export function provideConfig() {
  var config = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider("783575719474-mbhan9e6d0ucn4j3c6t847udbvtbc8aq.apps.googleusercontent.com")
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("246047829574930")
    }
  ]);
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MerchantComponent,
    HomeComponent,
    ItemInfoComponent,
    ItemComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ActivateComponent,
    ResetPasswordComponent,
    WsLoadingComponent,
    WsSpinnerBarComponent,
    WsSpinnerDotComponent,
    WsSpinnerHDotComponent,
    WsSpinnerComponent,
    WsToastComponent,
    PaginationComponent,
    WsModalComponent,
    WsLoadingButtonComponent,
    WsDiscountconverterPipe,
    WsCurrencyPipe,
    FloatBannerComponent,
    WsLoadingScreenComponent,
    FavoriteComponent,
    PageComponent,
    ClickoutsideDirective,
    AutofocusDirective,
    WsLimitCtrlPipe,
    SettingsComponent,
    ProfileSettingsComponent,
    GeneralSettingsComponent,
    SecuritySettingsComponent,
    SearchComponent,
    ListItemComponent,
    ListItemInfoComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatSliderModule,
    AppRoutingModule,
    MatCheckboxModule,
    SwiperModule,
    ClipboardModule,
    DragDropModule,
    SocialLoginModule,
    NgProgressModule,
    NgProgressRouterModule,
    MDBBootstrapModule.forRoot(),
    FacebookModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBTVuemjzI8vqXoCPeJhtt0WgFQ9TNizLQ'
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [PLATFORM_ID]
      }
    })
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }, 
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
