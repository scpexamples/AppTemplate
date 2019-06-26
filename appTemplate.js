var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require ('passport-local');
var User = require("./models/user");
var bodyParser = require('body-parser');
const o = require('odata');
var request = require('request');

var app = express();

mongoose.Promise = global.Promise;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB error de conexión:'));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var port = 8080;

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
})

app.get('/login',function(req,res){
	res.render('login');
});

app.get('/register',function(req,res){
	res.render('register');
});

app.get('/error',function(req,res){
	res.render('error');
});

app.get('/Mapa', isLoggedIn, function(req,res){
	res.render('mapa',{user: req.user});
});

app.get('/Ticket', isLoggedIn, function(req,res){
	res.render('ticket', {user:req.user});
});

app.get('/Mercancias', isLoggedIn, function(req,res){
	res.render('mercancias',{user:req.user});
})

app.get('/Reporte', isLoggedIn, function(req,res){
	o(url).get(function(data){
		var info_clientes = data.d.results
		if(typeof data.d.results[0] !== 'undefined'){
			o(url2).get(function(data){
				var info_formatos = data.d.results
				if(typeof data.d !== 'undefined'){
					respuesta = ({"clientes":info_clientes, "formatos":info_formatos, "usuario": req.user,"existe":true});
					// console.log(respuesta);
					res.render('reporte',{"resultado": respuesta, user:req.user});
				} else {
					respuesta = ({"existe":false});
					res.send({"resultado": respuesta});
				};
			});
		}
	});
});

app.get('/',isLoggedIn,function(req,res){
	res.render('home',{user: req.user});
});

app.get('/formato/:idformato',isLoggedIn,function(req,res){
	idformato = parseInt(req.params.idformato);
	o(url).get(function(data){
		// console.log(data);
		info_formato = data.d.results;
		if(typeof data.d.results[0] !== 'undefined'){
			o(url2).get(function(data){
				cliente_formato = data.d
				if(typeof data.d !== 'undefined'){
					respuesta = ({"formato":info_formato, "cliente":cliente_formato, "usuario": req.user,"existe":true});
					// console.log(respuesta);
					res.render('formato',{"resultado": respuesta, user:req.user});
				} else {
					respuesta = ({"existe":false});
					res.send({"resultado": respuesta});
				};
			});
		}
	});
});

app.post('/consultarSolicitudes',function(req,res){
	var user = req.body.id_usuario;
	var tipo = req.body.tipo
	var tipo_usuario = req.body.tipo_usuario;
	if(tipo_usuario == "normal"){
	} else {
	}
	o(url).get(function(data){
		// console.log(data);
		if(typeof data.d.results[0] !== 'undefined'){
			// console.log(data.d);
			respuesta = ({"solicitudes":data.d,"existe":true});
			res.send({"resultado": respuesta});
		} else {
			respuesta = ({"existe":false});
			res.send({"resultado": respuesta});
		};
	});
});

app.post('/mercancias',function(req,res){
	var valor = req.body.valor;
	console.log(url);

	o(url).get(function(data){
		console.log("Resultados obtenidos satisfactoriamente")
		console.log(data.d.results);
		if(typeof data.d.results[0] !== 'undefined'){
			// console.log(data.d);
			respuesta = ({"solicitudes":data.d,"existe":true});
			res.send({"resultado": respuesta});
		} else {
			respuesta = ({"existe":false});
			res.send({"resultado": respuesta});
		};
	});
});

app.post('/mercancias_vt',function(req,res){
	var valor = req.body.valor;
	console.log(url);
	
	o(url).get(function(data){
		console.log(data.d.results);
		console.log("Resultados obtenidos satisfactoriamente")
		if(typeof data.d.results[0] !== 'undefined'){
			// console.log(data.d);
			respuesta = ({"solicitudes":data.d,"existe":true});
			res.send({"resultado": respuesta});
		} else {
			respuesta = ({"existe":false});
			res.send({"resultado": respuesta});
		};
	});
});

