import { Injectable } from '@angular/core';
import { defer, NEVER, Subject } from 'rxjs';
import { finalize, share } from 'rxjs/operators';
import { LoaderState } from '../../models/loaderstate.model';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public readonly spinner$ = defer(() => {
    this.show();
    return NEVER.pipe(
      finalize(() => {
        this.hide();
      })
    );
  }).pipe(share());

  private loaderSubject = new Subject<LoaderState>();

  loaderState = this.loaderSubject.asObservable();

  show() {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }

  hide() {
    this.loaderSubject.next(<LoaderState>{ show: false });
  }
}
