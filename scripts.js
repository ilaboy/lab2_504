function PopUp(){
  document.getElementById('box').style.display="none";
}

var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWpzbGFnZXIiLCJhIjoiZUMtVjV1ZyJ9.2uJjlUi0OttNighmI-8ZlQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
});

var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWpzbGFnZXIiLCJhIjoiZUMtVjV1ZyJ9.2uJjlUi0OttNighmI-8ZlQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
});

var map = L.map('map', {layers:[light]}).fitWorld();

function onLocationFound(e) {
    var radius = e.accuracy; //this defines a variable radius as the accuracy value returned by the locate method divided by 2. It is divided by 2 because the accuracy value is the sum of the estimated accuracy of the latitude plus the estimated accuracy of the longitude. The unit is meters.

    L.marker(e.latlng).addTo(map)  //this adds a marker at the lat and long returned by the locate function.

          L.circle(e.latlng, radius, {color: 'green'}).addTo(map);


    var times = SunCalc.getTimes(new Date(), e.latitude, e.longitude);
    var sunrise = times.sunrise.getHours();
    var sunset = times.sunset.getHours();


    var currentTime = new Date().getHours();
        if (sunrise < currentTime && currentTime < sunset){
          map.removeLayer(dark);
          map.addLayer(light);
        }
        else {
          map.removeLayer(light);
          map.addLayer(dark);
        }
}

map.on('locationfound', onLocationFound); //this is the event listener

    function onLocationError(e) {
      alert(e.message);
    }

    map.on('locationerror', onLocationError);
    map.locate({setView: true, maxZoom: 14});

    var baseMaps = {
      "Light": light,
      "Dark": dark
    };

    L.control.layers(baseMaps).addTo(map);

    var stateChangingButton = L.easyButton({
    states: [{
            stateName: 'Your Location',        // name the state
            icon:      '<img src="location-arrow-solid.svg" style="width:15.5px">',               // and define its properties
            title:     'Your Location',      // like its title
            onClick: function(btn, map) {       // and its callback
                map.locate({setView: true, maxZoom: 14});
                btn.state();    // change state on click!
            }
        }]
      });

      stateChangingButton.addTo(map);
/// I forgot how to remove my location whenever I tap on "your location" L.easyButton
var control = L.Routing.control({
          units:'imperial',
          collapsible: true,
          geocoder: L.Control.Geocoder.mapbox('pk.eyJ1IjoiaWRhbGlzbGFib3kiLCJhIjoiY2syd3BhaXFkMDM1MTNicnYzdnl5ZTU1aSJ9.sMf0JfpuixHluriTdYN5ww'),
          router: L.Routing.mapbox('pk.eyJ1IjoiaWRhbGlzbGFib3kiLCJhIjoiY2syd3BhaXFkMDM1MTNicnYzdnl5ZTU1aSJ9.sMf0JfpuixHluriTdYN5ww'),
          waypoints: [
            null
              //L.latLng(47.246587, -122.438830),
             //L.latLng(47.318017, -122.542970),
             //L.latLng(47.258024, -122.444725)
          ],
           routeWhileDragging: true,
           show: false /// from L.Routing.Itinerary it also inherits the show option (https://stackoverflow.com/questions/34077708/leaflet-routing-machine-usage-of-options)

      }).addTo(map);

function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

map.on('click', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);

L.DomEvent.on(startBtn, 'click', function() {
        control.spliceWaypoints(0, 1, e.latlng);
        map.closePopup();
    });

L.DomEvent.on(destBtn, 'click', function() {
    control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
    control.show();
    map.closePopup();
});

L.popup()
    .setContent(container)
    .setLatLng(e.latlng)
    .openOn(map);
 });
