const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
var firebase = require("firebase");
const qrcode = require('qrcode');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


var serviceAccountFile;

try {
    serviceAccountFile = require('../serviceAccountKey.json');
} catch (err) {
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
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(csrfMiddleware);

function sessionStatus(req) {
    const sessionCookie = req.cookies.session || "";

    return admin
        .auth()
        .verifySessionCookie(sessionCookie, true);
}

// FUNCIONES QUE TIENEN QUE VER CON LOS USUARIOS
router.post("/sessionLogin", (req, res) => {
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

router.get('/needs_register/:id', (req, res) => {
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

router.get('/activos_list/:uid', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            var reference = get_reference('inventario/')
                .orderByChild("trabajo")
                .equalTo(req.params.uid);

            reference.once("value", function (snapshot) {
                res.json(snapshot.val());
            });
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

router.get('/eliminar_solicitud/:uid/:uid_activo', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            get_reference('solicitudes/'+ req.params.uid + '/abierto').set(false).then(
                (result) => { },
                (error) => {
                    res.status(403).send("UNAUTHORIZED REQUEST!");
                }
            );
            get_reference('inventario/' + req.params.uid_activo + '/dominio').set('Bodega').then(
                (result) => { },
                (error) => {
                    res.status(400).send("BAD REQUEST!");
                }
            );
            res.json({ 'exito': true })
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

router.get('/email_logged/:uid', (req, res) => {
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

router.get('/phone_logged/:uid', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            admin.auth().getUser(req.params.uid).then(
                (usr) => {
                    res.json(usr.phoneNumber);
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

router.get('/get_solicitudes/:uid', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            let reference = get_reference('solicitudes/')
                .orderByChild("company")
                .equalTo(req.params.uid);

            reference.once("value", function (snapshot) {
                res.json(snapshot.val());
            });
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

router.get('/get_mttos/:uid', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            let reference = get_reference('mantenimiento/')
                .orderByChild("id_activo")
                .equalTo(req.params.uid);

            reference.once("value", function (snapshot) {
                res.json(snapshot.val());
            });
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

router.get('/get_prestamos/:uid', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            let reference = get_reference('prestamos/')
                .orderByChild("usuario")
                .equalTo(req.params.uid);

            reference.once("value", function (snapshot) {
                res.json(snapshot.val());
            });
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

router.get('/regresar_activo/:uid/:uid_activo', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            get_reference('inventario/' + req.params.uid_activo + '/dominio').set('Bodega').then(
                (result) => { },
                (error) => {
                    res.status(400).send("BAD REQUEST!");
                }
            );
            get_reference('prestamos/' + req.params.uid + '/entregado').set(true).then(
                (result) => { },
                (error) => {
                    res.status(400).send("BAD REQUEST!");
                }
            );
            get_reference('prestamos/' + req.params.uid + '/fecha_entregado').set(new Date(Date.now())).then(
                (result) => { },
                (error) => {
                    res.status(400).send("BAD REQUEST!");
                }
            );
            res.json({ 'exito': true });
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

router.post('/create_user_pr', (req, res) => {
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

router.get('/get_user/:uid', (req, res) => {
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

router.post('/create_activo', (req, res) => {
    var QR = "";
    sessionStatus(req).then(
        (success) => {
            var activoRegistrado = get_reference('inventario/').push(req.body);
            var idActivo = activoRegistrado.key;
            const crearQR = async () => {
                QR = await qrcode.toDataURL("https://wilderinv.herokuapp.com/activo/" + idActivo);
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

router.post('/get_activo', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            var uid = req.body.uid;
            get_reference('inventario/' + uid).once("value", function (snapshot) {
                var datosActivo = (snapshot.val()/* && snapshot.val().nombre*/) || 'Anonymous';
                //return datosActivo;
            }).then(
                (result) => {
                    res.json(JSON.stringify(result));
                },
                (error) => {
                    res.json(false);
                }
            );
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

router.post('/edit_activo/:id', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            get_reference('inventario/' + req.params.id).set(req.body).then(
                (result) => {
                    console.log("Activo editado.");
                    console.log(JSON.stringify(result));
                    res.json({ 'creado': true });
                },
                (error) => {
                    console.log("Activo no editado.");
                    console.log(JSON.stringify(error));
                    res.json({ 'creado': false });
                }
            );
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST! create_activo");
    });
});

router.post('/solicitar_activo/:id', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            get_reference('solicitudes/' + req.params.id).set(req.body).then(
                (result) => { },
                (error) => {
                    res.status(403).send("UNAUTHORIZED REQUEST!");
                }
            );
            get_reference('inventario/' + req.params.id + '/dominio').set('solicitado').then(
                (result) => { },
                (error) => {
                    res.status(403).send("UNAUTHORIZED REQUEST!");
                }
            );
            res.json({ 'exito': true });
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

router.post('/create_mantenimiento', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            get_reference('mantenimiento/').push(req.body).then(
                (result) => {
                    res.json({ 'exito': true });
                },
                (error) => {
                    res.status(403).send("UNAUTHORIZED REQUEST!");
                }
            );
        }
    ).catch((error) => {
        console.log(error);
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

router.post('/create_prestamo', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            get_reference('prestamos/').push(req.body).then(
                (result) => { },
                (error) => {
                    res.status(403).send("UNAUTHORIZED REQUEST!");
                }
            );
            get_reference('solicitudes/').child(req.body.activo).remove().then(
                (result) => { },
                (error) => {
                    res.status(403).send("UNAUTHORIZED REQUEST!");
                }
            );
            get_reference('inventario/' + req.body.activo + '/dominio').set('prestado').then(
                (result) => { },
                (error) => {
                    res.status(403).send("UNAUTHORIZED REQUEST!");
                }
            );
            res.json({ 'exito': true });
        }
    ).catch((error) => {
        console.log(error);
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

router.post('/delet_activo/:id', (req, res) => {
    sessionStatus(req).then(
        (success) => {
            console.log("K PEX " + req.params.id);
            get_reference('inventario/').child(req.params.id).remove().then(
                (result) => {
                    res.json({ 'creado': true });
                },
                (error) => {
                    res.json({ 'creado': false });
                }
            );
        }
    ).catch((error) => {
        res.status(403).send("UNAUTHORIZED REQUEST! create_activo");
    });
});

module.exports = router;
