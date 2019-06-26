console.log("JS conectados")
var info_completa = JSON.parse($("#informacion_completa")[0].innerText);
var cliente_seleccionado;

function AbrirDetalle(id_array){
	cliente = info_completa.clientes[id_array]
	cliente_seleccionado = info_completa.clientes[id_array];
	$("#NombreCliente").text(cliente.NOMBRE);
	$("#Direccion").text("Dirección: " + cliente.DIRECCION);
	$("#Gmap").attr('src',"https://www.google.com/maps/embed/v1/view?key=AIzaSyBFgZGsI4z8ofxPBUqWTg7ee9NrJ3XQl54&center="+cliente.LATITUD+","+cliente.LONGITUD+"&zoom=11");
	$("#NombreContacto").text("Contacto: " + cliente.NOMBRECONTACTO);
	$("#Telefono").text("Telefono: " + cliente.TELEFONO);


	$("#modalConsultaDetalle").modal('show');
};


function CrearSolicitud(){
	$("#NombreCliente_Sol").text(cliente_seleccionado.NOMBRE);
	$("#modalConsultaDetalle").modal('hide');
	$("#modalCrearSolicitud").modal('show');
}

function AceptarSolicitud(){
	$("#NombreCliente_Sol").text(cliente_seleccionado.NOMBRE);
	var cliente = $("#NombreCliente_Sol").text();
	var bodega = $("#Bodega_Sol").val();
	var latitud = "25.6670632"
	var longitud = "-100.3441759"
	var id_formato = 101
	var usuario = $("#Supervisor_Sol").val();

	$.post("/CrearSolicitud", {"cliente": cliente, "bodega": bodega, "latitud": latitud, "longitud": longitud, "id_formato": id_formato, "usuario": usuario}, function(result){
		if(result.resultado=="success"){
			alert("Se creo solicitud en tabla de solicitudes");	
		} else {
			alert("Hubo un error al realizar la actualización")
		};
	});

	$("#modalCrearSolicitud").modal('hide');
}