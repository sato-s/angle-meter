import paper from 'paper/dist/paper-core'

const defaultOptions = {
  src: null,
  strokeColor: 'black',
  fillColor: 'white',
  bindTo: 'anglemeter',
  radius: 70,
}

export class AngleMeter {
  constructor(inputOptions) {
    const options = Object.assign(defaultOptions, inputOptions)
    // Create instance specific paper scope to take care of multiple canvases
    this.paper = new paper.PaperScope();
    this.angle = 0
    this.angleHistory = []
    this.radius =  options.radius
    this.center= new this.paper.Point(this.radius, this.radius)
    this.strokeColor = options.strokeColor
    this.bindTo = options.bindTo
    this.fillColor = options.fillColor
    this.config = {
      scale: {
        sub : {
          interval: 5,
          factor: 0.93,
          color: 'black',
          width: 1,
        },
        primary: {
          interval: 45,
          factor: 0.9,
          color: 'black',
          width: 1.5,
        },
      },
      crosslight: {
        color: 'grey',
        padding: 10,
        width: 2,
      },
      histgram: {
        color: 'blue',
        factor: 0.94,
        width: 2,
      },
      model: {
        id: 'model',
        src: options.src,
        scaleFactor: 0.6,
      },
    }
  }

  draw(){
    var canvas = document.getElementById(this.bindTo);
    this.paper.setup(canvas);
    this.circle = new this.paper.Path.Circle({
      center: this.center,
      radius: this.radius,
    });
    this.circle.strokeColor = this.strokeColor;
    this.circle.fillColor = this.fillColor;
    this.drawScale()
    this.drawModel()
    this.drawCrossLight()
    this.paper.view.draw();
  }

  rotateInternal(absAngle){
    let relativeAngle = - (this.angle - absAngle)
    this.model.rotate(relativeAngle, this.center)
    this.crosslight.rotate(relativeAngle, this.center)
    this.angle = absAngle
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

  rotateWithHistgram(absAngle){
    this.rotateSafe(absAngle)
    this.drawHistgram(absAngle)
  }

  drawModel(){
    this.paper.project.importSVG(this.config.model.src, function(item){
      item.data.id = 'model'
      item.fitBounds(this.getModelBoundingBox())
      item.scale(this.config.model.scaleFactor)
      this.model = item
      this.angleHistory.forEach((angle) => {
        this.rotate(angle)
      })
    }.bind(this))
  }

  drawCrossLight(){
    let halfLength = this.radius - this.config.crosslight.padding
    var start = new this.paper.Point(this.center.x, this.center.y - halfLength)
    var end = new this.paper.Point(this.center.x, this.center.y + halfLength)
    let path1 = new this.paper.Path.Line(start, end)
    path1.strokeColor = this.config.crosslight.color
    path1.strokeWidth = this.config.crosslight.width
    path1.dashArray = [2, 2]

    var start = new this.paper.Point(this.center.x - halfLength, this.center.y)
    var end = new this.paper.Point(this.center.x + halfLength, this.center.y)
    let path2 = new this.paper.Path.Line(start, end)
    path2.strokeColor = this.config.crosslight.color
    path2.strokeWidth = this.config.crosslight.width
    path2.dashArray = [2, 2]

    this.crosslight = new this.paper.Group([path1, path2])
  }

  drawScale(){
    for (var angle=0; angle< 360; angle = angle + this.config.scale.sub.interval) {
      if (angle % this.config.scale.primary.interval == 0){
        this.drawRadiusLine(
          angle,
          this.config.scale.primary.width,
          this.config.scale.primary.color,
          this.config.scale.primary.factor
        )
      }else{
        this.drawRadiusLine(
          angle,
          this.config.scale.sub.width,
          this.config.scale.sub.color,
          this.config.scale.sub.factor
        )
      }
    }
  }

  drawLabel(point, text){
    let pointText = new this.paper.PointText(point)
    pointText.justification = 'center';
    pointText.content = text
  }

  drawHistgram(angle){
    this.drawRadiusLine(
      angle,
      this.config.histgram.width,
      this.config.histgram.color,
      this.config.histgram.factor
    )
  }

  drawRadiusLine(angle, width, color, factor){
    let start = new this.paper.Point(this.center.x, this.center.y - this.radius)
    let _end  = this.center
    var vector = start.subtract(_end)
    vector = vector.multiply(factor)
    let end = _end.add(vector)
    let path = new this.paper.Path.Line(start, end)
    path.strokeColor = color
    path.strokeWidth = width
    path.rotate(angle, this.center)
  }

  getBoundaryPointAtAgnle(angle){
    var point = new this.paper.Point(this.center.x, this.center.y - this.radius)
    return point.rotate(angle, this.center)
  }

  getModelBoundingBox(){
    let vector = new this.paper.Point(this.radius, this.radius)
    let topLeft = this.center.subtract(vector)
    let box = new this.paper.Rectangle(topLeft, this.radius * 2)
    return box
  }

}
