import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AccountEditComponent } from './pages/account/account-edit/account-edit.component';
import { AccountHomeComponent } from './pages/account/account-home/account-home.component';

import { CartComponent } from './pages/account/cart/cart.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductsComponent } from './pages/products/products.component';
import { Products2Component } from './pages/products2/products2.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserAuthGuard } from './Utilities/user-auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products2', component: Products2Component },
  { path: 'products/:id', component: ProductDetailComponent },  
  { path: 'products/:id/:name', component: ProductDetailComponent },  
  {
    path: 'account', component: AccountHomeComponent, canActivate: [UserAuthGuard], 
     children: [
      { path: 'edit', component: AccountEditComponent },
      { path: 'cart', component: CartComponent },
    ]
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  //for scrolling to #id
  // imports: [RouterModule.forRoot(routes, {
  //   scrollPositionRestoration: 'enabled', // or 'top'
  //   anchorScrolling: 'enabled',
  //   scrollOffset: [0, 64] // [x, y] - adjust scroll offset
  // })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
