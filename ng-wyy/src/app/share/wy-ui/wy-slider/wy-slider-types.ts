import { Observable } from 'rxjs'

export type WysliderStyle = {
    width?:string | null;
    height?:string | null;
    left?:string | null;
    bottom?:string | null;
};


export type SliderEventObserverConfig = {
    start : string;
    move:string;
    end:string;
    filter:(e:Event) => boolean;
    pluckKey:string[];
    startPlucked$?:Observable<number>;//鼠标的位置信息
    moveResolved$?:Observable<number>;
    end$?:Observable<Event>;
};

//value的数据类型
export type SliderValue = number | null;