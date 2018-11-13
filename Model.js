import Image from './Image'
import Crosslight from './Crosslight'
import Indicator from './Indicator'
import AngleLabel from './AngleLabel'

const getBoundingBox  = (paperScope, center, radius) => {
  let vector = new paperScope.Point(radius, radius)
  let topLeft = center.subtract(vector)
  let box = new paperScope.Rectangle(topLeft, radius * 2)
  return box
}

export default class Model {
  constructor(paperScope, src, center, radius, color) {
    this.angle = 0
    this.color = color
    this.image = new Image(
      paperScope,
      src,
      getBoundingBox(paperScope, center, radius),
      0.6,
      center,
      color
    )
    // crosslight
    this.crosslight = new Crosslight(
      paperScope,
      radius,
      10,
      center,
      color,
      2,
    )
    let indicatorRadius =  radius / 6
    this.indicator = new Indicator(
      paperScope,
      center,
      radius,
      indicatorRadius,
      color,
    )
    this.angleLabel = new AngleLabel(
      paperScope,
      center,
      radius,
      indicatorRadius,
      color,
    )
  }

  rotate(absAngle){
    let relativeAngle = - (this.angle - absAngle)
    this.image.rotate(relativeAngle)
    this.crosslight.rotate(relativeAngle)
    this.indicator.rotate(relativeAngle)
    this.angleLabel.rotate(absAngle, relativeAngle)
    this.angle = absAngle
  }

}
