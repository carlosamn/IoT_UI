import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matchesCategory'
})
export class MathcesCategoryPipe implements PipeTransform {
  transform(items: Array<any>, category: string): Array<any> {
    const _list_of_items = items
      .filter(sensor => (sensor.layout.containerIndex === category)).
      sort((a, b) => a.layout.itemIndex - b.layout.itemIndex);
    return _list_of_items;
  }
}
