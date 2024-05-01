import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable, Subscription } from 'rxjs';
  import { finalize } from 'rxjs/operators';
  import { LoaderService } from '../services/loader/loader.service';
  
  @Injectable()
  export class GlobalInterceptor implements HttpInterceptor {
    constructor(private loaderService: LoaderService) {}
  
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      const spinnerSubscription: Subscription = this.loaderService.spinner$.subscribe();
      return next
        .handle(req)
        .pipe(finalize(() => spinnerSubscription.unsubscribe()));
    }
  }
  