class SceneHillaryDirective {
  constructor($window, $rootScope, $timeout) {
    this.restrict = 'E';
    this.scope = {
      'openModalFn': '&'
    };
    this.template = require('./scene-hillary.view.html');
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;

    this.link = this.link.bind(this);
    this.openDialog = this.openDialog.bind(this);
  }

  link(scope, element, attrs) {
    this.scope = scope;
    this.scene = element;
    this.hillary = this.scene.find('.scene--hillary__hillary');
    this.button = this.scene.find('.scene__button');

    this.flag = this.scene.find('.scene--hillary__flag');
    this.whitehouse = this.scene.find('.scene--hillary__whitehouse');
    this.blueBg = this.scene.find('.scene--hillary__blue-bg, .scene--hillary__bg-filler');
    this.tree = this.scene.find('.scene--hillary__tree');
    this.bush = this.scene.find('.scene--hillary__bush');
    this.fighterBlue = this.scene.find('.scene--hillary__fighter--blue');
    this.fighterBlueTrail = this.scene.find('.scene--hillary__trail--blue');
    this.fighterWhite = this.scene.find('.scene--hillary__fighter--white');
    this.fighterWhiteTrail = this.scene.find('.scene--hillary__trail--white');
    this.fighterRed = this.scene.find('.scene--hillary__fighter--red');
    this.fighterRedTrail = this.scene.find('.scene--hillary__trail--red');

    this.timelineFlag = new TimelineMax({ paused: true, repeat: -1 });
    this.timelineFlag
      .to(this.flag, 40, {
        rotation: '360',
        transformOrigin: '50% 50%',
        ease: Linear.easeNone
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
      .to(this.hillary, .2, {
        backgroundPosition: '-1128px 0px',
        ease: SteppedEase.config(3)
      })
      .addLabel('mouseover')
      .to(this.hillary, .3, {
        backgroundPosition: '-1880px 0px',
        ease: SteppedEase.config(2),
        onStart: () => { this.openDialog(); }
      })
      .to(this.hillary, 1, {
        y: 80,
        x: 80,
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
      .from(this.blueBg, .2, {
        opacity: 0,
        ease: Power4.easeOut
      }, '-=.8')

      // Flag
      .from(this.flag, .8, {
        opacity: 0,
        onStart: () => { this.timelineFlag.play(); }
      })

      // Tree + Bush
      .staggerFrom([this.tree, this.bush], .4, {
        opacity: 0,
        x: -100,
        ease: Back.easeOut.config(1.7)
      }, .5, '-=.5')

      // Fighters
      .from(this.fighterBlue, 1, {
        opacity: 0,
        scale: .7,
        x: 435,
        y: 216,
        ease: Expo.easeOut
      })
      .from(this.fighterWhite, 1.4, {
        opacity: 0,
        scale: .7,
        x: 457,
        y: 390,
        ease: Expo.easeOut
      }, '-=.7')
      .from(this.fighterRed, 1, {
        opacity: 0,
        scale: .7,
        x: 310,
        y: 356,
        ease: Expo.easeOut
      }, '-=.6')
      .from(this.fighterBlueTrail, 1, {
        opacity: 0
      }, '-=1.9')
      .from(this.fighterWhiteTrail, 1, {
        opacity: 0
      }, '-=1.5')
      .from(this.fighterRedTrail, 1, {
        opacity: 0
      }, '-=.8')
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
        this.timelineFull.timeScale(1).tweenTo('end');
        this.timelineButton.reverse();
        this.$rootScope.$emit('candidateChosen', 'D');
        this.$window.ga('send', 'event', 'candidate', 'Hillary');
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
      if (data === 'R') {
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
      this.scope.openModalFn({p: 'D'});
    }, 500);
  }
}

// @ngInject
export default ($window, $rootScope, $timeout) => new SceneHillaryDirective($window, $rootScope, $timeout);
