import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SwiperModule, SWIPER_CONFIG, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { FacebookModule } from 'ngx-facebook';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { MerchantComponent } from './components/merchant/merchant.component';
import { HomeComponent } from './components/home/home.component';
import { ItemInfoComponent } from './components/item-info/item-info.component';
import { SavedComponent } from './components/saved/saved.component';
import { ItemComponent } from './elements/item/item.component';
import { WsLoadingComponent } from './elements/ws-loading/ws-loading.component';
import { WsSpinnerComponent } from './elements/ws-spinner-styles/ws-spinner/ws-spinner.component';
import { WsSpinnerBarComponent } from './elements/ws-spinner-styles/ws-spinner-bar/ws-spinner-bar.component';
import { WsSpinnerDotComponent } from './elements/ws-spinner-styles/ws-spinner-dot/ws-spinner-dot.component';
import { WsSpinnerHDotComponent } from './elements/ws-spinner-styles/ws-spinner-h-dot/ws-spinner-h-dot.component';
import { PaginationComponent } from './elements/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { WsModalComponent } from './elements/ws-modal/ws-modal.component';
import { WsCurrencyPipe } from './pipes/ws-currency.pipe';
import { WsDiscountconverterPipe } from './pipes/ws-discountconverter.pipe';
import { FloatBannerComponent } from './elements/float-banner/float-banner.component';

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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MerchantComponent,
    HomeComponent,
    ItemInfoComponent,
    SavedComponent,
    ItemComponent,
    WsLoadingComponent,
    WsSpinnerBarComponent,
    WsSpinnerDotComponent,
    WsSpinnerHDotComponent,
    WsSpinnerComponent,
    PaginationComponent,
    WsModalComponent,
    WsDiscountconverterPipe,
    WsCurrencyPipe,
    FloatBannerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule,
    AppRoutingModule,
    SwiperModule,
    ClipboardModule,
    FacebookModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBTVuemjzI8vqXoCPeJhtt0WgFQ9TNizLQ'
    }),
  ],
  providers: [{
    provide: SWIPER_CONFIG,
    useValue: DEFAULT_SWIPER_CONFIG
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
