//Global Variables
var isSidePanelOpen = false;

//How To Screen
$(window).on('load',function(){
        $('#splashModal').modal('show');
    });

//MapBox settings
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/jeroendr/cjzfznutc1osh1cq5qeciw1zr',
  center: [-73.999, 40.728],
  zoom: 13
});

map.addControl(new mapboxgl.GeolocateControl({
  positionOptions:
    {
    enableHighAccuracy: true
    },
  trackUserLocation: true
}));

map.addControl(new mapboxgl.NavigationControl());

//Functions

//detailPanelSizingFunctions
function isWideScreen() {
   if(window.innerWidth >= 800) {
     return true;
   } else {
     return false;
   }
}

function openNav() {
  if(isWideScreen()){

    $("#detailPanel").addClass("sidePanelLandscapeOpen");
    $("#detailPanel").removeClass("sidePanelLandscapeCollapsed");
    $("#collapseBtn").html("<");
    $("#collapseBtn").removeClass("collapseBtnPortrait");
    $("#collapseBtn").addClass("collapseBtnLandscape");
  }else{
    $("#detailPanel").addClass("sidePanelPortraitOpen");
    $("#detailPanel").removeClass("sidePanelPortraitCollapsed");
    $("#detailPanel").css({'bottom' : '0'});
    $("#map").css({'marginBottom' : "25%"});
    $("#collapseBtn").html("v");
    $("#collapseBtn").removeClass("collapseBtnLandscape");
    $("#collapseBtn").addClass("collapseBtnPortrait");

  }
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  isSidePanelOpen = true;
}

function closeNav() {
  if(isWideScreen()){
    $("#detailPanel").addClass("sidePanelLandscapeCollapsed");
    $("#detailPanel").removeClass("sidePanelLandscapeOpen");
  }else{
    $("#detailPanel").addClass("sidePanelPortraitCollapsed");
    $("#detailPanel").removeClass("sidePanelPortraitOpen");
  }
  isSidePanelOpen = false;
  $("#activeMarker").remove();
}

function populateSidePanel(feature){
  //Check if single movie or location bookmark

  //always open first accordion
  if(!$('#movieCollapseOne').hasClass("show")) {
  $('#movieCollapseOne').collapse('toggle');
}
  if(feature.properties.features == undefined){

    //single movie
    $('#locationTitle').hide();
    $('#moviePanelTwo').hide();
    $("#movieTitle").html(feature.properties.title);
    $("#movieSceneDescription").html(feature.properties.description);

    omdbCall(feature.properties.title, 0);
  }else{
    //multi movie location
    var movieListForLocation = JSON.parse(feature.properties.features);
    var locationName = movieListForLocation[0].description.substr(0, movieListForLocation[0].description.indexOf('-')-1);
    $('#moviePanelTwo').show();
    //  $("#locationTitle").css("display : block");
    if(movieListForLocation.length==2){
      $("#movieTitle").html(movieListForLocation[0].title);
      $("#movieSceneDescription").html(movieListForLocation[0].description);
      $("#movieTitle2").html(movieListForLocation[1].title);
      $("#movieSceneDescription2").html(movieListForLocation[1].description);

      omdbCall(movieListForLocation[0].title, 0);
       omdbCall(movieListForLocation[1].title, 1);

    }
    $('#locationTitle').show();
    $("#locationTitle").html(locationName);


  }

}
function omdbCall(title, index){

  $.ajax({
    type: "GET",
    dataType: "json",
    url: "http://www.omdbapi.com/?t=" + title + "&apikey=8a173d11",
    success: function(data){
      omdbCallCallBack(data, index);

    },
    async:false,
    error: function() {
        return null;
    }
  });

}

function omdbCallCallBack(data, index){
  if(index == 0){
    $("#moviePoster").attr("src",data.Poster);
    $("#movieDescription").html(data.Plot);
  }else{
    $("#moviePoster2").attr("src",data.Poster);
    $("#movieDescription2").html(data.Plot);
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
  populateSidePanel(feature);
});
