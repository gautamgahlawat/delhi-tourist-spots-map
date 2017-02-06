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


