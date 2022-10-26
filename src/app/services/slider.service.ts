import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IResponseResult, Status } from '../DTOs/Common/IResponseResult';
import { SliderMiniDTO } from '../DTOs/Slider/sliderDTO';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  private homeSliders: BehaviorSubject<SliderMiniDTO[] | null> = new BehaviorSubject<SliderMiniDTO[] | null>(null);
  //homeSliders$=this.homeSliders.asObservable();

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  public GetSliders(): Observable<SliderMiniDTO[]> {
    return this.http.get<IResponseResult<SliderMiniDTO[]>>('/slider/GetActiveSliders').pipe(
      map(res => {
        if (res.eStatus === Status.Success)
          return res.data;
        else
          return this.errorHandler.handleServerUnsuccess(res, null);
      }),
      catchError(this.errorHandler.handleError<SliderMiniDTO[]>(`دریافت لیست اسلایدرها `))
    );
  }

  public getCurrentSliders(): Observable<SliderMiniDTO[] | null> {      
    return this.homeSliders.asObservable();
    //return this.homeSliders$;
  }

  public setCurrentSliders(sliders: SliderMiniDTO[]) {
    this.homeSliders.next(sliders);    
  }
}
