import { Component, OnInit, Input, Output } from '@angular/core';
import { ISensorQSO } from './../lib/models/ISensorQSO';
import { SensorLimitPipe } from '../lib/pipes/sensor.limits.pipe';
import { colors } from '../../../common/utilities/colors';
import { QSONotificationService } from '../qso.service.notifications';
@Component({
  selector: 'app-qso-controller',
  templateUrl: './qso-controller.component.html',
  styleUrls: ['./qso-controller.component.less']
})
export class QsoControllerComponent implements OnInit {

  @Input()
  qsoIndex: number = 0;

  @Input()
  qsoControllerSensor: any = {
    client: 'N/A',
    company: 'N/A',
    project: 'N/A',
    uid: 'N/A',
    isRetransmit: false,
    alarms: [],
    comlink: [],
    location: {
      id: 'N/A',
      description: 'N/A',
    },
    layout: {
      containerIndex: -1,
      itemIndex: -1
    },
    timestamp: 'N/A',
    channels: [
      {
        id: 0,
        name: 'N/A',
        value: -1,
        units: 'N/A',
        enable: false,
        trend: 0,
        alarms: {
          high: {
            enable: false,
            limit: -1,
          },
          low: {
            enable: false,
            limit: -1,
          }
        }
      },
      {
        id: 1,
        name: 'N/A',
        value: -1,
        units: 'N/A',
        enable: false,
        trend: 0,
        alarms: {
          high: {
            enable: false,
            limit: -1,
          },
          low: {
            enable: false,
            limit: -1,
          }
        }
      },
      {
        id: 2,
        name: 'N/A',
        value: -1,
        units: 'N/A',
        trend: 0,
        enable: false,
        alarms: {
          high: {
            enable: false,
            limit: -1,
          },
          low: {
            enable: false,
            limit: -1,
          }
        }
      }
    ],
  };

  public UI = {
    collapsedClass: 'normal', // normal or collapsed
    color: colors[this.qsoIndex],
    comlink : false
  };

  private subsComlink  = <any>{};

  constructor(private qsoNotificationService : QSONotificationService) { }

  ngOnInit() {
    this.UI.color = colors[this.qsoIndex];
    this.subsComlink = this.qsoNotificationService.syncQSONotifications().subscribe( comlinks => {
      const comlink = comlinks.filter(  comlink => comlink.location.id === this.qsoControllerSensor.location.id)[0];
      if(comlink){
        this.UI.comlink = true;
      }else{
        this.UI.comlink = false;
      }
    });
  }

  ngOnDestroy(): void {
    try{this.subsComlink.unsubscribe();}catch(e){}
  }


  onToogleCollapseSensor() {
    if (this.UI.collapsedClass === 'normal') {
      this.UI.collapsedClass = 'collapsed';
    } else {
      this.UI.collapsedClass = 'normal';
    }
  }




}
