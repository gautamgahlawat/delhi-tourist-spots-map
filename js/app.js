var map;

    function initMap() {
        // Constructor creates a new map
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 28.6139, lng: 77.2090},
          zoom: 11,
          disableDefaultUI: true
        });

        // var NewDelhi = {lat: 28.6609 ,lng: 77.2276};
        // var marker = new google.maps.Marker({
        //     position: NewDelhi,
        //     map: map,
        //     title: 'my city!!'
        // });


        // var infowindow = new google.maps.InfoWindow({
        //     content: ''
        // });
        // marker.addListener('click', function(){
        //     infowindow.open(map, marker);
        // });
    }

    //get locations metro station locations from metro.json file
// var getLocations = function(callback){
//     $.getJSON({
//         url:'js/metro.json',
//         success: function(data){
//             callback(data);
//         },
//         error: function(data){
//             callback(null);
//         }
//     });
// };

// var Location = function(data) {
//     this.name = ko.observable(data.name);
//     var details = ko.observable(data.details);
//     this.line = ko.observable(details().line);
//     this.layout = ko.observable(details().layout);
//     this.longitude = ko.observable(details().longitude);
//     this.latitude = ko.observable(details().latitude);
//     this.marker = new google.maps.Marker({
//         position: {lng: details().longitude,lat: details().latitude},
//         animation: google.maps.Animation.DROP,
//         map: map,
//         clickable: true,
//         title: data.name
//     });

// };
