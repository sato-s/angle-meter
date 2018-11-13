import paper from 'paper/dist/paper-core'
import Model from './Model'

const defaultOptions = {
  src: null,
  strokeColor: 'black',
  fillColor: 'white',
  bindTo: 'anglemeter',
  radius: 70,
  half: false,
  enableCrossLight: false,
}


export class AngleMeter {
  constructor(inputOptions) {
    const options = {}
    Object.assign(options, defaultOptions, inputOptions)
    // Create instance specific paper scope to take care of multiple canvases
    this.paper = new paper.PaperScope();
    this.angle = 0
    this.angleHistory = []

    this.config = {
      radius: options.radius,
      half: options.half,
      enableCrossLight: options.enableCrossLight,
      baseCirclePadding: options.radius / 2,
      strokeColor: options.strokeColor,
      bindTo: options.bindTo,
      fillColor: options.fillColor,
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
      indicator: {
        color: 'blue',
        radius: options.radius / 6
      },
      angleLabel: {
        opacity: 0.8,
        color: 'black',
        fontSize: (options.radius / 6),
      },
      histgram: {
        factor: 0.94,
        width: 2,
        opacity: 0.4,
      },
      models: options.models,
    }

    this.center= new this.paper.Point(
      options.radius + this.config.baseCirclePadding,
      options.radius + this.config.baseCirclePadding
    )
  }

  draw(){
    var canvas = document.getElementById(this.config.bindTo);
    this.paper.setup(canvas);
    this.drawBaseCircle()
    this.drawScale()
    // Model
    this.models = {}
    this.config.models.forEach((config) => {
      let m = new Model( this.paper, config.src, this.center, this.config.radius, config.color)
      this.models[config.id] = m
    })
    this.paper.view.draw();
  }

  rotate(id, angle){
    let target = this.models[id]
    if (target == null){
      throw new Error(`Couldn't find model with id=${id}`)
    }
    target.rotate(angle)
  }

  drawHistgrams(id, angles){
    let target = this.models[id]
    if (target == null){
      throw new Error(`Couldn't find model with id=${id}`)
    }
    angles.forEach((angle) => {
      this.drawHistgram(angle, target.color)
    })
  }

  drawBaseCircle(){
    this.circle = new this.paper.Path.Circle({
      center: this.center,
      radius: this.config.radius,
    });
    if (this.config.half){
      // If this is `half` draw arc instead of circle
      let start = new paper.Point(this.center.x - this.config.radius, this.center.y)
      let through = new paper.Point(this.center.x, this.center.y - this.config.radius)
      let end = new paper.Point(this.center.x + this.config.radius, this.center.y)
      let arc = new paper.Path.Arc(start, through, end)
      arc.strokeColor = this.config.strokeColor;
      arc.fillColor = this.config.fillColor;
    }
    else{
      this.circle.strokeColor = this.config.strokeColor;
      this.circle.fillColor = this.config.fillColor;
    }
  }

  drawScale(){
    let startAngle = this.config.half ? -90 : -180
    let endAngle = this.config.half ? 90 : 180
    for (var angle = startAngle; angle <= endAngle; angle = angle + this.config.scale.sub.interval) {
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

  drawHistgram(angle, color){
    this.drawRadiusLine(
      angle,
      this.config.histgram.width,
      color,
      this.config.histgram.factor,
      this.config.histgram.opacity
    )
  }

  drawRadiusLine(angle, width, color, factor, opacity=1){
    let start = new this.paper.Point(this.center.x, this.center.y - this.config.radius)
    let _end  = this.center
    var vector = start.subtract(_end)
    vector = vector.multiply(factor)
    let end = _end.add(vector)
    let path = new this.paper.Path.Line(start, end)
    path.strokeColor = color
    path.strokeWidth = width
    path.opacity = opacity
    path.rotate(angle, this.center)
  }

}
