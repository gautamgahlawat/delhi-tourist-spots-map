// Inizializing Global variables
var map,
    infoWindow,
    markers = ko.observableArray(),
    vmodel; //This variable holds viewModel

// This object is our model,  it holds the places which are needed to show on map
var Model = {
    // It hold the current place when marker/list is clicked
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
        {
            name:"Raj Ghat",
            location: {lat: 28.640732, lng: 77.249508},
            wiki: null
        },
        {
            name:"National Rail Museum",
            location: {lat: 28.585502, lng: 77.180071},
            wiki: null
        },
        {
            name:"Jantar Mantar",
            location: {lat: 28.627097, lng: 77.216549},
            wiki: null
        },
    ]
};


// InitMap initializes map and apply KO. binding to the viewmodel
function initMap() {
    map = new google.maps.Map(document.getElementsByClassName('map')[0], {
        zoomControl: true,
    });


     // Add mapBounds property to the window object
    window.mapBounds = new google.maps.LatLngBounds();

    //infowindow
    infoWindow = new google.maps.InfoWindow({maxWidth: 250});


    //Invoking createMarkers function
    createMarkers(Model.touristPlaces);

    vmodel = new viewModel();

    // apllyy binding
    ko.applyBindings(vmodel);

}

// This function creates markers on the map
function createMarkers(touristPlaces) {

    // initlizing variables
    var place,
        i,
        bounds,
        allPlacesLength = touristPlaces.length;

    //This loop itterates over the touristplaces and create marker for every place
    for(i = 0; i < allPlacesLength; i++) {
        //current place
        place = touristPlaces[i];

        // wikimedia information about the place
        getWikiInfo(place, i);

        bounds = window.mapBounds;

        // It creates new marker and assign to map
        marker = new google.maps.Marker({
            position: place.location,
            animation: google.maps.Animation.DROP,
            map: map,
            title: place.name
        });


         //event listner to the marker
         //return a function that sets currentPlace to this object
         //(only when this marker) and showInfoWindow
        marker.addListener('click', (function(place) {
            return function() {

                 /* IIFE set the place clicked on the currentPlace property of
                 * model so that we can access the clicked marker
                 * it is giving reference to the place
                 */
                (function(place) { Model.currentPlace = place; })(place);

                // invoking showInfoWindow
                toggleBounce();
                showInfoWindow();
            };
        })(place));


         /* Add a infoWindow close click event
         * when close remove Bounce animations
         * and set current activeListItemIndex null
         */
        google.maps.event.addListener(infoWindow,'closeclick',function(){
            toggleBounce();
            vmodel.activeListItemIndex(null);
        });

        //Extend the map boundry, that the marker is included in visible region
        bounds.extend(new google.maps.LatLng(place.location.lat, place.location.lng));


        // Fit map to the boundry
        map.fitBounds(bounds);

        // center the map
        map.setCenter(bounds.getCenter());

        //It Push the marker to the markers array(ko observable)
        markers.push(marker);
    }
}



//Get Information from wikipedia about the place
var getWikiInfo = function(place, i) {
    var wikiEndpoint = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+place.name+"&format=json";

     // timeout function runs and alert failed after 8 sec
    var wikiTimeout = setTimeout(function(){
        if(i === 0) alert('Unable to Load Information from wikipedia');
    }, 8000);

    //It set the response to current Model.touristPlaces object property wiki
    $.ajax({
        url: wikiEndpoint,
        dataType: "jsonp",
        success: function(data) {
            Model.touristPlaces[i].wiki = data[2][0];


            //we got response from wiki. clear the timeout so that the alert will not open.
            clearTimeout(wikiTimeout);
        }
    });
};


// It shows a little infoWindow when the marker clicked
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

    // Set infoWindow content
    infoWindow.setContent(content);

    //Center the infoWindow on map
    map.panTo(currentPlace.location);

    //Open the infowindow on the marker on which we clicked
    infoWindow.open(map, markers()[index]);
};

//Adds animation effect on google map markers taken from google map markers animation effects
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

//Adding resize listner and resize the map when listner triggers
window.addEventListener('resize', function(e) {
    //map bounds get updated on page resize
    map.fitBounds(mapBounds);
});




//************ KO. View Model***************
var viewModel = function() {
    var self = this;

    //Current menuStatus is ko observable and
    //is used to track menu visibility
    self.menuStatus = ko.observable(false);

    //It hold the index of the list item clicked or when marker clicked
    //Which is then used to add or remove css class of active of item list
    self.activeListItemIndex = ko.observable(null);


    // This will hold all places information created from Model.touristPlaces
    self.places = ko.observableArray(Model.touristPlaces);

       /* Input text is used to filter the places
       * it is ko observable, its value change
       * when user filter the list
       */
    self.filterText = ko.observable('');

    //Toggle class when hamburger menu icon clicks
    self.toggleMenu =  ko.pureComputed(function() {
        return self.menuStatus() == false ? "menu-hidden" : "";
    });


    //This is the function that shows InfoWindow
    // when the places in the list clicked, KO send it from view when the place item is clicked
    self.showInfoWindowWhenClicked = function(place) {

        Model.currentPlace = place;

        //index of current place
        var index = Model.touristPlaces.indexOf(place);

        //If activeListItemIndex has value null or not equal to
        //current place index then change activeListItemIndex to
        //the current place index and call showInfoWindow function
        //which will show infowindow
        if(self.activeListItemIndex() === null || self.activeListItemIndex() !== index) {
            self.activeListItemIndex(index);
            showInfoWindow();
        }

        //If activeListItemIndex has same value as current place
        //index then it mean the place is clicked again
        //therefor set activeListItemIndex to null and close the infowindow
        else if(self.activeListItemIndex() === index) {
            self.activeListItemIndex(null);
            infoWindow.close();
        }

        //Toggle The bouncing effect of markers
        toggleBounce();

    };

    // Filter the list and the markers
    self.filter = ko.computed(function() {

    // close the info window
    infoWindow.close();

    /* Set the activeListItemIndex to null,
     * so that active class is not visible anymore
     */
    self.activeListItemIndex(null);

    /* Itterate over the markers (ko observable) and
     * and for each object which are not visible or not
     * bound to map, make visible and bound to the map
     */
    markers().forEach(function(obj) {
        if(!obj.visible) obj.setVisible(true);
    });


    // filterLeftPlaces are the places that don't match to the filter
    var filterLeftPlaces = ko.utils.arrayFilter(self.places(), function(places){
        return places.name.toLowerCase().indexOf(self.filterText().toLowerCase()) == -1;
    });


    var index,
        marker;

    /* Itterate over the filterLeftPlaces and for every
    * object make its marker visibile property to false
    */
    filterLeftPlaces.forEach(function(obj) {
        index = Model.touristPlaces.indexOf(obj);
        marker = markers()[index];
        marker.setVisible(false);
    });


    // It returns the filtered array
    return ko.utils.arrayFilter(self.places(), function(places){
        return places.name.toLowerCase().indexOf(self.filterText().toLowerCase()) >= 0;
    });

  });

};
