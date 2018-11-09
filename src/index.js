import paper from 'paper/dist/paper-core'

const defaultOptions = {
  src: null,
  strokeColor: 'black'
}

export class AngleMeter {
  constructor(inputOptions) {
    const options = Object.assign(defaultOptions, inputOptions)
    this.angle = 0
    this.radius =  70
    this.center= new paper.Point(this.radius, this.radius)
    this.strokeColor = options.strokeColor
    this.fillColor = 'white'
    this.scale = {
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
      }
    }
    this.histgram = {
      color: 'blue',
      factor: 0.94,
      width: 2,
    }
    this.model = {
      id: 'model',
      src: options.src,
      scaleFactor: 0.6,
    }
    this.config = {
      crosslight: {
        color: 'grey',
        padding: 10,
        width: 2,
      }
    }
  }

  getModelBoundingBox(){
    let vector = new paper.Point(this.radius, this.radius)
    let topLeft = this.center.subtract(vector)
    let box = new paper.Rectangle(topLeft, this.radius * 2)
    return box
  }

  draw(){
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);
    this.circle = new paper.Path.Circle({
      center: this.center,
      radius: this.radius,
    });
    this.circle.strokeColor = this.strokeColor;
    this.circle.fillColor = this.fillColor;
    this.drawScale()
    this.drawModel()
    this.drawCrossLight()
    paper.view.draw();
  }

  rotate(absAngle){
    let relativeAngle = - (this.angle - absAngle)
    this._model.rotate(relativeAngle, this.center)
    this.crosslight.rotate(relativeAngle, this.center)
    this.angle = absAngle
  }

  rotateWithHistgram(absAngle){
    this.rotate(absAngle)
    this.drawHistgram(absAngle)
  }

  drawModel(){
    paper.project.importSVG(this.model.src, function(item){
      item.data.id = 'model'
      item.fitBounds(this.getModelBoundingBox())
      item.scale(this.model.scaleFactor)
      this._model = item
    }.bind(this))
  }

  drawCrossLight(){
    let halfLength = this.radius - this.config.crosslight.padding
    var start = new paper.Point(this.center.x, this.center.y - halfLength)
    var end = new paper.Point(this.center.x, this.center.y + halfLength)
    let path1 = new paper.Path.Line(start, end)
    path1.strokeColor = this.config.crosslight.color
    path1.strokeWidth = this.config.crosslight.width
    path1.dashArray = [2, 2]

    var start = new paper.Point(this.center.x - halfLength, this.center.y)
    var end = new paper.Point(this.center.x + halfLength, this.center.y)
    let path2 = new paper.Path.Line(start, end)
    path2.strokeColor = this.config.crosslight.color
    path2.strokeWidth = this.config.crosslight.width
    path2.dashArray = [2, 2]

    this.crosslight = new paper.Group([path1, path2])
  }

  getModel(){
    return paper.project.getItem({
      match: function(item){ return (item.data.id == 'model') }
    })
  }

  drawScale(){
    for (var angle=0; angle< 360; angle = angle + this.scale.sub.interval) {
      if (angle % this.scale.primary.interval == 0){
        this.drawRadiusLine(angle, this.scale.primary.width, this.scale.primary.color, this.scale.primary.factor)
        // this.drawLabel(this.getBoundaryPointAtAgnle(angle), `${angle}`)
      }else{
        this.drawRadiusLine(angle, this.scale.sub.width, this.scale.sub.color, this.scale.sub.factor)
      }
    }
  }

  drawLabel(point, text){
    let pointText = new paper.PointText(point)
    pointText.justification = 'center';
    pointText.content = text
  }

  drawHistgram(angle){
    this.drawRadiusLine(angle, this.histgram.width, this.histgram.color, this.histgram.factor)
  }

  drawRadiusLine(angle, width, color, factor){
    let start = new paper.Point(this.center.x, this.center.y - this.radius)
    let _end  = this.center
    var vector = start.subtract(_end)
    vector = vector.multiply(factor)
    let end = _end.add(vector)
    let path = new paper.Path.Line(start, end)
    path.strokeColor = color
    path.strokeWidth = width
    path.rotate(angle, this.center)
  }

  getBoundaryPointAtAgnle(angle){
    var point = new paper.Point(this.center.x, this.center.y - this.radius)
    return point.rotate(angle, this.center)
  }
}
