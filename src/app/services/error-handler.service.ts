import { Injectable } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Observable, of } from 'rxjs';
import { IResponseResult, Status } from '../DTOs/Common/IResponseResult';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private router:Router) { }//(private snackBar: MatSnackBar) { }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} با خطا مواجه شد: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  // private handleError(error: HttpErrorResponse) {
  //   if (error.status === 0) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong.
  //     console.error(
  //       `Backend returned code ${error.status}, body was: `, error.error);
  //   }
  //   // Return an observable with a user-facing error message.
  //   return throwError(
  //     'Something bad happened; please try again later.');
  // }




  private log(message: string, info: SwalData = { icon: 'error', title: 'خطا' }) {
    console.log(info);
    
    if (message)
      Swal.fire({
        icon: 'warning',
        title: info.title,//'Oops...',        
        text: message,
      })
  }

  handleServerUnsuccess<T>(res: IResponseResult<T>, result?: T) {
    switch (res.eStatus) {
      case Status.NotFound:
        console.log(res.message);
        this.router.navigate(['/not-found']);
        console.log('after nav');
        return null;
        
      default:
        console.log('default',res);
        this.log(res.message);
        return result;
    }


    //return (x: any) => {
    console.log(res);
    const x = this.swalInfo(res.eStatus);

    this.log(res.message, x);
    return result;

    /*else if (res.status === 'AccessDenied') {
        //         // this.alertController.create({
        //         //   header: 'اخطار',
        //         //   message: 'شما به این بخش دسترسی ندارید',
        //         //   buttons: ['ok']
        //         // }).then(alertEl => {
        //         //   alertEl.present();
        //         //   this.router.navigate(['/products']);
        //         // });
    
        //       }
         */


  }

  swalInfo(s: Status): SwalData {
    let data: SwalData;
    switch (s) {
      case Status.NotFound:
        data = { icon: 'warning', title: 'هشدار' }
        break;
      case Status.AccessDenied: case Status.UnAuthorized:
        data = { icon: 'error', title: 'اخطار' };
        break;
      case Status.Error:
        data = { icon: 'error', title: 'خطا' };
        break;
    }
    return data;
  }
}

export interface SwalData {
  icon: string,
  title: string
}
// success
// error
// warning
// info
// question