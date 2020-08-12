/*定义自定义数据的数据类型*/


//轮播图
export type Banner = {
    targetId:number;
    imageUrl:string;
    url:string;
}

//热门标签
export type HotTage = {
    id:number;
    name:string;
    position:number;
}



//歌手
export type Singer = {
    id:number;
    name:string;
    picUrl:string;
    albumSize:number;
}

//歌曲
export type Song = {
    id:number;
    name:string;
    url:string;
    ar:Singer[];//歌手数组
    al:{id:number;name:string;picUrl:string};//专辑
    dt:number;//播放时长
}

//歌单
export type SongSheet = {
    id:number;
    name:string;
    playCount:number; //播放量
    picUrl:string;
    tracks:Song[];//歌曲数组
}


//歌曲url(播放地址)
export type SongUrl = {
    id:number;
    url:string;
}