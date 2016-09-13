import './assets/sass/index.scss';
import './module';
import './services/vote';
import './services/translate';
import './components/ballot';

angular.bootstrap(angular.element('vote-app')[0], ['Vote']);
