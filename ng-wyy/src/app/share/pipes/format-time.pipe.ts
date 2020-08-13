import { Pipe, PipeTransform } from '@angular/core';

/**时间转换管道 */
@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(time:number): any {
    if(time){
         //|0 表示 向下取整
        const temp = time | 0;
        const minute = time / 60 | 0;
        //padStart()  是ES2017引入了字符创补全长度的功能
        const second = (temp % 60).toString().padStart(2,'0');
        return `${minute}:${second}`

    }else{
      return '00:00';
    }
  }

}
