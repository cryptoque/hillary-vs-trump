class SceneTrumpDirective {
  constructor($window, $rootScope, $timeout) {
    this.restrict = 'E';
    this.template = require('./scene-trump.view.html');
    this.scope = {
      'openModalFn': '&'
    };
    this.$window = $window;
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
    this.redBg = this.scene.find('.scene--trump__red-bg, .scene--trump__bg-filler');
    this.whitehouse = this.scene.find('.scene--trump__whitehouse');
    this.eagle = this.scene.find('.scene--trump__eagle');
    this.wall = this.scene.find('.scene--trump__wall > g');

    this.timelineFlag = new TimelineMax({ paused: true, repeat: -1, yoyo: true });
    this.timelineFlag
      .fromTo(this.flag, 40, {
        x: '-40%',
        y: '-40%',
        ease: Power1.easeOut
      }, {
        x: '-4%',
        y: '-4%',
        ease: Power1.easeOut
      });

    this.timelineEagle = new TimelineMax({ paused: true, repeat: -1, yoyo: false });
    this.timelineEagle
      .to(this.eagle, 5, {
        bezier:[{x:25, y:25}, {x:0, y:50}, {x:-25, y:25}, {x:0, y:0}],
        ease: RoughEase.ease.config({ template: Power0.easeNone, strength: 1, points: 1, taper: 'none', randomize: true, clamp: true})
      });

    this.timelineButton = new TimelineMax({ paused: true, repeat: 0 });
    this.timelineButton
      .to(this.button, .2, {
        y: -100,
        opacity: 1,
        ease: Back.easeOut
      }, .3)
      .addLabel('mouseover')
      .to(this.button, .4, {
        y: 150,
        opacity: 0,
        ease: Back.easeIn
      }, .5);

    this.timelineFull = new TimelineMax({ paused: true, repeat: 0 });
    this.timelineFull
      .to(this.trump, .2, {
        backgroundPosition: '-2688px 0px',
        ease: SteppedEase.config(3)
      })
      .addLabel('mouseover')
      .to(this.trump, .2, {
        backgroundPosition: '-4480px 0px',
        ease: SteppedEase.config(2),
        onStart: () => { this.openDialog(); }
      })
      .to(this.trump, 1, {
        y: 40,
        marginLeft: '-425px',
        scale: .8,
        force3D: false,
        ease: Power4.easeOut
      })

      // Whitehouse + BG
      .from(this.whitehouse, 1, {
        scale: 4,
        opacity: 0,
        transformOrigin: 'center center',
        ease: Power4.easeOut
      }, '-=1')
      .from(this.redBg, .6, {
        opacity: 0,
        ease: Power4.easeOut
      }, '-=.6')

      // Flag
      .from(this.flag, .4, {
        opacity: 0,
        onStart: () => { this.timelineFlag.play(); }
      })

      // Wall
      .staggerFrom(this.wall, .3, {
        opacity: 0,
        y: -200
      }, .2)

      // Eagle
      .from(this.eagle, 1, {
        opacity: 0,
        scale: .5,
        x: -500,
        y: -200,
        ease: Power1.easeOut,
        onComplete: () => { this.timelineEagle.restart().play(); }
      }, '-=1.2')
      .addPause('end');

    this.bindUiEvents();

  }

  bindUiEvents() {
    this.scene.on('mouseenter mouseover touchstart', () => {
      if (!this.scope.candidateChosen) {
        this.timelineFull.timeScale(1).tweenTo('mouseover');
        this.timelineButton.tweenTo('mouseover');
      }
    });

    this.scene.on('mouseout', () => {
      if (!this.scope.candidateChosen) {
        this.timelineFull.reverse();
        this.timelineButton.reverse();
      }
    });

    this.button.on('click touchend', () => {
      if (!this.scope.candidateChosen) {
        this.timelineButton.reverse();
        this.timelineFull.timeScale(1).tweenTo('end');
        this.$rootScope.$emit('candidateChosen', 'R');
        this.$window.ga('send', 'event', 'candidate', 'Trump');
      }
    });

    this.$rootScope.$on('close-modal', (event) => {
      this.$timeout(() => {
        this.timelineFull.timeScale(2).reverse();
      }, 500);
      this.$timeout(() => {
        this.timelineFlag.stop();
        this.$rootScope.$emit('candidateChosen', false);
      }, 2500);
    });


    this.$rootScope.$on('candidateChosen', (event, data) => {
      this.scope.candidateChosen = data;
      if (data === 'D') {
        this.timelineFull.timeScale(2).reverse();
        this.timelineButton.reverse();
      }
    });

    this.scope.$on('$destroy', () => {
      this.timelineFull.kill();
      this.timelineFlag.kill();
      this.timelineButton.kill();
    });
  }

  openDialog() {
    this.$timeout(() => {
      this.scope.openModalFn({p: 'R'});
    }, 500);
  }
}

// @ngInject
export default ($window, $rootScope, $timeout) => new SceneTrumpDirective($window, $rootScope, $timeout);
