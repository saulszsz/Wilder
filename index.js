const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
var firebase = require("firebase");
const path = require('path');
const qrcode = require('qrcode');
const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());
app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));
app.use(express.static("client/dist/Wilder"));

//Cosas necesarias para enviar el formulario de contact
app.use(express.urlencoded({extended: false})); //Sirve para entender los datos que lleguen del formulario y que no salga como undefined
app.use(express.json());//Hace que el servidor entienda datos en formatos JSON

require('dotenv').config(); 
const nodemailer = require('nodemailer');

app.post('/enviar_contacto', (req,res) => {
    var body=req.body;     //console.log(req.body);
    contentHTML = `
        <h1>Informacion del Usuario</h1>
        <ul>
        <li>Nombre: ${body.name}</li>
        <li>Email: ${body.mail}</li>
        <li>Telefono: ${body.phone}</li>
        </ul>
        <p>Mensaje: ${body.message}</p>
    `;
                                                            //console.log(contentHTML);    
    //Step 1
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'WilderApiISC@gmail.com',
            pass:'Hola1234'
        }
    });

    //Step 2
    let mailOptions={
        from: '',
        to:'WilderApiISC@gmail.com',
        subject:'Mensaje de Contacto',
        html:contentHTML
        //text:''+contentHTML
    };

    //Step 3
    transporter.sendMail(mailOptions, function (err,data){
        if(err){
            console.log('Error');
        }else{
            console.log('Succes');
        }
    });

    res.send('/succes.html');
});


//Fin de Cosas necesarias para enviar el formulario de contact

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(csrfMiddleware);

const propia = require('./apis/propia');
const fbapi = require('./apis/firebase');

app.use('/', propia);
app.use('/', fbapi);

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('client/dist/Wilder/index.html'))
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

app.post('/create_activo', (req, res) => {
    var QR = "";
    sessionStatus(req).then(
        (success) => {
            var activoRegistrado = get_reference('inventario/').push(req.body);
            var idActivo = activoRegistrado.key;
            const crearQR = async() => {
                QR = await qrcode.toDataURL("http://localhost:3000/activo/" + idActivo);
                req.body.qr = String(QR);
                get_reference('inventario/' + idActivo).set(req.body).then(
                    (result) => {
                        console.log("QR creado.");
                        console.log(JSON.stringify(result));
                        res.json({ 'creado': true });
                    },
                    (error) => {
                        console.log("QR no creado.");
                        console.log(JSON.stringify(error));
                        res.json({ 'creado': false });
                    }
                );
            }
            crearQR();
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST! create_activo");
    });

});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('client/dist/Wilder/index.html'));
});

app.post('/get_activo', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            var uid = req.body.uid;
            get_reference('inventario/' + uid).once("value", function (snapshot) {
                var datosActivo = (snapshot.val()/* && snapshot.val().nombre*/) || 'Anonymous';
                //return datosActivo;
            }).then(
                (result) => {
                    console.log("Activo obtenido.");
                    console.log(JSON.stringify(result));
                    res.json(JSON.stringify(result));
                },
                (error) => {
                    console.log("Activo no obtenido.");
                    console.log(JSON.stringify(error));
                    res.json(false);
                }
            );
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});
