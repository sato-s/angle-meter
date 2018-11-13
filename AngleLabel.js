export default class AngleLabel {
  constructor(paperScope, center, radius, indicatorRadius, color) {
    this.paper = paperScope
    this.center = center
    this.currentAngleLabelPosition =
      new paperScope.Point(
        center.x + indicatorRadius * 3,
        center.y - radius - indicatorRadius
      )
    this.currentAngleLabel = new paperScope.PointText({
      point: this.currentAngleLabelPosition,
      justification: 'center',
      fontSize: indicatorRadius * 1.5,
      fillColor: color,
    });
    this.currentAngleLabel.content = 0
  }

  rotate(absAngle, relativeAngle){
    this.currentAngleLabelPosition = this.currentAngleLabelPosition.rotate(relativeAngle, this.center)
    this.currentAngleLabel.position = this.currentAngleLabelPosition
    this.currentAngleLabel.content = `${absAngle}`
  }
}
