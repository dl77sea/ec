class Road {
  //seg is segment from previous road from which this road will be generated
  constructor(seg, rotDegrees, direction) {

    console.log(direction)

    this.direction = direction

    this.tile = new Tile()
    this.roadSeedX = this.tile.tileSideLength / 2

    this.roadSegLength = 100

    this.numSegs = 0

    //get mid point of cons arg seg
    let midPt = this.getSegMidPt(seg)

    //build road seg with initial spawn at NS or EW

    let firstRoadSegFromWorld
    let deltaX = Math.abs(seg.endPt.x - seg.startPt.x)
    let deltaY = Math.abs(seg.endPt.y - seg.startPt.y)

    //if originating seg is oriented more EW than NS
    if (deltaX > deltaY) {
      //set new seg direction NS
      firstRoadSegFromWorld = {
        startPt: {
          x: midPt.x,
          y: midPt.y,
          z: 0
        },
        endPt: {
          x: midPt.x + this.roadSegLength,
          y: midPt.y,
          z: 0
        }
      }
    } else {
      //set new seg direction EW
      firstRoadSegFromWorld = {
        startPt: {
          x: midPt.x,
          y: midPt.y,
          z: 0
        },
        endPt: {
          x: midPt.x,
          y: midPt.y + this.roadSegLength,
          z: 0
        }
      }
    }

    console.log("--", firstRoadSegFromWorld)

    // console.log("rotate test: ",
    //   this.rotateAboutOrigin({
    //     x: startSegTranslatedToOrigin.endPt.x,
    //     y: startSegTranslatedToOrigin.endPt.y
    //   }, rotDegrees)
    // )

    //returns point {startPt, endPt}
    // translateSegToOrigin(startPt, endPt)

    let startSegTranslatedToOrigin = this.translateSegToOrigin(firstRoadSegFromWorld.startPt, firstRoadSegFromWorld.endPt)

    //returns point {x,y} relative to 0,0 origin
    // rotateAboutOrigin(endPt, degrees)
    let rotatedEndPtFromOrigin = this.rotateAboutOrigin({
      x: startSegTranslatedToOrigin.endPt.x,
      y: startSegTranslatedToOrigin.endPt.y
    }, rotDegrees)

    console.log("***", rotatedEndPtFromOrigin)

    //this can be refactored by letting above return a seg instead of X,Y

    let rotatedStartSegFromOrigin = {
      startPt: {
        x: 0,
        y: 0,
        z: 0
      },
      endPt: {
        x: rotatedEndPtFromOrigin.x,
        y: rotatedEndPtFromOrigin.y,
        z: 0
      }
    }


    //returns segment where offset is {x, y} to move seg to in world
    // translateSegToWorld(seg, offset)

    firstRoadSegFromWorld = this.translateSegToWorld(rotatedStartSegFromOrigin, {
      x: firstRoadSegFromWorld.startPt.x,
      y: firstRoadSegFromWorld.startPt.y
    })

    console.log("...", firstRoadSegFromWorld)
    //build first road seg
    this.vertsRoad = [firstRoadSegFromWorld.startPt.x, firstRoadSegFromWorld.startPt.y, 0, firstRoadSegFromWorld.endPt.x, firstRoadSegFromWorld.endPt.y, 0]

    this.segmentsAddedSinceLastTurn = 0

    this.totalSegs = 0;
    this.degrees = 5
    this.mult = 1;

    this.turnThresh = 0.0174533 * 90
  }

  scaleSegFromOrigin(seg, scale) {
    seg.endPt.x = seg.endPt.x * scale
    seg.endPt.y = seg.endPt.y * scale

    return seg
  }

  getSegMidPt(seg) {
    let x = (seg.startPt.x + seg.endPt.x) / 2
    let y = (seg.startPt.y + seg.endPt.y) / 2

    return {
      x: x,
      y: y
    }
  }

  //get 2d unit vector from seg translated to origin
  getUnitVector(seg) {

    let originTranslatedSeg = this.translateSegToOrigin(seg.startPt, seg.endPt)
    let div = Math.sqrt(
      originTranslatedSeg.endPt.x * originTranslatedSeg.endPt.x +
      originTranslatedSeg.endPt.y * originTranslatedSeg.endPt.y
    )

    let x = (originTranslatedSeg.endPt.x / div) * 1
    let y = (originTranslatedSeg.endPt.y / div) * 1

    return {
      startPt: {
        x: 0,
        y: 0,
        z: 0
      },
      endPt: {
        x: x,
        y: y
      }
    }
  }

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

  getNewRoadSeg() {
    let lastRoadSeg = this.getLastRoadSeg()

    let endPt = {
      x: lastRoadSeg.endPt.x + (lastRoadSeg.endPt.x - lastRoadSeg.startPt.x),
      y: lastRoadSeg.endPt.y + (lastRoadSeg.endPt.y - lastRoadSeg.startPt.y),
      z: 0
    }

    return {
      startPt: lastRoadSeg.endPt,
      endPt: endPt
    }
  }


  //adds a segment to this road object
  //(in practice, when all segments are added, road is added as line geometry from Scene)
  addSeg(seg) {
    let segmentToOrigin = this.translateSegToOrigin(seg.startPt, seg.endPt)
    //determine bend in road
    // segmentToOrigin is seg moved to origin (length unmodified)
    let rotatedEndPt = this.determineBend(segmentToOrigin.endPt)

    //put endPt back into world space
    //rotatedEndPt is point to translate, startPt is offset by which to translate rotatedEndPt
    let translatedEndPt = this.translatePtToWorld(rotatedEndPt, seg.startPt)

    //add transformed end point to vertsRoad
    this.numSegs++
      this.vertsRoad.push(translatedEndPt.x)
    this.vertsRoad.push(translatedEndPt.y)
    this.vertsRoad.push(translatedEndPt.z)
  }
  determineBend(currentRdEndPtRelativeToOrigin) {

    this.mult = this.mult * (-1)
    this.degrees = 2.5

    //set randomization factor of raod path generation by how close it is to start of road
    let randomization = 0.5
    /*
    if(this.numSegs < 250) {
      randomization = .9
    } else {
      randomization = 0.5
    }
    */
    if (Math.random() > randomization) {
    // if (true) {
      return this.rotateRoadSegAboutOrigin(currentRdEndPtRelativeToOrigin, this.degrees * this.mult)
    } else {
      return currentRdEndPtRelativeToOrigin
    }
  }

  translateSegToOrigin(startPt, endPt) {
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
    let x = endPt.x * Math.cos(radDegrees) - endPt.y * Math.sin(radDegrees)
    let y = endPt.x * Math.sin(radDegrees) + endPt.y * Math.cos(radDegrees)
    return {
      x: x,
      y: y
    }
  }

  //returns an end point rotated about origin amount degrees
  rotateRoadSegAboutOrigin(endPt, degrees) {
    let pt = this.rotateAboutOrigin(endPt, degrees)
    let x = pt.x //endPt.x * Math.cos(radDegrees) - endPt.y * Math.sin(radDegrees)
    let y = pt.y //endPt.x * Math.sin(radDegrees) + endPt.y * Math.cos(radDegrees)
    let z = 0

    //constrain to left or right direction
    if (this.direction === "left") {
      //go up and left
      if (x <= 0 && y >= 0) {
        return {
          //not rotated
          x: x,
          y: y,
          z: z
        }
      } else {
        return {
          //rotated
          x: endPt.x,
          y: endPt.y,
          z: endPt.z
        }
      }
    } else {
      // go up and right
      if (x >= 0 && y >= 0) {
        return {
          //not rotated
          x: x,
          y: y,
          z: z
        }
      } else {
        return {
          //rotated
          x: endPt.x,
          y: endPt.y,
          z: endPt.z
        }
      }
    }
  }
  getRoad() {
    return this.vertsRoad
  }
}
