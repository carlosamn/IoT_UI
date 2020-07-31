import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mobile-locations-card',
  templateUrl: './mobile-locations-card.component.html',
  styleUrls: ['./mobile-locations-card.component.less']
})

export class MobileLocationsCard implements OnInit {

  @Input('index') id: string;
  @Input('locationId') locationId: string;
  @Input('locationDescription') locationDescription: string;
  @Input('project') project: string;
  @Input('version') version: string;
  @Input('uid') uid: string;
  @Input('status') status: string;
  @Input('logintervalTime') logInterval: string;
  @Input('logStartTime') logStart: string;
  @Input('ipNumber') ipNumber: string;
  @Input('ipServer') ipServer: string;

  @Output() onEditChanges = new EventEmitter();


  public UI = {
    isOpen: false,
    isEdit: false
  }

  public DATA = {
    locationId: '',
    locationDescription: '',
    uid: '',
  }

  constructor() { }

  ngOnInit() { }
  ngOnDestroy(): void { }

  onEditData() {

    this.UI.isEdit = true;
    this.DATA.locationId = this.locationId;
    this.DATA.locationDescription = this.locationDescription;
    this.DATA.uid = this.uid;

  }
  doSaveData() {
    const locationToSave = {
      id: this.DATA.locationId,
      description: this.DATA.locationDescription
    };
    const uidToSave = this.DATA.uid;
    this.onEditChanges.emit({ location: locationToSave, uid: uidToSave });
    this.UI.isEdit = false;
  }

}
