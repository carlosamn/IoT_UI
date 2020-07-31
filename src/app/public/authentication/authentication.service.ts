import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AppSharedService } from '../../app.shared-service';
import { AppHTTPService } from './../../app.http-service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthenticationService {
  private path = { base: `${environment.basepath}`, model: 'users' };

  constructor(private http: AppHTTPService, private sharedService: AppSharedService) {

  }


  getUserData() {
    return new Promise<any>((resolve, reject) => {
      this.sharedService.currentUserObject.subscribe(user => {
        if (user['userType']) {
          resolve(user);
        } else {
          resolve({});
        }
      });
    });
  }

	/*
		POST /users/login
		Login a user with username/email and password.
	*/
  login(credentials): Observable<any> {
    let url = `${this.path.base}/${this.path.model}/login`;
    return this.http.post(url, credentials)
      .map((data: any) => {
        this.setCookie(data);
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }
	/*
		POST /users/logout
		Logout a user with access token.
	*/
  logout() {
    let url = `${this.path.base}/${this.path.model}/logout`;
    localStorage.clear();
    return this.http.post(url, {})
      .map((data: any) => {
        this.removeToken();
        return data;

      })

      .catch((e: any) => Observable.throw(this.errorHandler(e)));

  }

	/*
		GET /users/{id}
		Find current user data
	*/
  me() {
    let url = `${this.path.base}/${this.path.model}/${this.getUserId()}`;
    return this.http.get(url)
      .map((user: any) => {
        this.sharedService.settingUserObject(user);
        return user
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

	/*
	POST: /users/{id}/verify
	Trigger user's identity verification with configured verifyOptions
	*/
  verifyUser() {
    let url = `${this.path.base}/${this.path.model}/${this.getUserId()}/verify`;
    return this.http.post(url, {})
      .map((data: any) => {
        return data
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

	/*
	POST: /users/change-password
	Change a user's password.
	*/
  changePassword(credentials) {
    let url = `${this.path.base}/${this.path.model}/change-password`;
    return this.http.post(url, credentials)
      .map((data: any) => {
        return data
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

	/*
	GET: /users/confirm
	Confirm a user registration with identity verification token.
	*/
  confirmUser(uid, token) {
    let url = `${this.path.base}/${this.path.model}/confirm?uid=${uid}&token=${token}`;
    return this.http.get(url)
      .map((data: any) => {
        return data
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

	/*
	GET: /users/count
	Count instances of the model matched by where from the data source.
	*/
  countUsers(uid, token) {
    let url = `${this.path.base}/${this.path.model}/count`;
    return this.http.get(url)
      .map((data: any) => {
        return data
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

	/*
	POST: /users/reset
	Count instances of the model matched by where from the data source.
	*/
  resetPassword(options?) {
    if (!options) options = {};
    let url = `${this.path.base}/${this.path.model}/reset`;
    return this.http.post(url, options)
      .map((data: any) => {
        return data
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

	/*
	POST: /users/reset
	Count instances of the model matched by where from the data source.
	*/
  resetPasswordViaToken(newpassword) {
    let url = `${this.path.base}/${this.path.model}/reset-password`;
    return this.http.post(url, { newPassword: newpassword })
      .map((data: any) => {
        return data
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  //  Get Token
  getToken(): string {
    var name = 'login' + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        let data = JSON.parse(c.substring(name.length, c.length));
        sessionStorage.userId = data.userId;
        return data.token;
      }
    }
    return undefined;
  }

  getUserId(): string {
    return sessionStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) return true;
    else return false;
  }

  removeToken() {
    document.cookie = 'login=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    sessionStorage.removeItem('userId');
  }

  private setCookie(data) {
    let date = new Date();
    date.setTime(date.getTime() + (2 * 24 * 60 * 60 * 1000));
    let expires = `expires=${date.toUTCString()}`;
    let cookieData = { userId: data.userId, token: data.id };
    document.cookie = `login=${JSON.stringify(cookieData)};${expires};path=/`
  }

  private errorHandler(error: any): void {
    return error;
  }
}
