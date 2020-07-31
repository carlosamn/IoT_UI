import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../public/authentication/authentication.service';
import { AppSharedService } from '../../../app.shared-service';
import { Subject } from 'rxjs';

import { LogsService } from '../logs.service';
import { LocationsService } from '../../locations/locations.service';
import { ProjectsService } from '../../projects/projects.service';
import { DevicesService } from '../../devices/devices.service';
import { LoadingService } from '../../shared/loading.service';

import { ILocation } from '../../../common/models/location';

import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

declare var jquery: any;
declare var $: any;
  
export interface ReportParameters {
  startDate: string;
  endDate: string;
  interval: string;
}

export interface Params extends ReportParameters {
  uid: string;
}

@Component({
  selector: 'app-log-data',
  templateUrl: './log-data.component.html',
  styleUrls: ['./log-data.component.css']
})

export class LogsDataComponent implements OnInit {

  public p = 1;
  public filter;
  public controllers;
  public locations;
  public projects = [];
  public apiParams: Params;
  public pagination = 10;
  public reportData = [];
  public controllerSelected = [];
  public reportParams: ReportParameters;
  public logo;
  private chosenProjectId;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  // RXJS Subscriptions
  public SUBS = {
    location: <any>{},
    isCollar : <any>{},
    DtOptions: <any>{}
  };

  constructor(
    private projectsService: ProjectsService,
    private devicesService: DevicesService,
    private appShared: AppSharedService,
    private locationService: LocationsService,
    private loadingService: LoadingService,
    private readonly logsService: LogsService
  ) {
    this.chosenProjectId = '';
    this.locations = [];
  }

  ngOnInit() {
    this.SUBS.DtOptions = this.appShared.currentDtOptions.subscribe(options => this.dtOptions = options);

    this.apiParams = {
      uid: '',
      startDate: '',
      endDate: '',
      interval: ''
    };

    this.reportParams = {
      startDate: '',
      endDate: '',
      interval: ''
    };

    this.getProjects();

    this.appShared.currentLogo.subscribe(logo => this.logo = logo);
  }

  getProjects() {
    this.projectsService.getProjects().subscribe(projects => {
      this.projects = projects;
    }, err => {
      //console.error(err);
    });
  }

  showLocationsByProject(projectId) {
    this.chosenProjectId = projectId;
    this.locationService.getLocationsAsObs({ projectId }).subscribe(locations => {
      locations.map(location => location.checked = false);
      this.locations = locations;
      this.dtTrigger.next();
    });
    $('#projects').hide();
    $('#report').show();
  }

  checkAllLocations($event) {
    if ($event.target.checked) {
      this.locations.map(location => location.checked = true);
    } else {
      this.locations.map(location => location.checked = false);
    }
  }

  async createReport() {
    if (!this.reportParams.startDate || !this.reportParams.endDate) {
      alert('Select date');
      return false;
    }
    let queryParams: any = {};
    queryParams.projectId = this.chosenProjectId;

    let filteredLocations = this.locations.filter(location => location.checked);

    for (const params of Object.keys(this.reportParams)) {
      if (params === 'startDate' || params === 'endDate') {
        queryParams[params] = this.reportParams[params].replace(/-/gi, '');
      } else {
        queryParams[params] = this.reportParams[params];
      }
    }

    for (let i = 0; i < filteredLocations.length; i++) {
      queryParams.locationId = filteredLocations[i].locationId;
      this.loadingService.show();
      let data: any = await this.devicesService.reportsBulkApi(queryParams);

      /*  Uncomment hardcoded data
      let data: any = await this.logsService.getData();
      */

      //  Verificamos que existan filas para un reporte txt
      if (data.report.reportRows.length) this.downloadFile(data.report, filteredLocations[i].description);
      else {
        alert(`Does not exist data log for location ${filteredLocations[i].description}`);
        this.loadingService.hide();
      };
    }
  }

  backToProjects() {
    $('#report').hide();
    $('#projects').show();
  }

  printReportData() {
    html2canvas(document.getElementById('report-data')).then(canvas => {
      var imgData = canvas.toDataURL('image/png');
      var doc = new jsPDF("p", "mm", "a4");
      var width = doc.internal.pageSize.width | 595;
      var height = doc.internal.pageSize.height | 842;

      doc.addImage(imgData, 'JPEG', 2, 10, 210, 297);
      doc.save('report.pdf');

      $('#report-data').hide();
    });    
  }

  printReport() {
    $('#report-data').show();
    this.printReportData(); 
  }  


  async downloadFile(report, locationName) {
    let headers = report.sensorNames;
    let rows = report.reportRows;
    let items;
    //  Sensors Qty
    let finalArray = [];
    let dataObject: any = {};

    rows.forEach((row, index) => {
      row = row.split(' ');
      dataObject = {};
      for (let i = 0; i < row.length; i++) {
        dataObject[headers[i]] = parseInt(row[i], 10);
      }
      finalArray.push(dataObject);
    });
    console.log('final array');
    console.log(finalArray);

    this.loadingService.hide();
    //  Definimos la data, key value

    //  Creamos una función que haga un reemplazo
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    
    //  Definimos las cabeceras del objeto
    const header = Object.keys(finalArray[0]);


    let csv = finalArray.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(' '));

    csv.unshift(`ProjectId: ${this.chosenProjectId}`, `LSD: ${locationName}`, `UTC Offset: ${report.utcOffset}`, header.join(' '));

    let csvArray = csv.join('\r\n');

    console.log(csvArray);
    var a = document.createElement('a');
    var blob = new Blob([csvArray], { type: 'text/asc' });
    console.log('blob here');
    console.log(blob);
    var url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = `${locationName}.asc`;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}
