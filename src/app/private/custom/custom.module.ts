import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import{CustomComponent} from './custom.component'
import{HighchartsChartComponent} from './highcharts-chart.component'

//route
import{customRoutes} from './custom.routes';

@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(customRoutes, { useHash: false })
  ],
  providers: [],
  exports: [],
  declarations: [CustomComponent,HighchartsChartComponent]
})
export class CustomModule { }