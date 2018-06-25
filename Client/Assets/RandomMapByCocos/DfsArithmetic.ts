import { ArithmeticVo, TerrainType } from "./ArithmeticVo";

//********************************** 深搜算法 **********************************//
//地图尺寸必须是奇数，初始化地图需要成0,1相间的
//核心思想，选取任意road点（0），随机选取一个方向开始深度搜索下一个未访问的road点，递归下去
export class DfsArithmetic extends ArithmeticVo{
    private _notVisitRoadList:{[key:string]:cc.Vec2} = {};//DFS未访问到的road点
    private _notVisitLength:number = 0;

    constructor(w,h){
        super(w,h);

        this.initTerrainMap();
        this.start();
    }


    private getVisitKey(x:number,y:number):string{
        return x+"_"+y;
    }

    private initTerrainMap(){
        //先创建外围一圈障碍(1)，内部0，1相间的map

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let terrainFlag = (j+i)%2 | ((i+1)%2);
                //外围一圈
                if(i == 0 || i == this.height-1 ||
                j == 0 || j == this.width-1){
                    terrainFlag = TerrainType.TERRAIN_TYPE_BARRIER;
                }
                this.terrainMap.push(terrainFlag);

                if(terrainFlag == TerrainType.TERRAIN_TYPE_ROAD){
                    this._notVisitRoadList[this.getVisitKey(j,i)] = cc.p(j,i);
                    this._notVisitLength++;
                }
            }
        }
    }

    private randomInitRoad():cc.Vec2{
        let randIndex = Math.floor(cc.random0To1()*this._notVisitLength);

        for (const key in this._notVisitRoadList) {
            if (this._notVisitRoadList.hasOwnProperty(key)) {
                randIndex--;
                if(randIndex < 0)
                    return this._notVisitRoadList[key];
            }
        }

        return null;
    }

    private start(){
        //先随一个road点出来，开始DFS
        let start = this.randomInitRoad();
        if(!start){
            cc.error("random road is error please check!");
            return;
        }

        this.dfs(start);
    }

    private isVisit(x,y):boolean{
        if(this._notVisitRoadList[this.getVisitKey(x,y)]){
            return false;
        }
        return true;
    }

    private visit(x,y){
        if(this._notVisitRoadList[this.getVisitKey(x,y)]){
            delete this._notVisitRoadList[this.getVisitKey(x,y)];
            this._notVisitLength--;
        }
    }

    private dfs(curPos:cc.Vec2){
        if(this.isVisit(curPos.x,curPos.y))
            return;
        
        //标记已访问
        this.visit(curPos.x,curPos.y);

        //上下左右4个方向向量
        let directionNormal = [cc.p(1,0),cc.p(-1,0),cc.p(0,1),cc.p(0,-1)];

        while(directionNormal.length){
            //每次随一个方向
            let index = Math.floor(cc.random0To1()*directionNormal.length);
            let dir:cc.Vec2 = cc.p(directionNormal[index].x,directionNormal[index].y);
            directionNormal.splice(index,1);

            let nextRoad = this.checkRoadThrough(curPos,dir);

            if(nextRoad)
                this.dfs(nextRoad);

        }
    }

    private checkRoadThrough(srcRoad:cc.Vec2,dir:cc.Vec2):cc.Vec2{
        let desRoad = cc.p(srcRoad.x+dir.x*2,srcRoad.y+dir.y*2);

        //目标road已经访问过，就不能通行了
        if(this.isVisit(desRoad.x,desRoad.y))
            return null;
        
        //可通行，要把road中间的障碍打通
        let barrierPos = cc.p(srcRoad.x+dir.x,srcRoad.y+dir.y);
        //根据map宽高算出在地形数组中的index
        let barrierIndex = barrierPos.y*this.width + barrierPos.x;
        this.terrainMap[barrierIndex] = TerrainType.TERRAIN_TYPE_ROAD;

        return desRoad;
    }
}