console.log("Js conectado");

$.post("/mercancias",{valor:$("#valor")[0].value}, function(result){
  console.log("imprimiendo solicitudes");
  console.log(result);
  solicitudes = result.resultado.solicitudes.results;
      // console.log(solicitudes);
      if(solicitudes.length>0){
        for(i=0; i < solicitudes.length ;i++){
          $("#tabla_mercancias").append('<tr><th scope="row">' + solicitudes[i].GenID + '</th><td>' + solicitudes[i].MAKTG + '</td><td>' + solicitudes[i].MAKTX + '</td><td>' + solicitudes[i].MANDT + '</td><td>' + solicitudes[i].MATNR + '</td><td>' + solicitudes[i].SPRAS + '</td></tr>');
        }
      }
    });

function Buscar(){
  console.log("Consultando Materiales");
  var valor = $("#valor")[0].value;
  console.log(valor);
  $("#tabla_mercancias > tr").remove();
  if($("#boton_tabla")[0].outerText=="Tabla Física"){
    $.post("/mercancias",{valor:$("#valor")[0].value}, function(result){
      console.log("imprimiendo solicitudes");
      console.log(result);
      solicitudes = result.resultado.solicitudes.results;
      // console.log(solicitudes);
      if(solicitudes.length>0){
        for(i=0; i < solicitudes.length ;i++){
          $("#tabla_mercancias").append('<tr><th scope="row">' + solicitudes[i].GenID + '</th><td>' + solicitudes[i].MAKTG + '</td><td>' + solicitudes[i].MAKTX + '</td><td>' + solicitudes[i].MANDT + '</td><td>' + solicitudes[i].MATNR + '</td><td>' + solicitudes[i].SPRAS + '</td></tr>');
        }
      }
    });
  } else {
    $.post("/mercancias_vt",{valor:$("#valor")[0].value}, function(result){
      console.log("imprimiendo solicitudes");
      console.log(result);
      solicitudes = result.resultado.solicitudes.results;
      // console.log(solicitudes);
      if(solicitudes.length>0){
        for(i=0; i < solicitudes.length ;i++){
          $("#tabla_mercancias").append('<tr><th scope="row">' + solicitudes[i].GenID + '</th><td>' + solicitudes[i].MAKTG + '</td><td>' + solicitudes[i].MAKTX + '</td><td>' + solicitudes[i].MANDT + '</td><td>' + solicitudes[i].MATNR + '</td><td>' + solicitudes[i].SPRAS + '</td></tr>');
        }
      }
    });
  }
};

function consultarMateriales(){

  if($("#boton_tabla")[0].outerText=="Tabla Física"){
    $( "#boton_tabla" ).removeClass("btn-success").addClass("btn-warning");
    $( "#boton_tabla" ).text("Tabla Virtual");
  } else {
    $( "#boton_tabla" ).removeClass("btn-warning").addClass("btn-success");
    $( "#boton_tabla" ).text("Tabla Física");
  }
};