import { OnDestroy } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";

export function componentDestroyed(component: OnDestroy): Observable<void> {
    const oldNgOnDestroy = component.ngOnDestroy;
    const destroyed$ = new ReplaySubject<void>(1);
    component.ngOnDestroy = () => {
      oldNgOnDestroy.apply(component);
      destroyed$.next(undefined);
      destroyed$.complete();
    };
    return destroyed$.asObservable();
  }