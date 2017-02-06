/**
 * Inizializing Global variables
 */
var map, //this variable hold our google map
    infoWindow, //This is the infoWindow that GMap Provide
    markers = ko.observableArray(), //The markers of the GMap is ko observableArray
    vmodel; //This variable will hold our viewModel

/**
 * [Model description] : This object is our model/data
 * it holds places which we need to show on map etc
 * @type {Object}
 */
var Model = {
    // It hold the current place when marker/list click
    currentPlace : null,

     // Array of objects of tourist places
    touristPlaces : [
        {
            name: "Purana Qila",
            location: { lat: 28.609579, lng: 77.243736},
            wiki : null
        },
        {
            name: "India Gate",
            location: { lat: 28.612913, lng: 77.229509},
            wiki : null
        },
        {
            name: "Humayun Tomb",
            location: { lat: 28.593340, lng: 77.250710},
            wiki : null
        },
        {
            name: "Lotus Temple",
            location: { lat: 28.553503, lng: 77.258821},
            wiki : null
        },
        {
            name: "Qutub Minar",
            location: { lat: 28.524511, lng: 77.185307},
            wiki : null
        },
        {
            name: "Akshardham",
            location: { lat: 28.612706, lng: 77.277145},
            wiki : null
        },
        {
            name:"India Habitat Centre",
            location: {lat: 28.589948, lng: 77.225132},
            wiki: null
        },
        {
            name:"Gurudwara Bangla Sahib",
            location: {lat: 28.626419, lng: 77.208996},
            wiki: null
        },
        {
            name:"Jama Masjid",
            location: {lat: 28.650675, lng: 77.233372},
            wiki: null
        },
    ]
};


/** InitMap initializes map and apply knockout
 * binding to the viewmodel
 */
function initMap() {
    map = new google.maps.Map(document.getElementsByClassName('map')[0], {
        zoomControl: true,
    });


     // Add mapBounds property to the window object
    window.mapBounds = new google.maps.LatLngBounds();

    //infowindow
    infoWindow = new google.maps.InfoWindow({maxWidth: 250});

    /**
     * Invoking createMarkers function
     */
    createMarkers(Model.touristPlaces);

    vmodel = new viewModel();

    // apllyy binding
    ko.applyBindings(vmodel);

}

/**
 * This function creates map markers on the google map
// touristPlaces
 */
function createMarkers(touristPlaces) {
    /**
     * Initializing function variables
     */
    var
    place,
    i,
    bounds,
    allPlacesLength = touristPlaces.length;

    /**
     * This loop itterates over the allPlace array
     * and create map marker for every place and place
     * on the map
     */
    for(i = 0; i < allPlacesLength; i++) {
        //current place
        place = touristPlaces[i];

        /**
         * Get WikiMedia information about this place
         */
        getWikiInfo(place, i);

        bounds = window.mapBounds;

        /**
         * Create a new marker for this place and assign
         * to the current map we have `map`
         * @type {google}
         */
        marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: place.location,
            map: map,
            title: place.name
        });

        /**
         * Adding ClickListner to the marker so that when it clicks
         * it performs the action we provide
         * @param  {object} place)
         * @return {function} return a function that set currentPlace to this object
         * (only when this marker) and showInfoWindow
         */
        marker.addListener('click', (function(place) {
            return function() {
                /**
                 * This IIFE set the place clicked on the currentPlace property of
                 * model so that we can access the clicked marker. Note it is not copying
                 * place to currentPlace, it is giving reference to the place
                 * @param  {object} place)
                 */
                (function(place) { Model.currentPlace = place; })(place);

                /**
                 * invoking showInfoWindow
                 */
                showInfoWindow();
                toggleBounce();

            };
        })(place));

        /**
         * Add a infoWindow close click event
         * when close remove Bounce animations
         * and set current activeListItemIndex null
         */
        google.maps.event.addListener(infoWindow,'closeclick',function(){
            toggleBounce();
            vmodel.activeListItemIndex(null);
        });

        /**
         * Extend the map boundry so that this marker include in map
         * current visible region
         */
        bounds.extend(new google.maps.LatLng(place.location.lat, place.location.lng));

       /**
        * Fit map to the boundry
        */
        map.fitBounds(bounds);

        /**
         * center the map
         */
        map.setCenter(bounds.getCenter());

        /**
         * Push the newly created marker to the markers array
         * which is ko observable, used for tracking markers
         */
        markers.push(marker);
    }
}


/**
 * Get Information from wikipedia about the place
 * @param  {object} place This is the place object
 * @param  {integer} i  This is the current index of this place
 */
var getWikiInfo = function(place, i) {
    var wikiEndpoint = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+place.name+"&format=json";
    /**
     * This timeout function run and after 8 sec
     * alert that wikipedia request failed.
     */
    var wikiTimeout = setTimeout(function(){
        if(i === 0) alert('Unable to Load Information from wikipedia');
    }, 8000);
    /**
     * Get data using ajax and set the response to
     * current Model touristPlaces object property wiki
     */
    $.ajax({
        url: wikiEndpoint,
        dataType: "jsonp",
        success: function(data) {
            Model.touristPlaces[i].wiki = data[2][0];
            /**
             * Now we got response from wikipedia,
             * clear the timeout so that the alert
             * will not open.
             */
            clearTimeout(wikiTimeout);
        }
    });
};

/**
 * This function shows a little infoWindow when marker clicked
 */
showInfoWindow = function() {

    var
    currentPlace = Model.currentPlace,

    index = Model.touristPlaces.indexOf(currentPlace),

    content = '<div class="info-window">';
    content += '<h4>'+ currentPlace.name +'</h4>';
    if(currentPlace.wiki === null) {
        content += '<p>Sorry! Unable to load wikipedia information</p>';
    }
    else {
        content += '<p>' + currentPlace.wiki +'</p>';
    }

    //set current place active
    vmodel.activeListItemIndex(index);
    /**
     * Set infoWindow content
     */
    infoWindow.setContent(content);

    /**
     * Center the infoWindow on map
     */
    map.panTo(currentPlace.location);

    /**
     * Open the infowindow on the current map i.e `map` and
     * on above of the marker which we clicked
     */
    infoWindow.open(map, markers()[index]);
};

/**
 * This function add animation effect on google map markers
 * extracted from google map markers animation effects.
 * @param  {numeric} index Its the current clicked marker index
 */
var toggleBounce = function () {
    //get index of the current place
    var index = Model.touristPlaces.indexOf(Model.currentPlace);
    //get the marker of the current place
    var marker = markers()[index];
    //itterate over the markers
    markers().forEach(function(mark, i) {
        //if current marker index of itterating loop is
        //not same as currentPlace index remove animation
        if(index !== i) mark.setAnimation(null);
    });
    //if marker has animation it mean it is already
    //clicked or active therefore remove marker animation
    //close infowindow and set activeListItemIndex to null
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
    infoWindow.close();
    vmodel.activeListItemIndex(null);
  }
  //otherwise add animation to the marker
  else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
};


/**
 * Adding resize listner and resize the map when listner triggers
 */
window.addEventListener('resize', function(e) {
  //Make sure the map bounds get updated on page resize
    map.fitBounds(mapBounds);
});