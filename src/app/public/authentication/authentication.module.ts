import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { authRoutes } from './authentication.routes';
import { FormsModule }   from '@angular/forms';
import { AuthenticationService } from './authentication.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forRoot(authRoutes, { useHash: false })
  ],
  providers: [AuthenticationService],
  exports: [LoginComponent],
  declarations: [LoginComponent]
})
export class AuthenticationModule { }
