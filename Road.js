/*
state and control for road construction
*/

class Road {
  constructor() {
    //pt: {x, y, z}
    //{ptStart, ptEnd}

    //setup road seed start location
    this.tile = new Tile()
    this.roadSeedX = this.tile.tileSideLength/2
    console.log(this.roadSeedX)

    //setup road segment length
    this.roadSegLength = 100

    //seed first road segment (start pt and end pt of first segment)
    this.vertsRoad = [0, -this.roadSeedX, 0, 0, -this.roadSeedX+this.roadSegLength, 0]

    console.log(this.vertsRoad)
  }

  rotSeg(prevSegStartX, prevSegStartY, prevSegEndX, prevSegEndY) {
    console.log("enter Road.laySeg")
    //
    // let degrees = 0;
    // //translate seg to 0,0 origin
    // //by subtracting it's startX and startY from it's endX and endY, to get new endX and endY and 0,0 startX, startY
    //
    // //(eventually base on perlin noise) but, to start with:
    // //1 out of 10 times, turn
    // //subsequent turns more likely on even, less likely on odd
    // let rotatedEnd = rotatePt(translatedEndX, translatedEndY, degrees)
    // let rotatedEndX = rotatedEnd.x
    // let rotatedEndY = rotatedEnd.y
    //
    // //translate back to world position

    //plot segment
  }
  rotPt(pivotX, pivotY, degrees) {
    let rotatedX
    let rotatedY
    return {x: rotatedX, y: rotatedY}
  }

  //adds a segment to this road object
  //(in practice, when all segments are added, road is added as line geometry from Scene)
  addSeg() {
    //let new end point be transformed version of last end point
    let newEndPt = {
      x: this.vertsRoad[(((this.vertsRoad.length/3)-1)*3)+0],
      y: this.vertsRoad[(((this.vertsRoad.length/3)-1)*3)+1]+this.roadSegLength,
      z: this.vertsRoad[(((this.vertsRoad.length/3)-1)*3)+2]
    }
    console.log("===",this.vertsRoad.length/3, newEndPt)

    //add transformed end point to vertsRoad
    this.vertsRoad.push(newEndPt.x)
    this.vertsRoad.push(newEndPt.y)
    this.vertsRoad.push(newEndPt.z)
  }
  getRoad() {
    console.log("from getRoad ", this.vertsRoad)
    return this.vertsRoad
  }
}

//
// class Car extends Vehicle {
//
//   constructor (name) {
//     super(name, 'car');
//   }
//
//   getName () {
//     return 'It is a car: ' + super.getName();
//   }
//
// }
