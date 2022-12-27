import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { IResponseResult, Status } from '../DTOs/Common/IResponseResult';
import { CategoryDTO } from '../DTOs/Product/CategoryDTO';
import { ProductCommentDTO, ProductCommentMiniDTO } from '../DTOs/Product/ProductCommentDTO';
import { productDatasourceDTO, ProductDetailDTO, ProductMiniDTO } from '../DTOs/Product/ProductDTO';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  getFilteredProducts(filter: productDatasourceDTO): Observable<productDatasourceDTO> {
    let params = this.generateProductFilterParams(filter);
    return this.http.get<IResponseResult<productDatasourceDTO>>('/product/filter-products', { params }).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<productDatasourceDTO>(`دریافت لیست محصولات `))
    );
  }

  private generateProductFilterParams(filter: productDatasourceDTO): HttpParams {
    let params;
    if (filter !== null) {
      params = new HttpParams()
        .set('pageIndex', filter.pageIndex.toString())
        .set('pageSize', filter.pageSize.toString());
      if (filter.text)
        params = params.append('text', filter.text);
      for (const category of filter.categories) {
        params = params.append('categories', category.toString());
      }
      if (filter.orderBy != null)
        params = params.append('orderBy', filter.orderBy.toString());
      if (filter.startPrice != null)
        params = params.append('startPrice', filter.startPrice.toString());
      if (filter.endPrice != null)
        params = params.append('endPrice', filter.endPrice.toString());
      if(filter.availableOnly)      
        params=params.append('availableOnly','true');
      console.log('service params',params);
      
    }
    return params;
  }

  getProductDetail(productId: number): Observable<ProductDetailDTO> {
    return this.http.get<IResponseResult<ProductDetailDTO>>('/product/product-detail/' + productId).pipe(
      map(res => {       
        if (res.eStatus === Status.Success)
          return res.data;
        else
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<ProductDetailDTO>(`دریافت جزئیات محصول `))      
    );
  }

  getRelatedProducts(productId: number): Observable<ProductMiniDTO[]> {
    return this.http.get<IResponseResult<ProductMiniDTO[]>>('/product/related-products/' + productId).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<ProductMiniDTO[]>(`دریافت لیست محصولات مرتبط `))
    );
  }
  //-----------------------------------

  public GetCategoryChildren(id: number): Observable<CategoryDTO[]> {
    return this.http.get<IResponseResult<CategoryDTO[]>>('/product/child-categories/' + id).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else// if (res.eStatus === Status.NotFound)
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<CategoryDTO[]>(`دریافت فرزندان کتگوری : ${id}`))
    );
  }

  //-------------------------------------

  getProductComments(productId: number): Observable<ProductCommentDTO[]> {
    return this.http.get<IResponseResult<ProductCommentDTO[]>>('/product/product-comments/' + productId).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      take(1),
      catchError(this.errorHandler.handleError<ProductCommentDTO[]>(`دریافت لیست نظرات محصول`))
    );
  }

  addProductComment(comment: ProductCommentMiniDTO): Observable<boolean> {
    return this.http.post<IResponseResult<any>>('/product/add-product-comment', comment).pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return true;
        else
          return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      take(1),
      catchError(this.errorHandler.handleError<boolean>(`ثبت نظر برای محصول`))
    );
  }

}
