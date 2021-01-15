import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonValue'
})
export class JsonValuePipe implements PipeTransform {

  transform(json: string, value: string) {
    const obj = JSON.parse(json);
    return Object.keys(obj).includes(value) ? obj[value] : json;
  }

}
