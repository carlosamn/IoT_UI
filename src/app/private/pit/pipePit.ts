import {Pipe, Injectable,PipeTransform} from '@angular/core'

@Injectable()

@Pipe({
    name:'secondsToTime'
})
export class secondsToTimePipe implements PipeTransform{
times = [
  3600,
  60,
  1
]

 transform(seconds){
     let time_string: string = '';
     let flag=false;
     
    
     for(var key in this.times){
        
         //let intValue=parseInt(key);
         if((Math.floor(seconds / this.times[key])) > 0){
            if(this.times[key]==1){
                let value:any;
                value=Math.floor(seconds / this.times[key])
                if(value<10){
                    value='0'+Math.floor(seconds / this.times[key]).toString()
                }else{
                value=Math.floor(seconds / this.times[key]).toString()
                }
                time_string += value;

            }
            else{
                
                let value;
                value=Math.floor(seconds / this.times[key])
                
               if( value<10 ){
                    
                    value='0'+Math.floor(seconds / this.times[key]).toString()
                }
               
                else if (value>10 ){
                    value=Math.floor(seconds / this.times[key]).toString()
                }
               
                     time_string += value +':';
            }
             
             seconds = seconds - this.times[key] * Math.floor(seconds / this.times[key]);
             

         }else
         {
             let value;
             if(this.times[key]==60 || this.times[key]==3600 ){
                value='00:';
             }else
            {value='00';}

            time_string += value;

         }

     }
     return time_string;
 }
}



