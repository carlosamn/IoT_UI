import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//  Components
import { AppComponent } from './app.component'

export const appRoutes: Routes = [
	{ path: '**', redirectTo: 'login' }
];
