class SceneHillaryDirective {
  constructor() {
    this.restrict = 'E';
    this.template = require('./scene-hillary.view.html');
    this.link = this.link.bind(this);
  }

  link(scope, element, attrs) {
    this.scope = scope;
    this.scene = element;
    this.hillary = this.scene.find('.scene--hillary__hillary');
    this.button = this.scene.find('.scene__button');

    this.timeline = new TimelineMax({ paused: true, yoyo: false, repeat: 0 });

    this.timeline
      .to(this.hillary, .2, {
        backgroundPosition: '-1128px 0px',
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
      .to(this.hillary, .2, {
        backgroundPosition: '-1880px 0px',
        ease: SteppedEase.config(2)
      })
      .to(this.hillary, 2, {
        top: '200px',
        marginLeft: '-225px',
        scale: 1,
        force3D: false,
        ease: Power4.easeOut
      })

      .addPause('end');

    // this.timeline.tweenFromTo('mouseover', 'end');
    // this.bindUiEvents();

    this.scene.on('click', () => {
      this.timeline.tweenFromTo('mouseover', 'end');

    });
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


    //$ctrl.openModal('D')
  }
}

// @ngInject
export default () => new SceneHillaryDirective();
