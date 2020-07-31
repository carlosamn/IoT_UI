import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IAnalogInput } from '../../lib/models/IAnalogInput';

@Component({
  selector: 'app-mobile-analogs-card',
  templateUrl: './mobile-analogs-card.component.html',
  styleUrls: ['./mobile-analogs-card.component.less']
})

export class MobileAnalogsCard implements OnInit {

  @Input('index') id: string;
  @Input('analog') analog: IAnalogInput;


  @Output() onEditChanges = new EventEmitter();

  /**



          {
  "uid": "914",
  "channelId": 1,
  "packetType": 19,
  "inSync": false,
  "name": "Sensor 1",
  "notifyDevice": false,
  "clientCode": "AMS",
  "showinmap": false,
  "enable": false,
  "unit": "kpa",
  "analog_h": 5,
  "analog_l": 0,
  "physical_h": 65535,
  "physical_l": 0,
  "alarm_h": 65535,
  "alarm_l": 0,
  "enable_alarm_h": true,
  "enable_alarm_l": true,
  "text_h": "High Alarm Warning",
  "text_l": "Low Alarm Warning",
  "trendTimeMin": 5,
  "trendDelta": 1000,
  "id": "5b89a68ea5498920f8458a40",
  "trendEnable": true
}




   */


  public UI = {
    isOpen: false,
    isEnable: false,
    isEdit: false,
    isEditName: false,
    tab: 'alarms'
  }

  public DATA = {
    uid: '',
    name: '',
    trend: {
      enable: false,
      time: 0.00,
      delta: 0.00
    },
    alarms: {
      low: {
        enable: false,
        message: '',
        limit: 0.0
      },
      high: {
        enable: false,
        message: '',
        limit: 0.0
      },
    },
    map: {
      enable: false
    }
  }

  constructor() { }

  ngOnInit() {

    this.UI.isEnable = this.analog.enable;

    if (this.analog) {

      this.DATA.name = this.analog.name ? this.analog.name : '';
      this.DATA.map.enable = this.analog.showinmap ? this.analog.showinmap : false;

      this.DATA.trend.enable = this.analog.trendEnable ? this.analog.trendEnable : false;
      this.DATA.trend.time = this.analog.trendTimeMin ? this.analog.trendTimeMin : 0.0;
      this.DATA.trend.delta = this.analog.trendDelta ? this.analog.trendDelta : 0.0;

      this.DATA.alarms.high.enable = this.analog.enable_alarm_h ? this.analog.enable_alarm_h : false;
      this.DATA.alarms.high.limit = this.analog.alarm_h ? this.analog.alarm_h : 0.0;
      this.DATA.alarms.high.message = this.analog.text_h ? this.analog.text_h : '';

      this.DATA.alarms.low.enable = this.analog.enable_alarm_l ? this.analog.enable_alarm_l : false;
      this.DATA.alarms.low.limit = this.analog.alarm_l ? this.analog.alarm_l : 0.0;
      this.DATA.alarms.low.message = this.analog.text_l ? this.analog.text_l : '';
    }


  }

  ngOnDestroy(): void { }

  onEditData() {

    this.UI.isEdit = true;

  }
  doSaveData() {
    //this.onEditChanges.emit({ location: locationToSave, uid: uidToSave });
    this.UI.isEdit = false;
  }

  toogleCard(tab) {

    if (!this.UI.isOpen && this.UI.tab == tab) {
      this.UI.isOpen = true;
      this.UI.tab = tab;
      if (tab === 'units') {
        this.UI.isOpen = false;
      }
    }

    else if (!this.UI.isOpen && this.UI.tab != tab) {
      this.UI.isOpen = true;
      this.UI.tab = tab;
    }

    else if (this.UI.isOpen && this.UI.tab == tab) {
      this.UI.isOpen = false;
      this.UI.tab = tab;
    }

    else if (this.UI.isOpen && this.UI.tab != tab) {
      this.UI.isOpen = true;
      this.UI.tab = tab;
    }

    else {
      this.UI.isOpen = false;
      this.UI.tab = 'alarms';
    }


  }
  toogleEditName() {
    this.UI.isEditName = !this.UI.isEditName;
  }
  setEditName() {
    this.UI.isEditName = true;
  }
  resetEditName() {
    this.UI.isEditName = false;
  }


}
