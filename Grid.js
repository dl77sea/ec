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

    for (let i = -this.gridCellDist * this.gridNumCells / 2; i <= this.gridCellDist * this.gridNumCells / 2; i += this.gridCellDist) {
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

  //  vertical segment    (right edge): 0
  //  horizontal segment  (bottom edge): 1
  //  45  degree segment: 2
  //  135 degree segment: 3
  addRoad(verts) {
    console.log("---")
    for (let i = 0; i < verts.length; i += 3) {
      console.log(verts[i + 0])
      console.log(verts[i + 1])
      console.log(verts[i + 2])
    }
  }

}
