// Add google maps to page
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

let address1Field;
let address2Field;
let postalField;
let city;
let autocomplete;
let latitude;
let longitude;
let saver;
// Suggest address and autocomplete form.
// function autocompleteFunc() {
//   address1Field = document.querySelector('#firstLineAddress');
//   address2Field = document.querySelector('#address-line-2');
//   postalField = document.querySelector('#postcode');
//   const input = document.getElementById('firstLineAddress');
//   const options = {
//     componentRestrictions: { country: 'uk' },
//     fields: ['address_components', 'geometry'],
//     strictBounds: false,
//     types: ['address'],
//   };
//   autocomplete = new google.maps.places.Autocomplete(input, options);

//   address1Field.focus();
//   autocomplete.addListener('place_changed', fillInAddress);
// }

function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();
  let address1 = '';
  let postcode = '';
  saver = place.address_components;
  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  for (const component of place.address_components) {
    // @ts-ignore remove once typings fixed
    const componentType = component.types[0];

    switch (componentType) {
    case 'street_number': {
      address1 = `${component.long_name} ${address1}`;
      break;
    }

    case 'route': {
      address1 += component.short_name;
      break;
    }

    case 'postal_code': {
      postcode = `${component.long_name}${postcode}`;
      break;
    }

    case 'postal_code_suffix': {
      postcode = `${postcode}-${component.long_name}`;
      break;
    }
    case 'locality':
      document.querySelector('#locality').value = component.long_name;
      break;
    case 'postal_town':
      document.querySelector('#locality').value = component.long_name;
      break;

    case 'country':
      document.querySelector('#country').value = component.long_name;
      break;
    }
  }
  latitude = place.geometry.location.lat();
  longitude = place.geometry.location.lng();
  address1Field.value = address1;
  postalField.value = postcode;
  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
  address2Field.focus();
}

window.initMap = initMap;
if (window.location.pathname.includes('/about-property/')) {
  const datePicker = function () {
    $('#startingDate').datepicker({
      dateFormat: 'yy-mm-dd',
      minDate: 0,
      maxDate: 365,
    });
    $('#endDate').datepicker({
      dateFormat: 'yy-mm-dd',
      selectOtherMonths: true,
      showWeek: true,
      changeMonth: true,
      changeYear: true,
      minDate: 31,
      maxDate: 365,
    });
  };
  $(datePicker);
  datePicker();

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
}

//Posting the data to the db
const submitButton = document.getElementById('submitForm');
const signInButton = document.getElementById('signInButton');
const signOutButton = document.getElementById('singOutButton');
const signUpButton = document.getElementById('signUpButton');
if (window.location.pathname == '/add-listing') {
  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('one');

    let addressOne = document.querySelector('#firstLineAddress').value;
    let cityOne = document.querySelector('#locality').value;
    let numberBedrooms = document.querySelector('#numberBeds').value;
    let numberBathrooms = document.querySelector('#numberBaths').value;
    let price = document.querySelector('#price').value;
    let description = document.querySelector('#textAreaProperty').value;
    let available = true;
    let owner = 1;
    postalField = document.querySelector('#postcode');
    let data = {
      landlord_id: owner,
      address: addressOne,
      city: cityOne,
      price: price,
      bathroom_number: numberBathrooms,
      rooms_number: numberBedrooms,
      description: description,
      available: available,
    };
    console.log(data);

    const response = await fetch('/api/property/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    const { description: dsc } = await response.json();
  });
}
if (window.location.pathname == '/login') {
  signInButton.addEventListener('click', async (e) => {
    e.preventDefault();

    let email = document.querySelector('#loginEmailAddress').value;
    let password = document.querySelector('#logInPassword').value;

    postalField = document.querySelector('#postcode');
    let loginForm = {
      email: email,
      password: password,
    };

    // Login fetch request
    const response = await fetch('/api/user/signIn', {
      method: 'POST',
      body: JSON.stringify(loginForm),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Successful POST request:', data);
        // Empty the input fields
        window.location.href = '/';

        return data;
      })
      .catch((error) => {
        console.error('Error in POST request:', error);
      });
  });

  signUpButton.addEventListener('click', async (e) => {
    e.preventDefault();

    let firstName = document.querySelector('#firstName-su').value;
    let lastName = document.querySelector('#lastName-su').value;
    let email = document.querySelector('#email-su').value;
    let password = document.querySelector('#password-su').value;
    let address = document.querySelector('#address-su').value;
    let city = document.querySelector('#city-su').value;

    postalField = document.querySelector('#postcode');
    let signUpForm = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      address,
      city,
    };

    // Login fetch request
    const response = await fetch('/api/user/signUp', {
      method: 'POST',
      body: JSON.stringify(signUpForm),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Successful POST request:', data);
        // Empty the input fields
        // Simulate an HTTP redirect:
        return data;
      })
      .catch((error) => {
        console.error('Error in POST request:', error);
      });
    if (response) {
      window.location.href = '/';
    }
  });
}

// Sign Out
if (signOutButton) {
  signOutButton.addEventListener('click', async (e) => {
    // e.preventDefault();
    // Login fetch request
    const response = await fetch('/api/user/signOut', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((data) => {
        console.log('Successful SignOut:');
        // Empty the input fields
        location.reload();
      })
      .catch((error) => {
        console.error('Error in POST request:', error);
      });
  });
}
