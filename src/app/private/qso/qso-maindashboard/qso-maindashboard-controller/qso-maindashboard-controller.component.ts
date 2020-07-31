import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {IControllerSensorQSO, toIControllerSensorQSO } from '../../lib/models/ISensorQSO';
import {ISensorQSO} from '../../lib/models/ISensorQSO';
import { IComlinkNotification } from '../../lib/models/IComlinkNotification';
import { QSOService } from '../../qso.service';
import { QSONotificationService } from '../../qso.service.notifications';

@Component({
  selector: 'app-qso-maindashboard-controller',
  templateUrl: './qso-maindashboard-controller.component.html',
  styleUrls: ['./qso-maindashboard-controller.component.less']
})

export class QsoMainDashboardControllerComponent implements OnInit {

  private _kContainer: number;
  private _kItem: number;


  @Input()
  sensor: IControllerSensorQSO;


  @Input() set kContainer(kContainer: number) {
     this._kContainer = kContainer;
  }
  get kContainer(): number {
      return this._kContainer;
  }

  @Input() set kItem(kItem: number) {
    this._kItem = kItem;
    let id, layout;

    id = this.sensor.location.id;
    layout = {
      dashboardLayout: {
        containerIndex: this._kContainer,
        itemIndex: this._kItem
      }
    };
    this.qsoService.patchLayout(id, layout);
  }
  get kItem(): number {
      return this._kItem;
  }


  public ui = {
    collapse: true,
    comlink: false,
    areAlarms : false,
    areAlarmsOn: false
  };

  public subsComlink = <any>{};

  public DATA = {
    SENSOR : <IControllerSensorQSO>{}
  };

  constructor(private qsoService: QSOService, private qsoNotificationService : QSONotificationService) {}

  ngOnInit(): void {
    this.DATA.SENSOR = this.sensor;
    this.ui.areAlarms = this.DATA.SENSOR.channels.some( channel => channel.alarms.high.enable || channel.alarms.low.enable );
    this.subsComlink = this.qsoNotificationService.syncQSONotifications().subscribe( comlinks => {
      const comlink = comlinks.filter(  comlink => comlink.location.id === this.DATA.SENSOR.location.id)[0];
      if(comlink){
        this.ui.comlink = true;
      }else{
        this.ui.comlink = false;
      }
    });
  }

  getColorClass() {
    return `qsoTagColor-container${this.kContainer}-item${this.kItem}`;
  }

  ngOnChanges(changes): void {

    this.DATA.SENSOR = this.sensor;
    this.ui.areAlarms = this.DATA.SENSOR.channels.some( channel => channel.alarms.high.enable || channel.alarms.low.enable );


  }



  ngOnDestroy(): void {
    try{this.subsComlink.unsubscribe();}catch(e){}
  }


}
