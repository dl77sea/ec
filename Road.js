/*
state and control for road construction
*/

class Road {
  /*
  todo:
  constructor sourceSeg arg,
  from which first seg is generated: genFirstSeg()
  midOnLine(),
  this.segsSinceLastBranch branch control from index
  */
  constructor(seg) {
    //spawnSeg is segment that will spawn this road
    // {startPt: startPt, endPt: endPt} //pt = {x: x, y: y, z: 0}

    //setup road seed start location (todo: get this number from constructor)
    this.tile = new Tile()
    this.roadSeedX = this.tile.tileSideLength / 2

    // this.getUnitVector (
    //   {
    //     startPt: {x: -this.roadSeedX, y: -this.roadSeedX, z: 0},
    //     endPt: {x: this.roadSeedX, y: -this.roadSeedX, z: 0}
    //   }
    // )

    // this.startSpawnPt = this.getSegMidPt(spawnSeg)
    //console.log(this.roadSeedX)

    //setup road segment length
    this.roadSegLength = 100

    //seed first road segment (start pt and end pt of first segment)
    // this.vertsRoad = [0, -this.roadSeedX, 0, 0, -this.roadSeedX + this.roadSegLength, 0]
    // this.vertsRoad = []

    //*** build first seg of road off of constructor argument seg

    //result of this origin translated
    let firstRoadSeg = this.getUnitVector(seg)

    //rotate and scale unit vector
    let firstRoadSegEndPtRotated = this.rotateAboutOrigin(firstRoadSeg.endPt, 90) //{x: newSegEndPt.x, y: newSegEndPt.y, z: 0}

    //build a unit vector seg to get mid point (will be from origin)
    let firstRoadSegFromOrigin = {startPt: {x: 0, y: 0, z: 0}, endPt: {x: firstRoadSegEndPtRotated.x , y: firstRoadSegEndPtRotated.y, z: 0}}

    //get mid point of cons arg seg
    let midPt = this.getSegMidPt(seg)

    //translate it by it's startPt to mid point of constructor arg seg. args: seg to translate, point to translate it to
    let firstRoadSegFromWorld = this.translateSegToWorld(firstRoadSegFromOrigin,  {x: midPt.x, y: midPt.y, z: 0} ) //{x: 5, y: -51897, z: 0}) //{x: midPt.x, y: midPt.y, z: 0}

    //build first road seg
    this.vertsRoad = [firstRoadSegFromWorld.startPt.x, firstRoadSegFromWorld.startPt.y, 0, firstRoadSegFromWorld.endPt.x, firstRoadSegFromWorld.endPt.y, 0]
    //****

    // this.vertsRoad = [spawnSeg.startPt.x,]
    this.segmentsAddedSinceLastTurn = 0

    //console.log(this.vertsRoad)
    this.totalSegs = 0;
    this.degrees = 5
    this.mult = 1;

    //eventually must be set from arguments to consstructor
    this.turnThresh = 0.0174533 * 90
    console.log(this.turnThresh)
  }

  getSegMidPt(seg) {
    //mid = (x1+x2)/2 , (y1+y2)/2
    let x = (seg.startPt.x+seg.endPt.x)/2
    let y = (seg.startPt.y+seg.endPt.y)/2

    return {x: x, y: y}
  }

  //return a segment of distance dist in direction dir (where dir is just -1 or +1),
  // rotated by angle of seg's endPt to it's startPt, + 90 degrees
  getNormalSeg(seg, dist, dir) {
    //normalize seg

    // get angle of seg
    // let
    // Math.abs(Math.asin(x/this.roadSegLength)
  }

  //get 2d unit vector from seg translated to origin
  getUnitVector(seg) {

    let originTranslatedSeg = this.translateSegToOrigin(seg.startPt, seg.endPt)
    let div = Math.sqrt(
      originTranslatedSeg.endPt.x*originTranslatedSeg.endPt.x +
      originTranslatedSeg.endPt.y*originTranslatedSeg.endPt.y
    )

    let x = (originTranslatedSeg.endPt.x/div)*1
    let y = (originTranslatedSeg.endPt.y/div)*1

    return {startPt: {x: 0, y: 0, z: 0}, endPt: {x: x, y: y}}
  }

