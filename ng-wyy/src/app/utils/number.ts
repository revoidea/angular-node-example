//限制值的范围（最小~最大之间）
//先匹配max,后匹对min
export function limitNumberInRange(val:number,min:number,max:number):number {
    return Math.min(Math.max(val,min),max);
};

//val值转换成offset百分比
export function getPercent(min:number,max:number,val:number):number{
    return ((val - min) / (max - min)) * 100;
}