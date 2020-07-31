import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as env from '../environments/environment';
import * as transform from './common/filters/text-transform';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable"
import { ObserveOnOperator } from 'rxjs/operators/observeOn';
import { concat } from 'rxjs/observable/concat';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/skipUntil';

import { md5 } from './common/utilities/md5';

export interface IHTTPStoreItem {
  id: string;
  isEnable : BehaviorSubject<boolean>
}


@Injectable()
export class AppHTTPService{

  public relaxTime = 0;
  public HTTPStore : IHTTPStoreItem[] = [];

  constructor(private http: HttpClient){

  }


  get(url,option?){
    let item = {
      id : md5( (new Date()).toISOString()  + url ) + "-" + this.HTTPStore.length,
      isEnable : new BehaviorSubject<boolean>(false)
    }
    if(this.HTTPStore.length == 0){
      item.isEnable = new BehaviorSubject<boolean>(true)
    }else{
      item.isEnable = new BehaviorSubject<boolean>(false)
    }

    this.addQueue(item);
    return Observable.create( observer => {
      let storageItem = this.HTTPStore.filter( httpItem => { return httpItem.id == item.id } )[0]

        var subs =  storageItem.isEnable.asObservable().subscribe( isEnable => {
          if(isEnable){
            this.http.get(url,option).toPromise().then( data => {
              setTimeout( x => {
                this.removeQueue(item.id)
                observer.next(data);
                subs.unsubscribe();
                observer.complete()
              },this.relaxTime);
            }).catch( error => {
              this.removeQueue(item.id)
                observer.error(error);
                subs.unsubscribe();
                observer.complete()
            })
          }
        });

    });
  }

  post(url,data){
    return this.http.post(url,data);
  }

  patch(url,data){
    return this.http.patch(url,data);
  }


  put(url,data){
    return this.http.put(url,data);
  }

  delete(url,options?){
    return this.http.delete(url,options);
  }

  addQueue(item){
    this.HTTPStore.push(item)
  }

  removeQueue(id){
    this.HTTPStore = this.HTTPStore.filter( item => { return item.id != id} );
    if(this.HTTPStore.length > 0 ){
      this.HTTPStore[0].isEnable.next(true);
    }else{

    }
  }


  /*
 this.HTTPStore.push(new BehaviorSubject<boolean>(false))
    return this.HTTPStore[this.HTTPStore.length - 1].asObservable().flatMap( dispatch => {
      return this.http.get(url).map( x => {
        this.HTTPStore[this.HTTPStore.length - 1]
      })
    })

  */


}
