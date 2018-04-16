class Road {
  constructor(direction, gridCellX, gridCellY) {
    this.vertsRoad = []

    let grid = new Grid()
    this.gridMin = (grid.gridNumCells / 2) * -1
    this.gridMax = grid.gridNumCells / 2
    this.boundsMin = this.gridMin * grid.gridCellDist
    this.boundsMax = this.gridMax * grid.gridCellDist
    console.log("min max: ", this.gridMin, this.gridMax)
    this.gridCellDist = grid.gridCellDist
    this.gridCellDistHalf = grid.gridCellDist / 2

    this.gridCellX = gridCellX
    this.gridCellY = gridCellY
    this.direction = direction

    this.dirMult = null

    if (this.direction === "left") {
      this.dirMult = -1
    } else {
      this.dirMult = 1
    }
    console.log(this.dirMult)
    console.log(this.gridMin, this.gridMax)

    this.mat = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      linewidth: 3
      // linecap: 'round', //ignored by WebGLRenderer
      // linejoin:  'round' //ignored by WebGLRenderer
    });


  }

  getLine(startPt, endPt) {
    let verts = new Float32Array([startPt.x, startPt.y, startPt.z, endPt.x, endPt.y, endPt.z])
    let geom = new THREE.BufferGeometry()
    geom.addAttribute('position', new THREE.BufferAttribute(verts, 3))
    let line = new THREE.Line(geom, this.mat)
    return line
  }

  getNextEndPt(prvSegStartPt, prvSegEndPt) {
    // console.log("snarf: ", prvSegStartPt, prvSegEndPt)
    //check if prev seg was straight up and down ("UD"), straight left and right("LR") or 45("45")
    let prvSegDir
    if (prvSegEndPt.x === prvSegStartPt.x) {
      // console.log("a")
      prvSegDir = "UD"
    } else if (prvSegEndPt.y === prvSegStartPt.y) {
      // console.log("b")
      prvSegDir = "LR"
    } else {
      // console.log("c")
      prvSegDir = "45"
    }
    // console.log("prvSegDir: ", prvSegDir)
    let newEndPt
    if (prvSegDir === "UD") {
      //continue UD or 45
      if (Math.random() > 0.5) {
        //UD
        console.log("UD, prvSegDir: ", prvSegDir)
        newEndPt = {
          x: prvSegEndPt.x,
          y: prvSegEndPt.y + this.gridCellDistHalf,
          z: 0
        }
      } else {
        //45
        console.log("45, prvSegDir: ", prvSegDir)
        newEndPt = {
          x: prvSegEndPt.x + this.gridCellDistHalf * this.dirMult,
          y: prvSegEndPt.y + this.gridCellDistHalf,
          z: 0
        }
      }
    }
    if (prvSegDir === "LR") {
      //continue LR or go either 45
      if (Math.random() > 0.5) {
        //LR
        newEndPt = {
          x: prvSegEndPt.x + this.gridCellDistHalf * this.dirMult,
          y: prvSegEndPt.y,
          z: 0
        }
      } else {
        //45
        newEndPt = {
          x: prvSegEndPt.x + this.gridCellDistHalf * this.dirMult,
          y: prvSegEndPt.y + this.gridCellDistHalf,
          z: 0
        }
      }
    }

    if (prvSegDir === "45") {
      //continue LR or go either 45
      if (Math.random() > 0.5) {
        if (Math.random() > 0.5) {
          //LR
          newEndPt = {
            x: prvSegEndPt.x + this.gridCellDistHalf * this.dirMult,
            y: prvSegEndPt.y,
            z: 0
          }
        } else {
          //UD
          newEndPt = {
            x: prvSegEndPt.x,
            y: prvSegEndPt.y + this.gridCellDistHalf,
            z: 0
          }
        }
      } else {
        //45
        newEndPt = {
          x: prvSegEndPt.x + this.gridCellDistHalf * this.dirMult,
          y: prvSegEndPt.y + this.gridCellDistHalf,
          z: 0
        }
      }
    }


    return newEndPt
  }

  genRoad() {

    let currentGridCellX = this.gridCellX
    let currentGridCellY = this.gridCellY
    console.log("f", currentGridCellX, currentGridCellY)

    let edgeReached = false
    let verts
    if (this.gridCellY === -10) {
      verts = [
        //first vertex
        currentGridCellX * this.gridCellDist + this.gridCellDist / 2,
        this.gridMin * this.gridCellDist,
        0,
        //second vertex
        currentGridCellX * this.gridCellDist + this.gridCellDist / 2,
        (this.gridMin + 1) * this.gridCellDist,
        0
      ]
    }
    if (this.gridCellX === 10) {
      verts = [
        //first vertex
        this.boundsMax,
        this.gridCellY * this.gridCellDist + this.gridCellDist / 2,
        0,
        //second vertex
        this.boundsMax-this.gridCellDist,
        this.gridCellY * this.gridCellDist + this.gridCellDist / 2,
        0,
      ]
    }
    if (this.gridCellX === -10) {
      verts = [
        //first vertex
        this.boundsMin,
        this.gridCellY * this.gridCellDist + this.gridCellDist / 2,
        0,
        //second vertex
        this.boundsMin+this.gridCellDist,
        this.gridCellY * this.gridCellDist + this.gridCellDist / 2,
        0,
      ]
    }

    while (edgeReached === false) {
      // let i = 0
      // while (i < 2) {
      // i++

      let prvSegEndPt = {
        x: verts[verts.length - 3],
        y: verts[verts.length - 2],
        z: 0
      }
      let prvSegStartPt = {
        x: verts[verts.length - 6],
        y: verts[verts.length - 5],
        z: 0
      }

      let newPt

      newPt = this.getNextEndPt(prvSegStartPt, prvSegEndPt)

      verts.push(newPt.x, newPt.y, newPt.z)
      if (
        newPt.x >= this.boundsMax ||
        newPt.x <= this.boundsMin ||
        newPt.y >= this.boundsMax) {

        edgeReached = true
      }
    }
    return verts
  }

  getRoad(verts = this.genRoad()) {
    let verts32 = new Float32Array(verts)
    let geom = new THREE.BufferGeometry()
    geom.addAttribute('position', new THREE.BufferAttribute(verts32, 3))
    let line = new THREE.Line(geom, this.mat)
    return line
  }
}
