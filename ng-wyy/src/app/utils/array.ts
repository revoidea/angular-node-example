import { getRandomInt } from './number';

export function inArray(arr:any[],target:any):boolean {
    return arr.indexOf(target) !==-1;
}

//打乱数组，重新排列数组元素
export function shuffle<T>(arr: T[]):T[] {
    //保存父本
    let result = arr.slice();
    for (let i = 0; i < result.length; i++) {
        //0和i 之间的一个随机数
        const j = getRandomInt([0,i]);
        //把这两个元素换一下位置
        [result[i],result[j]] = [result[j],result[i]];
    }
    return result;
}