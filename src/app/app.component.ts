import { Component, OnDestroy, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { OrderService } from './services/order.service';
import { PersistenceService } from './services/persistence.service';
import { componentDestroyed } from './shared/functions/componentDestroyed';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  //title = 'test';

  constructor(private authService: AuthService,
    private orderService: OrderService, private lsService:PersistenceService) { }
  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.authService.checkUserAuth().pipe(
      tap(res => this.authService.setCurrentUser(res)),
      switchMap(user => {
        if (user)
          return this.orderService.getUserShoppingCart();// this.getcart();
        return of(this.lsService.get('cart'));//get cart from local-storage //of(null);
      }),
      tap(res => this.orderService._setShoppingCart(res)),
      takeUntil(componentDestroyed(this))
    ).subscribe();

    // this.authService.checkUserAuth().pipe(
    //   tap(res => this.authService.setCurrentUser(res)),      
    //   takeUntil(componentDestroyed(this))
    // ).subscribe();

    // this.orderService.getUserShoppingCart().pipe(
    //   tap(res => this.orderService._setShoppingCart(res)),
    //   takeUntil(componentDestroyed(this))
    // ).subscribe();
  }

  // getcart() {
  //   return this.orderService.getUserShoppingCart().pipe(
  //     tap(res => this.orderService._setShoppingCart(res))
  //   );
  // }
}
