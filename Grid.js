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
        dgl: false
      })
    }

    this.happened = 0
    // for(let i = 0; i < 5; i++) {
    //   this.map.push([])
    //   for(let j = 0; j < 5; j++) {
    //     this.map[i].push(mapCell)
    //   }
    // }

    console.log("snarfaloo", this.testMap)
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
    console.log ("gridlines: ", this.gridLines)
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

  addRoad(verts) {

    console.log("---")
    //process each segment in road
    let numVerts = verts.length / 3 - 1
    let i = 0
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

      console.log("transStartX, transStartY, transEndX, transEndY:", transStartX, transStartY, transEndX, transEndY)
      i += 3

      //for each segment, update cell values in map array...
      let iX = (transStartX / this.testGridCellDist) - 1
      let iY = (this.testGridNumCells * this.testGridNumCells) - ((transStartY / this.testGridCellDist) * this.testGridNumCells) - this.testGridNumCells
      console.log ("iX: ", iX)
      console.log ("iY: ", iY)

      //vertical
      if (transStartX === transEndX) {
        //transformed x * y / units: use transformed x and y of vertex to determin array position
        console.log(":::", iX, iY)
        this.testMap[iY + iX - this.testGridNumCells].vrt = true
        this.testMap[iY + iX].vrt = true
      }
      //horizontal
      if (transStartY === transEndY) {
        this.testMap[iY + iX + 1].hrz = true
        this.testMap[iY + iX + 2].hrz = true
      }
      //diagonal

      if (transStartX !== transEndX && transStartY !== transEndY) {

        //diagonal up and right
        if (transEndX > transStartX) {
          this.happened+=1
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
  }

  plotDot(cenX,cenY,color) {
    var geometry = new THREE.CircleGeometry( 5, 32 );
    var material = new THREE.MeshBasicMaterial( { color: color } );
    var circle = new THREE.Mesh( geometry, material );

    circle.position.x = cenX
    circle.position.y = cenY

    scene.add( circle );
  }
  // put a color dot on each grid square on map representing tile
  testPlotTiles(grid) {
    let color = 0xffff00
    this.plotDot(3,-3,color)
    // red: triangle upper left diagonal (dul)
    // orange: triangle upper right diagonal (dur)
    // yellow: triangle lower left diagonal (dll)
    // magenta: triangle upper right diagonal (dlr)


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
    for(let i=0; i < grid.length; i++) {
      // console.log(gridSquare)
      //get translated plotting coordinates from index into map grid
      // let y = (Math.floor(i/this.testGridNumCells)*this.testGridNumCells) * this.testGridCellDist + this.testGridCellDist/2

      let y = (Math.floor(i/this.testGridNumCells)*this.testGridNumCells) + this.testGridCellDist/2
      // let x = (i - (Math.floor(i/this.testGridNumCells)*this.testGridNumCells)) + this.testGridCellDist/2
      let x = (i - (Math.floor(i/this.testGridNumCells)*this.testGridNumCells)) * this.testGridCellDist + this.testGridCellDist/2
      console.log(x,y)

      //figure out which tiles to plot for each gridSquare:
      if (!(grid[i].vrt && grid[i].hrz && grid[i].dgl && grid[i].dgr)) {
        //grid suqare is empty, so populate with upper right and lower left of current orientation mode
        this.plotDot(x,y,0xff0000)
      }


      //if gridSquare empty, do square (ll/ur of square) of current orientation mode

    }
  }
}