app.post('/ActualizarSolicitud',function(req,res){
	var info = req.body.info
	// console.log(info);
	// console.log(info.IDFORMATO);

	var options = { method: 'PATCH',
	headers: 
	{ 'postman-token': '5e3a0ec5-9f29-9f9f-a11b-0db43ab2f55e',
	'cache-control': 'no-cache',
	'content-type': 'application/json'}
	body: 
	{ IDFORMATO: info.IDFORMATO,
		ACCESOS: info.ACCESOS,
		SERVICIOS: info.SERVICIOS,
		PERSONALAJENO: info.PERSONALAJENO,
		CLIMAS: info.CLIMAS,
		LIMPIEZA: info.LIMPIEZA,
		MATERIAL: info.MATERIAL,
		CANTIDAD: info.CANTIDAD,
		UNIDAD: info.UNIDAD,
		COMENTARIOS: info.COMENTARIOS},
		json: true 
	};

	// console.log(options);


	var options2 = { method: 'POST',
	headers: 
	{ 'postman-token': '5e3a0ec5-9f29-9f9f-a11b-0db43ab2f55e',
	'cache-control': 'no-cache',
	'content-type': 'application/json'}
	body: 
	{ IDFORMATO: info.IDFORMATO,
		FIRMA: info.FIRMA,
		IMAGEN: info.IMAGEN
	},
	json: true 
};


	request(options, function (error, response, body) {
		console.log(response.statusCode)
		if (!error) {
			request(options2, function (error, response, body) {
				if (!error) {
					console.log("El status de respuesta de actualizar es: " + response.statusCode);
					res.send({"resultado":"success"}); 
				} else {
					console.log("El error de respuesta de eliminar es: " + error);
					res.send({"resultado":"fail"}); 
				}
			});
		} else {
			console.log("El error de respuesta de eliminar es: " + error);
			res.send({"resultado":"fail"}); 
		};
	});
});

app.post('/ActivarWorkflow', function(req,res){
	var cookieJar = request.jar();
	var correo = req.body.correo;
	var telefono = req.body.telefono;
	var mensaje = req.body.mensaje;
	var clientid = req.body.clientid;
	var prioridad = req.body.prioridad;

	var options = {
		method:'GET',
		jar: cookieJar,
		headers: {
			'X-CSRF-Token': 'Fetch'
		}
	};



	request(options,function(error,response,body){
		console.log(response.headers['x-csrf-token']);

		if(prioridad == "baja"){
			var options = {
				method:'POST'
				headers: {
					'X-CSRF-Token': response.headers['x-csrf-token'],
					'Content-type': 'application/json'
				},
				jar: cookieJar,
				body: 
				{ definitionId: 'alertas',
				context: 
				{ "correo": correo,
				"prioridad": prioridad,
				"mensaje": mensaje} },
				json: true 
			};
		} else {
			var options = {
				method:'POST',
				headers: {
					'X-CSRF-Token': response.headers['x-csrf-token'],
					'Content-type': 'application/json'
				},
				jar: cookieJar,
				body: 
				{ definitionId: 'alertas',
				context: 
				{ "correo": correo,
				"prioridad": prioridad,
				"mensaje": mensaje,
				"mensajetxt": mensaje,
				"telefono": telefono,
				"clientid": clientid } },
				json: true };
			}



			console.log(options);

			request(options,function(error,response,body){
				if(error){
					console.log("Hubo un error " + error)
					res.send({"resultado":"error " + error})
				} else {
					console.log(body);
					console.log("workflow generado satisfactoriamente");
					res.send({"resultado":"success","body":body});  
				}
			});

		});

});

