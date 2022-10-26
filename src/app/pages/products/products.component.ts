import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';

import { productDatasourceDTO, ProductOrderBy } from 'src/app/DTOs/Product/ProductDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  searchTerms = new Subject<string>();

  myDatasource: productDatasourceDTO = {
    items: null,
    pageSize: 6,
    pageIndex: 0,
    totalItems: 0,
    text: '',
    startPrice: 0,
    endPrice: 0,
    categories: [],
    orderBy: null
  };

  loading = true;//ngx-loading 
  pages: number[] = [];
  searchText: string = null;
  startPrice;
  endPrice;
  startPage: number = 0;
  endPage: number = 0;
  categories$; //CategoryDTO[] = [];
  orderBy = ProductOrderBy;

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      switchMap(params => {
        this.setDS(params);
        return this.productService.getFilteredProducts(this.myDatasource);
      }),
      takeUntil(componentDestroyed(this))
    ).subscribe(res => {
      if (res) {
        this.initializeReceivedDs(res);
        this.loading = false;
        //console.log(this.myDatasource);

      }
      //else ??????????????????????
    });
    this.getCategories();
    // this.searchTerms.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   switchMap(terms=> SERVICE. ... // WRONG : this.buildQueryParams())
    // );
  }

  initializeReceivedDs(res: productDatasourceDTO) {
    this.myDatasource = res;
    if (this.myDatasource.categories === null)
      this.myDatasource.categories = [];
    this.initializePaging();
  }

  getCategories() {
    this.categories$ = this.productService.GetCategoryChildren(-1).pipe(
      takeUntil(componentDestroyed(this))
    );
    //   map( res => 

    //     this.categories$ = res)
    // );//subscribe(res => this.categories = res);   
  }

  setPage(page: number) {
    //console.log(`page:${page} pageindex:${this.myDatasource.pageIndex}`);

    this.myDatasource.pageIndex = page;
    this.buildQueryParams();
  }

  previousPage() {
    this.myDatasource.pageIndex--;
    this.buildQueryParams();
  }

  nextPage() {
    this.myDatasource.pageIndex++;
    this.buildQueryParams();
  }

  initializePaging() {
    this.startPage = (this.myDatasource.pageIndex - 3 <= 0 ? 0 : this.myDatasource.pageIndex - 3);
    const pageCount = Math.ceil(this.myDatasource.totalItems / this.myDatasource.pageSize);
    this.endPage = this.myDatasource.pageIndex + 3 >= pageCount ? pageCount - 1 : this.myDatasource.pageIndex + 3;

    this.pages = [];
    for (let index = this.startPage; index <= this.endPage; index++) {
      this.pages.push(index);
    }

    //console.log(`count:${pageCount} start:${this.startPage} end:${this.endPage} ${this.pages}`);

  }

  setDS(params: Params) {
    this.myDatasource.pageIndex = params.pageIndex ? parseInt(params.pageIndex, 0) : 0;
    this.myDatasource.pageSize = params.pageSize ? parseInt(params.pageSize, 0) : 6;
    this.myDatasource.text = params.text;
    //this.searchText = params.text;
    this.myDatasource.startPrice = params.startPrice ? parseInt(params.startPrice, 0) : 0;
    this.myDatasource.endPrice = params.endPrice ? parseInt(params.endPrice, 0) : 0;//???????????
    this.myDatasource.categories = params.categories ? params.categories : [];
    this.myDatasource.orderBy = params.orderBy ? params.orderBy : null;
  }

  // onPaginateChange(event: PageEvent) {
  //   this.myDatasource.pageIndex = event.pageIndex;
  //   this.myDatasource.pageSize = event.pageSize;
  //   this.buildQueryParams();
  // }

  // sortData(sort: Sort) {
  //   console.log(`sort: avctive-${sort.active} direction-${sort.direction}`, sort);
  //   // this.myDatasource.sort = sort.direction;
  //   // this.buildQueryParams();
  // }
  filter2() {
    this.searchTerms.next(this.myDatasource.text);//????????????????????????????
  }

  filter() {
    this.buildQueryParams();
  }

  // filterByStartPrice(start: number) {
  //   console.log(start);

  //   this.myDatasource.startPrice = start;
  //   this.buildQueryParams();
  // }

  // filterByPrice(){//end: number) {
  //   //this.myDatasource.endPrice = end;
  //   console.log(this.myDatasource.endPrice);

  //   this.buildQueryParams();
  // }

  clearPrice() {
    this.myDatasource.startPrice = 0;
    this.myDatasource.endPrice = 0;
    this.buildQueryParams();
  }

  filterCategories(event: any) {
    const value = parseInt(event.target.value);
    if (event.target.checked)
      this.myDatasource.categories.push(value);
    else
      this.myDatasource.categories = this.myDatasource.categories.filter(s => s !== value);
    this.myDatasource.pageIndex = 0;

    this.buildQueryParams();
  }

  buildQueryParams() {
    let queryParams: any = {};
    if (this.myDatasource.text) queryParams.text = this.myDatasource.text;
    queryParams.pageIndex = this.myDatasource.pageIndex;
    queryParams.pageSize = this.myDatasource.pageSize;
    if (this.myDatasource.categories.length > 0)
      queryParams.categories = this.myDatasource.categories;
    if (this.myDatasource.orderBy)
      queryParams.orderBy = this.myDatasource.orderBy;
    if (this.myDatasource.startPrice && this.myDatasource.startPrice > 0)
      queryParams.startPrice = this.myDatasource.startPrice;
    if (this.myDatasource.endPrice && this.myDatasource.endPrice > 0)
      queryParams.endPrice = this.myDatasource.endPrice;
    this.router.navigate(['products'], { queryParams: queryParams });
  }

  changeSortOrder(sort: ProductOrderBy) {
    this.myDatasource.orderBy = sort;
    this.buildQueryParams();
  }

  changePageSize() {
    this.myDatasource.pageIndex = 0;
    this.buildQueryParams();
  }
}


