import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, tap, takeUntil } from 'rxjs/operators';
import { ShoppingCartItemDTO } from 'src/app/DTOs/Order/ShoppingCartItemDTO';
import { OrderService } from 'src/app/services/order.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { ImagePath } from 'src/app/Utilities/PathTools';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  cart$: Observable<ShoppingCartItemDTO[]>;
  totalPrice = 0;
  imagePath = ImagePath;

  constructor(private orderService: OrderService) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.cart$ = this.orderService._getShoppingCart().pipe(
      shareReplay(),
      tap(list => this.calculateTotalPrice(list)),
      takeUntil(componentDestroyed(this)),
      //tap(console.log)
    );
  }

  calculateTotalPrice(list: ShoppingCartItemDTO[]) {
    this.totalPrice = 0;
    if (list)
      for (const cartItem of list) {
        this.totalPrice += cartItem.price * cartItem.count;
      }
  }

  removeItem(id: number) {
    this.orderService.removeOrderDetail(id).subscribe(res => {
      if (res) {
        this.orderService._setShoppingCart(res);
      }
    });
  }
}
