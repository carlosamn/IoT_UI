import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'SensorLimit'})
export class SensorLimitPipe implements PipeTransform {
  transform(value: any, args: string[]): any {
    if (!value || value == '0' || value == 0) {
      return 'N/A';
    } else {
      if (value > 0) {
        return Math.floor(value);
      } else {
        return value;
      }

    }
  }
}
