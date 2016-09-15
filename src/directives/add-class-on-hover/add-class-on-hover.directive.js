class AddClassOnHover {
  constructor($timeout) {
    this.restrict = 'A';
    this.scope = {
      'wrapClass': '@addClassOnHover'
    };
    this.link = this.link.bind(this);
    this.$timeout = $timeout;
  }

  link(scope, element, attrs) {
    const parent = element.parent();

    element.on('mouseover', () => {
      parent.addClass(scope.wrapClass);
    });

    element.on('mouseout', () => {
      parent.removeClass(scope.wrapClass);
    });
  }

}

// @ngInject
export default ($timeout) => {
  return new AddClassOnHover($timeout);
};
