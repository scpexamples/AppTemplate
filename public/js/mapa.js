console.log("JS conectado");
var usuario;
var map, marker
var cantidad_spots;
var markers = [];
var contentString = [];
var tipo_usuario;
var puesto; 
usuario = $("#usuario")[0].innerText;
puesto = $("#puesto")[0].innerText;

var solicitudes;


if(puesto.includes("Director")){
  tipo_usuario = "admin"
} else {
  tipo_usuario = "normal"
};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 19.391003, lng: -99.284041},
    zoom: 5
  });

  marker = new google.maps.Marker;
  var infowindow =  new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      marker.setPosition(pos);
      marker.setMap(map);
      map.setCenter(pos);
      map.setZoom(16);

      spots = "";

      console.log("Cantidad de marcadores a agregar: " + cantidad_spots);

      var image = {
        url: "/images/circulo_verde3.png",
        scaledSize: new google.maps.Size(30, 30)
      };

      console.log(pos);

      marker.setPosition(pos);
      marker.setMap(map);

      $.post("/consultarSolicitudes",{id_usuario:usuario,tipo:"solabiertas",tipo_usuario:tipo_usuario}, function(result) { 
        console.log(result);
        solicitudes = result;
        cantidad_spots = solicitudes.resultado.solicitudes.results.length;

        for(i=0;i<cantidad_spots;i++){
          console.log("agregando nuevo marcador");

          rand1 = Math.random() * (.008 - .001) + .001;
          rand2 = Math.random() * (.008 - .001) + .001;

          var pos2 = {
            lat: Number(position.coords.latitude) + (rand1),
            lng: Number(position.coords.longitude) + (rand2)
          };

          console.log(pos2);

          markers[i] = new google.maps.Marker({
            position: pos2,
            map: map,
            icon:image,
            id_marker: i,
            direccion: "yolo",
            content: "<div class=\"text-center\" ><h3>Cliente: " + solicitudes.resultado.solicitudes.results[i].CLIENTE + "</h3><br><h4>Bodega: " + solicitudes.resultado.solicitudes.results[i].BODEGA + "</h4>" + "<h4>Tipo: " + solicitudes.resultado.solicitudes.results[i].TIPO + "</h4>" + "<h4>Responsable: " + solicitudes.resultado.solicitudes.results[i].USUARIO + "</h4>" + '<br><h4>¿Cómo llegar?</h4><a target="_blank" rel="noopener noreferrer" href="https://maps.google.com/?q=' + solicitudes.resultado.solicitudes.results[i].LATITUD + ',' + solicitudes.resultado.solicitudes.results[i].LONGITUD + '"><img src="/images/maps.png" height="30px" width="30px"></a></div>',
            direccion_gmaps: "https://maps.google.com/?q=" + pos2.lat + "," + pos2.lng
          });

          google.maps.event.addListener(markers[i], 'click', function() {
            infowindow.setContent(this.content);
            infowindow.open(map, this);
          });

        };
      });
    },
    )}
  };

