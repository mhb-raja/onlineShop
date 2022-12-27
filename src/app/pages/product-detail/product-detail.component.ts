import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
  exhaustMap,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { UserDTO } from 'src/app/DTOs/Account/UserDTO';
import {
  ProductCommentDTO,
  ProductCommentMiniDTO,
} from 'src/app/DTOs/Product/ProductCommentDTO';
import {
  ProductDetailDTO,
  ProductMiniDTO,
} from 'src/app/DTOs/Product/ProductDTO';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { helper } from 'src/app/Utilities/Helper';
import { ImageGalleryPath, ImagePath } from 'src/app/Utilities/PathTools';

declare function multiItemCarousel(minPerSlide: number): any;
declare function slickInit2(): any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  @ViewChild('commentModalClosebutton') closebutton;

  loading = true; //ngx-loading
  productId: number;
  productId$: Observable<number>;

  imagePath = ImagePath;
  imageGalleryPath = ImageGalleryPath;

  productDetail$: Observable<ProductDetailDTO> = null;
  relatedProducts$: Observable<ProductMiniDTO[]>;
  comments$: Observable<ProductCommentDTO[]>;

  commentText: string;
  user: UserDTO;
  //idIsValid = false;
  cartItems = new Subject<number>();
  count: number = 1;
  added = false;

  visibleItemsInCarousel = 3;

persianDate=helper.getPersianDate;


  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.productId$ = this.activatedRoute.paramMap.pipe(
      map((params) => parseInt(params.get('id')!)),
      tap((id) => (this.productId = id)),
      takeUntil(componentDestroyed(this))
    );

    // this.productDetail$ = this.activatedRoute.paramMap.pipe(
    //   switchMap((params: ParamMap) =>
    //     this.productService.getProductDetail(+params.get('id')!)
    //   ),
    //   shareReplay(),
    //   tap(() => (this.loading = false)),
    //   takeUntil(componentDestroyed(this))
    // );

    // this.comments$ = this.activatedRoute.paramMap.pipe(
    //   switchMap((params) =>
    //     this.productService.getProductComments(+params.get('id')!)
    //   ),
    //   shareReplay(),
    //   takeUntil(componentDestroyed(this))
    // );

    // this.relatedProducts$ = this.activatedRoute.paramMap.pipe(
    //   switchMap((params) =>
    //     this.productService.getRelatedProducts(+params.get('id')!)
    //   ),
    //   takeUntil(componentDestroyed(this))
    // );

    this.productDetail$ = this.productId$.pipe(
      switchMap((id) => this.productService.getProductDetail(id)),
      shareReplay(),
      tap(() => (this.loading = false)),
      takeUntil(componentDestroyed(this))
    );

    this.comments$ = this.productId$.pipe(
      switchMap((id) => this.productService.getProductComments(id)),
      shareReplay(),
      takeUntil(componentDestroyed(this))
    );

    this.relatedProducts$ = this.productId$.pipe(
      switchMap((id) => this.productService.getRelatedProducts(id)),
      takeUntil(componentDestroyed(this))
    );

    // this.activatedRoute.paramMap.pipe(
    //   //map((params: ParamMap)=>parseInt(params.get('id')!)),
    //   switchMap((params) =>
    //     // const id=parseInt(params.get('id')!);
    //     this.productService.getProductDetail(+params.get('id')!)
    //   ),
    //   shareReplay(),
    //   //switchMap((params: ParamMap)=>this.comments$=this.getComments(+params.get('id')!)),
    //   tap((x) => console.log('x=', x)),
    //   takeUntil(componentDestroyed(this))
    // );

    //this.getProductData();

    // this.activatedRoute.params
    //   .pipe(
    //     map((params) => parseInt(params.id, 0)),
    //     tap((id) => (this.productId = id)),
    //     switchMap((id) => this.getProductData()),
    //     switchMap(() => (this.comments$ = this.getComments())),
    //     switchMap(() => (this.relatedProducts$ = this.getRelatedProducts())),
    //     tap(() => this.startSlick()),
    //     takeUntil(componentDestroyed(this)),
    //     tap(() => (this.loading = false))
    //   )
    //   .subscribe();

    this.cartItems
      .asObservable()
      .pipe(
        tap(x=>console.log('cart item add pid',x)),
        switchMap(() => this.orderService.addProductToOrder(this.productId, this.count)),
        takeUntil(componentDestroyed(this))
      )
      .subscribe((res) => this.orderService._setShoppingCart(res));
  }

  //-----------ngOnInit end--------------------------

  getProductDetail(id: number) {
    return this.productService
      .getProductDetail(id)
      .pipe(shareReplay(), takeUntil(componentDestroyed(this)));
  }

  //-------------------------------------------------------------

  //   addtocartxx(id: number) {
  //     if (this.authService.LoggedIn)
  //       this.orderService.addProductToOrder(id, this.count);
  //     else

  // }

  // getProductData() {
  //   this.productService
  //     .getProductDetail(this.productId)
  //     .pipe(takeUntil(componentDestroyed(this)))
  //     .subscribe((item) => {
  //       if (item) {
  //         this.product = item.product;
  //         this.gallery = item.gallery;
  //         this.loading = false;
  //         this.getRestofData();
  //       }
  //     });
  // }

  // getRestofData() {
  //   this.comments$ = this.getComments(this.productId);
  //   this.relatedProducts$ = this.getRelatedProducts(this.productId);
  //   this.startSlick();
  //   this.getCurrentUser();
  // }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe((res) => (this.user = res));
    // console.log('user', this.user);
    // return (this.user) ? true : false;
  }

  getRelatedProducts(productId: number) {
    return this.productService
      .getRelatedProducts(productId)
      .pipe(shareReplay(), takeUntil(componentDestroyed(this)));
  }

  getComments(productId: number) {
    return this.productService
      .getProductComments(productId)
      .pipe(shareReplay(), takeUntil(componentDestroyed(this)));
  }

  startSlick() {
    setTimeout(() => {
      //slickInit();
      slickInit2();
      multiItemCarousel(this.visibleItemsInCarousel);
    });
  }
  //------------------------------

  navigateUp() {
    this.router.navigate(['/products']);
  }

  addToCart() {
    console.log('add to cart,pid=',this.productId);
    
    if (this.count > 0) {
      this.cartItems.next(this.productId);
      this.added = true;
    }
  }

  countChanged(x: number) {}

  removeItem() {
    this.added = false;
  }

  addComment() {
    // var myModal = document.getElementById('commentModal');
    //var myModal = new bootstrap.Modal(document.getElementById('myModal'), options)
    // myModal.hide();
    //myModal.hidden = true;

    if (this.user) {
      if (this.commentText) {
        const newComment: ProductCommentMiniDTO = {
          productId: this.productId,
          text: this.commentText,
        };
        this.productService
          .addProductComment(newComment)
          .pipe(
            map((res) => {
              if (res) this.getComments(this.productId);
            }),
            take(1)
          )
          .subscribe();
        this.closebutton.nativeElement.click();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  getPersianDate(date:Date){

  }
}
