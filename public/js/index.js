var map;
var service;
var infowindow;

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) {
    return;
  }

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, 'click', () => {
    console.log(place.name);
    infowindow.setContent(place.name || '');
    infowindow.open({
      anchor: marker,
      shouldFocus: false,
    });
  });
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function initMap() {
  var pyrmont = new google.maps.LatLng(52.48753, -1.94903);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 14,
  });

  var request = {
    location: pyrmont,
    radius: '1000',
    type: ['supermarket'],
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

window.initMap = initMap;

// Query for expanding and contracting text area in description page
var h = $('#property-description')[0].scrollHeight;

$('#more').click(function () {
  $('#property-description').animate({
    height: h,
  });
  $('#property-description').animate({
    height: 'fit-content',
  });
  $('#less').css('display', 'block');
  $('#more').css('display', 'none');
});

$('#less').click(function () {
  $('#property-description').animate({
    height: '200px',
  });
  $('#less').css('display', 'none');
  $('#more').css('display', 'block');
});
