import { Component, OnInit  } from '@angular/core';
import {PITService} from '../pit.services'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LoadingService } from '../../shared/loading.service';
import {AppSharedService} from '../../../app.shared-service'
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-pit',
  templateUrl: './pit.component.html',
  styleUrls: ['./pit.component.css']
})
export class PitComponent implements OnInit {

  public locationId;


  public STORE={
    sensors: new BehaviorSubject<any[]>([])
}
  public DATA;

  public uid;

  public Description;
   
  public displaymodal="none";
  constructor(private LoadingService:LoadingService,private pitservice:PITService, private sharedService:AppSharedService) { 

    this.DATA={
    others: {
      flowTime: 0,
      beta: 0,
      upstreamStaticPressure: 0
    },
    accumulation: {
     
    },
    factors: {
     
    }
  }

    }
  

  async ngOnInit() {
      let descriptionRxJs;

      let currentLocation=localStorage.getItem("currentLocation");
      let uidJson=JSON.parse(currentLocation);

      descriptionRxJs=this.pitservice.dataRxjs(2);
      
        this.uid=descriptionRxJs;
        console.log("descriptionReactive")
        console.log(descriptionRxJs)

      if(descriptionRxJs==undefined){
        descriptionRxJs=uidJson.description;
        console.log("descriptionLocalStorage")
        console.log(descriptionRxJs)
        this.uid=descriptionRxJs;
      }

      this.getEFM(descriptionRxJs)
   
  }

   public getEFM(description){
   this.pitservice.getPitEFM(description)

    .subscribe(data=>{

      this.DATA=data;
      console.log(data);
    });
  }

  public update(command){
    this.LoadingService.show();
    //this.display="block";
    this.pitservice.update(this.uid,command)
    .subscribe(data=>{
      if(data.poll.status=="success"){
        //this.display="none";
        this.LoadingService.hide();
      }
      

    }, error=>{
        this.LoadingService.hide();
        $('#deviceBusy').modal('show');
        setTimeout(()=>{$('#deviceBusy').modal('hide');},30000)
    })
  } 

  public closeModal(){
    this.displaymodal="none";
  }

}
