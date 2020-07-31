import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicComponent } from './public.component';
import { PUBLIC_ROUTES } from './public.routes';
import { AuthenticationModule } from './authentication/authentication.module';

@NgModule({
  imports: [
    AuthenticationModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(PUBLIC_ROUTES, { useHash: false })
  ],
  providers: [],
  exports: [PublicComponent],
  declarations: [PublicComponent]
})

export class PublicModule { }
