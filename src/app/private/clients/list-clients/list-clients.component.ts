import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppSharedService } from '../../../app.shared-service';
import { ClientsService } from '../clients.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.css']
})
export class ListClientsComponent implements OnInit {
  public clients;
  public activeIndex;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public client;
  public updateFlag;
  constructor(private clientsService: ClientsService, private appService: AppSharedService, private router:Router, private activeRoute:ActivatedRoute) {
    this.clients = [];   
  }

  ngOnInit() {
    this.appService.currentDtOptions.subscribe(options => this.dtOptions = options);

  	this.clientsService.getClients()
  		.subscribe(clients => {
        this.dtTrigger.next();
        this.clients = clients;
  		});
  }

  public activateIndex(index) {
    this.activeIndex = index;
  }

  public updateClient(client) {
    this.clientsService.updateClient(client.id, client)
      .subscribe(client => {
        this.activeIndex = undefined;
      }, err => {
        //console.log(err);
      });
  }
  public deleteClient(clientId, index) {
    if(confirm("Do you want to permanently delete this Client?")){
    this.clientsService.deleteClient(clientId)
      .subscribe(res => {
        this.clients.splice(index, 1);
      }, err => {
        //console.log(err);
      });}
      else  return false;
  }

}