import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  /*
    比较简单的组件，会把策略改为OnPush,有助于提升性能（变更检测）
  */
  changeDetection:ChangeDetectionStrategy.OnPush   
})
export class WyCarouselComponent implements OnInit {

  //static 表示Template是静态的，设为true，就会在之前去渲染，如果是动态的（加上if条件等），设为false，就会在之后去渲染
  @ViewChild('dot',{static:true})  dotRef:TemplateRef<any>;

  @Input() activeIndex = 0;
  @Output() changeSlide = new EventEmitter<string>();
 // @Output() changeSlide = new EventEmitter<'pre' | 'next'>(); //为了严谨，严格定义传递的字符串，但会报错

  constructor() { }

  ngOnInit(): void {
  }

  onChangeSlide(type:string){//type:'pre' | 'next'
    this.changeSlide.emit(type);
  }
}
