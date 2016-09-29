class PieDirective {
  constructor() {
    this.restrict = 'E';
    this.scope = {
      'percentages': '=',
      'colors': '='
    };
    this.template = '<canvas id="pie" width="190" height="190" />';
    this.link = this.link.bind(this);
  }

  link(scope, element, attrs) {
    var canvas = document.getElementById('pie');
    var ctx = canvas.getContext('2d');
    let data = scope.percentages;
    let colors = scope.colors;
    let center = [canvas.width / 2, canvas.height / 2];
    let radius = Math.min(canvas.width, canvas.height) / 2;

    let lastPosition = -0.25, total = 0;
    for(let i in data) { total += data[i]; }

    for(let i = 0; i < data.length; i++) {
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.moveTo(center[0], center[1]);
      ctx.arc(center[0], center[1], radius, lastPosition, lastPosition+(Math.PI*2*(data[i]/total)), false);
      ctx.lineTo(center[0], center[1]);
      ctx.fill();
      lastPosition += Math.PI*2*(data[i]/total);
    }
  }
}

// @ngInject
export default () => {
  return new PieDirective();
};