app.post('/obtenerImagenesUsuario', function(req,res){
	id_usuario = req.body.id_usuario;
	o(url).get(function(data){
		usuario = data.d.results[0];
		// console.log("usuario: " + usuario);
		if(typeof(usuario) !== "undefined"){
			foto1 = usuario.IMG1;
			foto2 = usuario.IMG2;
			res.send({"foto1":foto1,"foto2":foto2});
		} else {
			res.send({"foto1":"", "foto2": ""});
		}
	})
});

app.post('/CrearAlerta', function(req,res){
	var cliente = req.body.cliente
	var bodega = req.body.bodega
	var latitud = req.body.latitud
	var longitud = req.body.longitud
	var estatus = "En Revisión"
	var id_formato = req.body.id_formato
	var usuario = req.body.usuario

	o(url2).get(function(data){
		console.log(data.d.results[0].IDALERTA);
		numero_nuevo = Number(data.d.results[0].IDALERTA) + 1;
		console.log(numero_nuevo);
		info = {
			"IDALERTA": numero_nuevo,
			"CLIENTE": cliente,
			"BODEGA": bodega,
			"LATITUD": latitud,
			"LONGITUD": longitud,
			"ESTATUS": estatus,
			"IDFORMATO": id_formato,
			"USUARIO": usuario
		};
		console.log(info);
		o(url).post(info).save(function(data){
			console.log("Información agregada satisfactoriamente");
			res.send({"resultado":"success"});  
		}, function(status, error){
			console.error(status + " " + error);
			res.send({"resultado":"error"});  
		});
	});
});

app.post('/CrearSolicitud', function(req,res){
	var cliente = req.body.cliente
	var bodega = req.body.bodega
	var latitud = req.body.latitud
	var longitud = req.body.longitud
	var tipo = "Supervisión"
	var id_formato = req.body.id_formato
	var usuario = req.body.usuario
	var estatus = 1

	o(url2).get(function(data){
		console.log(data.d.results[0].IDSOLICITUD);
		numero_nuevo = Number(data.d.results[0].IDSOLICITUD) + 1;
		console.log(numero_nuevo);
		info = {
			"IDSOLICITUD": numero_nuevo,
			"CLIENTE": cliente,
			"BODEGA": bodega,
			"LATITUD": latitud,
			"LONGITUD": longitud,
			"TIPO": tipo,
			"IDFORMATO": id_formato,
			"USUARIO": usuario,
			"ESTATUS": estatus
		};
		console.log(info);
		o(url).post(info).save(function(data){
			console.log("Información agregada satisfactoriamente");
			res.send({"resultado":"success"});  
		}, function(status, error){
			console.error(status + " " + error);
			res.send({"resultado":"error"});  
		});
	});
});

app.post("/register", function(req,res){
	var newuser = new User({username: req.body.username, nombre: req.body.nombre, apellido: req.body.apellido, puesto: req.body.puesto});
	User.register(newuser, req.body.password, function(err,user){
		if(err){
			// console.log(err);
			return res.render("register");
		} 
		passport.authenticate("local")(req,res,function(){
			res.redirect("/");
		});
	});
});

app.post("/login", passport.authenticate("local",
{
	successRedirect:"/",
	failureRedirect:"/error"
}), function(req,res){
});

app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/login");
});

app.post('/usuarioLoggeado', function(req,res){
	res.send(req.user);
});

app.post('/RecastSolicitud', function(req,res){
	var idsolicitud = req.body.idsolicitud;
	o(url).get(function(data){
		if(typeof data.d.results[0] !== 'undefined'){
			console.log(data.d.results);
			// respuesta = ({"pedido":data.d.results,"existe":true});
			res.send({
				replies: [{
					type: 'text',
					content: 'La información de tu solicitud es la siguiente: ',
				}],
				conversation: {
					memory: { solicitud: data.d.results }
				}
			});
		} else {
			respuesta = ({"existe":false});
			res.send({"resultado": respuesta});
		};
	});
});

app.listen(port,function(req,res){
	console.log('Escuchando en el puerto: ' + port);
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/login");	
	}
};

