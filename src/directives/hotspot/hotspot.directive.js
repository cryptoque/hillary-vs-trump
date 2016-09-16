class HotspotDirective {
  constructor($timeout) {
    this.restrict = 'A';
    this.scope = {
      'wrapClass': '@hotspot',
      'parent': '@hotspotParent'
    };
    this.link = this.link.bind(this);
    this.$timeout = $timeout;
  }

  link(scope, element, attrs) {
    const parent = angular.element('.' + scope.parent);
    let debounce;

    element.on('mouseover mouseenter', () => {
      angular.element('.' + scope.wrapClass).removeClass(scope.wrapClass);
      parent.addClass(scope.wrapClass);
    });

    element.on('mouseleave', () => {
      if (debounce) {
        this.$timeout.cancel(debounce);
      }
      debounce = this.$timeout(() => {
        parent.removeClass(scope.wrapClass);
      }, 200);
    });
  }

}

// @ngInject
export default ($timeout) => {
  return new HotspotDirective($timeout);
};
