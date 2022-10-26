import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, takeUntil, tap } from 'rxjs/operators';
import { ShoppingCartItemDTO } from 'src/app/DTOs/Order/ShoppingCartItemDTO';
import { OrderService } from 'src/app/services/order.service';
import { ImagePath } from 'src/app/Utilities/PathTools';
import { componentDestroyed } from '../../functions/componentDestroyed';

@Component({
  selector: 'app-header-cart',
  templateUrl: './header-cart.component.html',
  styleUrls: ['./header-cart.component.scss']
})
export class HeaderCartComponent implements OnInit, OnDestroy {
  // cart: ShoppingCartItemDTO[];
  cart$: Observable<ShoppingCartItemDTO[]>;
  totalPrice = 0;
  imagePath = ImagePath;

  constructor(private orderService: OrderService) { }
  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.cart$ = this.orderService._getShoppingCart().pipe(
      shareReplay(),
      //tap(console.log),
      tap(list => this.calculateTotalPrice(list)),
      takeUntil(componentDestroyed(this))
    );

    // this.orderService._getShoppingCart().subscribe(res => {
    //   this.cart = res;
    //   this.calculateTotalPrice();
    //   console.log('got cart from service',res);      
    // });
  }

  calculateTotalPrice(list: ShoppingCartItemDTO[]) {
    this.totalPrice = 0;
    if (list)
      for (const cartItem of list) {
        this.totalPrice += cartItem.price * cartItem.count;
      }
  }

  // calculateTotalPrice() {
  //   this.totalPrice = 0;
  //   if (this.cart)
  //     for (const cartItem of this.cart) {
  //       this.totalPrice += cartItem.price * cartItem.count;
  //     }
  //   console.log('sum total',this.totalPrice);

  // }

  removeItem(id: number) {
    this.orderService.removeOrderDetail(id).subscribe(res => {
      if (res) {
        // this.cart = res.data;
        this.orderService._setShoppingCart(res);
        //this.calculateTotalPrice();
      }
    });
  }
}
