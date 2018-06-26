import { DfsArithmetic } from "./DfsArithmetic";
import { CrossRecursiveArith } from "./CrossRecursiveArith";

const {ccclass, property} = cc._decorator;

enum ArithmeticType{
    DFS = 0,
    CROSS_RECURSIVE = 1,
}

@ccclass
export class RandomMapCtrl extends cc.Component {
    @property({
        tooltip:"这里必须是奇数",
    })
    mapWidth:number = 51;

    @property({
        tooltip:"这里必须是奇数",
    })
    mapHeight:number = 51;

    @property({
        tooltip:"单块地形的尺寸",
    })
    terrainSize:number = 32;

    @property(cc.Prefab)
    roadPf: cc.Prefab = null;

    @property(cc.Prefab)
    barrierPf: cc.Prefab = null;

    @property({
        tooltip:"采用随机算法：\n1.DFS，用深度优先搜索生成\n2.CROSS_RECURSIVE，用十字递归分割生成",
        type: cc.Enum(ArithmeticType)
    })
    useArithmetic:ArithmeticType = ArithmeticType.DFS;

    @property({
        tooltip:"选择CROSS_RECURSIVE时参数生效\n表示最小分割面积",
    })
    minArea:number = 21;


    private _terrainMap:Array<number> = [];//0表示road，1表示barrier

    onLoad(){
        this.node.removeAllChildren();
        this.node.width = this.mapWidth*this.terrainSize;

        this.generateMap();
    }

    generateMap(){
        let arithObject = null;
        if(this.useArithmetic == ArithmeticType.DFS){
            //采用深搜
            arithObject = new DfsArithmetic(this.mapWidth,this.mapHeight);

        }else if(this.useArithmetic == ArithmeticType.CROSS_RECURSIVE){
            //采用十字递归分割
            arithObject = new CrossRecursiveArith(this.mapWidth,this.mapHeight,this.minArea);
        }
        this._terrainMap = arithObject.getResult();

        this.loadTerrain();
    }

    loadTerrain(){
        this._terrainMap.forEach(element => {
            let prefab = this.roadPf;
            if(element)
                prefab = this.barrierPf;
            
            let node = cc.instantiate(prefab);

            this.node.addChild(node);
        });
    }

}
