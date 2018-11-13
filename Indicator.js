export default class Indicator {
  constructor(paperScope, center, radius, indicatorRadius, color) {
    this.paper = paperScope
    this.center = center
    let point =
      new paperScope.Point(center.x, center.y - radius - indicatorRadius - 3)
    this.indicator = new paperScope.Path.RegularPolygon(point, 3, indicatorRadius);
    this.indicator.rotate(180, point)
    this.indicator.scale(0.4, 1, point)
    this.indicator.fillColor = color
    this.indicator.opacity = 0.8
  }

  rotate(angle){
    this.indicator.rotate(angle, this.center)
  }
}
