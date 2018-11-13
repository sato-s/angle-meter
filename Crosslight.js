export default class Crosslight {
  constructor(paperScope, radius, padding, center, color, width) {
    this.paper = paperScope
    paperScope.activate()
    this.center = center
    let halfLength = radius - padding
    var start = new this.paper.Point(this.center.x, this.center.y - halfLength)
    var end = new this.paper.Point(this.center.x, this.center.y + halfLength)
    let path1 = new this.paper.Path.Line(start, end)
    path1.strokeColor = color
    path1.strokeWidth = width
    path1.dashArray = [2, 2]

    var start = new this.paper.Point(this.center.x - halfLength, this.center.y)
    var end = new this.paper.Point(this.center.x + halfLength, this.center.y)
    let path2 = new this.paper.Path.Line(start, end)
    path2.strokeColor = color
    path2.strokeWidth = width
    path2.dashArray = [2, 2]
    this.crosslight = new this.paper.Group([path1, path2])
  }

  rotate(angle){
    this.crosslight.rotate(angle)
  }
}
