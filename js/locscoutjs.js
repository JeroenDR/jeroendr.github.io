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
function addMoviePanelToAccordion(){
  var $template = $(".template");
  var hash = 2;

    var $newPanel = $template.clone();
    $newPanel.find(".collapse").removeClass("in");
    $newPanel.find(".accordion-toggle").attr("href",  "#" + (++hash))
             .text("Dynamic panel #" + hash);
    $newPanel.find(".panel-collapse").attr("id", hash).addClass("collapse").removeClass("in");
    $("#accordion").append($newPanel.fadeIn());
}
function populateSidePanel(feature){
  //Check if single movie or location bookmark

  //always open first accordion \
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

    }else{

    }
    $('#locationTitle').show();
    $("#locationTitle").html(locationName);


  }


//  var results //http://www.omdbapi.com/?apikey=[yourkey]&
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
