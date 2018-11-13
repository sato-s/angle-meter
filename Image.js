export default class Image {
  constructor(paperScope, src, boundingbox, scaleFactor, center, color) {
    this.src = src
    this.center = center
    this.boundingbox = boundingbox
    this.paper = paperScope
    this.angleHistory = []
    this.angle = 0
    this.color = color
    this.paper.project.importSVG(this.src, function(item){
      item.fitBounds(this.boundingbox)
      item.scale(scaleFactor)
      this.image = item
      this.image.fillColor = this.color
      this.angleHistory.forEach((angle) => {
        this.rotate(angle)
      })
    }.bind(this))
  }

  rotateInternal(angle){
    this.image.rotate(angle, this.center)
  }

  rotateSafe(angle){
    this.paper.activate()
    if (this.image == null){
      this.angleHistory.push(angle)
    }else{
      this.rotateInternal(angle)
    }
  }

  rotate(angle){
    this.rotateSafe(angle)
  }

}
