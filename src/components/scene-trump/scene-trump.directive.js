class SceneTrumpDirective {
  constructor($rootScope, $timeout) {
    this.restrict = 'E';
    this.template = require('./scene-trump.view.html');
    this.scope = {
      'openModalFn': '&'
    };
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;

    this.link = this.link.bind(this);
    this.openDialog = this.openDialog.bind(this);
  }

  link(scope, element, attrs) {
    this.scope = scope;
    this.scene = element;
    this.trump = this.scene.find('.scene--trump__trump');
    this.button = this.scene.find('.scene__button');

    this.flag = this.scene.find('.scene--trump__flag');
    this.redBg = this.scene.find('.scene--trump__red-bg');
    this.whitehouse = this.scene.find('.scene--trump__whitehouse');
    this.eagle = this.scene.find('.scene--trump__eagle');
    this.wall = this.scene.find('.scene--trump__wall > g');

    this.flagTween = new TimelineMax({ paused: true, repeat: -1, yoyo: true });
    this.flagTween
      .fromTo(this.flag, 40, {
        x: '-40%',
        y: '-40%',
        ease: Power1.easeOut
      }, {
        x: '-4%',
        y: '-4%',
        ease: Power1.easeOut
      });

    this.timeline = new TimelineMax({ paused: true, repeat: 0 });
    this.timeline
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
      .to(this.trump, .6, {
        y: '100px',
        marginLeft: '-425px',
        scale: .8,
        force3D: false,
        ease: Power4.easeOut
      })
      .from(this.redBg, .3, {
        opacity: 0,
        y: 100
      })
      .from(this.whitehouse, .3, {
        opacity: 0,
        x: -100
      })
      .from(this.flag, .4, {
        opacity: 0,
        onStart: () => { this.flagTween.play() }
      })
      .staggerFrom(this.wall, .3, {
        opacity: 0,
        x: -200
      }, .2)
      .staggerFrom(this.eagle, .4, {
        opacity: 0,
        scale: .7,
        x: -300,
        y: -300
      }, .3)
      .addPause('end', this.openDialog);

    this.bindUiEvents();

  }

  bindUiEvents() {
    this.scene.on('mouseenter mouseover touchstart', () => {
      if (!this.scope.candidateChosen) {
        this.timeline.tweenTo('mouseover');
      }
    });

    this.scene.on('mouseout', () => {
      if (!this.scope.candidateChosen) {
        this.timeline.reverse();
      }
    });

    this.button.on('click', () => {
      if (!this.scope.candidateChosen) {
        this.$rootScope.$emit('candidateChosen', 'R');
        this.timeline.tweenTo('end');
      }
    });

    this.$rootScope.$on('close-modal', (event) => {
      this.timeline.reverse();
      this.$timeout(() => {
        this.flagTween.stop();
        this.$rootScope.$emit('candidateChosen', false);
      }, 2000);
    });

    this.$rootScope.$on('candidateChosen', (event, data) => {
      // console.log('T', data);
      this.scope.candidateChosen = data;
      if (data === 'D') {
        this.timeline.reverse();
      }
    });

    this.scope.$on('$destroy', () => {
      this.timeline.kill();
    });
  }

  openDialog() {
    // if (this.timeline.isActive()) {
      this.$timeout(() => {
        this.scope.openModalFn({p: 'R'});
      }, 500);
    // }
  }
}

// @ngInject
export default ($rootScope, $timeout) => new SceneTrumpDirective($rootScope, $timeout);