  getAngle(seg) {

  }

  rotSeg(prevSegStartX, prevSegStartY, prevSegEndX, prevSegEndY) {
    //console.log("enter Road.laySeg")
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
  // rotPt(pivotX, pivotY, degrees) {
  //   let rotatedX
  //   let rotatedY
  //   return {
  //     x: rotatedX,
  //     y: rotatedY
  //   }
  // }

  getLastRoadSeg() {
    let startPt = {
      x: this.vertsRoad[(((this.vertsRoad.length / 3) - 2) * 3) + 0],
      y: this.vertsRoad[(((this.vertsRoad.length / 3) - 2) * 3) + 1],
      z: this.vertsRoad[(((this.vertsRoad.length / 3) - 2) * 3) + 2]
    }
    let endPt = {
      x: this.vertsRoad[(((this.vertsRoad.length / 3) - 1) * 3) + 0],
      y: this.vertsRoad[(((this.vertsRoad.length / 3) - 1) * 3) + 1],
      z: this.vertsRoad[(((this.vertsRoad.length / 3) - 1) * 3) + 2]
    }
    return {
      startPt: startPt,
      endPt: endPt
    }
  }

  //return a continuation of previous segment
  getNewRoadSeg() {
    let lastRoadSeg = this.getLastRoadSeg()
    //console.log("---", lastRoadSeg)
    //ths is the last point in roads points array
    //to get new end point, add origin translated, 2nd to last end point in roads points array to last point
    // let endPt = {
    //   x: this.vertsRoad[(((this.vertsRoad.length / 3) - 1) * 3) + 0] + (startPt.x - secondToLastPt.x),
    //   y: this.vertsRoad[(((this.vertsRoad.length / 3) - 1) * 3) + 1] + (startPt.y - secondToLastPt.y),
    //   z: this.vertsRoad[(((this.vertsRoad.length / 3) - 1) * 3) + 2]
    // }
    let endPt = {
      x: lastRoadSeg.endPt.x + (lastRoadSeg.endPt.x - lastRoadSeg.startPt.x),
      y: lastRoadSeg.endPt.y + (lastRoadSeg.endPt.y - lastRoadSeg.startPt.y),
      z: 0
    }
    // let retPt = {
    //   startPt: lastRoadSeg.startPt,
    //   endPt: endPt
    // }
    //console.log("retPt: ", retPt)
    return {
      startPt: lastRoadSeg.endPt,
      endPt: endPt
    }
  }


  //adds a segment to this road object
  //(in practice, when all segments are added, road is added as line geometry from Scene)
  addSeg(seg) {
    // console.log(seg)
    // this.vertsRoad.push(seg.endPt.x)
    // this.vertsRoad.push(seg.endPt.y)
    // this.vertsRoad.push(seg.endPt.z)

    // this.vertsRoad.push(translatedEndPt.x)
    // this.vertsRoad.push(translatedEndPt.y)
    // this.vertsRoad.push(translatedEndPt.z)
    // console.log("road: ", this.vertsRoad)
    // console.log("seg", seg) //from getNewRoadSeg
    let segmentToOrigin = this.translateSegToOrigin(seg.startPt, seg.endPt)
    // console.log("segmentToOrigin", segmentToOrigin)
    // let degrees = 5

    //determine bend in road
    // segmentToOrigin is seg moved to origin (length unmodified)

    let rotatedEndPt = this.determineBend(segmentToOrigin.endPt)

    //put endPt back into world space
    //rotatedEndPt is point to translate, startPt is offset by which to translate rotatedEndPt
    let translatedEndPt = this.translatePtToWorld(rotatedEndPt, seg.startPt)
    // console.log("translatedEndPt", translatedEndPt)
    //add transformed end point to vertsRoad
    this.vertsRoad.push(translatedEndPt.x)
    this.vertsRoad.push(translatedEndPt.y)
    this.vertsRoad.push(translatedEndPt.z)


  }
  determineBend(currentRdEndPtRelativeToOrigin) {

    this.mult = this.mult * (-1)
    this.degrees= 5

    if(Math.random() > 0.75) {
      return this.rotateRoadSegAboutOrigin(currentRdEndPtRelativeToOrigin, this.degrees * this.mult)
    } else {
      // console.log('str')
      return currentRdEndPtRelativeToOrigin
    }
    // return this.rotateRoadSegAboutOrigin(currentRdEndPtRelativeToOrigin, this.degrees * this.mult)

    // return this.rotateRoadSegAboutOrigin(currentRdEndPtRelativeToOrigin, this.degrees * this.mult)
    // console.log("this.totalSegs ", this.totalSegs)
    //return an end point that is either rotated or not rotated
    //based on road generation-randomization rules
    // if (this.segmentsAddedSinceLastTurn >= 1) {
    // if (this.segmentsAddedSinceLastTurn >= 1) {
    // this.totalSegs += 1

    // if (Math.random() > 0.2) {
    // this.segmentsAddedSinceLastTurn = 0;
    // if (Math.random() > 0.5) {
    // if (this.totalSegs%2 === 0) {

    // }
    //add this to control if a second turn might happen
    // if(Math.random() > 0.5) {
    //   this.segmentsAddedSinceLastTurn=50
    // }
    // console.log("a"/)
    // currentRdEndPtRelativeToOrigin={x: 0, y: 100, z: 0}

    // }
    // } else {
    //   // console.log("b")
    //   this.totalSegs+=1
    //   //straight
    //   console.log("straight")
    //   this.segmentsAddedSinceLastTurn += 1
    //   return currentRdEndPtRelativeToOrigin
    // }

    // this.mult = this.mult * -1
    // console.log("turn", this.mult)
    // console.log(currentRdEndPtRelativeToOrigin)
    // let result =  this.rotateRoadSegAboutOrigin(currentRdEndPtRelativeToOrigin, 45 * this.mult)
    // console.log("result",result)
    // return result;

  }

  translateSegToOrigin(startPt, endPt) {
    //subtract world start point from start end point
    let endX = endPt.x - startPt.x
    let endY = endPt.y - startPt.y
    let endZ = 0

    let startX = 0
    let startY = 0
    let startZ = 0

    return {
      startPt: {
        x: startX,
        y: startY,
        z: startZ
      },
      endPt: {
        x: endX,
        y: endY,
        z: endZ
      }
    }
  }

  translatePtToWorld(pt, offset) {
    let x = pt.x + offset.x
    let y = pt.y + offset.y
    let z = pt.z + offset.z

    return {
      x: x,
      y: y,
      z: z
    }
  }

  translateSegToWorld(seg, offset) {
    let retSeg = {
      startPt: {
        x: seg.startPt.x + offset.x,
        y: seg.startPt.y + offset.y,
        z: 0
      },
      endPt: {
        x: seg.endPt.x + offset.x,
        y: seg.endPt.y + offset.y,
        z: 0
      }
    }
    return retSeg
  }

  rotateAboutOrigin(endPt, degrees) {
    let radDegrees = 0.0174533 * degrees;

    let x = (endPt.x) * Math.cos(radDegrees) - (endPt.y) * Math.sin(radDegrees)
    let y = (endPt.x) * Math.sin(radDegrees) + (endPt.y) * Math.cos(radDegrees)

    return {x: x, y: y}
  }

  rotateRoadSegAboutOrigin(endPt, degrees) {
    // if(Math.asin(endPt.x)... finish this
    let pt = this.rotateAboutOrigin(endPt, degrees)
    let x = pt.x //endPt.x * Math.cos(radDegrees) - endPt.y * Math.sin(radDegrees)
    let y = pt.y //endPt.x * Math.sin(radDegrees) + endPt.y * Math.cos(radDegrees)
    let z = 0
    if ((y/this.roadSegLength > 0) && Math.abs(Math.asin(x/this.roadSegLength)) < this.turnThresh) {
      // console.log("happens1")
      return {
        x: x,
        y: y,
        z: z
      }
    } else {
      // console.log("happens2")
      return {
        x: endPt.x,
        y: endPt.y,
        z: endPt.z
      }
    }
  }

  getRoad() {

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
