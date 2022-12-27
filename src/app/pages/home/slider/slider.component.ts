import { Component, OnInit } from '@angular/core';
import { from, iif, Observable, of } from 'rxjs';
import {
  concatAll,
  defaultIfEmpty,
  exhaustMap,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';

import { SliderMiniDTO } from 'src/app/DTOs/Slider/sliderDTO';
import { SliderService } from 'src/app/services/slider.service';
import { SliderImagePath } from 'src/app/Utilities/PathTools';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  public sliders$: Observable<SliderMiniDTO[]>= null;
  imagePath = SliderImagePath;

  constructor(private sliderService: SliderService) {}

  ngOnInit(): void {

    
    this.sliders$ = this.sliderService.getCurrentSliders().pipe(
      switchMap((sliders) => {
        if (sliders === null) {
          return this.getSlidersFromServer();
        } else {
          return of(sliders); //sliders;
        }
      }),
      shareReplay()
    ); //.subscribe(sliders => this.sliders$ = sliders);
  }

  getSlidersFromServer(): Observable<SliderMiniDTO[]> {
    return this.sliderService.GetSliders().pipe(
      tap((res) => this.sliderService.setCurrentSliders(res)),
      shareReplay()
    );
  }
}
