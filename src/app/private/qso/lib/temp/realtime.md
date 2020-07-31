/**
 *  --------------------------------------------------
 *  --    QSO REALTIME HIGCHART.JS
 *  --------------------------------------------------
 *
 *
 *
 */



 // ------------------------------------------------------------ //
 // -- Imports :: Angular Resources
 // ------------------------------------------------------------ //
 import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
 // ------------------------------------------------------------ //




// ------------------------------------------------------------ //
 // -- Imports :: HighCharts.js Resources
 // ------------------------------------------------------------ //
import * as Highcharts from 'highcharts/highstock';
import { chart } from 'highcharts';
 // ------------------------------------------------------------ //



 // ------------------------------------------------------------ //
 // -- Imports :: Chart Options
 // ------------------------------------------------------------ //
  import {options} from './qso-realtime.component.options';
 // ------------------------------------------------------------ //



 // ------------------------------------------------------------ //
 // -- Imports :: Services
 // ------------------------------------------------------------ //
  import { QSOService } from "../../qso/qso.service";
 // ------------------------------------------------------------ //




 // ------------------------------------------------------------ //
 // -- @Component QSO Realtime
 // ------------------------------------------------------------ //
@Component({
  selector: 'app-qso-realtime',
  templateUrl: './qso-realtime.component.html',
  styleUrls: ['./qso-realtime.component.css']
})
 // ------------------------------------------------------------ //






 // ------------------------------------------------------------ //
 // -- Component Class
 // ------------------------------------------------------------ //
export class QsoRealtimeComponent implements OnInit {


  // -------------------------------- //
  // -- UI/UX Storages
  // -------------------------------- //
    public STORAGE = {};
    public UX = {};
    public UI = {
      chart : {
        options : options,
        data1 : [],
        data2 : [],
        data3 : []
      }
    }
  // -------------------------------- //


  // -------------------------------- //
  // -- viewChild and DOM Objects
  // -------------------------------- //
     @ViewChild('chartTag') chartTag: ElementRef;
  // --------------------------------- //


  // -------------------------------- //
  // -- HighCharts Objects ---------- //
  // -------------------------------- //
     public qsoRealTimeChart: Highcharts.ChartObject;
  // -------------------------------- //


  // -------------------------------- //
  // -- RXJS Subs and Obs  ---------- //
  // -------------------------------- //
  public SUBS = {
    dataStream : <any>{},
  }
  // -------------------------------- //



  // -------------------------------- //
  // -- Class Constructor ----------- //
  // -------------------------------- //
  constructor(private qsoService: QSOService) {
    //console.log("QSO Chart Created ... ");
  }
  // -------------------------------- //



  // -------------------------------- //
  // -- ng LifeCycle ---------------- //
  // -------------------------------- //
  async ngOnInit() {

    //console.log("ngOnInit Realtime")

    // Init Chart
    this.qsoRealTimeChart = Highcharts.stockChart(this.chartTag.nativeElement,  <any>this.UI.chart.options);

    // Wait for get Devices on QSO Dashboard
    let devOnStreaming = await this.getDevicesOnStreaming();

    // Init Streaming
    this.qsoService.openStreaming(devOnStreaming, "sensor");

    // Init Subscription to Sensor Streaming
    this.SUBS.dataStream = this.qsoService.getDevices().subscribe( devices => {

      this.updateChart(devices);

      //console.log("Updating Chart .... ")

    });
  }

  async ngOnDestroy(){

    //console.log("ngOnDestroy Realtime")

    this.SUBS.dataStream.unsubscribe();
    try{this.qsoRealTimeChart.destroy()}catch(e){
      //console.log(e)
    }
  }
  // -------------------------------- //






  // -------------------------------- //
  // -- Componentns Helpers --------- //
  // -------------------------------- //
async getDevicesOnStreaming(){
  let onInit,onGetDevices,onGetSettings,onGetData,onSetDevice,onUpdate,onDestroy;
  let vDevices, oDevices, vUIDs;
  let self = this;

  onInit = await this.qsoService.onDeviceInit();
  onGetDevices = await this.qsoService.onGetDevices(onInit);
  onGetSettings = await this.qsoService.onGetAnalogSettings(onGetDevices);
  vDevices = await this.qsoService.onSetData(onGetSettings);
  vUIDs = onGetSettings.map(x => "QSO" + x.uid);
  return vUIDs;
}







updateChart(devices){

  if(window.location.href.includes('localhost')){
   var device = devices[1];
  }else{
    var device = devices[0];
  }


  let vTime = (new Date(device.timestamp).getTime());

  let sensor1 = device.sensors[0];
  let sensor2 = device.sensors[1];
  let sensor3 = device.sensors[2];

  let vValue1 = parseFloat(sensor1.value);
  let vValue2 = parseFloat(sensor2.value);
  let vValue3 = parseFloat(sensor3.value);


  let point1 = [vTime  , vValue1];
  let point2 = [vTime  , vValue2];
  let point3 = [vTime  , vValue3];

  let isDataAlreadyInChart1 = this.UI.chart.data1.filter( data => {
    return data[0] == vTime
  }).length;
  let isDataAlreadyInChart2 = this.UI.chart.data2.filter( data => {
    return data[0] == vTime
  }).length;
  let isDataAlreadyInChart3 = this.UI.chart.data3.filter( data => {
    return data[0] == vTime
  }).length;


  if(isDataAlreadyInChart1 == 0){
      if(this.UI.chart.data1.length < 200){
        this.UI.chart.data1.push(point1);
      }else{
        this.UI.chart.data1.shift();
        this.UI.chart.data1.push(point1);
      }

   let qsoSeries0 = this.qsoRealTimeChart.series[0];
    //console.log(this.qsoRealTimeChart.series[0])

    this.qsoRealTimeChart.series[0].update({
      data: this.UI.chart.data1.sort()
    }, true);

    this.qsoRealTimeChart.redraw();
  }


  if(isDataAlreadyInChart2 == 0){
    if(this.UI.chart.data2.length < 200){
      this.UI.chart.data2.push(point2);
    }else{
      this.UI.chart.data2.shift();
      this.UI.chart.data2.push(point2);
    }

  this.qsoRealTimeChart.series[1].update({
    data: this.UI.chart.data2.sort()
  }, true);

  this.qsoRealTimeChart.redraw();
}

if(isDataAlreadyInChart3 == 0){
  if(this.UI.chart.data3.length < 200){
    this.UI.chart.data3.push(point3);
  }else{
    this.UI.chart.data3.shift();
    this.UI.chart.data3.push(point3);
  }

this.qsoRealTimeChart.series[2].update({
  data: this.UI.chart.data3.sort()
}, true);

this.qsoRealTimeChart.redraw();
}


}



}
