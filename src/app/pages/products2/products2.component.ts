import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { productDatasourceDTO, ProductOrderBy } from 'src/app/DTOs/Product/ProductDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { ChangeContext, LabelType, Options, PointerType } from "@angular-slider/ngx-slider";
import { CategoryDTO } from 'src/app/DTOs/Product/CategoryDTO';
import { helper } from 'src/app/Utilities/Helper';

@Component({
  selector: 'app-products2',
  templateUrl: './products2.component.html',
  styleUrls: ['./products2.component.scss']
})
export class Products2Component implements OnInit , OnDestroy {

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
    orderBy: null,
    maxPrice: 0,
    availableOnly: false
  };

  loading = true;//ngx-loading 
  pages: number[] = [];

  categories$: Observable<CategoryDTO[]>;
  orderBy = ProductOrderBy;


  //ngx-slider
  priceRangeFrom: number = 0;
  priceRangeTo: number = 0;
  priceRangeOptions: Options = {
    floor: 0,
    ceil: 100,
    rightToLeft: true,
    step:10000,
    noSwitching: true,
    translate: (value: number): string => {
      return helper.numberToLocale(value);
    },
    // translate: (value: number, label: LabelType): string => {
    //   switch (label) {
    //     case LabelType.Low:
    //       return '<b>Min price:</b> $' + value;
    //     case LabelType.High:
    //       return '<b>Max price:</b> $' + value;
    //     default:
    //       return '$' + value;
    //   }
    // }
  };

  commaSeparate = helper.numberToLocale;

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
        this.setNewCeil(res.maxPrice);
        this.loading = false;
      }
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

  setNewCeil(newCeil: number): void {
    // Due to change detection rules in Angular, we need to re-create the options object to apply the change
    const newOptions: Options = Object.assign({}, this.priceRangeOptions);
    newOptions.ceil = newCeil;
    this.priceRangeOptions = newOptions;
  }

  getCategories() {
    this.categories$ = this.productService.GetCategoryChildren(-1).pipe(
      shareReplay(),
      takeUntil(componentDestroyed(this))
    ); 
  }

  setPage(page: number) {    
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
    let startPage = (this.myDatasource.pageIndex - 3 <= 0 ? 0 : this.myDatasource.pageIndex - 3);
    const pageCount = Math.ceil(this.myDatasource.totalItems / this.myDatasource.pageSize);
    let endPage = this.myDatasource.pageIndex + 3 >= pageCount ? pageCount - 1 : this.myDatasource.pageIndex + 3;

    this.pages = [];
    for (let index = startPage; index <= endPage; index++) {
      this.pages.push(index);
    }
  }

  setDS(params: Params) {
    this.myDatasource.pageIndex = params.pageIndex ? parseInt(params.pageIndex, 0) : 0;
    this.myDatasource.pageSize = params.pageSize ? parseInt(params.pageSize, 0) : 6;
    this.myDatasource.text = params.text;
    this.myDatasource.startPrice = params.startPrice ? parseInt(params.startPrice, 0) : 0;
    this.myDatasource.endPrice = params.endPrice ? parseInt(params.endPrice, 0) : 0;//???????????
    this.myDatasource.categories = params.categories ? params.categories : [];
    this.myDatasource.orderBy = params.orderBy ? params.orderBy : null;

    this.myDatasource.availableOnly = params.availableOnly ? true : false;
    this.myDatasource.items=null;
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




  onUserChangeEnd(changeContext: ChangeContext): void {
    this.buildQueryParams();
    //console.log( `End(${this.getChangeContextString(changeContext)}\n`);
  }
  getChangeContextString(changeContext: ChangeContext): string {
    return `${changeContext.pointerType === PointerType.Min ? 'Min' : 'Max'}, ` +
           `${changeContext.value}, ` +
           `${changeContext.highValue}}`;

    return `{pointerType: ${changeContext.pointerType === PointerType.Min ? 'Min' : 'Max'}, ` +
           `value: ${changeContext.value}, ` +
           `highValue: ${changeContext.highValue}}`;
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

  clearFilters() {
    this.myDatasource.startPrice = 0;
    console.log('end',this.myDatasource.endPrice,'max' ,this.myDatasource.maxPrice);
    this.myDatasource.categories=[];
    this.myDatasource.endPrice = this.myDatasource.maxPrice;
    this.myDatasource.availableOnly = false;
    this.myDatasource.text="";
    this.buildQueryParams();
  }

  filterCategories(event: any) {
    console.log(event);
    
    const value = parseInt(event.target.value);
    if (event.target.checked)
      this.myDatasource.categories.push(value);
    else
      this.myDatasource.categories = this.myDatasource.categories.filter(s => s !== value);
    this.myDatasource.pageIndex = 0;

    this.buildQueryParams();
  }

  buildQueryParams() {
    console.log(this.myDatasource.startPrice,this.myDatasource.endPrice);
    
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
    if (this.myDatasource.endPrice && this.myDatasource.endPrice != this.myDatasource.maxPrice)
      queryParams.endPrice = this.myDatasource.endPrice;
    if(this.myDatasource.availableOnly) queryParams.availableOnly=true;
    console.log('queryParams',queryParams);
    
    this.router.navigate(['products2'], { queryParams: queryParams });
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
