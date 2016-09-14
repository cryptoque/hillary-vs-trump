import './assets/sass/index.scss';
import './module';
import './services/api';
import './services/translate';
import './components/ballot';

angular.bootstrap(angular.element('vote-app')[0], ['Vote']);
