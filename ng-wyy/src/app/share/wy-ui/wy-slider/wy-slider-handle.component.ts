import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { WysliderStyle } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider-handle',
  template:'<div class="wy-slider-handle" [ngStyle]="style"></div>',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class WySliderHandleComponent implements OnInit,OnChanges {

  @Input() wyVertical = false;//是否是垂直模式，默认是水平
  @Input() wyOffset:number;//滑块(移动) 偏移的距离

 //变换的样式
  style:WysliderStyle = {};

  constructor() { }

  ngOnInit(): void {
  }


  //监听wyOffset值的改变
  ngOnChanges(changes:SimpleChanges):void{
    //如果wyOffset发生变化,就改变left 或者 bottom的值(改样式),wyOffset用百分比来控制
    if(changes['wyOffset']) {
       this.style[this.wyVertical ? 'bottom' : 'left'] = this.wyOffset + '%';
    }


  }
}
