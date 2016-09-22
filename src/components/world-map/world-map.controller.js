class WorldMapController {
  // @ngInject
  constructor($window, $document, $timeout) {
    this.$window = $window;
    this.$document = $document;
    this.$timeout = $timeout;

    this.initCountryLayer = this.initCountryLayer.bind(this);
    this.clickLayer = this.clickLayer.bind(this);
    this.enterLayer = this.enterLayer.bind(this);
    this.leaveLayer = this.leaveLayer.bind(this);

    this.colors = {
      republicans: '#ef5c5c',
      democrats: '#117db6',
      undecided: '#dadada',
      split: '#B26CC1'
    };

    this.totalVoteCount = this.votingResults.total.D + this.votingResults.total.R;
    if (this.totalVoteCount < 1000) {
      this.totalVoteCount = '<1000';
    }
  }

  initMap() {
    const southWest = new L.LatLng(-46.08085173686785, -151.171875),
      northEast = new L.LatLng(80.64524912417113, 187.03125),
      bounds = new L.LatLngBounds(southWest, northEast);

    this.leafletMap = L.map('world-map-leaflet', {
      maxZoom: 3,
      minZoom: 1,
      maxBounds: bounds,
      zoomControl: false,
      dragging: false
    });

    // this.leafletMap.on('click', function(e) {
    //   console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
    // });

    angular.element(window).on('resize', () => {
      this.leafletMap.fitBounds(bounds);
    });

    this.addTopoData();

    this.$timeout(() => {
      this.leafletMap.setView([44, -31], 2);
      this.leafletMap.fitBounds(bounds);
    }, 100);
  }

  addTopoData() {
    let topoLayer = new L.TopoJSON();
    topoLayer.addData(this.topoData);
    topoLayer.addTo(this.leafletMap);
    topoLayer.eachLayer(this.initCountryLayer);
  }

  initCountryLayer(layer) {
    const countryIso2 = layer.feature.id;
    const countryVote = this.votingResults.countries[countryIso2];

    let fillColor;
    if (countryVote) {

      if (countryVote.winner === 'R') {
        fillColor = this.colors.republicans;
      } else if (countryVote.winner === 'D') {
        fillColor = this.colors.democrats;
      } else {

        fillColor = this.colors.split;

      }

    } else {

      fillColor = this.colors.undecided;

    }

    layer.setStyle({
      fillColor: fillColor,
      fillOpacity: 1,
      color: '#ececec',
      weight: 1,
      opacity: .5
    });

    if (countryVote) {
      layer.on({
        click: this.clickLayer,
        mousedown: this.clickLayer,
        mouseover: this.enterLayer,
        mouseout: this.leaveLayer,
        touchstart: this.enterLayer,
        touchend: this.enterLayer,
      });
    }
  }

  clickLayer(l) {
    const id = l.target.feature.id;
    const el = angular.element('body').find('#country-' + id);
    this.$document.scrollToElement(el, 300, 2000);
    angular.element('body').find('.country-results--highlight').removeClass('country-results--highlight');
    el.addClass('country-results--highlight');
  }

  enterLayer(l) {
    l.target.bringToFront();
    l.target.setStyle({
      weight: 2,
      opacity: 1
    });
  }

  leaveLayer(l) {
    l.target.bringToBack();
    l.target.setStyle({
      weight: 1,
      opacity: .5
    });
  }
}

export default WorldMapController;
