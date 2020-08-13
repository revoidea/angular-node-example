import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild, Input, Inject, ChangeDetectorRef, OnDestroy, forwardRef, Output, EventEmitter } from '@angular/core';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { tap, pluck, map, distinctUntilChanged, takeUntil, filter } from 'rxjs/internal/operators';
import { SliderEventObserverConfig, SliderValue } from './wy-slider-types';
import { DOCUMENT } from '@angular/common';
import { sliderEvent,getElementOffset } from  './wy-slider-helper'
import { inArray } from 'src/app/utils/array'
import { limitNumberInRange, getPercent } from 'src/app/utils/number'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  //视图封装模式：（需要了解），设为None ，表示该组件的less样式为全局，可以在其他组件生效
  encapsulation:ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush,
  providers:[{  //自定义表单的架子
    provide:NG_VALUE_ACCESSOR,
    useExisting:forwardRef(() => WySliderComponent),
    multi:true
  }]

})
export class WySliderComponent implements OnInit,OnDestroy,ControlValueAccessor {

  @Input() wyVertical = false; //默认水平方向
  @Input() wyMin = 0;
  @Input() wyMax = 100;
  @Input() bufferOffset:SliderValue = 0; 

  @Output() wyOnAfterChange = new EventEmitter<SliderValue>();

  private sliderDom:HTMLDivElement;
  //获取元素
  @ViewChild('wySlider', { static:true} ) private wySlider:ElementRef;

  //订阅时用到的变量(绑定流)
  private dragStart$:Observable<number>;
  private dragMove$:Observable<number>;
  private dragEnd$:Observable<Event>;
  //解绑时用到的变量（取消订阅）
  private dragStart_:Subscription | null;
  private dragMove_:Subscription | null;
  private dragEnd_:Subscription | null;
  //表示是否正在滑动
  private isDragging = false;
  //
  value:SliderValue = null;
  offset:SliderValue = null;
  


