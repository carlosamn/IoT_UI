import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { ClientsService } from '../../clients/clients.service';
import { Subject } from 'rxjs';
import { AppSharedService } from '../../../app.shared-service';
import { CompaniesService } from '../../companies/companies.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-user-invite',
  templateUrl: './user-invite.component.html'
})

export class UserInviteComponent implements OnInit {

  public logo;
  public users;
  public clients;
  public invitation;
  public activeIndex;
  public companies;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  constructor(private usersService: UsersService,
              private router: Router,
              private appService: AppSharedService,
              private clientservice: ClientsService,
              private companiesService: CompaniesService ) {

    this.users = [];
    this.clients = [];

    this.invitation = {
      domain: '',
      project: '',
      userId: ''
    };

    this.companiesService.getCompanies().subscribe(companies => {
      this.companies = companies;
    });
  }

  public activateIndex(index) {
    this.activeIndex = index;
  }

  public updateUser(user) {
    this.usersService.updateUser(user.id, user)
      .subscribe(response => {
        this.activeIndex = -1;
      }, err => {
        //console.error(err);
      });
  }

  public getClient() {
    this.clientservice.getClients()
    .subscribe(clients => {
      this.clients = clients;
    });
  }

  deleteUser(userId, index) {
    if (confirm('Do you want to permanently delete this User?'))
    this.usersService.deleteUserById(userId)
      .subscribe(res => {
        this.users.splice(index, 1);
      }, err => {
        //console.error(err);
      });
  }

  async sendInvitation(user) {

    $('#sendInvitation').modal('show');

    const userId = user.id;

    await this.appService.currentLogo.subscribe(logo => this.logo = logo);

    this.invitation.project = user.companyIds;
    this.invitation.domain = window.location.host;
    this.invitation.logo = user.logo;

    this.usersService.sendEmail(userId, this.invitation).subscribe(info => {
      //console.log(info);
      setTimeout(function() {
        $('#sendInvitation').modal('hide');
       }, 2000);
    });
  }

  ngOnInit() {
    this.appService.currentDtOptions.subscribe(options => this.dtOptions = options);

    this.usersService.getInvitedUsers()
      .subscribe(users => {
        //console.log(users);
        this.users = users;
        this.dtTrigger.next();
      });
      this.getClient();
  }
}
