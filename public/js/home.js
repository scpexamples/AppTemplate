console.log("JS conectado");
var usuario;
var solicitudes;
var tipo_usuario;


// window.onload = function(){
//   RevisarUsuarioLoggeado();
//   ConsultarSolicitudes();
// };


$.post("/usuarioLoggeado", function(result) {
  usuario = result;
  console.log(usuario);
  $("#NombreUsuario").text(usuario.nombre + " " + usuario.apellido);
  $("#CorreoUsuario").text(usuario.username);

  if(usuario.puesto.includes("Director")){
    tipo_usuario = "admin"
  } else {
    tipo_usuario = "normal"
  };

  $.post("/obtenerImagenesUsuario",{id_usuario:usuario.username}, function(result) {
    foto_usuario = result.foto1;
    if (foto_usuario !== ""){
      foto_usuario = foto_usuario.replace('www','dl');
      foto_usuario = foto_usuario.replace('?dl=0','');
      $("#ImagenUsuario").attr('src',foto_usuario);
    }
  });

  $.post("/consultarSolicitudes",{id_usuario:usuario.username,tipo_usuario:tipo_usuario, tipo:"solabiertas"},function(result){
    console.log("imprimiendo solicitudes");
    console.log(result);
    solicitudes = result.resultado.solicitudes.results;
      // console.log(solicitudes);
      if(solicitudes.length>0){
        for(i=0; i < solicitudes.length ;i++){
          $("#tabla_solicitudes_abiertas").append('<tr><th scope="row">' + solicitudes[i].IDSOLICITUD + '</th><td>' + solicitudes[i].CLIENTE + '</td><td>' + solicitudes[i].BODEGA + '</td><td>' + '<a target="_blank" rel="noopener noreferrer" href="https://maps.google.com/?q=' + solicitudes[i].LATITUD + ',' + solicitudes[i].LONGITUD + '"><img src="/images/maps.png" height="30px" width="30px"></a>' + '</td><td> ' + solicitudes[i].TIPO + '</td><td><p><a class="btn btn-danger btn-" onclick="AbrirFormato(1,' + solicitudes[i].IDFORMATO + '); return false" href="#"" role="button">Abrir</a></td></tr>');
        }
      }
    });

  $.post("/consultarSolicitudes",{id_usuario:usuario.username,tipo_usuario:tipo_usuario, tipo:"solcerradas"},function(result){
    console.log("imprimiendo solicitudes");
    console.log(result);
    solicitudes = result.resultado.solicitudes.results;
      // console.log(solicitudes);
      if(solicitudes.length>0){
        for(i=0; i < solicitudes.length ;i++){
          $("#tabla_solicitudes_cerradas").append('<tr><th scope="row">' + solicitudes[i].IDSOLICITUD + '</th><td>' + solicitudes[i].CLIENTE + '</td><td>' + solicitudes[i].BODEGA + '</td><td>' + '<a target="_blank" rel="noopener noreferrer" href="https://maps.google.com/?q=' + solicitudes[i].LATITUD + ',' + solicitudes[i].LONGITUD + '"><img src="/images/maps.png" height="30px" width="30px"></a>' + '</td><td> ' + solicitudes[i].TIPO + '</td><td><p><a class="btn btn-danger btn-" onclick="AbrirFormato(2,' + solicitudes[i].IDFORMATO + '); return false" href="#"" role="button">Abrir</a></td></tr>');
        }
      }
    });

  $.post("/consultarSolicitudes",{id_usuario:usuario.username,tipo_usuario:tipo_usuario, tipo:"alertas"},function(result){
    console.log("imprimiendo solicitudes");
    console.log(result);
    solicitudes = result.resultado.solicitudes.results;
      // console.log(solicitudes);
      if(solicitudes.length>0){
        for(i=0; i < solicitudes.length ;i++){
          $("#tabla_alertas").append('<tr><th scope="row">' + solicitudes[i].IDALERTA + '</th><td>' + solicitudes[i].CLIENTE + '</td><td>' + solicitudes[i].BODEGA + '</td><td>' + '<a target="_blank" rel="noopener noreferrer" href="https://maps.google.com/?q=' + solicitudes[i].LATITUD + ',' + solicitudes[i].LONGITUD + '"><img src="/images/maps.png" height="30px" width="30px"></a>' + '</td><td> ' + solicitudes[i].ESTATUS + '</td><td><p><a class="btn btn-danger btn-" onclick="AbrirFormato(3,' + solicitudes[i].IDFORMATO + '); return false" href="#"" role="button">Abrir</a></td></tr>');
        }
      }
    });

});

