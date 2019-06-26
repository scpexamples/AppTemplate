console.log("JS conectado");

function crearTicket(){
	var correo = $("#email")[0].value
	var nombre = $("#nombre")[0].value
	var mensaje = "El mensaje de soporte que especifica el usuario es el siguiente: " + $("#mensaje")[0].value + " .El nombre del usuario es: " + nombre +" .El correo del usuario es: " + correo
	var correo_soporte = "fernando.sanchez@sap.com"
	var prioridad = "baja"
	var telefono = ""
	var clientid = Math.floor(Math.random() * 200); 
	$.post("/ActivarWorkflow",{"correo":correo_soporte, "telefono": telefono, "mensaje": mensaje, "clientid": clientid, "prioridad": prioridad}, function(result) {
		if(result.resultado=="success"){
			alert("El ticket fue enviado correctamente")
			console.log(result.body);
		} else {
			alert("Hubo un error al querer enviar tu mensaje, inténtalo más tarde.")
		}
	});
};
