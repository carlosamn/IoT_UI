import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shotStart' })
export class ShotStartPipe implements PipeTransform {
  transform(filename: string): string {
    let splitted = filename.split('_');
    let shotStartTime = `${splitted[1]}-${splitted[2]}-${splitted[3]} ${splitted[4]}:${splitted[5]}:${splitted[6]}`;
    let date = new Date(shotStartTime);
    return shotStartTime;
  }
}