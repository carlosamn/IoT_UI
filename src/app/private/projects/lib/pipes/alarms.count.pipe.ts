import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'AlarmsCountByProject'})
export class AlarmsCountByProject implements PipeTransform {

  transform(value: any, args: any[]): any {

return value;

  }
}
