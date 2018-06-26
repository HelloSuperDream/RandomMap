import { ArithmeticVo, TerrainType } from "./ArithmeticVo";

//********************************** 十字递归分割算法 **********************************//
//1.地图尺寸必须是奇数，初始化地图除外围，其他的点均为0
//2.核心思想，在矩形区域随机取横竖两条线，把两条线标记为1; 
//  选取条件：选线应在“偶数”上随机，<1>是奇数可能会出现两面墙刷到一起的问题，破坏连通性
//  <2>是要保证不把墙刷到已经打通的road上，也会破坏连通性         
//3.为保障连通性，两条线形成的四堵墙，随机选择3个面，每个面随机一个“奇数”点打通成road（0）
//4.同时两条线会划分出新的4个矩形，小矩形继续回到2如此递归
//5.直到所有小矩形分割到width或者height小于3,分割完成
export class CrossRecursiveArith extends ArithmeticVo{
    private _minArea:number = 0;
    constructor(w,h,area){
        super(w,h);

        this._minArea = area;
        this.initTerrainMap();
        this.start();
    }

    private initTerrainMap(){
        //创建一个外围一圈障碍，中间全是road的地图
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let terrainFlag = TerrainType.TERRAIN_TYPE_ROAD;
                //外围一圈
                if(i == 0 || i == this.height-1 ||
                j == 0 || j == this.width-1){
                    terrainFlag = TerrainType.TERRAIN_TYPE_BARRIER;
                }
                this.terrainMap.push(terrainFlag);
            }
        }
    }

    private start(){
        let startPos = cc.p(1,1);//外围是墙，矩形从1,1点开始
        let rWidth = this.width -2;
        let rheight = this.height -2;

        this.CrossRecursive(cc.rect(startPos.x,startPos.y,rWidth,rheight));
    }

    private CrossRecursive(rect:cc.Rect){
        let area = rect.width*rect.height;
        //面积小于给定值停止分割（宽高小于3是强制限制）
        if(area <= this._minArea || rect.width < 3 || rect.height < 3){
            return;
        }

        let littleRects = this.segmentationRect(rect);

        littleRects.forEach(element => {
            this.CrossRecursive(element);
        });
    }

    private segmentationRect(rect:cc.Rect):cc.Rect[]{
        let result:cc.Rect[] = [];

        //分别在垂直、水平方向随机一个偶数
        let randomV = Math.ceil(cc.random0To1()*Math.floor(rect.width/2))*2;
        let randomH = Math.ceil(cc.random0To1()*Math.floor(rect.height/2))*2;

        //可知交叉点坐标
        let crossPos = cc.p(rect.x+randomV-1,rect.y+randomH-1);

        //刷墙壁
        this.createWallByCrossPoint(crossPos,rect);

        //随机打穿3堵墙
        this.randomBreakWall(crossPos,rect);

        //左上小矩形
        let rectLT = cc.rect(rect.x,rect.y,randomV-1,randomH-1);
        result.push(rectLT);
        //右上小矩形
        let rectRT = cc.rect(crossPos.x+1,rect.y,rect.width - randomV,randomH-1);
        result.push(rectRT);
        //左下小矩形
        let rectLB = cc.rect(rect.x,crossPos.y+1,randomV-1,rect.height - randomH);
        result.push(rectLB);
        //右下小矩形
        let rectRB = cc.rect(crossPos.x+1,crossPos.y+1,rect.width - randomV,rect.height - randomH);
        result.push(rectRB);


        return result;
    }

    //通过交叉点刷出墙壁
    private createWallByCrossPoint(cross:cc.Vec2,rect:cc.Rect){

        //先刷垂直方向
        for (let i = rect.yMin; i < rect.yMax ; i++) {
            //根据map宽高算出在地形数组中的index
            let terrainIndex = i*this.width + cross.x;
            this.terrainMap[terrainIndex] = TerrainType.TERRAIN_TYPE_BARRIER;
        }

        //接着水平方向
        for (let i = rect.xMin; i < rect.xMax; i++) {
            //根据map宽高算出在地形数组中的index
            let terrainIndex = i + cross.y*this.width;
            this.terrainMap[terrainIndex] = TerrainType.TERRAIN_TYPE_BARRIER;
        }

    }

    //交叉点与矩形组成了4堵墙，随机选3个打洞
    private randomBreakWall(cross:cc.Vec2,rect:cc.Rect){
        let upLine = {start:cc.p(cross.x,rect.y),end:cc.p(cross.x,cross.y-1)};
        let downLine = {start:cc.p(cross.x,cross.y+1),end:cc.p(cross.x,rect.yMax-1)};
        let leftLine = {start:cc.p(rect.x,cross.y),end:cc.p(cross.x-1,cross.y)};
        let rightLine = {start:cc.p(cross.x+1,cross.y),end:cc.p(rect.xMax-1,cross.y)};

        let allLines = [upLine,downLine,leftLine,rightLine];

        //最后要剩一堵墙
        while(allLines.length > 1){
            //每次随一条线段
            let index = Math.floor(cc.random0To1()*allLines.length);
            let line = allLines[index];
            this.breakWallByLine(line.start,line.end);

            allLines.splice(index,1);
        }
    }

    //根据给定线段起始点打穿墙壁
    private breakWallByLine(start:cc.Vec2,end:cc.Vec2){
        let breakPt:cc.Vec2 = null;
        //线段只能垂直或水平
        //随一个奇数出来
        if(start.x == end.x){
            let len = end.y - start.y + 1;
            let random = Math.ceil(cc.random0To1()*Math.ceil(len/2))*2 - 1;

            //得到要打穿的点
            breakPt = cc.p(start.x,start.y+random-1);
        }else if(start.y == end.y){
            let len = end.x - start.x + 1;
            let random = Math.ceil(cc.random0To1()*Math.ceil(len/2))*2 - 1;

            //得到要打穿的点
            breakPt = cc.p(start.x+random-1,start.y);
        }
        
        if(breakPt){
            let terrainIndex = breakPt.x + breakPt.y*this.width;
            this.terrainMap[terrainIndex] = TerrainType.TERRAIN_TYPE_ROAD;
        }
    }
}