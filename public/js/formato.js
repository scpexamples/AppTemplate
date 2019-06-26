console.log("JS Conectado");
var firmaguardada;
var firmaguardada2; 
var firmaguardada3;
var imagen_convertida;
var imagen_decodificada;

var canvas = document.querySelector("canvas");


var signaturePad = new SignaturePad(canvas);
var firma = $("#firma_existente")[0].innerText;
var imagen = $("#imagen_existente")[0].innerText;
var info_completa = JSON.parse($("#informacion_completa")[0].innerText);
var logo = $("#logo")[0];
var doc = new jsPDF()

function ImprimirPDF(){

	var texto = "<h1>Impresión de Formato de Revisión</h1><br><h2>Formato: " + info_completa.formato[0].IDFORMATO + "</h2><h2>Cliente: " + info_completa.cliente.NOMBRE + "</h2><h2>Responsable: " + info_completa.usuario.username + "</h2><h2>Accesos: " + info_completa.formato[0].ACCESOS + "</h2><h2>Servicios: " + info_completa.formato[0].SERVICIOS + "</h2><h2>Personal Ajeno: " + info_completa.formato[0].PERSONALAJENO + "</h2><h2>Climas: " + info_completa.formato[0].CLIMAS + "</h2><h2>Limpieza: " + info_completa.formato[0].LIMPIEZA + "</h2><h2>Material: " + info_completa.formato[0].MATERIAL + "</h2><h2>Unidades: " + info_completa.formato[0].UNIDAD + "</h2><h2>Cantidad: " + info_completa.formato[0].CANTIDAD + "</h2><h2>Comentarios: " + info_completa.formato[0].COMENTARIOS
	;
	doc.fromHTML(texto, 10, 10)
	doc.addImage(info_completa.formato[0].IMAGEN, 'JPEG', 10, 175, 30, 30);
	doc.addImage(info_completa.formato[0].FIRMA, 'JPEG', 10, 215, 30, 30);
	doc.addImage(logo, 'JPEG', 150, 10, 30, 20);
	doc.save('Reporte_' + Date.now() + '.pdf')

};

// if(firma !== ""){
// 	signaturePad.fromDataURL(firma);
// }

function goBack() {
	window.history.back();
}

