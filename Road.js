class Road {
  constructor(seg, rotDegrees, direction) {
    console.log(direction)

    this.direction = direction

    this.tile = new Tile()
    this.roadSeedX = this.tile.tileSideLength / 2

    this.roadSegLength = 100

    //result of this origin translated
    let firstRoadSeg = this.getUnitVector(seg)

    //rotate unit vector from constructor arg seg
    let firstRoadSegEndPtRotated = this.rotateAboutOrigin(firstRoadSeg.endPt, rotDegrees) //{x: newSegEndPt.x, y: newSegEndPt.y, z: 0}

    //build a unit vector seg to get mid point (will be from origin)
    let firstRoadSegFromOrigin = {
      startPt: {
        x: 0,
        y: 0,
        z: 0
      },
      endPt: {
        x: firstRoadSegEndPtRotated.x,
        y: firstRoadSegEndPtRotated.y,
        z: 0
      }
    }

    //scale first segment by road length (this establishes segment length for all segs since each seg uses the previous to offset it's new end point)
    firstRoadSegFromOrigin = this.scaleSegFromOrigin(firstRoadSegFromOrigin, this.roadSegLength)

    //get mid point of cons arg seg
    let midPt = this.getSegMidPt(seg)

    //translate it by it's startPt to mid point of constructor arg seg. args: seg to translate, point to translate it to
    let firstRoadSegFromWorld = this.translateSegToWorld(firstRoadSegFromOrigin, {
      x: midPt.x,
      y: midPt.y,
      z: 0
    })

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
    this.vertsRoad.push(translatedEndPt.x)
    this.vertsRoad.push(translatedEndPt.y)
    this.vertsRoad.push(translatedEndPt.z)
  }
  determineBend(currentRdEndPtRelativeToOrigin) {

    this.mult = this.mult * (-1)
    this.degrees = 5

    if (Math.random() > 0.75) {
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
          x: x,
          y: y,
          z: z
        }
      } else {
        return {
          x: endPt.x,
          y: endPt.y,
          z: endPt.z
        }
      }
    } else {
      // go up and right
      if (x >= 0 && y >= 0) {
        return {
          x: x,
          y: y,
          z: z
        }
      } else {
        return {
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
