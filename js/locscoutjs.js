mapboxgl.accessToken = 'pk.eyJ1IjoiamVyb2VuZHIiLCJhIjoiY2sxdmgzaW40MGgwYTNjcDUyMG45ODI5cyJ9.tyU7MRdx8PZ_ZGnSbe3MEw';


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
}

map.on('click', function(e) {

  var features = map.queryRenderedFeatures(e.point, {
    layers: ['movieloc-nyc'] // replace this with the name of the layer
  });

  if (!features.length) {
    return;
  }

  var feature = features[0];
openNav();
$("#movieTitle").html(feature.properties.title);
$("#movieDescription").html(feature.properties.description);
//$("headerInfo").val();
/*  var popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML('<h3>' + feature.properties.title + '</h3><p>' + feature.properties.description + '</p>')
    .addTo(map);*/
});