function guardar(){
	// const data = signaturePad.toData();
	// firmaguardada = signaturePad.toDataURL("image/svg+xml");
	// firmaguardada2 = signaturePad.toData();
	firmaguardada3 = signaturePad.toDataURL();

	var info = {
		"IDFORMATO": $("#IDFORMATO")[0].value,
		"ACCESOS": $("#ACCESOS")[0].value,
		"SERVICIOS": $("#SERVICIOS")[0].value,
		"PERSONALAJENO": $("#PERSONALAJENO")[0].value,
		"CLIMAS": $("#CLIMAS")[0].value,
		"LIMPIEZA": $("#LIMPIEZA")[0].value,
		"MATERIAL": $("#MATERIAL")[0].value,
		"CANTIDAD": $("#CANTIDAD")[0].value,
		"UNIDAD": $("#UNIDAD")[0].value,
		"COMENTARIOS": $("#COMENTARIOS")[0].value,
		"FIRMA": firmaguardada3,
		"IMAGEN": imagen_convertida
	}

	if($("#CANTIDAD")[0].value<=parseInt(info_completa.formato[0].CANTIDAD)-(parseInt(info_completa.formato[0].CANTIDAD)*0.10)){
		alert("Bajó la cantidad en 10% o más");
		var correo = info_completa.usuario.username
		var nombre = info_completa.usuario.nombre + " " + info_completa.usuario.apellido
		var mensaje = "Bajo la cantidad en 10% o mas en la solicitud: " + $("#IDFORMATO")[0].value
		var correo_soporte = "fernando.sanchez@sap.com"
		var prioridad = "alta"
		var telefono = "+525541857013"
		var clientid = Math.floor(Math.random() * 200); 


		$.post("/ActivarWorkflow",{"correo":correo_soporte, "telefono": telefono, "mensaje": mensaje, "clientid": clientid, "prioridad": prioridad}, function(result) {
			if(result.resultado=="success"){
				alert("El ticket fue enviado correctamente")
				console.log(result.body);
				ws.send(sms);
				// ws.send(sms2);

				$.post("/CrearAlerta", {"cliente": info_completa.cliente.NOMBRE, "bodega": info_completa.formato[0].BODEGA, "latitud": info_completa.cliente.LATITUD, "longitud": info_completa.cliente.LONGITUD, "id_formato": info_completa.formato[0].IDFORMATO, "usuario": info_completa.usuario.username}, function(result){
					if(result.resultado=="success"){
						alert("Se creo alerta en tabla de alertas");	
					}
					$.post("/ActualizarSolicitud",{"info":info},function(result){
						if(result.resultado=="success"){
							alert("Información actualizada satisfactoriamente")
							location.reload();
						} else {
							alert("Hubo un error al realizar la actualización")
						};
					});
				});

			} else {
				alert("Hubo un error al querer enviar tu mensaje, inténtalo más tarde.")
			}
		});
	} else if($("#CANTIDAD")[0].value<=parseInt(info_completa.formato[0].CANTIDAD)-(parseInt(info_completa.formato[0].CANTIDAD)*0.03)){
		alert("Bajó la cantidad en 3% o más");
		var correo = info_completa.usuario.username
		var nombre = info_completa.usuario.nombre + " " + info_completa.usuario.apellido
		var mensaje = "Bajó la cantidad en 3% o más en la solicitud: " + $("#IDFORMATO")[0].value
		var correo_soporte = "fernando.sanchez@sap.com"
		var prioridad = "baja"
		var telefono = "+525541857013"
		var clientid = Math.floor(Math.random() * 200); 
		$.post("/ActivarWorkflow",{"correo":correo_soporte, "telefono": telefono, "mensaje": mensaje, "clientid": clientid, "prioridad": prioridad}, function(result) {
			if(result.resultado=="success"){
				alert("El ticket fue enviado correctamente")
				console.log(result.body);

				$.post("/CrearAlerta", {"cliente": info_completa.cliente.NOMBRE, "bodega": info_completa.formato[0].BODEGA, "latitud": info_completa.cliente.LATITUD, "longitud": info_completa.cliente.LONGITUD, "id_formato": info_completa.formato[0].IDFORMATO, "usuario": info_completa.usuario.username}, function(result){
					if(result.resultado=="success"){
						alert("Se creo alerta en tabla de alertas");	
					}
					$.post("/ActualizarSolicitud",{"info":info},function(result){
						if(result.resultado=="success"){
							alert("Información actualizada satisfactoriamente")
							location.reload();
						} else {
							alert("Hubo un error al realizar la actualización")
						};
					});
				});

			} else {
				alert("Hubo un error al querer enviar tu mensaje, inténtalo más tarde.")
			}
		});
	} else {

		$.post("/ActualizarSolicitud",{"info":info},function(result){
			if(result.resultado=="success"){
				alert("Información actualizada satisfactoriamente")
				location.reload();
			} else {
				alert("Hubo un error al realizar la actualización")
			};
		});
	};
}

function BorrarFirma(){
	signaturePad.clear();
}

function cargarImagen(){
	var file = $("#IMAGEN")[0].files[0];
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function () {
		// console.log(reader.result);
		imagen_convertida = reader.result;
	};
	reader.onerror = function (error) {
		console.log('Error: ', error);
	};
}

ws.onmessage = function (event) {
	console.log(event.data);
}

// function resizeCanvas() {
//     var ratio =  Math.max(window.devicePixelRatio || 1, 1);
//     canvas.width = canvas.offsetWidth * ratio;
//     canvas.height = canvas.offsetHeight * ratio;
//     canvas.getContext("2d").scale(ratio, ratio);
//     signaturePad.clear(); // otherwise isEmpty() might return incorrect value
// }

// window.addEventListener("resize", resizeCanvas);
// resizeCanvas();