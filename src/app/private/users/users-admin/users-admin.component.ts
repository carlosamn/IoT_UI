import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { ClientsService } from '../../clients/clients.service';
import { Subject } from 'rxjs';
import { AppSharedService } from '../../../app.shared-service';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-users-admin',
  templateUrl: './users-admin.component.html'
})
export class UsersAdminComponent implements OnInit {
  public Users;
  public users;
  public clients;
  public updflag;
  public activeIndex;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  constructor(private activeRoute:ActivatedRoute, 
              private usersService: UsersService,
              private router:Router, 
              private appService:AppSharedService,
              private clientservice:ClientsService ) {   
    this.users = [];
  }
  
  ngOnInit() {  
    this.appService.currentDtOptions.subscribe(options => this.dtOptions = options); 
    this.usersService.getUsers({ userType:'sysadmin' })
      .subscribe(users => {
        this.users = users;
        this.dtTrigger.next();  
      });     
  }

  public activateIndex(index) {
    this.activeIndex = index;
  }
    
  public deleteUser(userId, index) {
    if(confirm('Do you want to permanently delete this User?'))
      this.usersService.deleteUserById(userId)
        .subscribe(result => {
          this.users.splice(index, 1);
        }, err => {
          //console.error(err);
        });
  }

  public updateUser(user) {
    this.usersService.updateUser(user.id, user)
      .subscribe(result => {
        this.activeIndex = -1;
      }, err => {
        //console.error(err);
      });
  }
}