  constructor(@Inject(DOCUMENT) private doc:Document,private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {

    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
   // console.log('object',this.wySlider.nativeElement)
  }

  private createDraggingObservables() {

    const orientField = this.wyVertical ? 'pageY' : 'pageX';

    // pc端绑定的事件
    const mouse:SliderEventObserverConfig = {
      start : 'mousedown',
      move:'mousemove',
      end:'mouseup',
      filter:(e:MouseEvent) => e instanceof MouseEvent,
      pluckKey:[orientField]
    };

    //手机上的事件
    const touch:SliderEventObserverConfig = {
      start:'touchstart',
      move:'touchmove',
      end:'touchend',
      filter:(e:TouchEvent) => e instanceof TouchEvent,
      pluckKey:['touches','0',orientField]
    };

    [mouse,touch].forEach(source => {
        const { start,move,end,filter:filerFunc,pluckKey } = source;

        //start事件
        source.startPlucked$ = fromEvent(this.sliderDom,start)
        .pipe( 
          filter(filerFunc),//过滤
          tap(sliderEvent),
          //取鼠标按下的位置
          pluck(...pluckKey),
          map((position:number) => this.findClosestValue(position))
        );
        
        //end事件
        source.end$ = fromEvent(this.doc,end); //做服务端渲染，使用原生document不利于渲染，所以要尽量避免使用浏览器对象，尽量使用angular提供的
        //move事件
        source.moveResolved$ = fromEvent(this.doc,move).pipe(
          filter(filerFunc),
          tap(sliderEvent),
          //取鼠标按下的位置
          pluck(...pluckKey),
          distinctUntilChanged(),//当里面的值，发生改变，继续往后发射（流--数据流）
          map((position:number) => this.findClosestValue(position)),
          takeUntil(source.end$)
        );
    });


    //绑定
    this.dragStart$ = merge(mouse.startPlucked$,touch.startPlucked$);//合并
    this.dragMove$ = merge(mouse.moveResolved$,touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$,touch.end$);
  }

  //订阅函数:同时支持多个事件
  private subscribeDrag(events:string[] = ['start','move','end']){

     //通过工具类，封装了共同的判断逻辑
    if(inArray(events,'start') && this.dragStart$ && !this.dragStart_){
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if(inArray(events,'move') && this.dragMove$ && !this.dragMove_){
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if(inArray(events,'end') && this.dragEnd$ && !this.dragEnd_){
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }

    // if(events.indexOf('start') !== -1 && this.dragStart$){
    //   this.dragStart$.subscribe(this.onDragStart.bind(this));
    // }
    // if(events.indexOf('move') !== -1 && this.dragMove$){
    //   this.dragMove$.subscribe(this.onDragMove.bind(this));
    // }
    // if(events.indexOf('end') !== -1 && this.dragEnd$){
    //   this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    // }
  }

  //解绑事件
  private unsubscribeDrag(events:string[] = ['start','move','end']){
    if(inArray(events,'start') && this.dragStart_){
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }
    if(inArray(events,'move') && this.dragMove_){
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    if(inArray(events,'end') && this.dragEnd_){
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }

  //开始
  private onDragStart(value:number){
      console.log("value",value)
      this.toggleDragMoving(true); 
      this.setValue(value);
  }

  //移动
  private onDragMove(value:number){
      if(this.isDragging){
        //目的是：为了手动触发检测value
        this.setValue(value);
        this.cdr.markForCheck();//可以实现手动触发变更检测
      }
  }
  //结束
  private onDragEnd(value:number){
    this.wyOnAfterChange.emit(this.value);
    this.toggleDragMoving(false);
    this.cdr.markForCheck();//可以实现手动触发变更检测

  }

  //设置value值（把value保存下来）
  /**
   * needCheck :表示value 是否需要经过一次检测
   */
  private setValue(value:SliderValue,needCheck = false){
    
    //需要检测
    if(needCheck){
      //拖拽不检测
      if(this.isDragging) { return; }
      //否则需要检测:把不合法的值，转变成合法的值
      this.value = this.formatValue(value);
      this.UpdateTrackAndHandles();//更改这两者的属性
    }else if(!this.valuesEqual(this.value,value)){ //value的值会出现相同的情况，所以需要进行判断,value不相同时，则执行，value相同时，则不执行。
      this.value = value;
      this.UpdateTrackAndHandles();//更改这两者的属性
      this.onValueChange(this.value);
    }
  }

  //把不合法的值，转变成合法的值
  private formatValue(value:SliderValue):SliderValue {
    let res = value;
    if(this.assertValueValid(value)){
      res = this.wyMin;
    }else {
      res = limitNumberInRange(value,this.wyMin,this.wyMax)
    }
    return res;
  }

  //判断是否是NAN
  private assertValueValid(value:SliderValue):boolean {
    return isNaN(typeof value !== 'number' ? parseFloat(value) :value );
  }

  //判断value值是否相同
  private valuesEqual(valA:SliderValue,valB:SliderValue):boolean{
    if(typeof valA !== typeof valB){
      return false;
    }
    return valA === valB;
  }


  //改变wyVertical，wyOffset属性
  private UpdateTrackAndHandles(){
     this.offset = this.getValueToOffset(this.value);
     this.cdr.markForCheck();//可以实现手动触发变更检测
  }


  //value转换成offset
  private getValueToOffset(value:SliderValue):SliderValue{
     return getPercent(this.wyMin,this.wyMax,value)
  }

  //用于绑定或者解绑事件
  private toggleDragMoving(movable:boolean){
    this.isDragging = movable;
    //若正在移动
    if(movable){
      //订阅事件
      this.subscribeDrag(['move','end'])
    }else {
      //解绑
      this.unsubscribeDrag(['move','end'])
    }
  }

  //移动距离的转换
  private findClosestValue(position:number):number {
    //获取滑块总长
    const sliderLength = this.getSliderLength();
    //滑块（左，上）端点位置
    const sliderStart = this.getSliderStartPosition();
    //滑块当前位置/滑块总长
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    //需要判断滑块的方向（垂直或者水平）
    const ratioTrue = this.wyVertical ? 1 - ratio : ratio;
    //最后要算的val
    return ratioTrue * (this.wyMax - this.wyMin) + this.wyMin;

  }


  //滑块组件总长
  private getSliderLength():number {
    return this.wyVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  //滑块（左，上）端点位置
  private getSliderStartPosition():number {
    //获取offset的值
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical ? offset.top : offset.left;
  }


  private onValueChange(value:SliderValue):void {};
  private onTouched():void {};

  /**
   * 以下是来自ControlValueAccessor提供的方法
   * 用来发射change事件
   */
  
  //读取值 ---> 赋值的过程
  writeValue(value:SliderValue): void {
     this.setValue(value,true)
  }

  //
  registerOnChange(fn: (value:SliderValue) => void): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  /** */

  //销毁时，要解绑
  ngOnDestroy():void {
    this.unsubscribeDrag();
  }

  
}

