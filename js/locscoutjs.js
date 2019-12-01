mapboxgl.accessToken = 'pk.eyJ1IjoiamVyb2VuZHIiLCJhIjoiY2sxdmgzaW40MGgwYTNjcDUyMG45ODI5cyJ9.tyU7MRdx8PZ_ZGnSbe3MEw';
var isSidePanelOpen = false;

$(window).on('load',function(){
        $('#splashModal').modal('show');
    });

var map = new mapboxgl.Map({
  container: 'map',
  //style: 'mapbox://styles/mapbox/dark-v10',
  style: 'mapbox://styles/jeroendr/cjzfznutc1osh1cq5qeciw1zr',
  center: [-73.999, 40.728],
  zoom: 13
});

map.addControl(new mapboxgl.GeolocateControl({
positionOptions: {
enableHighAccuracy: true
},
trackUserLocation: true
}));

function isWideScreen() {
   if(window.innerWidth >= 800) {
     return true;
   } else {
     return false;
   }
}

function openNav() {
  if(isWideScreen()){

    $("#detailPanel").width("25%");
    $("#detailPanel").height("100%");
    $("#map").css("marginLeft = 25%");
    $("#closebtn").html("<");
  }else{
    $("#detailPanel").height("25%");
    $("#detailPanel").width("100%");
    $("#detailPanel").css({'bottom' : '0'});
    $("#map").css({'marginBottom' : "25%"});
    $("#closebtn").html("v");
  }
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  isSidePanelOpen = true;
}

function closeNav() {
  //TODO: cleanup with jquery
  if(isWideScreen()){
    document.getElementById("detailPanel").style.width = "0";
    document.getElementById("map").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
  }else{
    document.getElementById("detailPanel").style.height = "0";
    document.getElementById("map").style.marginBottom= "0";
    document.body.style.backgroundColor = "white";
  }
  isSidePanelOpen = false;
  $("#activeMarker").remove();
}

function populateSidePanel(feature){
  //Check if single movie or location bookmark
  if(feature.properties.features == undefined){
    //single movie
    $("#movieTitle").html(feature.properties.title);
    $("#movieSceneDescription").html(feature.properties.description);

    $.ajax({
      type: "GET",
      dataType: "json",
      url: "http://www.omdbapi.com/?t=" + feature.properties.title + "&apikey=8a173d11",
      success: function(data){
          $("#moviePoster").attr("src",data.Poster);
          $("#movieDescription").html(data.Plot);
      },
      async:false,
      error: function() {
          debugger;
      }
  });
  }else{
    //multi movie location
    debugger;
    var movieListForLocation = JSON.parse(feature.properties.features);
    var locationName = movieListForLocation[0].description.substr(0, movieListForLocation[0].description.indexOf('-')-1);
    $("#locationTitle").html(locationName);


  }


//  var results //http://www.omdbapi.com/?apikey=[yourkey]&
}

map.on('click', function(e) {

  var features = map.queryRenderedFeatures(e.point, {
    layers: ['movieloc-nyc'] // replace this with the name of the layer
  });

  if (!features.length) {
    return;
  }

  var feature = features[0];

  if(isSidePanelOpen){
    $("#activeMarker").remove();
  }

  var el = document.createElement('div');
    el.className = 'marker';
    el.id = 'activeMarker';

  new mapboxgl.Marker(el)
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);

  openNav();
  debugger;
  populateSidePanel(feature);

  /*  this.setIcon(
        e.mapbox.marker.icon({
            'marker-color': 'red'
        })
    );*/



//$("headerInfo").val();
/*  var popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML('<h3>' + feature.properties.title + '</h3><p>' + feature.properties.description + '</p>')
    .addTo(map);*/
});
