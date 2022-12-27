import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxLoadingModule} from 'ngx-loading';

import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FeaturedProductsComponent } from './pages/home/featured-products/featured-products.component';
import { NewProductsComponent } from './pages/home/new-products/new-products.component';
import { SliderComponent } from './pages/home/slider/slider.component';
import { SliderService } from './services/slider.service';
import { Interceptor } from './Utilities/Interceptor';
import { AuthService } from './services/auth.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { HeaderCartComponent } from './shared/components/header-cart/header-cart.component';
import { CommentComponent } from './pages/comment/comment.component';
import { AccountHomeComponent } from './pages/account/account-home/account-home.component';
import { CartComponent } from './pages/account/cart/cart.component';
import { AccountEditComponent } from './pages/account/account-edit/account-edit.component';
import { OrderService } from './services/order.service';
import {ProductService} from './services/product.service';
import { CountChangerComponent } from './shared/components/count-changer/count-changer.component';
import { RatingStarsComponent } from './shared/components/rating-stars/rating-stars.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { Products2Component } from './pages/products2/products2.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ProductInfiniteComponent } from './pages/product-infinite/product-infinite.component';
//import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutUsComponent,
    ContactUsComponent,
    ProductsComponent,
    LoginComponent,
    RegisterComponent,
    FeaturedProductsComponent,
    NewProductsComponent,
    SliderComponent,
    ProductCardComponent,
    ProductDetailComponent,
    HeaderCartComponent,
    CommentComponent,
    
    AccountHomeComponent,
    CartComponent,
    AccountEditComponent,
    CountChangerComponent,
    RatingStarsComponent,
    NotFoundComponent,
    Products2Component,
    ProductInfiniteComponent
  ],
  imports: [
    BrowserModule,    
    HttpClientModule,
    ReactiveFormsModule, FormsModule,
    SweetAlert2Module.forRoot(),
    NgxLoadingModule.forRoot({
      fullScreenBackdrop:true, 
    }),
    NgxSliderModule,
    //InfiniteScrollModule,
    AppRoutingModule,
  ],
  providers: [
    SliderService,
    AuthService,
    OrderService,
    ProductService,
    ErrorHandlerService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
