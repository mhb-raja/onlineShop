import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserDTO, LoginDTO, loggedInUserDTO } from '../DTOs/Account/UserDTO';
import { IResponseResult, Status } from '../DTOs/Common/IResponseResult';
import { SliderMiniDTO } from '../DTOs/Slider/sliderDTO';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: BehaviorSubject<UserDTO> = new BehaviorSubject<UserDTO>(null);
  private _loggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  get IsLoggedIn(): boolean {
    return this._loggedIn;
  }

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  setCurrentUser(user: UserDTO) {
    this.currentUser.next(user);
    this._loggedIn = user !== null && user !== undefined;

    // console.log('logged-in:', this._loggedIn, 'user', user);
  }

  getCurrentUser(): Observable<UserDTO> {
    return this.currentUser.asObservable();
  }

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
      resolve(this._loggedIn);
    });
    return promise;
  }

  registerUser(data: UserDTO): Observable<boolean> {
    return this.http.post<IResponseResult<any>>('/account/register', data).pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return this.errorHandler.handleServerUnsuccess(res, false);
      }),
      catchError(this.errorHandler.handleError<boolean>(`ثبت نام`))
    );
  }

  loginUser(loginData: LoginDTO): Observable<loggedInUserDTO> {
    return this.http
      .post<IResponseResult<loggedInUserDTO>>('/account/login', loginData)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<loggedInUserDTO>(`ورود`))
      );
  }

  checkUserAuth(): Observable<UserDTO> {
    return this.http
      .post<IResponseResult<UserDTO>>('/account/check-auth', null)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          else return null;
          //return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(this.errorHandler.handleError<UserDTO>(`احراز هویت`))
      );
  }

  logOutUser(): Observable<boolean> {
    return this.http.get<IResponseResult<any>>('/account/sign-out').pipe(
      map((res) => {
        if (res.eStatus === Status.Success) return true;
        else return false;
        //return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<boolean>(`خروج`))
    );
  }

  // activateUser(emailActiveCode: string): Observable<any> {
  //   return this.http.get('/account/activate-account/' + emailActiveCode);
  // }

  editUserAccount(user: UserDTO): Observable<UserDTO> {
    return this.http
      .post<IResponseResult<UserDTO>>('/account/edit-user', user)
      .pipe(
        map((res) => {
          if (res.eStatus === Status.Success) return res.data;
          //return false;
          else return this.errorHandler.handleServerUnsuccess(res, null);
        }),
        catchError(
          this.errorHandler.handleError<UserDTO>(`ویرایش مشخصات کاربر`)
        )
      );
  }
}
