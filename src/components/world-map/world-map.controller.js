class WorldMapController {
  // @ngInject
  constructor($window) {
    this.$window = $window;
    this.colors = {
      republicans: '#ef5c5c',
      democrats: '#117db6',
      undecided: '#EEE'
    };

    this.initCountryLayer = this.initCountryLayer.bind(this);
    this.clickLayer = this.clickLayer.bind(this);
  }

  initMap() {


    const southWest = new L.LatLng(-40.44694705960048, -165.9375),
      northEast = new L.LatLng(76.67978490310692, 175.4296875),
      bounds = new L.LatLngBounds(southWest, northEast);

    this.leafletMap = L.map('world-map', {
      // zoom: 3,
      maxZoom: 3,
      minZoom: 1,
      maxBounds: bounds,
      zoomControl: false,
      dragging: false
    });

    this.leafletMap.on('click', function(e) {
      console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    });

    angular.element(window).on('resize', () => {
      this.leafletMap.fitBounds(bounds);
    });

    this.leafletMap.setView([44, -31], 3);

    console.log(this.leafletMap.getBounds());

    // this.leafletMap.fitWorld([[-190.0, -160.0], [-190.0, -180.0]]);
    this.leafletMap.fitBounds(bounds);
    this.addTopoData();
    // this.fitBounds();
  }

  addTopoData() {
    let topoLayer = new L.TopoJSON();
    topoLayer.addData(this.topoData);
    topoLayer.addTo(this.leafletMap);
    topoLayer.eachLayer(this.initCountryLayer);
  }

  fitBounds() {
    const southWest = new L.LatLng(0.7031073524364783, -9.140625),
      northEast = new L.LatLng(71.74643171904148, 62.57812500000001),
      bounds = new L.LatLngBounds(southWest, northEast);
    this.leafletMap.fitWorld(bounds);
  }

  initCountryLayer(layer) {
    const countryIso2 = layer.feature.id;
    const countryVote = this.votingResults.countries[countryIso2];

    let colorScale = chroma
      .scale([this.colors.republicans, this.colors.democrats])
      .domain([0,100]);

    let fillColor;
    if (countryVote) {

      if (countryVote.winner === 'T') {
        fillColor = colorScale(countryVote.percentage).hex();
      } else {
        fillColor = colorScale(100 - countryVote.percentage).hex();
      }

    } else {

      fillColor = this.colors.undecided;

    }

    layer.setStyle({
      fillColor: fillColor,
      fillOpacity: 1,
      color: '#555',
      weight: 1,
      opacity: .5
    });

    if (countryVote) {
      layer.on({
        mousedown: this.clickLayer,
        mouseover: this.enterLayer,
        mouseout: this.leaveLayer,
        touchend: this.enterLayer
      });
    }
  }

  clickLayer(l) {
    // console.log(l, this.feature.properties.name);
    // debugger;
    // this.leafletMap.fitBounds(l.target.getBounds());
  }

  enterLayer() {
    this.bringToFront();
    this.setStyle({
      weight: 2,
      opacity: 1
    });
  }

  leaveLayer() {
    this.bringToBack();
    this.setStyle({
      weight: 1,
      opacity: .5
    });
  }
}

export default WorldMapController;
