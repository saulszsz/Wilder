const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");
var firebase = require("firebase");
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');
const firebaseConfig = {
    apiKey: "AIzaSyDPjgrScq2uCDySCQA-59J_K3a1-KM0LDc",
    authDomain: "wilderinv.firebaseapp.com",
    databaseURL: "https://wilderinv.firebaseio.com",
    projectId: "wilderinv",
    storageBucket: "wilderinv.appspot.com",
    messagingSenderId: "984347129922",
    appId: "1:984347129922:web:1e428b5f2a1fe8896755db",
    measurementId: "G-8GSHPQB7EE"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://server-auth-41acc.firebaseio.com",
});

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

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
        );
});

app.get('/needs_register/:id', (req, res) => {
    let id = req.params.id;
    let reference = get_reference(`users/${id}`);

    reference.on("value", function (snapshot) {
        return res.json(snapshot.val() == null);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

function get_reference(reference) {
    return database.ref(reference);
}

app.get('/email_logged/:uid', (req, res) => {
    admin.auth().getUser(req.params.uid).then(
        (usr) => {
            res.json(usr.email);
        }, 
        (err) => {
            console.log(err);
        }
    );
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('client/dist/Wilder/index.html'));
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
