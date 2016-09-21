class SceneTrumpDirective {
  constructor() {
    this.restrict = 'E';
    this.template = require('./scene-trump.view.html');
    this.link = this.link.bind(this);
  }

  link(scope, element, attrs) {
    this.scope = scope;
    this.scene = element;
    this.trump = this.scene.find('.scene__trump');
    this.button = this.scene.find('.scene__button');

    this.timeline = new TimelineMax({ paused: true });

    this.timeline
      .addLabel('start')
      .to(this.trump, .2, {
        backgroundPosition: '-2688px 0px',
        ease: SteppedEase.config(3)
      })
      .to(this.button, .2, {
        y: -100,
        opacity: 1,
        ease: Back.easeOut
      })
      .addPause('mouseover')

      .to(this.button, .2, {
        y: 150,
        opacity: 0,
        ease: Back.easeIn
      }, .5)
      .to(this.trump, .2, {
        backgroundPosition: '-4480px 0px',
        ease: SteppedEase.config(2)
      })
      .addPause('end');

    this.bindUiEvents();
  }

  bindUiEvents() {

    this.scene.on('mouseenter mouseover touchstart', () => {
      if (!this.scope.buttonClicked) {
        this.timeline.tweenTo('mouseover');
      }
    });

    this.scene.on('mouseout', () => {
      if (!this.scope.buttonClicked) {
        this.timeline.reverse();
      }
    });

    this.button.on('click', () => {
      this.scope.buttonClicked = true;
      this.timeline.tweenTo('end');
    });

    //$ctrl.openModal('R')
  }
}

// @ngInject
export default () => new SceneTrumpDirective();
