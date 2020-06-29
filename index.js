const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
var firebase = require("firebase");
const path = require('path');
const qrcode = require('qrcode');

var serviceAccountFile;

try {
    serviceAccountFile = require('./serviceAccountKey.json');   
} catch(err) {
    serviceAccountFile = null; 
}

const serviceAccount = {
    type: process.env.FB_TYPE,
    project_id: process.env.FB_PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
    client_x509_cert_url: process.env.CLIENT_X
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountFile || serviceAccount),
    databaseURL: "https://wilderinv.firebaseio.com",
});


const database = admin.database();

const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());

app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));
app.use(express.static("client/dist/Wilder"));

app.use(bodyParser.urlencoded({extended:false}));
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

app.use(bodyParser.json());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

function sessionStatus(req) {
    const sessionCookie = req.cookies.session || "";

    return admin
        .auth()
        .verifySessionCookie(sessionCookie, true);
}

// FUNCIONES QUE TIENEN QUE VER CON LOS USUARIOS
app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            (sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true };
                res.cookie("session", sessionCookie, options);
                res.end(JSON.stringify({ status: "success" }));
            },
            (error) => {
                res.status(401).send("UNAUTHORIZED REQUEST!");
            }
        ).catch((error) => {
            res.status(403).send("UNAUTHORIZED REQUEST!");
        });
});

app.post('/logout', (req, res) => {
    res.clearCookie('session');
    res.json(true);
});

app.get('/needs_register/:id', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            let id = req.params.id;
            let reference = get_reference(`users/${id}`);

            reference.once("value", function (snapshot) {
                return res.json(snapshot.val() == null);
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });

});

function get_reference(reference) {
    return database.ref(reference);
}

app.get('/email_logged/:uid', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            admin.auth().getUser(req.params.uid).then(
                (usr) => {
                    res.json(usr.email);
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });

});

app.post('/create_user_pr', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            let body = req.body;
            let companies_reference = get_reference('companies/');
            var company = companies_reference.push({
                company_name: body.trabajo
            });
            var company_id = company.key;
            get_reference('users/' + body.uid).set({
                email: body.correo,
                tipo: body.tipo,
                trabajo: company_id,
                nombre: body.nombre,
                apellido: body.apellido,
                nacimiento: body.nacimiento,
                telefono: body.telefono
            }).then(
                (result) => {
                    console.log("Usuario creado.");
                    console.log(JSON.stringify(result));
                    res.json({ 'creado': true });
                },
                (error) => {
                    console.log("Usuario no creado.");
                    console.log(JSON.stringify(error));
                    res.json({ 'creado': false });
                }
            );
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });

});

app.get('/get_user/:uid', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            var params = req.params;
            var reference = get_reference('users/' + params.uid)
            
            reference.once("value", function (snapshot) {
                return res.json(snapshot.val());
            });
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('client/dist/Wilder/index.html'));
});

app.post('redirect', (req, res) => {
    res.redirect(req.get('host') + req.body.liga);
    res.end();
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
