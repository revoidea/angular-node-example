import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.wy-scroll{width: 100%; height: 100%; overflow: hidden;}`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit,AfterViewInit,OnChanges {

  @Input() data:any[];

  //ts刷新的延迟时间
  @Input() refreshDelay = 50;
  //声明BScroll实例
  private bs:BScroll;

  @ViewChild('wrap',{ static:true })  private wrapRef:ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
     //初始化bs实例
     this.bs = new BScroll(this.wrapRef.nativeElement,{
        scrollbar: {  
          interactive:true //滚动条可以交互
        },
        mouseWheel: {} //滚轮
     });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["data"]){
      this.refreshScroll();
    }
  }

  //bs 刷新
  private refresh(){
    this.bs.refresh();
  }

  refreshScroll(){

    /**需要延迟操作的原因:
     * 因为bs的刷新，必须在面板的消失隐藏操作完成之后，列表数据更新完成之后，去执行
     **/    
    setTimeout(() => {
       this.refresh();
    }, this.refreshDelay);
  }

}
