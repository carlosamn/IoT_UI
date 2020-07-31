import { Injectable } from '@angular/core';
import { AuthenticationService } from './public/authentication/authentication.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { md5 } from './common/utilities/md5';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { finalize } from 'rxjs/operators';


@Injectable()
export class RequestInterceptorService implements HttpInterceptor {

  private pendingRequest = [];

	constructor(public auth: AuthenticationService) {
	}
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = `${this.auth.getToken()}`;
    let dummy = md5( (new Date()).getUTCDate() + Math.random().toString() );
    let params;
		if(token && token !== 'null')
			params = { access_token: token, dummy : dummy  };
		else
			params = '';

		request = request.clone({
			setParams: params
    });
      return next.handle(request)
	}
}

@Injectable()
export class ErrorsInterceptorService implements HttpInterceptor {
  	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  		return next
  			.handle(request)
  			.do((ev: HttpEvent<any>) => {
  			})
  			.catch(response => {
  				if(response instanceof HttpErrorResponse) {
  					response['body'] = response.error;
  					response['body'].success = response.ok;
  				}
  			return Observable.throw(response);
  			});
  	}
}


@Injectable()
export class HttpRequestsInterceptor implements HttpInterceptor {

    requestQueue = [];
    reqCount: number = 0;
    reqFlag: boolean = false;
    prevCount: number = 0;
    obsIntrReq: any;

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        this.prevCount++;
        if (this.prevCount >= 4) {
            this.requestQueue.push(req);
            this.obsIntrReq = Observable.interval(1000).do(() => {
                if (this.reqFlag) {
                    this.requestQueue.splice(0, 1);
                    return next.handle(this.requestQueue[0]);
                }
            })
                .switchMap(() => this.intervalPreviewChecking(this.reqCount, this.requestQueue.length))
                .subscribe(() => { });
        } else {
            return next.handle(req).pipe(
                finalize(() => {
                    this.prevCount--;
                })
            );
        }

    }

    intervalPreviewChecking(rCount, requestQueueLength) {
        if (requestQueueLength == 0) {
            this.prevCount = 0;
            this.reqFlag = false;
            this.obsIntrReq.unsubscribe();
            return this.obsIntrReq = null;
        }
        if (this.prevCount < 4) {
            this.reqFlag = true;
            return Observable.of(true);
        }
        this.reqFlag = false;
        return Observable.of(false);
    }
}

