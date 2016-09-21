class SceneHillaryDirective {
  constructor($rootScope, $timeout) {
    this.restrict = 'E';
    this.scope = {
      'openModalFn': '&'
    };
    this.template = require('./scene-hillary.view.html');
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
    this.blueBg = this.scene.find('.scene--hillary__blue-bg');
    this.tree = this.scene.find('.scene--hillary__tree');
    this.bush = this.scene.find('.scene--hillary__bush');
    this.fighterBlue = this.scene.find('.scene--hillary__fighter--blue');
    this.fighterBlueTrail = this.scene.find('.scene--hillary__trail--blue');
    this.fighterWhite = this.scene.find('.scene--hillary__fighter--white');
    this.fighterWhiteTrail = this.scene.find('.scene--hillary__trail--white');
    this.fighterRed = this.scene.find('.scene--hillary__fighter--red');
    this.fighterRedTrail = this.scene.find('.scene--hillary__trail--red');

    this.flagTween = new TimelineMax({ paused: true, repeat: -1, yoyo: true });
    this.flagTween
      .to(this.flag, 40, {
        rotation: '360',
        transformOrigin: '50% 50%',
        ease: Linear.easeNone
      });


    this.timeline = new TimelineMax({ paused: true, repeat: 0 });
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
      .to(this.hillary, .3, {
        backgroundPosition: '-1880px 0px',
        ease: SteppedEase.config(2)
      })
      .to(this.hillary, .6, {
        y: '200px',
        marginLeft: '-225px',
        scale: .8,
        force3D: false,
        ease: Power4.easeOut
      })
      .from(this.blueBg, .3, {
        opacity: 0,
        y: 100
      })
      .from(this.whitehouse, .3, {
        opacity: 0,
        x: 200
      })
      .from(this.flag, .4, {
        opacity: 0,
        onStart: () => { this.flagTween.play() }
      })
      .staggerFrom([this.tree, this.bush], .4, {
        opacity: 0,
        x: -100
      }, .5)
      .staggerFrom([
        [this.fighterBlue, this.fighterBlueTrail],
        [this.fighterWhite, this.fighterWhiteTrail],
        [this.fighterRed, this.fighterRedTrail]
      ], .3, {
        opacity: 0,
        scale: .7,
        x: 300,
        y: 300
      }, .1)
      .addPause('end', this.openDialog);

    this.bindUiEvents();
  }

  bindUiEvents() {
    this.scene.on('mouseenter mouseover touchstart', () => {
      if (!this.$rootScope.candidateChosen) {
        this.timeline.tweenTo('mouseover');
      }
    });

    this.scene.on('mouseout', () => {
      if (!this.$rootScope.candidateChosen) {
        this.timeline.reverse();
      }
    });

    this.button.on('click', () => {
      this.$rootScope.candidateChosen = true;
      this.timeline.tweenTo('end');
    });

    this.$rootScope.$on('close-modal', (event) => {
      this.timeline.reverse();
      this.flagTween.stop();
      this.$rootScope.candidateChosen = false;
    });
  }

  openDialog() {
    this.$timeout(() => {
      this.scope.openModalFn({p: 'D'});
    }, 500);
  }
}

// @ngInject
export default ($rootScope, $timeout) => new SceneHillaryDirective($rootScope, $timeout);