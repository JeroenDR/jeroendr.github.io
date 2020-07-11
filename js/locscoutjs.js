//Global Variables
var isSidePanelOpen = false;
var dataFromOmDb = null;
var firstMovieToBeAdded = false;
var moviesToLoad = [];
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
  //flag used to open up only the top moviepanel
  firstMovieToBeAdded=true;

  //construct movies to be loaded in the side panel, multiple movies at one location are stored different into one JSON object
  if(feature.properties.features == undefined){
    moviesToLoad.push(feature.properties);
  }else{
    var movieListForLocation = JSON.parse(feature.properties.features);
    $('#locationTitle').show();
    $("#locationTitle").html(locationName);
    var locationName = movieListForLocation[0].description.substr(0, movieListForLocation[0].description.indexOf('-')-1);

    for (i = 0; i < movieListForLocation.length; i++)
    {
      moviesToLoad.push(movieListForLocation[i]);
    }
  }

  //data collection call, multiple movies will be added in a recursive way
  document.getElementById("accordion").innerHTML = "";
  omdbCall();

}

function omdbCall(){

  $.ajax({
    type: "GET",
    dataType: "json",
    url: "http://www.omdbapi.com/?t=" + moviesToLoad[0].title + "&apikey=" + omdbKey,
    success: function(data){
      dataFromOmDb = data;
      omdbCallCallBack(data);
    },
    async:false,
    error: function() {
        return null;
    }
  });
}

function addMovieToSidePanel(dataFromMovieDb){
  //get main HTML panel
  var htmlMainSidePanel = document.getElementById("accordion");
  var staticIdForPanelCount = 0
  if(moviesToLoad.length>1){
    staticIdForPanelCount = moviesToLoad.length - (moviesToLoad.length-1);
  }
  var staticIdForPanel = "moviePanel" + staticIdForPanelCount;
  //main movie panel and title
  var mainMovieContainer = document.createElement("div");
   mainMovieContainer.setAttribute("class", "panel panel-default template");
   var htmlStr = '<div class="panel-heading">';
   htmlStr += '<h4 class="panel-title">';
   htmlStr += '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#' + staticIdForPanel + '"">' + dataFromOmDb.Title +'</a>';
   htmlStr += '</h4>';
   htmlStr += '</div>';

    //scene description from mapbox
    htmlStr += '<div id="' + staticIdForPanel + '" class="panel-collapse collapse' + ((firstMovieToBeAdded) ? " show": "") +'">';
    htmlStr += '<div class="panel-body">';

    htmlStr += '<h4 class="detailPanelLabel">Scene description</h4>';
    htmlStr += '<div class="panel panel-default subpanel">';
    htmlStr += '<div class="panel-body">';
    htmlStr += '<div class="row">';
    htmlStr += '<div class="col-sm-12">';
    htmlStr += '<p class="movieSceneDescription">'+moviesToLoad[0].description + '</p>';
    htmlStr += '</div>';
    htmlStr += '</div>';
    htmlStr += '</div>';
    htmlStr += '</div>';

    htmlStr += '<h4 class="detailPanelLabel">Movie info</h4>';
    htmlStr += '<div class="panel panel-default subpanel">';
    htmlStr += '<div class="panel-body">';
    htmlStr += '<div class="row" >';
    htmlStr += '<div class="col-sm-12 span4">';
    htmlStr += '<img src="'+ dataFromOmDb.Poster + '" class="moviePoster">';
    htmlStr += '<div class="movieDescription">'+ dataFromOmDb.Plot + '</div>';
    htmlStr += '</div>';
    htmlStr += '</div>';

    //cast table
    htmlStr += '<div class="row" >';
    htmlStr += '<div class="col-sm-12 span4">';
    htmlStr += '<table class="table table-dark casttable">';
    htmlStr += '<thead>';
    htmlStr += '<tr>';
    htmlStr += '<th scope="col">Character name</th>';
    htmlStr += '<th scope="col">Played by</th>';
    htmlStr += '</tr>';
    htmlStr += '</thead>';
    htmlStr += '<tbody>';
    for (i = 0; i < 8; i++)
    {
               htmlStr += '<tr>';
               htmlStr += '<td>' + dataFromMovieDb.cast[i].character +'</td>';
               htmlStr += '<td>' + dataFromMovieDb.cast[i].name +'</td>';
    }
    htmlStr += '</tbody>';
    htmlStr += '</table>';
    htmlStr += '</div>';
    htmlStr += '</div>';

    htmlStr += '</div>';
    htmlStr += '</div>';

    htmlStr += '</div>';
    htmlStr += '</div>';
    htmlStr += '</div>';

    firstMovieToBeAdded = false;
    mainMovieContainer.innerHTML = htmlStr;
   htmlMainSidePanel.appendChild(mainMovieContainer)

   //handle multiple movies being loaded
   moviesToLoad.shift();
   if(moviesToLoad.length>0){
     omdbCall();
   }
}

function themoviedbCall(id){
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=" + movieDbKey,
    success: function(data){
      addMovieToSidePanel(data);
    },
    async:false,
    error: function() {
        return null;
    }
  });

}

function omdbCallCallBack(data){
    themoviedbCall(data.imdbID);
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
