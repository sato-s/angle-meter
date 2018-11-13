export default class Model {
  constructor(paperScope, src, boundingbox, scaleFactor, center) {
    this.src = src
    this.boundingbox = boundingbox
    this.paper = paperScope
    this.angleHistory = []
    this.angle = 0
    this.paper.project.importSVG(this.src, function(item){
      item.fitBounds(this.boundingbox)
      item.scale(scaleFactor)
      this.model = item
      this.angleHistory.forEach((angle) => {
        this.rotate(angle)
      })
    }.bind(this))//.bind(this))
  }

  rotateInternal(absAngle){
    let relativeAngle = - (this.angle - absAngle)
    this.model.rotate(relativeAngle, this.center)
    // if (this.config.enableCrossLight){
    //   this.crosslight.rotate(relativeAngle, this.center)
    // }
    // this.indicator.rotate(relativeAngle, this.center)
		// this.currentAngleLabelPosition = this.currentAngleLabelPosition.rotate(relativeAngle, this.center)
    // this.currentAngleLabel.position = this.currentAngleLabelPosition
    // this.currentAngleLabel.content = absAngle
    // this.angle = absAngle
  }

  rotateSafe(absAngle){
    this.paper.activate()
    if (this.model == null){
      this.angleHistory.push(absAngle)
    }else{
      this.rotateInternal(absAngle)
    }
  }

  rotate(absAngle){
    this.rotateSafe(absAngle)
  }

}
