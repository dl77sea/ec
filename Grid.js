class Grid {
  //seg is segment from previous road from which this road will be generated
  constructor() {
    this.gridNumCells = 20
    this.gridCellDist = 10 //5200



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

    this.orientationMode = 0;
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
    // this.gridNumCells = 8
    // this.gridCellDist = 10

    this.map = []

    for (let i = 0; i < this.gridNumCells * 2 * this.gridNumCells * 2; i++) {
      this.map.push({
        vrt: false,
        hrz: false,
        dgr: false,
        dgl: false,
        //set to value of lower part of tile to be used as reference when determining orientation mode on starting filling of new row: 0 = 45degrees, 1 = 90degrees
        orientationMode: 0
      })
    }


    this.happened = 0
  }

  getLine(startPt, endPt) {
    let verts = new Float32Array([startPt.x, startPt.y, startPt.z, endPt.x, endPt.y, endPt.z])
    let geom = new THREE.BufferGeometry()
    geom.addAttribute('position', new THREE.BufferAttribute(verts, 3))
    let line = new THREE.Line(geom, this.mat)
    return line
  }

  getGrid(divisions, color) {
    //build positive hrz lines
    this.mat = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 1
      // linecap: 'round', //ignored by WebGLRenderer
      // linejoin:  'round' //ignored by WebGLRenderer
    });

    for (let i = -this.gridCellDist * this.gridNumCells / 2; i <= this.gridCellDist * this.gridNumCells / 2; i += this.gridCellDist / divisions) {
      //build horizontal line
      let startPt = {
        x: -this.gridCellDist * this.gridNumCells / 2,
        y: i,
        z: 0
      }
      let endPt = {
        x: this.gridCellDist * this.gridNumCells / 2,
        y: i,
        z: 0
      }
      let gridLine = this.getLine(startPt, endPt)
      this.gridLines.push(gridLine)
      //build vertical lines
      startPt = {
        x: i,
        y: -this.gridCellDist * this.gridNumCells / 2,
        z: 0
      }
      endPt = {
        x: i,
        y: this.gridCellDist * this.gridNumCells / 2,
        z: 0
      }
      gridLine = this.getLine(startPt, endPt)
      this.gridLines.push(gridLine)
    }

    return this.gridLines
  }

  addRoad(verts) {
    // console.log("---num of segs:", verts.length / 3 - 1)
    //process each segment in road
    let numVerts = verts.length / 3 - 1
    // console.log("this.map: ", this.map)
    for (let i = 0; i < verts.length - 3; i += 3) {

      let transOffset = this.gridCellDist * this.gridNumCells / 2

      let transStartX = verts[i + 0] + transOffset
      let transStartY = verts[i + 1] + transOffset

      let transEndX = verts[i + 3] + transOffset
      let transEndY = verts[i + 4] + transOffset
      /*
      console.log("transStartX x: ", transStartX)
      console.log("transStartY y: ", transStartY)

      console.log("transEndX x: ", transEndX)
      console.log("transEndY y: ", transEndY)
      console.log("--")
      */
      // this gets the x,y coordinates onto the grid (translated into grid space with origin at lower left corner)
      let iX = (transStartX / (this.gridCellDist / 2)) - 1
      let iY = (this.gridNumCells * 2) - (transStartY / (this.gridCellDist / 2)) - 1

      //vertical
      if (transStartX === transEndX) {
        this.map[(iY * this.gridNumCells * 2) + iX].vrt = true
      }

      //horizontal
      if (transStartY === transEndY) {
        iX++
        this.map[(iY * this.gridNumCells * 2) + iX].hrz = true
      }

      //diagonal
      if (transStartX !== transEndX && transStartY !== transEndY) {
        iX++
        if (transEndX > transStartX) {
          //diagonal up and right
          this.map[(iY * this.gridNumCells * 2) + iX].dgr = true
        } else {
          //diagonal up and left
          this.map[(iY * this.gridNumCells * 2) + iX - 1].dgl = true
        }
      }

    }

    // console.log(this.map)
  }

  //for each grid square quadrant,
  // assign orientation depending on surrounding orientation assignments,
  // determined by segment locations
  assignOrientation() {
    //each grid square is divided into quadrants by an X,
    // where each quadrant represents a tile of street grid in one of two orientation modes:
    // 45 and 90 degrees, in clockwise order (1 through 4) starting from left
    for (let i = 0; i < this.map.length; i++) {
      //quad1
      //  get value from quad3 of grid square to left, if not on first grid square of row
      //  if no vertical exist left adjacent, set orientation mode to left quad3 val,
      //  else set orientation mode to opposite that val
      if (i % this.gridNumCells * 2 !== 0) {
        if (this.map[i - 1].vrt) {
          this.orientationMode = this.getOppositeOrientationMode(this.map[i - 1].quad3)
          // console.log(this.map[i - 1])
          this.happened += 1
          // if (this.happened === 3) {
          this.plotDot(i)
          // }
        } else {
          this.orientationMode = this.map[i - 1].quad3
          // this.plotDot(i)
        }
      } else

        //quad2
        //  get value from above (quad4), if not on first row, but are in first grid square,
        //  and change orientation mode if hrz segment found adjacent above,
        //  else use value from quad4 above
        if (i > this.gridNumCells * 2 && i % this.gridNumCells * 2 === 0) {
          if (this.map[i - this.gridNumCells * 2].hrz) {
            this.orientationMode = this.getOppositeOrientationMode(this.map[i - this.gridNumCells * 2].quad4)
          } else {
            this.orientationMode = this.map[i - this.gridNumCells * 2].quad4
          }
        } else {
          //  quad2 is not in first grid square of row other than first, so check for diagonal left segment,
          //  change orientation mode for quad2 if dgl found
          if (this.map[i].dgl) {
            //diagonal left found, so set quad2 to opposite quad1
            this.orientationMode = this.getOppositeOrientationMode(this.map[i].quad1)
          } else {
            //no diagonal left, so set quad 2 same orientation as quad1
            this.orientationMode = this.map[i].quad1
          }
        }

      //quad3
      //  get value from quad2, unless diagonal right exist, then opposite quad2
      if (this.map[i].dgr) {
        this.orientationMode = this.getOppositeOrientationMode(this.map[i].quad2)
      } else {
        this.orientationMode = this.map[i].quad1
      }

      //quad4
      //  get value from quad3, unless diagonal left exist, then opposite quad3
      // (note: if diagonal right exist, does not matter, still want to match 3)
      if (this.map[i].dgl) {
        this.orientationMode = this.getOppositeOrientationMode(this.map[i].quad2)
      } else {
        this.orientationMode = this.map[i].quad1
      }
    }
  }

  getOppositeOrientationMode(orientationMode) {
    if (orientationMode === 0) {
      return 1
    } else {
      return 0
    }
  }

  // plotDot(cenX, cenY, color) {
  plotDotAt(x, y) {

    let cenX = x
    let cenY = y
    // console.log(iGrid, cenX, cenY)


    let color = 0xff0000
    var geometry = new THREE.CircleGeometry(1, 32);
    var material = new THREE.MeshBasicMaterial({
      color: color
    });
    var circle = new THREE.Mesh(geometry, material);

    circle.position.x = cenX
    circle.position.y = cenY

    scene.add(circle);
  }

  plotDot(iGrid) {

    /*
    let x = (i - (Math.floor(i / this.gridNumCells) * this.gridNumCells)) * this.gridCellDist + this.gridCellDist / 2
    let y = ((this.gridNumCells - 1) - Math.floor(i / this.gridNumCells)) * this.gridCellDist + this.gridCellDist / 2
    // console.log(x, y)
    //translate  cen of each map grid square into world space
    x = x - this.gridCellDist * (this.gridNumCells / 2)
    y = y - this.gridCellDist * (this.gridNumCells / 2)
    */

    // console.log(iGrid%(this.gridNumCells*2)*this.gridCellDist/2)
    let cenX = (iGrid % (this.gridNumCells * 2)) * this.gridCellDist / 2
    let cenY = this.gridNumCells * this.gridCellDist - (Math.floor(iGrid / this.gridNumCells / 2)) * (this.gridCellDist / 2) //* (this.gridCellDist/2)



    console.log(cenX, cenY)
    //translate into 3js coordinates

    cenX = cenX - (this.gridNumCells) * this.gridCellDist / 2
    cenY = cenY - (this.gridNumCells) * this.gridCellDist / 2
    // console.log(iGrid, cenX, cenY)


    let color = 0x00ff00
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
      let x = (i - (Math.floor(i / this.gridNumCells) * this.gridNumCells)) * this.gridCellDist + this.gridCellDist / 2
      let y = ((this.gridNumCells - 1) - Math.floor(i / this.gridNumCells)) * this.gridCellDist + this.gridCellDist / 2
      // console.log(x, y)
      //translate  cen of each map grid square into world space
      x = x - this.gridCellDist * (this.gridNumCells / 2)
      y = y - this.gridCellDist * (this.gridNumCells / 2)

      //determine orientation mode
      //if not on first tile,
      if (i !== 0) {
        //make sure filling with same orientation mode
        //as loewer part of tile above, when starting to fill new row
        if (i % this.gridNumCells === 0) {
          if (grid[i].hrz === false) {
            orientationMode = grid[i - this.gridNumCells].orientationMode
          } else {
            orientationMode = getOppositeOrientationMode(grid[i - this.gridNumCells].orientationMode)
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
      if (grid[i].dgl || grid[i].dgr) {

        if (grid[i].dgl) {

          if (grid[i].hrz) {
            orientationMode = getOppositeOrientationMode(grid[i - this.gridNumCells].orientationMode)

            this.plotDot(x + 2.5, y + 2.5, tileRefs.ll[orientationMode])
            changeOrientationMode()
            this.plotDot(x - 2.5, y - 2.5, tileRefs.ur[orientationMode])
            grid[i].orientationMode = orientationMode
          } else {
            this.plotDot(x - 2.5, y - 2.5, tileRefs.ur[orientationMode])
            grid[i].orientationMode = orientationMode
            //set new orientation mode to match what's happening in this area
            if (grid[i].hrz) {
              orientationMode = getOppositeOrientationMode(grid[i - this.gridNumCells].orientationMode)
            } else {
              if (i > 7) {
                orientationMode = grid[i - this.gridNumCells].orientationMode
              } else {
                changeOrientationMode()
              }
            }
            this.plotDot(x + 2.5, y + 2.5, tileRefs.ll[orientationMode])
          }
          if (grid[i].vrt) {
            changeOrientationMode()
          }


        } else {
          //dgr
          if (grid[i].hrz) {
            orientationMode = getOppositeOrientationMode(grid[i - this.gridNumCells].orientationMode)

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
          if (grid[i].vrt) {
            changeOrientationMode()
          }

        }
      }

      if (grid[i].vrt && (grid[i].dgl !== true && grid[i].dgr !== true)) {
        this.plotDot(x + 2.5, y + 2.55, tileRefs.ll[orientationMode])
        this.plotDot(x - 2.5, y - 2.55, tileRefs.ur[orientationMode])
        grid[i].orientationMode = orientationMode
        changeOrientationMode()
      }

      if (grid[i].hrz && (grid[i].dgl !== true && grid[i].dgr !== true)) {
        //don't switch fill orientation if no vertical to left
        if (grid[i - 1].vrt) {
          orientationMode = getOppositeOrientationMode(grid[i - this.gridNumCells].orientationMode)
        }

        grid[i].orientationMode = orientationMode
        this.plotDot(x + 2.5, y + 2.55, tileRefs.ll[orientationMode])
        this.plotDot(x - 2.5, y - 2.55, tileRefs.ur[orientationMode])
      }
    }
  }
}
