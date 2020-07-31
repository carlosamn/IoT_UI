import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ContainersService } from '../../containers/containers.service';
import { ClientsService } from '../clients.service';
@Component({
  selector: 'app-client-add-edit',
  templateUrl: './client-add-edit.component.html',
  styleUrls: ['./client-add-edit.component.css']
})
export class ClientAddOrEditComponent implements OnInit {
	@ViewChild('companyBanner') companyBanner;
	@ViewChild('companyLogo')   companyLogo;

	public banner;
	public logo;
	public client;
	public bannerUrl;
  public logoUrl;
  public isUpdate = false;

  constructor(private router: Router,
  						private activeRoute: ActivatedRoute,
  						private containers: ContainersService, 
  						private clientsService: ClientsService) {
    this.client = { dashboards: {} };  

  }

  ngOnInit() {
      this.bannerUrl = this.client.companyBanner;
      this.logoUrl = this.client.companyLogo;
      this.activeRoute.params.subscribe(params => { 
        let clientId = params['clientId'];
        if(clientId) {
          this.isUpdate = true;
          this.clientsService.getClientById(clientId)
            .subscribe(client => {
              this.client = client;
              if(this.client.dashboards.fl3_graph) this.client.dashboards.fl3 = true;
            }, err => {
              //console.error(err);
            });
        }
      });
  }

  public async addClient() {
  	let valid = await this.verifyExistentLogoAndBanner();
  	if(valid.success) {
  		this.client.companyBanner = await this.uploadBanner();
  		this.client.companyLogo = await this.uploadLogo();
  	} else {
  		alert(valid.message);
  		return false;
  	}
    //this.client={companyBanner:this.uploadLogo()}
  	  this.clientsService.addClient(this.client).subscribe(result => {
  		this.router.navigate(['../list'], { relativeTo: this.activeRoute });
  	});
  }

  public async updateClient(client) {
    let valid = await this.verifyExistentLogoAndBanner();
    if (valid.success) {
      this.client.companyBanner = await this.uploadBanner();
      this.client.companyLogo = await this.uploadLogo();
    } else {
      this.client.companyBanner = this.bannerUrl;
      this.client.companyLogo = this.logoUrl;
    }

    this.clientsService.updateClient(this.client.id, this.client)
      .subscribe(result => {
        this.router.navigate(['../../list'], { relativeTo: this.activeRoute })
      });
  }

  fileChanged(event, type) {
		if (event.target.files && event.target.files[0]) {
		    var reader = new FileReader();
		    reader.onload = (event: any) => {
		    	if(type === 'banner') this.bannerUrl = event.target.result;
		    	if(type === 'logo') this.logoUrl = event.target.result;
		    }
		    reader.readAsDataURL(event.target.files[0]);
		}
  }

   verifyExistentLogoAndBanner(): Promise<any> {
     return new Promise<any>((resolve, reject) => {
       this.banner = this.companyBanner.nativeElement;
       this.logo = this.companyLogo.nativeElement;
       if(!this.logo.files || !this.logo.files[0]) resolve({ success: false, message: 'Error, please choose your logo' });
       if(!this.banner.files || !this.banner.files[0]) resolve({ success: false, message: 'Error, please choose your banner' });
       resolve({ success: true });
     });
   }

   uploadBanner(): Promise<any> {
     return new Promise<any>((resolve, reject) => {
       const bannerFormData = new FormData();
       bannerFormData.append('', this.banner.files[0]);

       this.containers.uploadImage(bannerFormData, 'banner', this.client.id)
         .subscribe(res => {
           resolve(res);
         }, err => {
           //console.log(err);
           reject(err);
         });
     });
   }

    uploadLogo(): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        const logoFormData = new FormData();
        logoFormData.append('', this.logo.files[0]);
        this.containers.uploadImage(logoFormData, 'logo', this.client.id)
          .subscribe(res => {
            resolve(res);
          }, err => {
            reject(err);
        });
      });
    }

    public resetClientData() {
      this.client = { dashboards: {} };
    }
}