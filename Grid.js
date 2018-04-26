class Grid {
  //seg is segment from previous road from which this road will be generated
  constructor() {
    this.gridNumCells = 20
    this.gridCellDist = 5200



    this.gridLines = []

    this.mat = new THREE.LineBasicMaterial({
      color: 0x222222,
      linewidth: 3
      // linecap: 'round', //ignored by WebGLRenderer
      // linejoin:  'round' //ignored by WebGLRenderer
    });
    this.numRoads = 0
    //maintain info on what road segments are contained in each cell
    this.roadCoords = []

    //lienar array representation of 3js plot grid (presumes square grid): gridNumCells*4 x gridNumCells*4
    //refered to, to determine which street grid tiles to plot into 3js world coordinates
    // this.map = []
    // let mapCell = {
    //   vrt: 0,
    //   hrz: 0,
    //   dgr: 0,
    //   dgl: 0
    // }
    // for (let i = 0; i < this.gridNumCells * 4 * this.gridNumCells * 4; i++) {
    //   this.map.push(mapCell)
    // }
    this.testGridNumCells = 8
    this.testGridCellDist = 10

    this.testMap = []

    for (let i = 0; i < this.testGridNumCells * this.testGridNumCells; i++) {
      this.testMap.push({
        vrt: false,
        hrz: false,
        dgr: false,
        dgl: false,
        //set to value of lower part of tile to be used as reference when determining orientation mode on starting filling of new row: 0 = 45degrees, 1 = 90degrees
        orientationMode: 0
      })
    }

    this.happened = 0
    // for(let i = 0; i < 5; i++) {
    //   this.map.push([])
    //   for(let j = 0; j < 5; j++) {
    //     this.map[i].push(mapCell)
    //   }
    // }

    // console.log("snarfaloo", this.testMap)
  }

  getLine(startPt, endPt) {
    let verts = new Float32Array([startPt.x, startPt.y, startPt.z, endPt.x, endPt.y, endPt.z])
    let geom = new THREE.BufferGeometry()
    geom.addAttribute('position', new THREE.BufferAttribute(verts, 3))
    let line = new THREE.Line(geom, this.mat)
    return line
  }

  //populate the grid with a road coordinates
  addRoad() {
    this.numRoads++
  }
  getGrid() {
    //build positive hrz lines

    for (let i = -this.testGridCellDist * this.testGridNumCells / 2; i <= this.testGridCellDist * this.testGridNumCells / 2; i += this.testGridCellDist) {
      //build horizontal line
      let startPt = {
        x: -this.testGridCellDist * this.testGridNumCells / 2,
        y: i,
        z: 0
      }
      let endPt = {
        x: this.testGridCellDist * this.testGridNumCells / 2,
        y: i,
        z: 0
      }
      let gridLine = this.getLine(startPt, endPt)
      this.gridLines.push(gridLine)
      //build vertical lines
      startPt = {
        x: i,
        y: -this.testGridCellDist * this.testGridNumCells / 2,
        z: 0
      }
      endPt = {
        x: i,
        y: this.testGridCellDist * this.testGridNumCells / 2,
        z: 0
      }
      gridLine = this.getLine(startPt, endPt)
      this.gridLines.push(gridLine)
    }
    // console.log("gridlines: ", this.gridLines)
    return this.gridLines
  }

  // getGrid() {
  //   //build positive hrz lines
  //
  //   for (let i = -this.gridCellDist * this.gridNumCells / 2; i <= this.gridCellDist * this.gridNumCells / 2; i += this.gridCellDist) {
  //     //build horizontal line
  //     let startPt = {
  //       x: -this.gridCellDist * this.gridNumCells / 2,
  //       y: i,
  //       z: 0
  //     }
  //     let endPt = {
  //       x: this.gridCellDist * this.gridNumCells / 2,
  //       y: i,
  //       z: 0
  //     }
  //     let gridLine = this.getLine(startPt, endPt)
  //     this.gridLines.push(gridLine)
  //     //build vertical lines
  //     startPt = {
  //       x: i,
  //       y: -this.gridCellDist * this.gridNumCells / 2,
  //       z: 0
  //     }
  //     endPt = {
  //       x: i,
  //       y: this.gridCellDist * this.gridNumCells / 2,
  //       z: 0
  //     }
  //     gridLine = this.getLine(startPt, endPt)
  //     this.gridLines.push(gridLine)
  //   }
  //   return this.gridLines
  // }



  //add road segments to map array (80x80 array), where road segments represented as:
  // blank: 0
  //  vertical segment    (right edge): 1
  //  horizontal segment  (bottom edge): 2
  //  45 degree (diagonal right) segment: 3
  //  135 degree (diagonal left) segment: 4
  // {vrt: 0, hrz: 0, dgr: 0, dgl: 0}

  //ongrid05 old version
  // let testVertsRoad7 = [
  //   40,-20,0,
  //   20,-20,0,
  //   0,-20,0,
  //   -20,-20,0,
  //   -40,-20,0
  // ]

  addRoad(verts) {
    console.log("---", verts)
    //process each segment in road
    let numVerts = verts.length / 3 - 1

    for (let i = 0; i < verts.length - 3; i += 3) {

      let transOffset = this.testGridCellDist * this.testGridNumCells / 2

      let transStartX = verts[i + 0] + transOffset
      let transStartY = verts[i + 1] + transOffset

      let transEndX = verts[i + 3] + transOffset
      let transEndY = verts[i + 4] + transOffset
      // console.log("start x: ", verts[i + 0])
      // console.log("start y: ", verts[i + 1])
      // console.log("start z: ", verts[i + 2])
      //
      // console.log("end x: ", verts[i + 3])
      // console.log("end y: ", verts[i + 4])
      // console.log("end z: ", verts[i + 5])
      console.log("transStartX x: ", transStartX)
      console.log("transStartY y: ", transStartY)

      console.log("transEndX x: ", transEndX)
      console.log("transEndY y: ", transEndY)


      // console.log("end x: ", verts[i + 3])
      // console.log("end y: ", verts[i + 4])
      // console.log("end z: ", verts[i + 5])
      //

      // this gets the x,y coordinates onto the grid (translated into grid space with origin at lower left corner)
      let iX = (transStartX / this.testGridCellDist) - 1
      let iY = this.testGridNumCells - (transStartY / this.testGridCellDist) - 1
      console.log("iX, iY: ", iX, iY)

      //vertical
      if (transStartX === transEndX) {
        //transformed x * y / units: use transformed x and y of vertex to determin array position

        if (transStartY > transEndY) {
          //seg is going top to bottom
          this.testMap[((iY + 1) * this.testGridNumCells) + iX].vrt = true
          this.testMap[((iY + 1) * this.testGridNumCells) + iX + this.testGridNumCells].vrt = true
        } else {
          //seg is going bottom to top
          console.log("+++", iX, iY)
          this.testMap[(iY * this.testGridNumCells) + iX].vrt = true
          this.testMap[(iY * this.testGridNumCells) + iX - this.testGridNumCells].vrt = true
        }
      }
      //horizontal
      if (transStartY === transEndY) {
        //seg is going right to left
        if (transStartX > transEndX) {
          this.testMap[(iY * this.testGridNumCells) + iX + this.testGridNumCells - 1].hrz = true
          this.testMap[(iY * this.testGridNumCells) + iX + 1 + this.testGridNumCells - 1].hrz = true
        } else {
          //seg is going left to right
          this.testMap[(iY * this.testGridNumCells) + iX + 1 + this.testGridNumCells].hrz = true
          this.testMap[(iY * this.testGridNumCells) + iX + 1 + 1 + this.testGridNumCells].hrz = true
        }

      }
      //diagonal
      if (transStartX !== transEndX && transStartY !== transEndY) {

        //diagonal up and right
        if (transEndX > transStartX) {
          this.happened += 1
          //go one over to right from index,
          //then subtract gridNumCells
          //to mark cell representing upper part of diagonal
          this.testMap[(iY * this.testGridNumCells) + iX + 1].dgr = true
          this.testMap[(iY * this.testGridNumCells) + iX + 1 - this.testGridNumCells + 1].dgr = true
        } else {
          //diagonal up and left
          this.testMap[(iY * this.testGridNumCells) + iX].dgl = true
          this.testMap[(iY * this.testGridNumCells) + iX - this.testGridNumCells - 1].dgl = true
        }
      }
      this.testMap[0].snarf = 1
    }
    /*
    for (let vertCounter = 0; vertCounter < numVerts; vertCounter++) {
      console.log("i: ", i)
      console.log("start x:", verts[i + 0])
      console.log("start y:", verts[i + 1])
      console.log("start z:", verts[i + 2])
      console.log("end x:", verts[i + 3])
      console.log("end y:", verts[i + 4])
      console.log("end z:", verts[i + 5])

      //translate (test) verts to testMap segment representation:
      let transOffset = this.testGridCellDist * this.testGridNumCells / 2
      let transStartX = verts[i + 0] + transOffset
      let transStartY = verts[i + 1] + transOffset

      let transEndX = verts[i + 3] + transOffset
      let transEndY = verts[i + 4] + transOffset
      console.log("verts: ", verts)
      console.log("transStartX, transStartY, transEndX, transEndY:", transStartX, transStartY, transEndX, transEndY)
      i += 3

      //for each segment, update cell values in map array...
      let iX = (transStartX / this.testGridCellDist) - 1
      let iY = (this.testGridNumCells * this.testGridNumCells) - ((transStartY / this.testGridCellDist) * this.testGridNumCells) - this.testGridNumCells

      //vertical
      if (transStartX === transEndX) {
        //transformed x * y / units: use transformed x and y of vertex to determin array position
        this.testMap[iY + iX - this.testGridNumCells].vrt = true
        this.testMap[iY + iX].vrt = true
      }
      //horizontal
      if (transStartY === transEndY) {
        this.testMap[iY + iX + 1 + this.testGridNumCells].hrz = true
        this.testMap[iY + iX + 2 + this.testGridNumCells].hrz = true
      }
      //diagonal
      if (transStartX !== transEndX && transStartY !== transEndY) {

        //diagonal up and right
        if (transEndX > transStartX) {
          this.happened += 1
          //go one over to right from index,
          //then subtract gridNumCells
          //to mark cell representing upper part of diagonal
          this.testMap[iY + iX + 1].dgr = true
          this.testMap[iY + iX - this.testGridNumCells + 2].dgr = true
        } else {
          //diagonal up and left
          this.testMap[iY + iX - this.testGridNumCells - 1].dgl = true
          this.testMap[iY + iX].dgl = true
        }
      }
    }
    */
  }

  plotDot(cenX, cenY, color) {
    var geometry = new THREE.CircleGeometry(1, 32);
    var material = new THREE.MeshBasicMaterial({
      color: color
    });
    var circle = new THREE.Mesh(geometry, material);

    circle.position.x = cenX
    circle.position.y = cenY

    scene.add(circle);
  }
  // put a color dot on each grid square on map representing tile
  testPlotTiles(grid) {
    function changeOrientationMode() {
      if (orientationMode === 0) {
        orientationMode = 1
      } else {
        orientationMode = 0
      }
    }

    function getOppositeOrientationMode(orientationMode) {
      if (orientationMode === 0) {
        return 1
      } else {
        return 0
      }
    }

    let color = 0xffff00
    this.plotDot(3, -3, color)
    // 0;
    // red: triangle upper left diagonal (dul)
    // orange: triangle upper right diagonal (dur)
    // yellow: triangle lower left diagonal (dll)
    // magenta: triangle lower right diagonal (dlr)

    // 1;
    // blue: triangle upper left straight (sul)
    // cyan: triangle upper right straight (sur)
    // green: triangle lower left straight (sll)
    // grey: triangle lower right straight (slr)

    //set orientation mode: 0 = 45 degrees, 1 = 90 degrees
    //(as long as no segments found in gridSquare, orientation does not change)
    let orientationMode = 0
    //[45deg ref, 90deg ref]
    let tileRefs = {
      ul: [0xff0000, 0x0000ff],
      ur: [0xff8833, 0x00ffff],
      ll: [0xffff00, 0x00ff00],
      lr: [0xff00ff, 0xaaaaaa]
    }

    for (let i = 0; i < grid.length; i++) {
      //get map coordinates center for each grid square
      let x = (i - (Math.floor(i / this.testGridNumCells) * this.testGridNumCells)) * this.testGridCellDist + this.testGridCellDist / 2
      let y = ((this.testGridNumCells - 1) - Math.floor(i / this.testGridNumCells)) * this.testGridCellDist + this.testGridCellDist / 2
      // console.log(x, y)
      //translate  cen of each map grid square into world space
      x = x - this.testGridCellDist * (this.testGridNumCells / 2)
      y = y - this.testGridCellDist * (this.testGridNumCells / 2)

      //determine orientation mode
      //if not on first tile,
      if (i !== 0) {
        //make sure filling with same orientation mode
        //as loewer part of tile above, when starting to fill new row
        if (i % this.testGridNumCells === 0) {
          if (grid[i].hrz === false) {
            orientationMode = grid[i - this.testGridNumCells].orientationMode
          } else {
            orientationMode = getOppositeOrientationMode(grid[i - this.testGridNumCells].orientationMode)
          }
        }
      }
      //figure out which tiles to plot for each gridSquare:

      //grid suqare is empty, so populate with upper right and lower left of current orientation mode
      if (grid[i].vrt === false && grid[i].hrz === false && grid[i].dgl === false && grid[i].dgr === false) {
        // console.log("empty")
        this.plotDot(x + 2.5, y + 2.55, tileRefs.ll[orientationMode])
        this.plotDot(x - 2.5, y - 2.55, tileRefs.ur[orientationMode])
        grid[i].orientationMode = orientationMode
      }

      //grid square has a diagonal segment
      if(grid[i].dgl || grid[i].dgr) {

        if(grid[i].dgl) {

          if(grid[i].hrz) {
            orientationMode = getOppositeOrientationMode(grid[i - this.testGridNumCells].orientationMode)

            this.plotDot(x + 2.5, y + 2.5, tileRefs.ll[orientationMode])
            changeOrientationMode()
            this.plotDot(x - 2.5, y - 2.5, tileRefs.ur[orientationMode])
            grid[i].orientationMode = orientationMode
          } else {
            this.plotDot(x - 2.5, y - 2.5, tileRefs.ur[orientationMode])
            grid[i].orientationMode = orientationMode
            changeOrientationMode()
            this.plotDot(x + 2.5, y + 2.5, tileRefs.ll[orientationMode])
          }
          if(grid[i].vrt) {
            changeOrientationMode()
          }


        } else {
          //dgr
          if(grid[i].hrz) {
            orientationMode = getOppositeOrientationMode(grid[i - this.testGridNumCells].orientationMode)

            this.plotDot(x - 2.5, y + 2.5, tileRefs.lr[orientationMode])
            changeOrientationMode()
            this.plotDot(x + 2.5, y - 2.5, tileRefs.ul[orientationMode])
            grid[i].orientationMode = orientationMode
          } else {
            this.plotDot(x - 2.5, y + 2.5, tileRefs.lr[orientationMode])

            changeOrientationMode()
            grid[i].orientationMode = orientationMode
            this.plotDot(x + 2.5, y - 2.5, tileRefs.ul[orientationMode])
          }
          if(grid[i].vrt) {
            changeOrientationMode()
          }

        }
      }

      if(grid[i].vrt && (grid[i].dgl !== true && grid[i].dgr !== true)) {
        this.plotDot(x + 2.5, y + 2.55, tileRefs.ll[orientationMode])
        this.plotDot(x - 2.5, y - 2.55, tileRefs.ur[orientationMode])
        grid[i].orientationMode = orientationMode
        changeOrientationMode()
      }

      if(grid[i].hrz && (grid[i].dgl !== true && grid[i].dgr !== true)) {
        orientationMode = getOppositeOrientationMode(grid[i - this.testGridNumCells].orientationMode)

        grid[i].orientationMode = orientationMode
        this.plotDot(x + 2.5, y + 2.55, tileRefs.ll[orientationMode])
        this.plotDot(x - 2.5, y - 2.55, tileRefs.ur[orientationMode])
      }

      /*
      //grid suqare is empty, so populate with upper right and lower left of current orientation mode
      if (grid[i].vrt === false && grid[i].hrz === false && grid[i].dgl === false && grid[i].dgr === false) {
        // console.log("empty")
        this.plotDot(x + 2.5, y + 2.55, tileRefs.ll[orientationMode])
        this.plotDot(x - 2.5, y - 2.55, tileRefs.ur[orientationMode])
        grid[i].orientationMode = orientationMode
      }

      if (grid[i].vrt && grid[i].dgl === false && grid[i].dgr === false) {
        // console.log("vrt")
        this.plotDot(x + 2.5, y + 2.55, tileRefs.ll[orientationMode])
        this.plotDot(x - 2.5, y - 2.55, tileRefs.ur[orientationMode])
        grid[i].orientationMode = orientationMode
        changeOrientationMode()
      } else {
        // this.plotDot(x + 2.5, y + 2.55, tileRefs.ll[orientationMode])
        // changeOrientationMode()
        // this.plotDot(x - 2.5, y - 2.55, tileRefs.ur[orientationMode])
        // grid[i].orientationMode = orientationMode

      }
      if (grid[i].vrt && (grid[i].dgl === true || grid[i].dgr === true)) {
        changeOrientationMode()
      }

      if (grid[i].hrz && grid[i].dgl === false && grid[i].dgr === false) {
        // console.log("hrz")
        orientationMode = getOppositeOrientationMode(grid[i - this.testGridNumCells].orientationMode)
        this.plotDot(x + 2.5, y + 2.55, tileRefs.ll[orientationMode])
        this.plotDot(x - 2.5, y - 2.55, tileRefs.ur[orientationMode])
        grid[i].orientationMode = orientationMode
      }

      //if diagonal
      if (grid[i].dgl) {
        // console.log("dgl")
        if (grid[i].vrt !== true) {
          this.plotDot(x - 2.5, y - 2.5, tileRefs.ur[orientationMode])
          this.plotDot(x + 2.5, y + 2.5, tileRefs.ll[orientationMode])
          grid[i].orientationMode = orientationMode
          changeOrientationMode()
        } else {
          changeOrientationMode()
          this.plotDot(x - 2.5, y - 2.5, tileRefs.ur[orientationMode])
          this.plotDot(x + 2.5, y + 2.5, tileRefs.ll[orientationMode])

          grid[i].orientationMode = orientationMode
        }

      }
      if (grid[i].dgr) {
        // console.log("dgr")
        this.plotDot(x - 2.5, y + 2.55, tileRefs.lr[orientationMode])
        changeOrientationMode()
        this.plotDot(x + 2.5, y - 2.55, tileRefs.ul[orientationMode])
        grid[i].orientationMode = orientationMode
      }

      // console.log(i%this.testGridNumCells)
      // if(i%this.testGridNumCells === 0) {
      // console.log(i-this.testGridNumCells)
      // if(grid[i])
      // }
      // if( (i - (Math.floor(i / this.testGridNumCells))) === 8 )
      // changeOrientationMode()
      // console.log(i, grid[i])
      */
    }
  }
}
