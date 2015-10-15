var map;

// marker initialization
var start_marker;
var lat_arr = document.getElementsByClassName("places-lat");
var lon_arr = document.getElementsByClassName("places-lon");
var nameOfLoc_arr = document.getElementsByClassName("places-name");
var info_arr = [];
var markers_arr = [];

function displayMap(position) {
  // location distance initialization
  var origin = {lat: position.coords.latitude, lng: position.coords.longitude};
  var destinations = [];
  var  originIcon = "https://chart.googleapis.com/chart?" +
      "chst=d_map_pin_letter&chld=D|FF0000|000000";
  var destinationIcon = "https://chart.googleapis.com/chart?" +
      "chst=d_map_pin_letter&chld=O|FFFF00|000000";

  // nearest location click trigger
  $("#nearest-loc-btn").click(function() {
    $("#distance-info").show();
    for (var i = 0; i < info_arr.length; i++) {
      var loc = {lat: parseFloat(info_arr[i][0]), lng: parseFloat(info_arr[i][1])};
      destinations.push(loc);
    }
    var markersArray = [];
    var bounds = new google.maps.LatLngBounds;
    var geocoder = new google.maps.Geocoder;
    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [origin],
      destinations: destinations,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function(response, status) {
      if (status !== google.maps.DistanceMatrixStatus.OK) {
        alert('Error was: ' + status);
      } else {
        var originList = response.originAddresses;
        var destinationList = response.destinationAddresses;
        var outputDiv = document.getElementById('distance-info');
        outputDiv.innerHTML = '';
        deleteMarkers(markersArray);

        var showGeocodedAddressOnMap = function(asDestination) {
          var icon = asDestination ? destinationIcon : originIcon;
          return function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              map.fitBounds(bounds.extend(results[0].geometry.location));
              markersArray.push(new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: icon
              }));
            } else {
              alert('Geocode was not successful due to: ' + status);
            }
          };
        };
        var nearest_loc;
        var nearest_address;
        for (var i = 0; i < originList.length; i++) {
          var results = response.rows[i].elements;
          var nearest_loc_dist = results[0].distance.value;
          for (var k = 0; k < results.length; k++) {
            if (nearest_loc_dist > results[k].distance.value) {
              nearest_loc_dist = results[k].distance.value
              nearest_loc = results[k];
              nearest_address = destinationList[k];
            }
          }
          geocoder.geocode({'address': originList[i]},
              showGeocodedAddressOnMap(false));
            geocoder.geocode({'address': nearest_address},
                showGeocodedAddressOnMap(true));
            outputDiv.innerHTML += originList[i] + ' to ' + nearest_address +
                ': ' + nearest_loc.distance.text + ' in ' +
                nearest_loc.duration.text + '<br>';
        }
      }
    });
    function deleteMarkers(markersArray) {
      for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
      }
      markersArray = [];
    }
  })

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: position.coords.latitude, lng: position.coords.longitude},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  start_marker = new google.maps.Marker({
    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    animation: google.maps.Animation.DROP,
    title: "you are here"
  });
  for (var i = 0; i < lon_arr.length; i++) {
    var inner_arr = [];
    inner_arr.push($(lat_arr[i]).val());
    inner_arr.push($(lon_arr[i]).val());
    inner_arr.push($(nameOfLoc_arr[i]).val());
    info_arr.push(inner_arr);
  }
  for (var j = 0; j < info_arr.length; j++) {
    var loc_marker = new google.maps.Marker({
      position: new google.maps.LatLng(parseFloat(info_arr[j][0]), parseFloat(info_arr[j][1])),
      animation: google.maps.Animation.DROP,
      title: info_arr[j][2]
    });
    markers_arr.push(loc_marker);
  }

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  start_marker.setMap(map);
  for (var k = 0; k < markers_arr.length; k++) {
    markers_arr[k].setMap(map);
  }

  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    console.log("HERE", places);
    $("#longitude").val(places[0].geometry.location.lng());
    $("#latitude").val(places[0].geometry.location.lat());
    $("#address").val(places[0].formatted_address);
    $("#loc_name").val(places[0].name);
    places[0].latitude = places[0].geometry.location.lat();
    places[0].longitude = places[0].geometry.location.lng();
    $("#loc_data").val(JSON.stringify(places));
    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    var listener = google.maps.event.addLcistener(map, "idle", function() {
      if (map.getZoom() > 16) map.setZoom(16);
      google.maps.event.removeListener(listener);
    });
  });
  // [END region_getplaces]
}

function initAutocomplete() {
  navigator.geolocation.getCurrentPosition(displayMap);
}
