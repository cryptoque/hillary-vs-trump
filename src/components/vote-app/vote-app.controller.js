class VoteAppController {
  // @ngInject
  constructor($state, deviceDetector) {
    this.$state = $state;
    this.deviceDetector = deviceDetector;

    // alert(deviceDetector.browser + ' ' + deviceDetector.browser_version + ' ' + parseInt(deviceDetector.browser_version,10) + ' ' + deviceDetector.device + ' ' + deviceDetector.os);

    this.isUnsupportedBrowser = deviceDetector.browser === 'ie'  && parseInt(deviceDetector.browser_version, 10) < 10 ||
                                deviceDetector.os === 'android' && deviceDetector.browser === 'safari' && parseInt(deviceDetector.browser_version, 10) <= 4 ||
                                deviceDetector.os === 'ios' && parseInt(deviceDetector.browser_version, 10) < 8;
  }
}

export default VoteAppController;