function AbrirFormato(tipo,idformato){
  window.location.href = window.location.href + "formato/" + idformato;
};

// trae info de las solicitudes hechas por este usuario

function cargarImagen(image){
  /**
 * Two variables should already be set.
 * dropboxToken = OAuth access token, specific to the user.
 * file = file object selected in the file widget.
 */

 var xhr = new XMLHttpRequest();
 var xhr2 = new XMLHttpRequest();

 xhr.upload.onprogress = function(evt) {
  var percentComplete = parseInt(100.0 * evt.loaded / evt.total);
    // Upload in progress. Do something here with the percent complete.
    console.log(percentComplete);
    $("#Estatus_carga").text("Uploading percentage: " + percentComplete + "%");
    $("#Estatus_carga2").text("Uploading percentage: " + percentComplete + "%");
    $("#Estatus_carga3").text("Uploading percentage: " + percentComplete + "%");
  };

  xhr.onload = function() {
    if (xhr.status === 200) {
      $("#Estatus_carga").text("");
      $("#Estatus_carga2").text("");
      $("#Estatus_carga3").text("");
      $('#Close_modal_photo' + contador_imagenes).prop('disabled', false);
      contador_imagenes = contador_imagenes + 1;
      var fileInfo = JSON.parse(xhr.response);
      console.log(fileInfo);
      // Upload succeeded. Do something here with the file info.
      xhr2.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
      xhr2.setRequestHeader('Content-Type', 'application/json');
      var body = '{"path": "'+fileInfo.path_lower+'","settings": {"requested_visibility":"public"}}';
      xhr2.send(body);
    }
    else {
      var errorMessage = xhr.response || 'Unable to upload file';
      console.log(errorMessage);
      // Upload failed. Do something here with the error.
    }
  };
  
  carpeta = String(usuario.nombre).trim() + String(usuario.apellido).trim();
  carpeta = carpeta.replace(/\s/g, '');
  carpeta = carpeta.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

  console.log(carpeta);
  xhr.setRequestHeader('Content-Type', 'application/octet-stream');
  xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
    path: '/'+ carpeta +'/' +  '000'+contador_imagenes+'.jpg',
    mode: 'overwrite',
    autorename: false,
    mute: false
  }));

  xhr.send(image[0]);

  xhr2.onload = function() {
    if (xhr2.status === 200) {
      var fileInfo2 = JSON.parse(xhr2.response);
      console.log(fileInfo2);
      imagenes[imagenes.length] = fileInfo2.url
      if(contador_imagenes==3){
        console.log("Contador_restaurado");
        contador_imagenes = 0;
        if(imagenes.length==3){
          console.log("Enviando imagenes a servidor");
          $.post('/ActualizarImagenes', {"imagenes":imagenes, "id_usuario":usuario.username}, function(result){
            console.log(imagenes);
            var resultado = result.resultado;
            mensaje = resultado;
            console.log(resultado);
            if (resultado == "success"){
              console.log("Se realizó el post satisfactoriamente.");
              location.reload();
            } else {
              mensaje = "Hubo un error. Inténtalo de nuevo más tarde."
            }
          });
        };
      }
      // Upload succeeded. Do something here with the file info.
    }
    else {
      var errorMessage = xhr2.response || 'Unable to upload file';
      console.log(errorMessage);
      if(contador_imagenes==3){
        location.reload();
      }
      // Upload failed. Do something here with the error.
    }
  };
};

function resetImage(){
 contador_imagenes = 0;
 $('#Close_modal_photo0').prop('disabled', true);
 $('#Close_modal_photo1').prop('disabled', true);
 $('#Close_modal_photo2').prop('disabled', true);
 $("#Estatus_carga").text("");
 $("#Estatus_carga2").text("");
 $("#Estatus_carga3").text("");
};