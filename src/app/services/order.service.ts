import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IResponseResult, Status } from '../DTOs/Common/IResponseResult';
import { ShoppingCart, ShoppingCartItemDTO } from '../DTOs/Order/ShoppingCartItemDTO';
import { AuthService } from './auth.service';
import { ErrorHandlerService } from './error-handler.service';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  cartKey = 'cart';

  private shoppingCart: BehaviorSubject<ShoppingCartItemDTO[]>
    = new BehaviorSubject<ShoppingCartItemDTO[]>(null);

  // private sumTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  // private cart: BehaviorSubject<ShoppingCart> = new BehaviorSubject<ShoppingCart>(null);

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService,
    private lsService: PersistenceService,
    private authService: AuthService) { }


  _setShoppingCart(cart: ShoppingCartItemDTO[]) {
    this.shoppingCart.next(cart);
    this.lsService.set(this.cartKey, cart);
    // console.log('cart', cart);
    //localStorage.setItem('cart', JSON.stringify(cart));
  }

  _getShoppingCart(): Observable<ShoppingCartItemDTO[]> {
    // console.log('LS cart', this.lsService.get('cart'));
    return this.shoppingCart.asObservable();
  }

  // _setCart(cart: ShoppingCartItemDTO[]) {
  //   this.cart.next({ cart: cart, sumTotal: 0 });
  // }

  // _getCart(): Observable<ShoppingCart> {
  //   return this.cart.asObservable();
  // }

  addProductToOrder(productId: number, count: number): Observable<ShoppingCartItemDTO[]> {
    console.log('o service pid',productId);
    
    if (this.authService.IsLoggedIn) {
      const params = new HttpParams().set('productId', productId.toString()).set('count', count.toString());
      return this.http.get<IResponseResult<ShoppingCartItemDTO[]>>('/order/add-order', { params }).pipe(
        map(res => {
          if (res.eStatus === Status.Success)
            return res.data;
          else
            return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<ShoppingCartItemDTO[]>(`افزودن محصول به سبد خرید `))
      );
    } else {
      return null;
    }
  }

  addToLsOrder(productId: number, count: number) {
    let cart: ShoppingCartItemDTO[] = this.lsService.get(this.cartKey);
    let found = cart.find(x => x.id === productId);
    if (found)
      found.count += count;
    else {
      const item:ShoppingCartItemDTO={
        id: productId,
        title: '',
        price: 0,
        imageName: '',
        count: 0
      }
      //cart.push({count:count,});
    }
  }

  getUserShoppingCart(): Observable<ShoppingCartItemDTO[]> {
    // console.log('service get cart from server');
    return this.http.get<IResponseResult<ShoppingCartItemDTO[]>>('/order/get-cart').pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<ShoppingCartItemDTO[]>(`دریافت سبد خرید کاربر`))
    );
  }


  removeOrderDetail(detailId: number): Observable<ShoppingCartItemDTO[]> {
    return this.http.get<IResponseResult<ShoppingCartItemDTO[]>>('/order/remove-order-detail/' + detailId).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<ShoppingCartItemDTO[]>(`حذف محصول از سبد خرید `))
    );
  }

}
