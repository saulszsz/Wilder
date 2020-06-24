const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");
var firebase = require("firebase");
const path = require('path');

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
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wilderinv.firebaseio.com",
});


const database = admin.database();

const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 3000;
const app = express();

app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));
app.use(express.static("client/dist/Wilder"));

app.use(bodyParser.json());
app.use(cookieParser());
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
    var params = req.params;
    sessionStatus(req).then(
        (success) => {
            get_reference('users/' + params.uid).on("value", function (snapshot) {
                return res.json(snapshot.val());
            });
        }
    ).catch((error) => {
        console.log(error);
        res.status(403).send("UNAUTHORIZED REQUEST!");
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('client/dist/Wilder/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
