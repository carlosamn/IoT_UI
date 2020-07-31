import { BrowserModule, Title } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { appRoutes } from './app.routes';
import { RouterModule } from '@angular/router';
import { PrivateModule } from './private/private.module';
import { PublicModule } from './public/public.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationGuard, AdminRoleGuard } from './common/guards/authentication.guard';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { AppComponent } from './app.component';

//  Interceptors
import { RequestInterceptorService } from './interceptor.service';
import { ErrorsInterceptorService } from './interceptor.service';
import { HttpRequestsInterceptor } from './interceptor.service';

//  Shared Services
import { AppSharedService } from './app.shared-service';
import { AppHTTPService } from './app.http-service';

//  Third parties
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { DndModule } from 'ng2-dnd';
import { DeviceDetectorModule } from 'ngx-device-detector';

@NgModule({
  declarations: [

    AppComponent
  ],
  imports: [
    HttpClientModule,
    HttpModule,
    PrivateModule,
    PublicModule,
    BrowserModule,

    DndModule.forRoot(),
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
    RouterModule.forRoot(appRoutes, { useHash: false }),
    DeviceDetectorModule.forRoot()

  ],
  exports: [DndModule],
  providers: [
    Title,
    AppSharedService,
    AppHTTPService,
    AuthenticationGuard,
    AdminRoleGuard,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true },
    //{ provide: HTTP_INTERCEPTORS, useClass: HttpRequestsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
