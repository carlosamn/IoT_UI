import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts/highstock';
import { AppSharedService } from '../../../app.shared-service';

import { FL3Service } from '../../fl3/fl3.service';
import * as HC_map from 'highcharts/modules/map';
//import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_ce from 'highcharts-custom-events';

//HC_map(Highcharts);
//require('../../../js/worldmap')(Highcharts);

//HC_exporting(Highcharts);
HC_ce(Highcharts);

Highcharts.setOptions({
  title: {
    style: {
      color: 'orange'
    }
  }
});

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html'
})

export class GraphComponent implements OnInit {


  constructor (private fl3Service: FL3Service, private appShared: AppSharedService) {
  }

  ngOnInit() {}
  Highcharts = Highcharts;

  // Demo #1
  optFromInputString = `
  {
    "subtitle": { "sensors": "Highcharts chart" },
    "series": [{
      "type": "line",
      "data": [11,2,3,1,-2]
    }, {
      "data": [5,6,7, 9, 10]
    },
    {
      "data": [5,2,-1, 9, 11]
    }]
  }
  `;

  optFromInput = JSON.parse(this.optFromInputString);
  updateFromInput = false;

  updateInputChart = function() {
    this.optFromInput = JSON.parse(this.optFromInputString);
  };

  seriesTypes = {
    line: 'column',
    column: 'scatter',
    scatter: 'spline',
    spline: 'line'
  };

  toggleSeriesType = function(index = 0) {
    this.optFromInput.series[index].type = this.seriesTypes[this.optFromInput.series[index].type];
    // nested change - must trigger update
    this.updateFromInput = true;
  };

}
