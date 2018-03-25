/*
state and control for a single tile representing the city scape:
major road network and fill in street grids

todo:
-single initial major-road branch from seed point to edge on tile,
 where edge road terminates into is randomly arrived at by road updating rules.
*/
class Tile {
  constructor() {
    this.tileCN = null;
    // this.tileN = null;
    // this.tileNW = null;
    // this.tileW = null;
    // this.tileSW = null;
    // this.tileS = null;
    // this.tileSE = null;
    // this.tileE = null;
    // this.tileNE = null;

    this.tileSideLength = 104000;

    //road tracking parameters (numSegsFromPreviousBranch, numFuel, etc)
  }
  seedRoad() {
    //lay down first road seggment
  }

  //add a segment to the road or terminate it
  updateRoad() {
    //evaluate road tracking parameters

    //if end point not above, left, right or below boundry of tile, lay down road segment

    //else, terminate it at boundary intersection

    //update road tracking parameters
  }
  rotSeg(prevSegStartX, prevSegStartY, prevSegEndX, prevSegEndY) {
    console.log("enter Road.laySeg")

    let degrees = 0;
  }

}
