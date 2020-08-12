export function sliderEvent(e:Event) { //tap作用相当于 console.log ,调试作用
    e.stopPropagation(); //冒泡
    e.preventDefault(); //默认事件
};


//获取dom的offset的值
export function getElementOffset(el:HTMLElement): { top:number; left:number;} {

    //判断HTMLElement是否正确，因为getClientRects()返回的是一个数组，里面的成员是getBoundingClientRect()
    if(!el.getClientRects().length){
        return {
            top:0,
            left:0
        }
    }
    const rect = el.getBoundingClientRect();
    const win = el.ownerDocument.defaultView; //获取所在节点的的window对象

    return {
        top:rect.top + win!.pageYOffset, //这些win的位置信息ie9以下不支持，所以加个非空断言
        left:rect.left + win!.pageXOffset
    }
};
