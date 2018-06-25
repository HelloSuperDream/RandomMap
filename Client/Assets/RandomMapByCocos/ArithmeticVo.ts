
export enum TerrainType{
    TERRAIN_TYPE_ROAD = 0,
    TERRAIN_TYPE_BARRIER = 1,
}

export class ArithmeticVo{
    width:number = 0;
    height:number = 0;
    terrainMap:Array<number> = [];//0表示road，1表示barrier

    constructor(w,h){
        this.width = w;
        this.height = h;
    }

    public getResult():number[]{
        return this.terrainMap;
    }
}