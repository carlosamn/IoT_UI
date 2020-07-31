//  Core Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { GraphComponent } from './graph/graph.component';
import {HighchartsChartComponent} from './graph/highcharts-chart.component';

//  Routes
import { graphRoutes } from './graph.routes';

//  Services
import { GraphService } from './graph.service';
@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(graphRoutes, { useHash: false })
  ],
  providers: [GraphService],
  exports: [],
  declarations: [GraphComponent,HighchartsChartComponent]
})
export class GraphModule { }