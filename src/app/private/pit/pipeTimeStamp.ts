import {Pipe, Injectable,PipeTransform} from '@angular/core'

@Injectable()

@Pipe({
    name:'timeStamp'
})

export class timeStamp implements PipeTransform  {

   
    
    transform(data){
    
    let timeStamp;
    if(data!=undefined){
        let year;
        let finalMonth;
        let finalday;
        let hour;
        let minutes;
        let seconds;
      if(data.substring(10,11) == ' '){
        
        //console.log("de 10 a 11")
        hour=data.substring(11,13)
        finalMonth=data.substring(5,7)
        finalday=data.substring(7,9)
        minutes=data.substring(15,17)
        seconds=data.substring(19,21)
        year=data.substring(0,4)
      }
      else if(data.substring(9,10) == ' '){
        //console.log("de 9 a 10")
        year=data.substring(0,4);
        let month=data.substring(5,7);
        let day=data.substring(7,9);
        hour=data.substring(10,12)
        minutes=data.substring(13,15)
        seconds=data.substring(15,17)
        if(month.substring(1,1)=='-')
        {
          finalMonth=month.substring(0,1)
        }
        else
          finalMonth=month.substring(0,1)

        if(day.substring(1,1)=='-'){
          finalday=day.substring(0,2);
        }
        else
          finalday=day.substring(0,2);
      }
      else if(data.substring(8,9) == ' '){
        //console.log("de 8 a 9")
        hour=data.substring(9,11)
        finalMonth=data.substring(5,6)
        finalday=data.substring(6,7)
        minutes=data.substring(13,15)
        seconds=data.substring(17,19)
        year=data.substring(0,4)
      }
    
       // let localTime= new Date(data.packetTimestamp)
       let intHour=parseInt(hour)-4;
       timeStamp=year+'-'+finalMonth+'-'+finalday+' '+intHour+':'+minutes+':'+seconds;
       //console.log("timeStamp")
        
    }
       return timeStamp;
    }

}
